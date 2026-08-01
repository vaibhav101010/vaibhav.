const fs = require('fs');

async function parse() {
  try {
    const url = 'https://www.bankbazaar.com/gold-rate-india.html';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Write HTML to temporary file to inspect structure if needed
    fs.writeFileSync('scratch/bankbazaar.html', html);
    
    // Look for prices in the HTML. 
    // BankBazaar tables typically look like: 
    // <tr><td>1 gram</td><td>₹ 7,200</td><td>₹ 6,600</td></tr>
    // Let's write a regex that matches numbers in tables
    const tableRegex = /<tr[^>]*>\s*<td[^>]*>\s*(\d+)\s*(?:gram|gm)[^<]*<\/td>\s*<td[^>]*>[^0-9]*([\d,]+)[^<]*<\/td>\s*<td[^>]*>[^0-9]*([\d,]+)[^<]*<\/td>/gi;
    
    let match;
    const rates = [];
    while ((match = tableRegex.exec(html)) !== null) {
      rates.push({
        grams: match[1],
        rate24K: match[2].replace(/,/g, ''),
        rate22K: match[3].replace(/,/g, '')
      });
    }
    
    console.log('Parsed Rates Table Rows (Method A):', rates);

    // Fallback: search for "Today's Gold Rate per Gram"
    // Example: "24 Karat Gold Rate per gram is ₹7,250" or "22 Karat Gold Rate per gram is ₹6,646"
    const textRegex = /24\s*Karat\s*Gold[^0-9\n]{1,20}([\d,]{4,6})/i;
    const textMatch = html.match(textRegex);
    if (textMatch) {
      console.log('Detected 24K Gold Rate (Method B):', textMatch[1]);
    }
    
    const text22Regex = /22\s*Karat\s*Gold[^0-9\n]{1,20}([\d,]{4,6})/i;
    const text22Match = html.match(text22Regex);
    if (text22Match) {
      console.log('Detected 22K Gold Rate (Method B):', text22Match[1]);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}
parse();
