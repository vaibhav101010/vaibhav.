'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Sync Lenis's core with GSAP's ticker
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis 
      root 
      ref={lenisRef}
      autoRaf={false} 
      options={{ lerp: 0.12, duration: 1.0, syncTouch: true }}
    >
      {children}
    </ReactLenis>
  );
}
