'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Preloader.module.css';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Disable scrolling when loading
    document.body.style.overflow = 'hidden';

    // End loading state after intro animations finish
    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = '';
      }, 300); // Fast fade-out animation
      return () => clearTimeout(removeTimer);
    }, 900); // Show preloader for 0.9 seconds

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ''}`} aria-hidden="true">
      {/* Showroom background photo with zoom effect */}
      <div 
        className={styles.loaderBg} 
        style={{ backgroundImage: 'url("/images/showroom.jpg")' }} 
      />
      <div className={styles.loaderMask} />
      
      <div className={styles.container}>
        {/* Animated Gold Image Loader */}
        <div className={styles.logoWrapper}>
          {/* Spinning decorative loader ring */}
          <div className={styles.outerSpinCircle} />
          
          {/* Masked gold image container */}
          <div className={styles.imageContainer}>
            <Image
              src="/images/logo-gold.png"
              alt="Suman Jewellers Logo"
              fill
              sizes="(max-width: 768px) 150px, 200px"
              style={{ objectFit: 'contain' }}
              className={styles.goldLogoImage}
              priority
            />
          </div>
        </div>

        {/* Golden Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} />
        </div>
        
        {/* Loading Status Text */}
        <p className={styles.statusText}>Suman Jewellers</p>
      </div>
    </div>
  );
}
