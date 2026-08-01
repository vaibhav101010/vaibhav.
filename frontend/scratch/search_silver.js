const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/remix_context.json', 'utf8'));

const results = [];
function search(obj, path = '') {
  if (!obj) return;
  if (typeof obj === 'string') {
    if (obj.toLowerCase().includes('silver') || obj.toLowerCase().includes('chandi')) {
      results.push({ path, val: obj });
    }
  } else if (typeof obj === 'object') {
    for (let k in obj) {
      if (k.toLowerCase().includes('silver') || k.toLowerCase().includes('chandi')) {
        results.push({ path: `${path}.${k}`, val: obj[k] });
      }
      search(obj[k], `${path}.${k}`);
    }
  }
}
search(data);
console.log('Search results for silver:', results.slice(0, 30));
