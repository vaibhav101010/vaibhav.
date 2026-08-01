async function test() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=inr');
    const data = await res.json();
    console.log('Coingecko Response:', JSON.stringify(data, null, 2));
    
    if (data['pax-gold'] && data['pax-gold'].inr) {
      const pricePerOunce = data['pax-gold'].inr;
      const pricePerGram = pricePerOunce / 31.1035;
      console.log('Price per gram 24K:', Math.round(pricePerGram));
      console.log('Price per gram 22K:', Math.round(pricePerGram * 0.9167));
      console.log('Price per gram 18K:', Math.round(pricePerGram * 0.75));
    }
  } catch (err) {
    console.error('Error fetching from coingecko:', err);
  }
}
test();
