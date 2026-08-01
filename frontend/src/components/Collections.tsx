'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Collections.module.css';

const collections = [
  {
    title: 'Gold',
    subtitle: 'Timeless Warmth',
    description: 'From 18K to 24K — our gold jewellery collection blends classical Indian craftsmanship with contemporary silhouettes.',
    tags: ['18K / 22K / 24K', 'BIS Hallmarked', 'Custom Orders'],
    image: '/images/gold-hero-banner.jpg',
    gradient: 'linear-gradient(135deg, rgba(139, 99, 32, 0.4) 0%, rgba(30, 25, 15, 0.9) 100%)',
    featured: false,
  },

  {
    title: 'Silver',
    subtitle: 'Modern Elegance',
    description: '925 Sterling Silver — oxidised, plain, and gemstone-studded pieces that speak to the modern connoisseur.',
    tags: ['925 Sterling', 'Rhodium Plated', 'Oxidised Range'],
    image: 'https://i5.walmartimages.com/seo/Bouanq-Necklaces-for-Women-Necklace-Earrings-Alloy-Rhinestone-Jewelry-Set-Wedding-Party-Accessories-Silver-Necklace-Wedding-Christmas-Gifts_09892335-14e6-45c1-ad33-967cc6e4ccc2.68f6d227d7696d0920d4cd0be0291a4a.jpeg',
    gradient: 'linear-gradient(135deg, rgba(100, 100, 110, 0.4) 0%, rgba(15, 15, 20, 0.9) 100%)',
    featured: false,
  },
];

function CollectionCard({ item, index }: { item: typeof collections[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * 4}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} collection-card-skew ${item.featured ? styles.featured : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--card-delay': `${index * 0.15}s` } as React.CSSProperties}
    >
      {item.featured && <div className={styles.featuredBadge}>Signature Collection</div>}

      {/* Product image */}
      <div className={styles.cardImage}>
        <Image
          src={item.image}
          alt={`${item.title} jewellery collection`}
          fill
          sizes="(max-width: 900px) 90vw, 33vw"
          style={{ objectFit: 'cover' }}
          className={styles.cardImg}
        />
        <div className={styles.cardOverlay} style={{ background: item.gradient }} />
      </div>

      <div className={styles.cardContent}>
        <p className={styles.cardSubtitle}>{item.subtitle}</p>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDesc}>{item.description}</p>

        <div className={styles.tags}>
          {item.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <Link
          href={`/${item.title.toLowerCase()}`}
          className={styles.cardCta}
          id={`collection-${item.title.toLowerCase()}-cta`}
        >
          View Collection
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function Collections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // No scroll triggers needed, displaying as a premium static grid layout

  return (
    <section id="collections" className={styles.section} aria-label="Jewellery Collections" ref={containerRef}>
      {/* Immersive Intro Pinned First */}
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Our Collections</p>
        <h2 className={styles.heading}>
          Two Metals,<br />
          <em>Infinite Stories</em>
        </h2>
        <div className={styles.divider} />
      </div>

      {/* Horizontal Scroll Area */}
      <div className={styles.horizontalContainer}>
        <div ref={wrapperRef} className={styles.cardsWrapper}>
          {collections.map((item, i) => (
            <CollectionCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
