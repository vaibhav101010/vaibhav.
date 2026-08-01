'use client';

import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';

interface DiamondRingProps {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}

/* ── Diamond material using standard material with high metalness ── */
function DiamondGem({ position }: { position: [number, number, number] }) {
  const envMap = useEnvironment({ preset: 'studio' });
  const geo = useMemo(() => {
    const g = new THREE.OctahedronGeometry(0.22, 0);
    g.applyMatrix4(new THREE.Matrix4().makeScale(1, 0.65, 1));
    return g;
  }, []);

  return (
    <mesh geometry={geo} position={position} castShadow>
      <meshPhysicalMaterial
        color="#e8f4ff"
        metalness={0}
        roughness={0}
        transmission={0.95}
        thickness={0.8}
        ior={2.42}
        reflectivity={1}
        envMap={envMap}
        envMapIntensity={3}
        transparent
        opacity={0.92}
        attenuationColor="#b8d4ff"
        attenuationDistance={0.3}
      />
    </mesh>
  );
}

/* ── Gold ring band ── */
function GoldBand() {
  const envMap = useEnvironment({ preset: 'studio' });
  const geo = useMemo(() => new THREE.TorusGeometry(1.4, 0.18, 32, 120), []);

  return (
    <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        color="#b8860b"
        metalness={1}
        roughness={0.12}
        envMap={envMap}
        envMapIntensity={2.5}
      />
    </mesh>
  );
}

/* ── Setting (prong mount base) ── */
function RingSetting() {
  const envMap = useEnvironment({ preset: 'studio' });
  const geo = useMemo(() => new THREE.CylinderGeometry(0.55, 0.45, 0.22, 6), []);
  return (
    <mesh geometry={geo} position={[0, 0.18, 0]} castShadow>
      <meshStandardMaterial
        color="#c9a000"
        metalness={1}
        roughness={0.08}
        envMap={envMap}
        envMapIntensity={3}
      />
    </mesh>
  );
}

/* ── 3x3 Diamond cluster ── */
function DiamondCluster() {
  const gems: [number, number, number][] = [
    [0, 0.48, 0],
    [-0.28, 0.4, 0.1],  [0.28, 0.4, 0.1],
    [-0.28, 0.4, -0.1], [0.28, 0.4, -0.1],
    [-0.14, 0.4, 0.22], [0.14, 0.4, 0.22],
    [-0.14, 0.4, -0.22],[0.14, 0.4, -0.22],
  ];
  return (
    <>
      {gems.map((pos, i) => (
        <DiamondGem key={i} position={pos} />
      ))}
    </>
  );
}

/* ── Prongs ── */
function Prongs() {
  const envMap = useEnvironment({ preset: 'studio' });
  const prongGeo = useMemo(() => new THREE.CylinderGeometry(0.025, 0.015, 0.32, 8), []);
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <>
      {angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh
            key={i}
            geometry={prongGeo}
            position={[Math.cos(rad) * 0.5, 0.42, Math.sin(rad) * 0.5]}
          >
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} envMap={envMap} />
          </mesh>
        );
      })}
    </>
  );
}

/* ── Dynamic light following mouse ── */
function DynamicLight({ mouseX, mouseY }: DiamondRingProps) {
  const light = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    if (!light.current) return;
    light.current.position.x = mouseX.current * 6;
    light.current.position.y = mouseY.current * 4 + 2;
    light.current.position.z = 5;
  });
  return <pointLight ref={light} intensity={80} color="#f0d080" distance={20} decay={2} />;
}

/* ── Full ring assembly ── */
function RingAssembly({ mouseX, mouseY }: DiamondRingProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const bandRef = useRef<THREE.Group>(null!);
  const settingRef = useRef<THREE.Group>(null!);
  const diamondRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current || !settingRef.current || !diamondRef.current || !bandRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Read global scroll progress
    const scrollY = window.scrollY;
    
    // Explosion factor (0 at top, 1 at 1000px scroll)
    const rawFactor = scrollY / 1000;
    const explosionFactor = Math.min(Math.max(rawFactor, 0), 1);
    // Camera fly-through factor (starts after 500px, peaks at 1500px)
    const flyFactor = Math.min(Math.max((scrollY - 500) / 1000, 0), 1);

    // Dynamic rotation mapping
    const targetRotY = mouseX.current * 0.6 + flyFactor * Math.PI * 4;
    const targetRotX = -mouseY.current * 0.3 + flyFactor * Math.PI * 2;
    
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    
    // Base float
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.12;

    // Fly towards camera
    groupRef.current.position.z = flyFactor * 6;

    // Explosion effects
    bandRef.current.position.y = explosionFactor * -1.5;
    bandRef.current.rotation.x = explosionFactor * Math.PI * 0.5;

    settingRef.current.position.y = explosionFactor * -0.5;
    settingRef.current.position.x = explosionFactor * -1;
    settingRef.current.rotation.z = explosionFactor * Math.PI * 0.2;

    diamondRef.current.position.y = explosionFactor * 2.5;
    diamondRef.current.rotation.y = explosionFactor * Math.PI * 2;
    
    // Fade out overall group if passed through
    if (flyFactor > 0.9) {
      groupRef.current.visible = false;
    } else {
      groupRef.current.visible = true;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0.15, 0.3, 0]}>
        <group ref={bandRef}>
          <GoldBand />
        </group>
        <group ref={settingRef}>
          <RingSetting />
          <Prongs />
        </group>
        <group ref={diamondRef}>
          <DiamondCluster />
        </group>
      </group>
    </Float>
  );
}

/* ── Lights (outside Suspense) ── */
function Lights({ mouseX, mouseY }: DiamondRingProps) {
  return (
    <>
      {/* Stark pitch black lighting: minimal ambient, sharp directional */}
      <ambientLight intensity={0.1} color="#ffffff" />
      <directionalLight position={[5, 8, 5]} intensity={4} color="#ffe4a0" castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.5} color="#c0d8ff" />
      <pointLight position={[0, 6, 3]} intensity={50} color="#f5e6c0" distance={10} />
      <DynamicLight mouseX={mouseX} mouseY={mouseY} />
    </>
  );
}

export default function DiamondRing({ mouseX, mouseY }: DiamondRingProps) {
  return (
    <>
      <Lights mouseX={mouseX} mouseY={mouseY} />
      <Suspense fallback={null}>
        <RingAssembly mouseX={mouseX} mouseY={mouseY} />
      </Suspense>
    </>
  );
}
