const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/remix_context.json', 'utf8'));

const loaderData = data.state.loaderData['gold-rate-india.html'];
if (loaderData && loaderData.commodityData) {
  const cd = loaderData.commodityData;
  console.log('Metal:', cd.metal);
  console.log('Units:', cd.units);
  console.log('City Prices Keys:', Object.keys(cd.cityPrices));
  
  // Let's print the first city's price data
  const firstCityKey = Object.keys(cd.cityPrices)[0];
  const firstCityData = cd.cityPrices[firstCityKey];
  console.log(`First City (${firstCityKey}) name:`, firstCityData.cityName);
  console.log(`First City (${firstCityKey}) details:`, JSON.stringify(firstCityData, null, 2));
} else {
  console.log('commodityData not found in Remix context loaderData.');
}
