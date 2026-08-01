const fs = require('fs');
const html = fs.readFileSync('scratch/bankbazaar.html', 'utf8');

// Find window.__remixContext
const match = html.match(/window\.__remixContext\s*=\s*({.*?});<\/script>/s);
if (match) {
  const jsonText = match[1];
  console.log('Successfully found remixContext JSON.');
  fs.writeFileSync('scratch/remix_context.json', jsonText);
  
  // Try to parse it
  try {
    const data = JSON.parse(jsonText);
    console.log('Successfully parsed JSON!');
    // Let's search key/value pairs in the JSON to find where rates are
    const keys = [];
    function findGold(obj, path = '') {
      if (!obj) return;
      if (typeof obj === 'object') {
        for (let k in obj) {
          if (k.toLowerCase().includes('gold') || k.toLowerCase().includes('rate') || k.toLowerCase().includes('price') || k === 'rates') {
            keys.push(`${path}.${k}`);
          }
          findGold(obj[k], `${path}.${k}`);
        }
      }
    }
    findGold(data);
    console.log('Keys matching gold/rate/price:', keys.slice(0, 40));
    
  } catch (err) {
    console.error('Error parsing JSON:', err.message);
  }
} else {
  console.log('window.__remixContext not found.');
}
