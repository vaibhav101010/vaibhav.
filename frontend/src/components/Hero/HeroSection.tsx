'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !imageRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // Hyper-realistic 3D tilt on the photograph
      gsap.to(imageRef.current, {
        rotateY: x * 10,
        rotateX: y * 6,
        x: x * 20,
        y: -y * 15,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Move the light glow behind the product
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x * 40,
          y: -y * 30,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    const ctx = gsap.context(() => {
      // 1. Initial Reveal Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.8 } });
      
      tl.fromTo(
        '.gsap-reveal',
        { y: 60, opacity: 0, rotationX: -30, transformPerspective: 1000 },
        { y: 0, opacity: 1, rotationX: 0, stagger: 0.1, delay: 0.2 }
      );

      // 2. Cinematic Scroll Zoom-Through (Desktop Only)
      const isMobile = window.innerWidth <= 900;
      if (!isMobile) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            pin: true,
            pinSpacing: false,
          }
        });

        // As the user scrolls, the necklace scales up and "flies" past the camera
        scrollTl.to(imageRef.current, {
          scale: 8,
          z: 500,
          opacity: 0,
          duration: 1,
          ease: 'none'
        }, 0);

        // Fade out content on scroll VERY quickly (first 20% of scroll)
        scrollTl.to(contentRef.current, {
          opacity: 0,
          y: -200,
          duration: 0.2,
          ease: 'power2.out'
        }, 0);
      }
    }, heroRef);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`${styles.hero} ${loaded ? styles.loaded : ''}`}
      aria-label="Jewellery Showcase Hero"
    >
      {/* Ambient background particles */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className={styles.particle} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }} />
        ))}
      </div>

      <div className={styles.orbLeft} aria-hidden="true" />
      <div className={styles.orbRight} aria-hidden="true" />

      {/* The Central Photorealistic Masterpiece */}
      <div className={styles.imageContainer}>
        <div ref={glowRef} className={styles.imageGlow} aria-hidden="true" />
        <div ref={imageRef} className={styles.imageWrapper}>
          <div className={styles.mainProduct}>
            <Image
              src="/images/hero-necklace.png"
              alt="High-end diamond necklace"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 60vw"
              style={{ objectFit: 'contain' }}
              className={styles.productImage}
            />
          </div>
          <div className={styles.shimmerOverlay} aria-hidden="true" />
        </div>
      </div>

      {/* Floating typography layer */}
      <div ref={contentRef} className={styles.content}>
        <p className={`${styles.eyebrow} gsap-reveal`}>
          <span className={styles.eyebrowLine} />
          GIA · IGI Certified
          <span className={styles.eyebrowLine} />
        </p>

        <h1 className={styles.heading}>
          <span className={`${styles.headingLine1} gsap-reveal`}>M/S Suman</span>
          <span className={`${styles.headingLine2} gsap-reveal`}>Jewellers</span>
        </h1>

        <p className={`${styles.tagline} gsap-reveal`}>
          Golden Craftsmanship
          <br />
          <em>for Men of Class</em>
        </p>

        <p className={`${styles.sub} gsap-reveal`}>
          More than Jewellery. A Legacy.<br />
          Est. in Mirzapur
        </p>

        <div className={`${styles.actions} gsap-reveal`}>
          <a href="#collections" className="btn-gold" id="hero-explore-btn">
            Begin the Journey
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Trust badges */}
        <div className={`${styles.trust} gsap-reveal`}>
          {['GIA', 'IGI', 'BIS', 'Emerald'].map((cert) => (
            <span key={cert} className={styles.trustBadge}>{cert}</span>
          ))}
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollText}>Begin the story</span>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
}
