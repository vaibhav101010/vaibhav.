import { Metadata } from 'next';
import GoldPageClient from './GoldPageClient';

export const metadata: Metadata = {
  title: 'Gold Collection | M/S Suman Jewellers',
  description: 'Explore our curated collection of 18K, 22K, and 24K gold jewellery — necklaces, bangles, chains, rings, and earrings. BIS Hallmarked. Suman Jewellers, Mirzapur.',
};

export default function GoldPage() {
  return <GoldPageClient />;
}
