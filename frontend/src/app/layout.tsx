import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScrolling from '@/components/SmoothScrolling';
import Preloader from '@/components/Preloader';
import Chatbot from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'M/S Suman Jewellers Mirzapur | Best Gold, Silver & Diamond Jewellery',
  description:
    'Looking for the best jewellery shop in Mirzapur? Visit M/S Suman Jewellers at Wellesley Ganj for luxury 18K/22K Gold, 925 Silver, and GIA Certified Diamonds.',
  keywords: [
    'Suman Jewellers Mirzapur',
    'M/S Suman Jewellers',
    'best jewellery shop in Mirzapur',
    'gold shop in Mirzapur',
    'diamond jewellery Mirzapur',
    'silver jewellery Mirzapur',
    'Wellesley Ganj jewellers',
    'IGI certified diamonds Mirzapur'
  ],
  icons: {
    icon: '/images/logo-gold.png',
    apple: '/images/logo-gold.png',
  },
  openGraph: {
    title: 'M/S Suman Jewellers Mirzapur',
    description: 'Best Gold, Silver & Diamond Jewellery Shop in Mirzapur',
    type: 'website',
  },
  verification: {
    google: 'Kwq6jYyvdboP2VKue2jcl5EEpV-V_CZp6oaKZuFrN38',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'M/S Suman Jewellers',
    description: 'Luxury Diamond, Gold & Silver Jewellery in Mirzapur. GIA & IGI certified.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Wellesley Ganj, near Sai Baba Temple',
      addressLocality: 'Mirzapur',
      addressRegion: 'UP',
      addressCountry: 'IN'
    },
    url: 'https://www.sumanjeweller.com'
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <SmoothScrolling>
          <Preloader />
          <CustomCursor />
          {children}
          <Chatbot />
        </SmoothScrolling>
      </body>
    </html>
  );
}
