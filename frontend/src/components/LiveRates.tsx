'use client';

import { useEffect, useState } from 'react';

interface Rates {
  gold24k: number | null;
  gold22k: number | null;
  gold18k: number | null;
  silver: number | null;
}

export default function LiveRates() {
  const [rates, setRates] = useState<Rates>({ gold24k: null, gold22k: null, gold18k: null, silver: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // 5 second timeout — agar API slow ho toh hang na kare
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('/api/rates', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();
        if (data.gold24k && data.silver) {
          setRates({
            gold24k: data.gold24k,
            gold22k: data.gold22k,
            gold18k: data.gold18k,
            silver: data.silver,
          });
        }
      } catch (error) {
        console.error('Failed to fetch rates', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    
    // Auto-update rates on the website page every 5 minutes without needing page reload
    const interval = setInterval(fetchRates, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ opacity: 0.7 }}>Loading live market rates...</div>;
  }

  if (!rates.gold24k || !rates.silver) {
    return <div style={{ opacity: 0.7 }}>Rates currently unavailable</div>;
  }

  const formatRate = (rate: number | null, multiplier: number = 1) => rate ? Math.round(rate * multiplier) : 'N/A';

  return (
    <div>
      Live Rates: 24K Gold ₹{formatRate(rates.gold24k, 10)}/10g | 22K Gold ₹{formatRate(rates.gold22k, 10)}/10g | 18K Gold ₹{formatRate(rates.gold18k, 10)}/10g | Silver ₹{formatRate(rates.silver)}/g
    </div>
  );
}
