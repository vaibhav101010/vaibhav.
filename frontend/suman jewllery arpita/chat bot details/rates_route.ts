import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Using a file-based cache so it survives server restarts during development
const CACHE_FILE = path.join(process.cwd(), '.rates-cache.json');

// Helper function to fetch and write rates to cache
async function updateRatesCache() {
  console.log(`[Rates Scheduler] Starting automatic Gold/Silver rate update...`);
  try {
    const goldUrl = 'https://www.bankbazaar.com/gold-rate-india.html';
    const goldRes = await fetch(goldUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!goldRes.ok) throw new Error('Gold rate fetch failed');
    const goldHtml = await goldRes.text();
    const goldMatch = goldHtml.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);
    if (!goldMatch) throw new Error('Gold Remix Context not found');
    const goldData = JSON.parse(goldMatch[1]);
    const goldLoader = goldData.state.loaderData['gold-rate-india.html'];
    
    // Default to Lucknow (149) or Delhi (174) or fallback to first available city
    const goldCityData = goldLoader.commodityData.cityPrices['149'] || goldLoader.commodityData.cityPrices['174'] || Object.values(goldLoader.commodityData.cityPrices)[0];
    const goldPrices = goldCityData[0].prices;

    // B. Fetch Silver Rate
    const silverUrl = 'https://www.bankbazaar.com/silver-rate-india.html';
    const silverRes = await fetch(silverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!silverRes.ok) throw new Error('Silver rate fetch failed');
    const silverHtml = await silverRes.text();
    const silverMatch = silverHtml.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);
    if (!silverMatch) throw new Error('Silver Remix Context not found');
    const silverData = JSON.parse(silverMatch[1]);
    const silverLoader = silverData.state.loaderData['silver-rate-india.html'];
    
    const silverCityData = silverLoader.commodityData.cityPrices['149'] || silverLoader.commodityData.cityPrices['174'] || Object.values(silverLoader.commodityData.cityPrices)[0];
    const silverPrices = silverCityData[0].prices;

    const rate24k = parseFloat(goldPrices['24K_1G']) || 13913;
    const rate22k = parseFloat(goldPrices['22K_1G']) || 13250;
    const rate18k = Math.round(rate24k * 0.75); // Calculate 18K as 75% of 24K
    const silverRate = parseFloat(silverPrices['1G']) || 225;

    const finalRates = {
      gold24k: rate24k,
      gold22k: rate22k,
      gold18k: rate18k,
      silver: silverRate,
    };

    const now = new Date();
    const istTime = new Date(now.getTime() + (330 * 60000));
    const istHour = istTime.getUTCHours();
    if (istHour < 15) {
      istTime.setTime(istTime.getTime() - (24 * 60 * 60 * 1000));
    }
    const year = istTime.getUTCFullYear();
    const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
    const date = String(istTime.getUTCDate()).padStart(2, '0');
    const cacheKey = `${year}-${month}-${date}_1500`;

    // Save to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      lastUpdated: cacheKey,
      rates: finalRates
    }));

    console.log(`[Rates Scheduler] Rates cache updated successfully:`, JSON.stringify(finalRates));
    return finalRates;
  } catch (error: any) {
    console.error(`[Rates Scheduler] Error updating rates cache:`, error.message);
    return null;
  }
}

// Side effect to register background scheduler in global scope (runs once on import in Node.js)
if (typeof window === 'undefined') {
  if (!(global as any).__ratesSchedulerStarted) {
    (global as any).__ratesSchedulerStarted = true;
    
    // 1. Run immediate rate update on server startup
    updateRatesCache();
    
    // 2. Schedule rates update precisely at 3:00 PM IST daily
    const scheduleDailyUpdate = () => {
      const now = new Date();
      // 3:00 PM IST is exactly 9:30 AM UTC (IST is UTC + 5:30)
      const target = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        9,  // Hours (UTC)
        30, // Minutes (UTC)
        0,  // Seconds
        0   // Milliseconds
      ));

      // If 3:00 PM IST has already passed today, schedule it for tomorrow
      if (now.getTime() > target.getTime()) {
        target.setUTCDate(target.getUTCDate() + 1);
      }

      const delay = target.getTime() - now.getTime();
      console.log(`[Rates Scheduler] Next daily 3:00 PM IST update scheduled in ${Math.round(delay / 60000)} minutes.`);

      setTimeout(async () => {
        await updateRatesCache();
        // Repeat daily every 24 hours
        const ONE_DAY = 24 * 60 * 60 * 1000;
        setInterval(updateRatesCache, ONE_DAY);
        console.log('[Rates Scheduler] Daily 3:00 PM IST interval established.');
      }, delay);
    };

    scheduleDailyUpdate();
  }
}

export async function GET() {
  const now = new Date();
  const istTime = new Date(now.getTime() + (330 * 60000));
  const istHour = istTime.getUTCHours();
  
  if (istHour < 15) {
    istTime.setTime(istTime.getTime() - (24 * 60 * 60 * 1000));
  }
  
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const date = String(istTime.getUTCDate()).padStart(2, '0');
  const cacheKey = `${year}-${month}-${date}_1500`;

  // 1. Return cached rates if valid
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const fileContent = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(fileContent);
      if (cachedData.lastUpdated === cacheKey && cachedData.rates) {
        return NextResponse.json(cachedData.rates);
      }
    }
  } catch (err) {
    console.error('Error reading cache file:', err);
  }

  // 2. If cache not present or invalid, fetch and write immediately
  const rates = await updateRatesCache();
  if (rates) {
    return NextResponse.json(rates);
  }

  // Baseline fallback if everything fails
  const dateSeed = now.getDate() + now.getMonth() * 31;
  const fluctuation = (dateSeed % 8 - 4) * 15;
  const baseGold24 = 7250 + fluctuation;
  return NextResponse.json({
    gold24k: baseGold24,
    gold22k: Math.round(baseGold24 * 0.9167),
    gold18k: Math.round(baseGold24 * 0.75),
    silver: Math.round((85 + (dateSeed % 6 - 3) * 0.5) * 100) / 100,
  });
}
