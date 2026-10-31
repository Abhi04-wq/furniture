'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import {
  createCalacattaGoldMarbleTexture,
  createTravertineTexture,
  createWoodTexture,
} from './materials';

export function RoomEnvironment() {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  // Animation refs for subtle living environment motion
  const curtainLeftRef = useRef<THREE.Group>(null);
  const chandelierLight1Ref = useRef<THREE.PointLight>(null);
  const chandelierLight2Ref = useRef<THREE.PointLight>(null);
  const sunlightRef = useRef<THREE.DirectionalLight>(null);

  // Textures state
  const [marbleData, setMarbleData] = useState<{
    map: THREE.CanvasTexture;
    roughnessMap: THREE.CanvasTexture;
  } | null>(null);
  const [travertineTex, setTravertineTex] = useState<THREE.CanvasTexture | null>(null);
  const [walnutData, setWalnutData] = useState<{
    map: THREE.CanvasTexture;
    roughnessMap: THREE.CanvasTexture;
  } | null>(null);

  useEffect(() => {
    const marble = createCalacattaGoldMarbleTexture();
    const travertine = createTravertineTexture();
    const walnut = createWoodTexture(true);

    setMarbleData(marble);
    setTravertineTex(travertine);
    setWalnutData(walnut);
  }, []);

  // Subtle living background animation loop (sunlight warmth, curtain breeze, chandelier breathing)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const p = scrollProgress;

    // 1. Subtle curtain sway (natural Italian morning breeze)
    if (curtainLeftRef.current) {
      curtainLeftRef.current.rotation.z = Math.sin(time * 0.8) * 0.015;
      curtainLeftRef.current.position.x = -6.45 + Math.cos(time * 0.6) * 0.02;
    }

    // 2. Chandelier subtle warm pulse
    const chandelierFlicker = Math.sin(time * 2.0) * 0.05 + Math.cos(time * 3.5) * 0.03;
    const finalBoost = Math.max(0, (p - 0.75) / 0.25);

    if (chandelierLight1Ref.current) {
      chandelierLight1Ref.current.intensity = 0.8 + chandelierFlicker + finalBoost * 0.5;
    }
    if (chandelierLight2Ref.current) {
      chandelierLight2Ref.current.intensity = 0.8 + chandelierFlicker + finalBoost * 0.5;
    }

    // 3. Natural sunlight angle
    if (sunlightRef.current) {
      sunlightRef.current.intensity = 2.0 + Math.sin(time * 0.5) * 0.1 + finalBoost * 0.3;
    }
  });

  return (
    <group name="italian-luxury-dining-room">
      {/* ============================================================== */}
      {/* 1. LIGHTING RIG: NATURAL SUNLIGHT & WARM SHOWROOM AMBIENCE     */}
      {/* ============================================================== */}
      {/* Natural Sunlight streaming through left floor-to-ceiling windows */}
      <directionalLight
        ref={sunlightRef}
        position={[-9, 8.5, 4]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0001}
        color="#FFF6EA"
      />

      {/* Warm Ambient Fill Light (Soft Mediterranean interior bounce) */}
      <ambientLight intensity={0.65} color="#F8F3EC" />

      {/* Soft Rim Light highlighting back wall and cabinets */}
      <directionalLight position={[7, 6, -3]} intensity={0.9} color="#E8DBC9" />

      {/* Ceiling Cove & Front Fill */}
      <directionalLight position={[0, 7, 7]} intensity={0.7} color="#FFF8F0" />

      {/* Chandelier Downlights over the dining table */}
      <pointLight
        ref={chandelierLight1Ref}
        position={[-0.65, 2.45, 0]}
        intensity={0.9}
        distance={5}
        decay={2}
        color="#FFE1B3"
      />
      <pointLight
        ref={chandelierLight2Ref}
        position={[0.65, 2.45, 0]}
        intensity={0.9}
        distance={5}
        decay={2}
        color="#FFE1B3"
      />

      {/* ============================================================== */}
      {/* 2. TRAVERTINE FLOORING WITH CONTACT SHADOWS                    */}
      {/* ============================================================== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.002, 0]}
        receiveShadow
      >
        <planeGeometry args={[28, 24]} />
        <meshStandardMaterial
          color="#ECE6DC"
          map={travertineTex || undefined}
          roughness={0.28}
          metalness={0.05}
        />
      </mesh>

      {/* Soft ground contact shadows under table and 6 chairs */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.65}
        scale={8.5}
        blur={2.2}
        far={3.0}
        resolution={1024}
        color="#1D1713"
      />

      {/* ============================================================== */}
      {/* 3. SYMMETRICAL WHITE MARBLE FEATURE WALL (CALACATTA GOLD)      */}
      {/* ============================================================== */}
      <group position={[0, 2.3, -3.2]}>
        {/* Left Bookmatched White Marble Slab */}
        <mesh position={[-1.85, 0, 0]} receiveShadow>
          <boxGeometry args={[3.65, 4.6, 0.12]} />
          <meshStandardMaterial
            color="#FAF7F2"
            map={marbleData?.map}
            roughness={0.16}
            metalness={0.04}
          />
        </mesh>

        {/* Right Bookmatched White Marble Slab */}
        <mesh position={[1.85, 0, 0]} rotation={[0, Math.PI, 0]} receiveShadow>
          <boxGeometry args={[3.65, 4.6, 0.12]} />
          <meshStandardMaterial
            color="#FAF7F2"
            map={marbleData?.map}
            roughness={0.16}
            metalness={0.04}
          />
        </mesh>

        {/* Vertical Brushed Champagne Gold Center Seam & Perimeter Reveals */}
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[0.025, 4.6, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
        </mesh>
        <mesh position={[-3.68, 0, 0.065]}>
          <boxGeometry args={[0.025, 4.6, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
        </mesh>
        <mesh position={[3.68, 0, 0.065]}>
          <boxGeometry args={[0.025, 4.6, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
        </mesh>
        <mesh position={[0, 2.3, 0.065]}>
          <boxGeometry args={[7.4, 0.025, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
        </mesh>
        <mesh position={[0, -2.3, 0.065]}>
          <boxGeometry args={[7.4, 0.025, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 4. SYMMETRICAL DARK WALNUT DISPLAY CABINETS (LEFT & RIGHT)     */}
      {/* ============================================================== */}
      {/* LEFT VITRINE CABINET */}
      <group position={[-4.35, 2.1, -3.0]} receiveShadow castShadow>
        {/* Walnut Cabinet Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 4.2, 0.65]} />
          <meshStandardMaterial
            color="#271C14"
            roughness={0.35}
            metalness={0.05}
          />
        </mesh>
        {/* Recessed Vitrine Opening */}
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[1.14, 3.8, 0.42]} />
          <meshStandardMaterial color="#1E140E" roughness={0.4} />
        </mesh>
        {/* Glass Shelves (3 Tiers) */}
        {[-1.0, 0.0, 1.0].map((sy, i) => (
          <group key={`l-shelf-${i}`} position={[0, sy, 0.18]}>
            <mesh>
              <boxGeometry args={[1.10, 0.02, 0.35]} />
              <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.45}
                roughness={0.1}
              />
            </mesh>
            {/* Curated Ceramic Vases & Sculptures on Shelves */}
            <mesh position={[0.26, 0.16, 0]}>
              <cylinderGeometry args={[0.07, 0.045, 0.28, 24]} />
              <meshStandardMaterial color="#EBE5D8" roughness={0.3} />
            </mesh>
            <mesh position={[-0.26, 0.11, 0]}>
              <boxGeometry args={[0.15, 0.18, 0.11]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}
        {/* Warm Internal Downlight in Cabinet */}
        <pointLight position={[0, 1.8, 0.2]} intensity={0.65} distance={3.0} color="#FFE6C2" />
      </group>

      {/* RIGHT VITRINE CABINET */}
      <group position={[4.35, 2.1, -3.0]} receiveShadow castShadow>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 4.2, 0.65]} />
          <meshStandardMaterial
            color="#271C14"
            roughness={0.35}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[1.14, 3.8, 0.42]} />
          <meshStandardMaterial color="#1E140E" roughness={0.4} />
        </mesh>
        {[-1.0, 0.0, 1.0].map((sy, i) => (
          <group key={`r-shelf-${i}`} position={[0, sy, 0.18]}>
            <mesh>
              <boxGeometry args={[1.10, 0.02, 0.35]} />
              <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.45}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[-0.24, 0.14, 0]}>
              <cylinderGeometry args={[0.055, 0.07, 0.25, 24]} />
              <meshStandardMaterial color="#DFD9CD" roughness={0.3} />
            </mesh>
            <mesh position={[0.24, 0.12, 0]}>
              <boxGeometry args={[0.14, 0.20, 0.12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 1.8, 0.2]} intensity={0.65} distance={3.0} color="#FFE6C2" />
      </group>

      {/* ============================================================== */}
      {/* 5. LARGE FLOOR-TO-CEILING GLASS WINDOWS & LINEN CURTAINS       */}
      {/* ============================================================== */}
      {/* Left Window Wall (Spanning floor to ceiling) */}
      <group position={[-5.3, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Bronze Window Frame & Mullions */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8.0, 4.6, 0.1]} />
          <meshStandardMaterial
            color="#B8D5E5"
            transparent
            opacity={0.18}
            roughness={0.05}
          />
        </mesh>
        {/* Mullion vertical dividers */}
        {[-2.5, 0.0, 2.5].map((mx, i) => (
          <mesh key={`mullion-${i}`} position={[mx, 0, 0.04]}>
            <boxGeometry args={[0.06, 4.6, 0.08]} />
            <meshStandardMaterial color="#221B16" roughness={0.4} />
          </mesh>
        ))}
        {/* Horizontal transom bar */}
        <mesh position={[0, 1.3, 0.04]}>
          <boxGeometry args={[8.0, 0.06, 0.08]} />
          <meshStandardMaterial color="#221B16" roughness={0.4} />
        </mesh>
      </group>

      {/* Natural Cream Linen Curtains (Gentle breeze sway) */}
      <group ref={curtainLeftRef} position={[-5.0, 2.3, -1.8]}>
        {/* Pleated Fabric Waves */}
        {Array.from({ length: 6 }).map((_, f) => (
          <mesh
            key={`curtain-fold-${f}`}
            position={[0, 0, f * 0.15]}
            castShadow
          >
            <cylinderGeometry args={[0.075, 0.085, 4.5, 16]} />
            <meshStandardMaterial
              color="#F0EBE1"
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        ))}
        {/* Brass Curtain Track Rod */}
        <mesh position={[0, 2.25, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.6, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 6. BRASS & GOLD GEOMETRIC CHANDELIERS (CEILING SUSPENSION)      */}
      {/* ============================================================== */}
      <group position={[0, 2.65, 0]}>
        {/* Dual Interlocking Champagne Gold Rectangular Frames */}
        {[-0.65, 0.65].map((cx, i) => (
          <group key={`ch-tier-${i}`} position={[cx, 0, 0]}>
            {/* Thin Brass Suspension Cables connecting to ceiling at y=4.6m */}
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 1.9, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
            </mesh>

            {/* Geometric Outer Rectangular Ring */}
            <group rotation={[0, i === 0 ? 0.35 : -0.35, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.2, 0.035, 0.60]} />
                <meshStandardMaterial
                  color="#D4AF37"
                  metalness={0.94}
                  roughness={0.22}
                />
              </mesh>
              {/* Internal Warm Emissive Glow Diffuser */}
              <mesh position={[0, -0.015, 0]}>
                <boxGeometry args={[1.14, 0.018, 0.54]} />
                <meshStandardMaterial
                  color="#FFF4DE"
                  emissive="#FFE0A3"
                  emissiveIntensity={1.4}
                  roughness={0.2}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* Architectural Ceiling with Perimeter Recess */}
      <mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 18]} />
        <meshStandardMaterial color="#FAF7F2" roughness={0.8} />
      </mesh>
    </group>
  );
}
