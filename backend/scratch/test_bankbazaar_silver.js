async function test() {
  try {
    // 1. Fetch Gold Rate
    const goldUrl = 'https://www.bankbazaar.com/gold-rate-india.html';
    const goldRes = await fetch(goldUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const goldHtml = await goldRes.text();
    const goldMatch = goldHtml.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);
    if (!goldMatch) throw new Error('Gold Remix Context not found');
    const goldData = JSON.parse(goldMatch[1]);
    const goldLoader = goldData.state.loaderData['gold-rate-india.html'];
    
    // We default to Lucknow (cityId: 149) or Delhi (cityId: 174) or fallback to Ahmedabad/first city
    const goldLucknow = goldLoader.commodityData.cityPrices['149'] || goldLoader.commodityData.cityPrices['174'];
    const goldRatesToday = goldLucknow[0].prices;
    console.log('Gold Rates Today:', goldRatesToday);

    // 2. Fetch Silver Rate
    const silverUrl = 'https://www.bankbazaar.com/silver-rate-india.html';
    const silverRes = await fetch(silverUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const silverHtml = await silverRes.text();
    const silverMatch = silverHtml.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);
    if (!silverMatch) throw new Error('Silver Remix Context not found');
    const silverData = JSON.parse(silverMatch[1]);
    const silverLoader = silverData.state.loaderData['silver-rate-india.html'];
    
    const silverLucknow = silverLoader.commodityData.cityPrices['149'] || silverLoader.commodityData.cityPrices['174'];
    const silverRatesToday = silverLucknow[0].prices;
    console.log('Silver Rates Today:', silverRatesToday);

  } catch (err) {
    console.error('Error fetching bankbazaar rates:', err.message);
  }
}
test();
