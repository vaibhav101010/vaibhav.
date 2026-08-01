const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/remix_context.json', 'utf8'));

const loaderData = data.state.loaderData['gold-rate-india.html'];
if (loaderData) {
  console.log('LoaderData Keys:', Object.keys(loaderData));
  if (loaderData.commodityData) {
    console.log('commodityData Keys:', Object.keys(loaderData.commodityData));
  }
}
