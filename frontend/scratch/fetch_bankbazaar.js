async function fetchBankBazaar() {
  try {
    const url = 'https://www.bankbazaar.com/gold-rate-india.html';
    console.log(`Fetching from URL: ${url}...`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log(`Successfully fetched HTML (${html.length} bytes).`);

    // Let's look for rates patterns using regex
    // BankBazaar usually has tables with rates like "24 Karat Gold Rate", "22 Karat Gold Rate"
    // Let's search for gold rates numbers
    const rateMatches = [];
    
    // We can search for the text in the HTML that typically has the rate
    // e.g. looking for numbers like 7,000 - 8,000 or 70,000 - 80,000
    // Let's print a small snippet around gold rate occurrences
    const regex = /(?:24\s*Karat|22\s*Karat|24K|22K|Gold\s*Price|Gold\s*Rate)[^<]{0,100}/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null && count < 10) {
      rateMatches.push(match[0].trim());
      count++;
    }

    console.log('\n--- Found Rates Snippets ---');
    console.log(rateMatches.join('\n\n'));

  } catch (error) {
    console.error('Error fetching BankBazaar:', error.message);
  }
}

fetchBankBazaar();
