'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Certifications.module.css';

const certs = [
  {
    id: 'bis',
    name: 'BIS Hallmark',
    fullName: 'Government Purity Mark',
    desc: 'Government-mandated gold purity certification — our guarantee of absolute gold authenticity.',
    image: '/images/bis-hallmark-certificate.jpg',
    color: '#d4af37',
  },
  {
    id: 'caratmeter',
    name: 'Caratometer',
    fullName: 'In-Store Gold Purity Test',
    desc: 'Verify gold purity instantly in our showroom with our high-precision Carat Meter machine. Complete transparency for your peace of mind.',
    image: '/images/carat-meter.png',
    color: '#00d2d3',
  },
  {
    id: 'emerald',
    name: 'Emerald Jewelers',
    fullName: 'Coimbatore Dealership',
    desc: 'Authorized dealership of Emerald Jewel Industry, Coimbatore. Offering South India\'s finest lightweight, laser-cut, and designer gold jewellery.',
    image: '/images/emerald-dealership-logo.png',
    color: '#2ecc71',
  },
  {
    id: 'bombay',
    name: 'Bombay Jewelers',
    fullName: 'Bombay Style Dealership',
    desc: 'Direct partnership for premium Bombay-style handcrafted antique jewellery and contemporary Mumbai designs, crafted by master artisans.',
    image: '/images/bombay-craftsmanship.png',
    color: '#ff6b6b',
  },
];

const trustPoints = [
  { label: '20+', desc: 'Years of Heritage' },
  { label: '4', desc: 'Partnerships' },
  { label: '100%', desc: 'Purity Assured' },
  { label: '∞', desc: 'Customer Trust' },
];

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<any>(null);
  const [isPinned, setIsPinned] = useState(false);

  const handleCardMouseEnter = (cert: any) => {
    if (!isPinned) {
      setActiveCert(cert);
    }
  };

  const handleCardMouseLeave = () => {
    if (!isPinned) {
      setActiveCert(null);
    }
  };

  const handleCardClick = (cert: any) => {
    setActiveCert(cert);
    setIsPinned(true);
  };

  return (
    <section id="certifications" className={styles.section} aria-label="Certifications and trust">
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">Trust & Authenticity</p>
          <h2 className="section-title">
            Why Smart Buyers<br />
            <em>Choose Suman Jewellers</em>
          </h2>
          <div className="gold-divider" />
          <p className={styles.headerSub}>
            exclusive partnerships from India&apos;s finest gold craftsmanship hubs — Coimbatore and Bombay.
          </p>
        </div>

        {/* Certification cards */}
        <div 
          className={styles.certGrid}
          onMouseLeave={handleCardMouseLeave}
        >
          {certs.map((cert) => (
            <div 
              key={cert.id} 
              id={`cert-${cert.id}`} 
              className={styles.certCard}
              onMouseEnter={() => handleCardMouseEnter(cert)}
              onClick={() => handleCardClick(cert)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.certImageWrap}>
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  sizes="70px"
                  style={{ 
                    objectFit: ['bombay', 'bis'].includes(cert.id) ? 'cover' : 'contain',
                    padding: ['bombay', 'bis'].includes(cert.id) ? '0px' : '4px'
                  }}
                />
              </div>
              <div className={styles.certGlow} style={{ background: cert.color }} />
              <h3 className={styles.certName} style={{ color: cert.color }}>
                {cert.name}
              </h3>
              <p className={styles.certFull}>{cert.fullName}</p>
              <p className={styles.certDesc}>{cert.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className={styles.statsStrip}>
          {trustPoints.map((tp) => (
            <div key={tp.label} className={styles.statItem}>
              <span className={`${styles.statNum} shimmer`}>{tp.label}</span>
              <span className={styles.statLabel}>{tp.desc}</span>
            </div>
          ))}
        </div>

        {/* Bottom marquee */}
        <div className={styles.marqueeWrap} aria-hidden="true">
          <div className={styles.marquee}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className={styles.marqueeItem}>
                BIS Hallmarked &nbsp;·&nbsp; Caratometer Tested &nbsp;·&nbsp; Emerald Coimbatore Dealership &nbsp;·&nbsp; Bombay Design Partners &nbsp;·&nbsp; Gold Experts &nbsp;·&nbsp; Silver Artisans &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {activeCert && (
        <div 
          className={`${styles.modalOverlay} ${isPinned ? styles.pinned : ''}`}
          onClick={() => {
            setActiveCert(null);
            setIsPinned(false);
          }}
        >
          <div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {isPinned && (
              <button 
                className={styles.closeBtn} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setActiveCert(null); 
                  setIsPinned(false); 
                }}
              >
                &times;
              </button>
            )}
            <div className={styles.modalGrid}>
              <div className={styles.modalImageContainer}>
                <Image
                  src={activeCert.image}
                  alt={activeCert.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ 
                    objectFit: activeCert.id === 'bombay' ? 'cover' : 'contain', 
                    padding: activeCert.id === 'bombay' ? '0px' : '16px' 
                  }}
                  priority
                />
              </div>
              <div className={styles.modalDetails}>
                <p className={styles.modalEyebrow} style={{ color: activeCert.color }}>
                  {activeCert.fullName}
                </p>
                <h3 className={styles.modalTitle} style={{ color: activeCert.color }}>
                  {activeCert.name}
                </h3>
                <p className={styles.modalDesc}>
                  {activeCert.desc}
                </p>
                <div className={styles.modalFooter}>
                  <span className={styles.badge} style={{ borderColor: activeCert.color, color: activeCert.color }}>
                    Guaranteed Purity & Trust
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
