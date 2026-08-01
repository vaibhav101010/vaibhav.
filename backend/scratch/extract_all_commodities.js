const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/remix_context.json', 'utf8'));

const loaderData = data.state.loaderData['gold-rate-india.html'];
if (loaderData && loaderData.commodityData) {
  const cd = loaderData.commodityData;
  console.log('allCommodityPrices:', JSON.stringify(cd.allCommodityPrices, null, 2));
}
