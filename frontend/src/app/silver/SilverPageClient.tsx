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
  { label: 'Necklaces', count: '2 Items', image: '/images/silver-necklace-1.jpeg' },
  { label: 'Trending', count: '14 Items', image: '/images/collection-silver.png' },


];

const products: Product[] = [];

export default function SilverPageClient() {
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [allProducts, setAllProducts] = useState(products);
  const [rates, setRates] = useState<any>(null);

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => setRates(data))
      .catch(err => console.error('Failed to fetch rates', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCategoriesFromSheet().then((data) => {
      if (data) {
        const filtered = data.filter((item) => item.page === 'silver');
        if (filtered.length > 0) {
          setCategories(filtered.map(item => {
            let finalImage = item.image;
            // If the sheet hasn't been updated with specific images, use our beautiful new ones!
            if (item.label.toLowerCase() === 'rings' && item.image === '/images/collection-silver.png') {
              finalImage = '/images/cat-silver-ring.png';
            } else if (item.label.toLowerCase() === 'oxidised' && item.image === '/images/collection-silver.png') {
              finalImage = '/images/cat-oxidised.png';
            }
            
            return {
              label: item.label,
              count: item.count,
              image: finalImage
            };
          }));
        }
      }
    });

    fetchProductsFromSheet().then((sheetProducts) => {
      if (sheetProducts && sheetProducts.length > 0) {
        const silverSheetProducts = sheetProducts.filter(p => p.category === 'silver');
        if (silverSheetProducts.length > 0) {
          setAllProducts([...products, ...silverSheetProducts]);
        }
      }
    });
  }, []);

  const matchesCategory = (product: Product, category: string) => {
    const cat = category.toLowerCase();
    const name = product.name.toLowerCase();
    const badge = product.badge?.toLowerCase() || '';
    const purity = product.purity?.toLowerCase() || '';

    if (cat === 'earrings') {
      return name.includes('earring') || name.includes('jhumka') || name.includes('studs');
    }
    if (cat === 'rings') {
      return (name.includes('ring') || name.includes('band')) && !name.includes('earring');
    }
    if (cat === 'necklaces') {
      return name.includes('necklace') || name.includes('chain');
    }
    if (cat === 'oxidised') {
      return name.includes('oxidised') || purity.includes('oxidised');
    }
    if (cat === 'trending') {
      return badge.includes('trending') || name.includes('rope chain') || name.includes('kada') || name.includes('pendant');
    }
    return false;
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
    ? allProducts.filter(p => matchesCategory(p, activeCategory))
    : allProducts;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div style={{ height: '140vh', position: 'relative' }}>
          <div className={styles.banner} style={{ position: 'sticky', top: '90px', zIndex: 0 }}>
            <div className={styles.bannerImageSlider}>
              {/* Blurred background to fill empty space */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                <Image
                  src="https://i5.walmartimages.com/seo/Bouanq-Necklaces-for-Women-Necklace-Earrings-Alloy-Rhinestone-Jewelry-Set-Wedding-Party-Accessories-Silver-Necklace-Wedding-Christmas-Gifts_09892335-14e6-45c1-ad33-967cc6e4ccc2.68f6d227d7696d0920d4cd0be0291a4a.jpeg"
                  alt="Silver Collection Background"
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: 'cover', filter: 'blur(30px) brightness(0.5)', transform: 'scale(1.1)' }}
                />
              </div>
              {/* Main sharp image */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 1, transform: `scale(${1 + scrollY * 0.0015})`, transformOrigin: 'center center' }}>
                <Image
                  src="https://i5.walmartimages.com/seo/Bouanq-Necklaces-for-Women-Necklace-Earrings-Alloy-Rhinestone-Jewelry-Set-Wedding-Party-Accessories-Silver-Necklace-Wedding-Christmas-Gifts_09892335-14e6-45c1-ad33-967cc6e4ccc2.68f6d227d7696d0920d4cd0be0291a4a.jpeg"
                  alt="Silver Collection"
                  fill
                  priority
                  sizes="100vw"
                  className={`${styles.bannerImgSlide} ${styles.slide1}`}
                />
              </div>
            </div>
            <div className={styles.bannerOverlay} style={{ background: 'linear-gradient(180deg, rgba(7,7,9,0.1) 0%, rgba(7,7,9,0.5) 100%)' }} />
            <div className={styles.bannerContent}>
              <p className={styles.bannerEyebrow}>925 Sterling · Rhodium · Oxidised</p>
              <h1 className={styles.bannerTitle}><em>Silver</em> Collection</h1>
              <p className={styles.bannerSub}>Modern elegance, accessible luxury</p>
            </div>
          </div>
        </div>

        {/* Overlapping Categories */}
        <div className={styles.categories}>
          {categories.map((cat, i) => (
            <div 
              key={cat.label} 
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
                    e.currentTarget.src = defaultCategories[i]?.image || '/images/collection-silver.png';
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
            <h2 className={styles.sectionTitle}>Delicate Jewelry</h2>
          </div>
          <div className={styles.grid}>
            {filteredProducts.map((product, i) => {
              let displayPrice = product.price;
              let originalDisplayPrice = product.originalPrice;

              if (rates && product.weight) {
                const weightMatch = product.weight.match(/[\d.]+/);
                if (weightMatch) {
                  const weight = parseFloat(weightMatch[0]);
                  const silverRate = rates.silver;
                  
                  if (silverRate) {
                    // Base silver value based on API route + 100 making charge per gram
                    const finalPrice = Math.round(weight * (silverRate + 100));
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
