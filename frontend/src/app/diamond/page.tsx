import { Metadata } from 'next';
import DiamondPageClient from './DiamondPageClient';

export const metadata: Metadata = {
  title: 'Diamond Collection | M/S Suman Jewellers',
  description: 'GIA & IGI certified diamond jewellery — solitaire rings, tennis bracelets, pendant sets, and men\'s diamond rings. Suman Jewellers, Mirzapur.',
};

export default function DiamondPage() {
  return <DiamondPageClient />;
}
