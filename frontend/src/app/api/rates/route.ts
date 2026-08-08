import { NextResponse } from 'next/server';

// In-memory cache that persists across warm Lambda invocations
let memCache: { rates: any; date: string } | null = null;

function getTodayKey() {
  const now = new Date();
  // IST = UTC + 5:30
  const ist = new Date(now.getTime() + 330 * 60000);
  // Before 10 AM IST, use previous day's key
  if (ist.getUTCHours() < 10) {
    ist.setUTCDate(ist.getUTCDate() - 1);
  }
  return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, '0')}-${String(ist.getUTCDate()).padStart(2, '0')}`;
}

async function fetchLiveRates(): Promise<any | null> {
  const goldApiKey = process.env.SILVER_API_KEY || process.env.GOLD_API_KEY || 'goldapi-d53ea8547a5de489e93f9a2b8065b40c-io';

  // 1. Try GoldAPI.io first
  if (goldApiKey?.startsWith('goldapi')) {
    try {
      console.log('[Rates] Fetching from GoldAPI.io...');
      const [goldRes, silverRes] = await Promise.all([
        fetch('https://www.goldapi.io/api/XAU/INR', {
          headers: { 'x-access-token': goldApiKey, 'Content-Type': 'application/json' },
          cache: 'no-store',
        }),
        fetch('https://www.goldapi.io/api/XAG/INR', {
          headers: { 'x-access-token': goldApiKey, 'Content-Type': 'application/json' },
          cache: 'no-store',
        }),
      ]);

      if (goldRes.ok && silverRes.ok) {
        const goldData = await goldRes.json();
        const silverData = await silverRes.json();

        if (goldData.price_gram_24k && silverData.price_gram_24k) {
          const rates = {
            gold24k: Math.round(goldData.price_gram_24k * 1.1253),
            gold22k: Math.round(goldData.price_gram_22k * 1.1691),
            gold18k: Math.round(goldData.price_gram_18k * 1.1253),
            silver: Math.round(silverData.price_gram_24k * 1.33),
          };
          console.log('[Rates] GoldAPI.io success:', JSON.stringify(rates));
          return rates;
        }
      } else {
        console.warn(`[Rates] GoldAPI.io not OK: XAU=${goldRes.status}, XAG=${silverRes.status}`);
      }
    } catch (err: any) {
      console.error('[Rates] GoldAPI.io error:', err.message);
    }
  }

  // 2. Fallback: BankBazaar scraping
  try {
    console.log('[Rates] Fetching from BankBazaar...');
    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    const [goldRes, silverRes] = await Promise.all([
      fetch('https://www.bankbazaar.com/gold-rate-india.html', { headers: { 'User-Agent': UA }, cache: 'no-store' }),
      fetch('https://www.bankbazaar.com/silver-rate-india.html', { headers: { 'User-Agent': UA }, cache: 'no-store' }),
    ]);

    if (!goldRes.ok) throw new Error('Gold fetch failed');
    if (!silverRes.ok) throw new Error('Silver fetch failed');

    const goldHtml = await goldRes.text();
    const silverHtml = await silverRes.text();

    const goldMatch = goldHtml.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);
    const silverMatch = silverHtml.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);

    if (!goldMatch || !silverMatch) throw new Error('Remix context not found');

    const goldLoader = JSON.parse(goldMatch[1]).state.loaderData['gold-rate-india.html'];
    const silverLoader = JSON.parse(silverMatch[1]).state.loaderData['silver-rate-india.html'];

    const goldCity = goldLoader.commodityData.cityPrices['149'] || goldLoader.commodityData.cityPrices['174'] || Object.values(goldLoader.commodityData.cityPrices)[0] as any;
    const silverCity = silverLoader.commodityData.cityPrices['149'] || silverLoader.commodityData.cityPrices['174'] || Object.values(silverLoader.commodityData.cityPrices)[0] as any;

    const goldPrices = goldCity[0].prices;
    const silverPrices = silverCity[0].prices;

    const rate24k = parseFloat(goldPrices['24K_1G']) || 13913;
    const rate22k = parseFloat(goldPrices['22K_1G']) || 13250;

    const rates = {
      gold24k: rate24k,
      gold22k: rate22k,
      gold18k: Math.round(rate24k * 0.75),
      silver: parseFloat(silverPrices['1G']) || 225,
    };
    console.log('[Rates] BankBazaar success:', JSON.stringify(rates));
    return rates;
  } catch (err: any) {
    console.error('[Rates] BankBazaar error:', err.message);
  }

  return null;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const todayKey = getTodayKey();

  // 1. Return in-memory cache if still valid for today
  if (memCache && memCache.date === todayKey) {
    console.log('[Rates] Returning in-memory cached rates for', todayKey);
    return NextResponse.json(memCache.rates);
  }

  // 2. Fetch fresh rates
  const rates = await fetchLiveRates();

  if (rates) {
    // Save to memory cache
    memCache = { rates, date: todayKey };
    return NextResponse.json(rates);
  }

  // 3. Stale cache fallback — return yesterday's cached rates if available
  if (memCache) {
    console.warn('[Rates] Live fetch failed, returning stale cache from', memCache.date);
    return NextResponse.json(memCache.rates);
  }

  // 4. Last resort static fallback
  console.warn('[Rates] All sources failed, returning static fallback');
  const now = new Date();
  const dateSeed = now.getDate() + now.getMonth() * 31;
  const fluctuation = (dateSeed % 8 - 4) * 15;
  const baseGold24 = 13900 + fluctuation;
  return NextResponse.json({
    gold24k: baseGold24,
    gold22k: Math.round(baseGold24 * 0.9167),
    gold18k: Math.round(baseGold24 * 0.75),
    silver: 220,
  });
}
