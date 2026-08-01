'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import DiamondRing from './Hero/DiamondRing';
import styles from './ThreeCanvas.module.css';

export default function ThreeCanvas() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.canvasContainer}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <DiamondRing mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}
