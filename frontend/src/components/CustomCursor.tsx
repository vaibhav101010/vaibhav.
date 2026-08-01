'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia("(hover: none)").matches) return;

    if (!cursorRef.current) return;
    
    // Set GSAP setter for quick updates
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If target is link, button, or has cursor: pointer
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        cursorRef.current?.classList.add(styles.cursorHover);
      } else {
        cursorRef.current?.classList.remove(styles.cursorHover);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseHover);
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />;
}
