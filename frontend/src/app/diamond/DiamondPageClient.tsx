'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard, { Product } from '@/components/ProductCard';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import styles from '../collection.module.css';
import { fetchCategoriesFromSheet } from '@/lib/googleSheets';

const defaultCategories = [
  { label: 'Rings', count: '18 Items', image: '/images/diamond-solitaire.png' },
  { label: 'Bracelets', count: '6 Items', image: '/images/story-diamond.png' },
  { label: 'Necklaces', count: '12 Items', image: '/images/collection-diamond.png' },
  { label: 'Earrings', count: '14 Items', image: '/images/hero-necklace.png' },
];

const products: Product[] = [
  {
    name: '1 Carat Solitaire Ring',
    price: '₹8,50,000',
    originalPrice: '₹9,25,000',
    image: '/images/diamond-solitaire.png',
    weight: '1.02 ct',
    purity: '18K Gold · VVS1 · GIA',
    badge: 'Signature',
  },
  {
    name: 'Diamond Bridal Necklace Set',
    price: '₹12,75,000',
    image: '/images/collection-diamond.png',
    weight: '6.5 ct Total',
    purity: '18K Gold · VS · IGI',
    badge: 'Bridal',
  },
  {
    name: 'Diamond Tennis Bracelet',
    price: '₹4,20,000',
    originalPrice: '₹4,80,000',
    image: '/images/story-diamond.png',
    weight: '3.2 ct Total',
    purity: '18K Gold · VS · GIA',
  },
  {
    name: 'Diamond Studs (Pair)',
    price: '₹1,85,000',
    image: '/images/hero-necklace.png',
    weight: '0.8 ct Total',
    purity: '18K Gold · VVS2 · IGI',
  },
  {
    name: 'Men\'s Diamond Band Ring',
    price: '₹2,40,000',
    image: '/images/collection-diamond.png',
    weight: '1.5 ct Total',
    purity: '18K Gold · SI · GIA',
    badge: 'Men\'s',
  },
  {
    name: 'Pear Drop Diamond Pendant',
    price: '₹3,65,000',
    originalPrice: '₹4,10,000',
    image: '/images/diamond-solitaire.png',
    weight: '1.8 ct',
    purity: '18K Gold · VS1 · IGI',
  },
];

export default function DiamondPageClient() {
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoriesFromSheet().then((data) => {
      if (data) {
        const filtered = data.filter((item) => item.page === 'diamond');
        if (filtered.length > 0) {
          setCategories(filtered.map(item => ({
            label: item.label,
            count: item.count,
            image: item.image
          })));
        }
      }
    });
  }, []);

  const getProductCategory = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('ring') || name.includes('band')) return 'rings';
    if (name.includes('bracelet') || name.includes('tennis')) return 'bracelets';
    if (name.includes('necklace') || name.includes('pendant') || name.includes('set')) return 'necklaces';
    if (name.includes('earring') || name.includes('studs') || name.includes('drop')) return 'earrings';
    return '';
  };

  const handleCategoryClick = (label: string) => {
    if (activeCategory?.toLowerCase() === label.toLowerCase()) {
      setActiveCategory(null);
    } else {
      setActiveCategory(label);
      const gridSec = document.getElementById('trending-products-section');
      if (gridSec) {
        gridSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filteredProducts = activeCategory
    ? products.filter(p => getProductCategory(p.name).toLowerCase() === activeCategory.toLowerCase())
    : products;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.banner}>
          <div className={styles.bannerImage}>
            <Image
              src="/images/story-diamond.png"
              alt="Diamond Collection"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', filter: 'grayscale(100%) brightness(0.5) contrast(1.2)' }}
              className={styles.bannerImg}
            />
          </div>
          <div className={styles.bannerOverlay} style={{ background: 'linear-gradient(90deg, rgba(7,7,9,0.9) 0%, rgba(7,7,9,0.4) 100%)' }} />
          <div className={styles.bannerContent} style={{ textAlign: 'left', paddingLeft: 'clamp(20px, 5vw, 80px)', maxWidth: '600px', margin: '0 auto 0 0' }}>
            <p className={styles.bannerEyebrow}>GIA & IGI Certified · 18K Gold Setting</p>
            <h1 className={styles.bannerTitle} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Why is <em>Craftsmanship</em><br/>so important?
            </h1>
            <p className={styles.bannerSub} style={{ fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '20px' }}>
              Excellent craftsmanship provides a diamond&apos;s outstanding cut quality, a quality that assures that the diamond does not lose color, or sparkle.
            </p>
            <p className={styles.bannerEyebrow} style={{ margin: '20px 0 0 0', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)' }}>Trust Suman Jewellers for the best price for your diamonds.</p>
          </div>
        </div>

        {/* Overlapping Categories */}
        <div className={styles.categories}>
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={`${styles.categoryCard} ${activeCategory?.toLowerCase() === cat.label.toLowerCase() ? styles.categoryCardActive : ''}`}
              onClick={() => handleCategoryClick(cat.label)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.catImageWrap}>
                <img
                  src={cat.image}
                  alt={cat.label}
                  style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                  className={styles.catImg}
                  onError={(e) => {
                    e.currentTarget.src = defaultCategories[i]?.image || '/images/collection-diamond.png';
                  }}
                />
                <div className={styles.catHoverOverlay}>
                  <span className={styles.catHoverText}>ENTER</span>
                </div>
              </div>
              <div className={styles.catLabel}>{cat.label}</div>
              <div className={styles.catSub}>{cat.count}</div>
            </div>
          ))}
        </div>

        <Link href="/" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </Link>

        {/* Active Filter display */}
        {activeCategory && (
          <div className={styles.filterStatus}>
            <span className={styles.filterStatusLabel}>Currently viewing:</span>
            <span className={styles.filterStatusValue}>{activeCategory}</span>
            <span>({filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'})</span>
            <button className={styles.clearFilterBtn} onClick={() => setActiveCategory(null)}>
              Show All Products
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className={styles.gridSection} id="trending-products-section">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Discover Your Sparkle</h2>
          </div>
          <div className={styles.grid}>
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.name} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
      <Certifications />
      <Contact />
      <WhatsAppFAB />
    </>
  );
}
