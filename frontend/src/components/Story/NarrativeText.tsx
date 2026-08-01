'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './NarrativeText.module.css';

export default function NarrativeText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    // Split text into words for animation
    const words = textRef.current.querySelectorAll(`.${styles.word}`);

    const ctx = gsap.context(() => {
      // The timeline that fills the text color
      gsap.to(words, {
        backgroundSize: '100% 100%',
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const storyText = "For generations, Suman Jewellers has redefined luxury in Mirzapur. Our obsession with perfection ensures that every piece is not just crafted, but born of passion. We don't just sell jewellery — we curate timeless artifacts for men of class.";

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.textWrapper}>
        <p className={styles.eyebrow}>The Heritage</p>
        <p ref={textRef} className={styles.text} aria-label={storyText}>
          {storyText.split(' ').map((word, i) => {
            const isHighlight = ['luxury', 'perfection', 'timeless', 'artifacts', 'class.'].includes(
              word.replace(/[.,]/g, '').toLowerCase()
            );
            return (
              <span 
                key={i} 
                className={`${styles.word} ${isHighlight ? styles.highlight : ''}`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
