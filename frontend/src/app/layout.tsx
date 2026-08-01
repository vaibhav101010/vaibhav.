import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScrolling from '@/components/SmoothScrolling';
import Preloader from '@/components/Preloader';
import Chatbot from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'M/S Suman Jewellers — Golden Craftsmanship for Men of Class',
  description:
    'Luxury Diamond, Gold & Silver Jewellery in Mirzapur. GIA & IGI certified. Visit us at Wellesley Ganj near Sai Baba Temple.',
  keywords: ['jewellery', 'diamond', 'gold', 'silver', 'Mirzapur', 'GIA', 'IGI', 'Suman Jewellers'],
  icons: {
    icon: '/images/logo-gold.png',
    apple: '/images/logo-gold.png',
  },
  openGraph: {
    title: 'M/S Suman Jewellers',
    description: 'Golden Craftsmanship for Men of Class',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
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
