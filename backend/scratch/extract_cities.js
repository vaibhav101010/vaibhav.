const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/remix_context.json', 'utf8'));

const loaderData = data.state.loaderData['gold-rate-india.html'];
if (loaderData && loaderData.commodityData) {
  const cd = loaderData.commodityData;
  console.log('topCities:', JSON.stringify(cd.topCities, null, 2));
  console.log('majorCities:', JSON.stringify(cd.majorCities, null, 2));
}
