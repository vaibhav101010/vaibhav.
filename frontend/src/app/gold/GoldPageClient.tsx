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
import { fetchCategoriesFromSheet, fetchProductsFromSheet } from '@/lib/googleSheets';

const defaultCategories = [
  { label: 'Necklaces', count: '12 Items', image: '/images/gold-necklace.png' },
  { label: 'Bangles', count: '8 Items', image: '/images/gold-bangles.png' },
  { label: 'Bracelets', count: '5 Items', image: '/images/gold-bracelet/suman4.jpeg' },
  { label: 'Rings', count: '15 Items', image: '/images/gold-ring.png' },
  { label: 'Earrings', count: '24 Items', image: '/images/gold-earrings.png' },
];

const products: Product[] = [];

export default function GoldPageClient() {
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [rates, setRates] = useState<any>(null);
  const [allProducts, setAllProducts] = useState(products);

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => setRates(data))
      .catch(err => console.error('Failed to fetch rates', err));
  }, []);

  useEffect(() => {
    fetchCategoriesFromSheet().then((data) => {
      if (data) {
        const filtered = data.filter((item) => item.page === 'gold');
        if (filtered.length > 0) {
          const newCategories = filtered.map(item => ({
            label: item.label,
            count: item.count,
            image: item.image
          }));
          
          if (!newCategories.find(c => c.label.toLowerCase() === 'bracelets')) {
            const defaultBracelet = defaultCategories.find(c => c.label.toLowerCase() === 'bracelets');
            if (defaultBracelet) {
              newCategories.splice(2, 0, defaultBracelet);
            }
          }
          setCategories(newCategories);
        }
      }
    });

    fetchProductsFromSheet().then((sheetProducts) => {
      if (sheetProducts && sheetProducts.length > 0) {
        // Only include products that are either unspecified (assume gold) or explicitly 'gold'
        const goldSheetProducts = sheetProducts.filter(p => !p.category || p.category === 'gold');
        if (goldSheetProducts.length > 0) {
          setAllProducts([...products, ...goldSheetProducts]);
        }
      }
    });
  }, []);

  const getProductCategory = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('necklace') || name.includes('chain') || name.includes('pendant')) return 'necklaces';
    if (name.includes('bangle') || name.includes('kada')) return 'bangles';
    if (name.includes('bracelet')) return 'bracelets';
    if (name.includes('earring') || name.includes('jhumka') || name.includes('studs')) return 'earrings';
    if (name.includes('ring') || name.includes('band')) return 'rings';
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
    ? allProducts.filter(p => getProductCategory(p.name).toLowerCase() === activeCategory.toLowerCase())
    : allProducts;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        {/* Hero Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerImage}>
            <Image
              src="/images/gold-hero-banner.jpg"
              alt="Gold Collection"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              className={styles.bannerImg}
            />
          </div>
          <div className={styles.bannerOverlay} style={{ background: 'linear-gradient(180deg, rgba(7,7,9,0.3) 0%, rgba(7,7,9,0.8) 100%)' }} />
          <div className={styles.bannerContent}>
            <p className={styles.bannerEyebrow}>BIS Hallmarked · 18K</p>
            <h1 className={styles.bannerTitle}><em>Gold</em> Collection</h1>
            <p className={styles.bannerSub}>Timeless craftsmanship, eternal warmth</p>
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
                    e.currentTarget.src = defaultCategories[i]?.image || '/images/collection-gold.png';
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
            <h2 className={styles.sectionTitle}>Trending Products</h2>
          </div>
          <div className={styles.grid}>
            {filteredProducts.map((product, i) => {
              let displayPrice = product.price;
              let originalDisplayPrice = product.originalPrice;

              if (rates && product.weight && product.purity) {
                const weightMatch = product.weight.match(/[\d.]+/);
                if (weightMatch) {
                  const weight = parseFloat(weightMatch[0]);
                  let rate = rates.gold22k; // default to 22k
                  if (product.purity.includes('18K')) rate = rates.gold18k;
                  if (product.purity.includes('24K')) rate = rates.gold24k;
                  
                  if (rate) {
                    // Base gold value + 18% for making charges and GST
                    const finalPrice = Math.round(weight * rate * 1.18);
                    displayPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalPrice);
                    originalDisplayPrice = undefined; // Hide original price if dynamic rate is applied
                  }
                }
              }

              return (
                <ProductCard 
                  key={product.name} 
                  product={{...product, price: displayPrice, originalPrice: originalDisplayPrice}} 
                  index={i} 
                />
              );
            })}
          </div>
        </div>
      </div>
      <Certifications />
      <Contact />
      <WhatsAppFAB />
    </>
  );
}
