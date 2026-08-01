import { Metadata } from 'next';
import SilverPageClient from './SilverPageClient';

export const metadata: Metadata = {
  title: 'Silver Collection | M/S Suman Jewellers',
  description: '925 Sterling Silver jewellery — oxidised, rhodium plated, and gemstone-studded bracelets, rings, pendants. Suman Jewellers, Mirzapur.',
};

export default function SilverPage() {
  return <SilverPageClient />;
}
