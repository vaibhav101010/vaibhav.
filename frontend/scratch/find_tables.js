const fs = require('fs');
const html = fs.readFileSync('scratch/bankbazaar.html', 'utf8');

// Find all HTML tables or lists or text around "24 Karat" or "22 Karat"
const lines = html.split('\n');
const matchingLines = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('24 Karat') || lines[i].includes('22 Karat') || lines[i].includes('Gold Price Today') || lines[i].includes('gold-rate-table') || lines[i].includes('table-responsive')) {
    matchingLines.push(`Line ${i + 1}: ${lines[i].trim().slice(0, 150)}`);
  }
}

console.log('Matching Lines:', matchingLines.slice(0, 30));
