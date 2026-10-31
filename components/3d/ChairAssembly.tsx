'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { createBeigeFabricTexture } from './materials';

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

interface SingleChairProps {
  index: number;
  basePos: [number, number, number]; // Extended assembly stance
  tuckedPos: [number, number, number]; // Final tucked dining stance
  baseRotY: number;
  timeStart: number;
  timeEnd: number;
  fabricTexture?: THREE.CanvasTexture;
}

function SingleChair({
  index,
  basePos,
  tuckedPos,
  baseRotY,
  timeStart,
  timeEnd,
  fabricTexture,
}: SingleChairProps) {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  const rootRef = useRef<THREE.Group>(null);
  const legsRef = useRef<THREE.Group>(null);
  const seatRef = useRef<THREE.Group>(null);
  const backrestRef = useRef<THREE.Group>(null);

  // Scattered broken coordinates in 3D space - Floating high in the luxury salon
  const brokenScatter = useMemo(() => {
    const angle = (index / 6) * Math.PI * 2 + 0.35;
    const dist = 3.4 + (index % 3) * 0.9;
    return {
      legs: {
        pos: new THREE.Vector3(
          Math.cos(angle) * dist,
          2.4 + (index % 3) * 0.5,
          Math.sin(angle) * dist
        ),
        rot: new THREE.Euler(1.2, 0.7 * index, -1.0),
      },
      seat: {
        pos: new THREE.Vector3(
          Math.cos(angle + 0.4) * (dist + 0.5),
          3.2 + index * 0.2,
          Math.sin(angle + 0.4) * (dist + 0.5)
        ),
        rot: new THREE.Euler(-0.7, 1.1, 0.5),
      },
      backrest: {
        pos: new THREE.Vector3(
          Math.cos(angle - 0.35) * (dist + 0.8),
          3.6 + (index % 2) * 0.4,
          Math.sin(angle - 0.35) * (dist + 0.8)
        ),
        rot: new THREE.Euler(0.5, -1.3, 0.8),
      },
    };
  }, [index]);

  useFrame((state) => {
    if (!rootRef.current) return;

    const time = state.clock.getElapsedTime();
    const p = scrollProgress;

    // Idle floating wobble during broken Stage 1
    const idleFactor = Math.max(0, 1 - p / 0.12);
    const idleY = Math.sin(time * 1.3 + index * 1.2) * 0.11 * idleFactor;
    const idleRot = Math.cos(time * 1.0 + index) * 0.05 * idleFactor;

    // Normalize progress for this specific chair's assembly window (timeStart to timeEnd)
    const chairProgress = Math.max(0, Math.min(1, (p - timeStart) / (timeEnd - timeStart)));

    // 1. LEGS ASSEMBLY (First 0% to 55% of chair window)
    // Legs tumble 540°, curve in a 3D arc, and descend to the travertine floor
    if (legsRef.current) {
      const legP = Math.max(0, Math.min(1, chairProgress / 0.52));
      const legEase = easeInOutCubic(legP);
      const arc = Math.sin(legP * Math.PI);

      const targetX = THREE.MathUtils.lerp(brokenScatter.legs.pos.x, 0, legEase) + Math.sin(legP * Math.PI * 1.5) * 0.6 * (1 - legEase);
      const targetY = THREE.MathUtils.lerp(brokenScatter.legs.pos.y, 0, legEase) + arc * 0.8 + idleY;
      const targetZ = THREE.MathUtils.lerp(brokenScatter.legs.pos.z, 0, legEase) + Math.cos(legP * Math.PI * 1.5) * 0.6 * (1 - legEase);

      legsRef.current.position.set(targetX, targetY, targetZ);

      // Rotational spin: 540 degrees on Y, 180 degrees on X
      const spinY = (1 - legEase) * Math.PI * 3.0;
      const spinX = (1 - legEase) * Math.PI * 1.0;
      const wobbleZ = Math.sin(legP * Math.PI) * 0.3;

      legsRef.current.rotation.set(
        THREE.MathUtils.lerp(brokenScatter.legs.rot.x, 0, legEase) + spinX + idleRot,
        THREE.MathUtils.lerp(brokenScatter.legs.rot.y, 0, legEase) + spinY,
        THREE.MathUtils.lerp(brokenScatter.legs.rot.z, 0, legEase) + wobbleZ
      );
    }

    // 2. SEAT ASSEMBLY (Middle 28% to 78% of chair window)
    // Soft beige cushion spirals down from 3m height, levels out, and seats firmly onto the frame
    if (seatRef.current) {
      const seatP = Math.max(0, Math.min(1, (chairProgress - 0.28) / 0.50));
      const seatEase = easeInOutCubic(seatP);
      const arc = Math.sin(seatP * Math.PI);

      const targetX = THREE.MathUtils.lerp(brokenScatter.seat.pos.x, 0, seatEase) + Math.cos(seatP * Math.PI * 1.5) * 0.5 * (1 - seatEase);
      const targetY = THREE.MathUtils.lerp(brokenScatter.seat.pos.y, 0.48, seatEase) + arc * 0.9 + idleY * 0.8;
      const targetZ = THREE.MathUtils.lerp(brokenScatter.seat.pos.z, 0, seatEase) + Math.sin(seatP * Math.PI * 1.5) * 0.5 * (1 - seatEase);

      seatRef.current.position.set(targetX, targetY, targetZ);

      const spinY = (1 - seatEase) * Math.PI * 2.5;
      const spinX = (1 - seatEase) * Math.PI * 0.8;
      const wobbleZ = Math.sin(seatP * Math.PI) * 0.25;

      seatRef.current.rotation.set(
        THREE.MathUtils.lerp(brokenScatter.seat.rot.x, 0, seatEase) + spinX + idleRot,
        THREE.MathUtils.lerp(brokenScatter.seat.rot.y, 0, seatEase) + spinY,
        THREE.MathUtils.lerp(brokenScatter.seat.rot.z, 0, seatEase) + wobbleZ
      );
    }

    // 3. BACKREST & ARMRESTS (Late 48% to 100% of chair window)
    // Curved upholstered backrest drops from high ceiling, rotates, and locks into rear posts
    if (backrestRef.current) {
      const backP = Math.max(0, Math.min(1, (chairProgress - 0.48) / 0.52));
      const backEase = easeInOutCubic(backP);
      const arc = Math.sin(backP * Math.PI);

      const targetX = THREE.MathUtils.lerp(brokenScatter.backrest.pos.x, 0, backEase) + Math.sin(backP * Math.PI * 1.5) * 0.4 * (1 - backEase);
      const targetY = THREE.MathUtils.lerp(brokenScatter.backrest.pos.y, 0.85, backEase) + arc * 0.7 + idleY * 0.6;
      const targetZ = THREE.MathUtils.lerp(brokenScatter.backrest.pos.z, -0.19, backEase) + Math.cos(backP * Math.PI * 1.5) * 0.4 * (1 - backEase);

      backrestRef.current.position.set(targetX, targetY, targetZ);

      const spinY = (1 - backEase) * Math.PI * 2.0;
      const spinX = (1 - backEase) * Math.PI * 0.6;

      backrestRef.current.rotation.set(
        THREE.MathUtils.lerp(brokenScatter.backrest.rot.x, 0, backEase) + spinX + idleRot,
        THREE.MathUtils.lerp(brokenScatter.backrest.rot.y, 0, backEase) + spinY,
        THREE.MathUtils.lerp(brokenScatter.backrest.rot.z, 0, backEase)
      );
    }

    // 4. STAGE 5 (84% to 100% scroll): Fully assembled chairs glide and tuck neatly around the dining table
    const tuckP = Math.max(0, Math.min(1, (p - 0.84) / 0.14));
    const tuckEase = easeInOutCubic(tuckP);

    const rootX = THREE.MathUtils.lerp(basePos[0], tuckedPos[0], tuckEase);
    const rootY = THREE.MathUtils.lerp(basePos[1], tuckedPos[1], tuckEase);
    const rootZ = THREE.MathUtils.lerp(basePos[2], tuckedPos[2], tuckEase);

    rootRef.current.position.set(rootX, rootY, rootZ);
    rootRef.current.rotation.y = baseRotY;
  });

  return (
    <group ref={rootRef} name={`luxury-chair-${index}`}>
      {/* 1. CHAIR LEGS: Tapered Dark Walnut with Brushed Gold Ferrules */}
      <group ref={legsRef}>
        {/* Front Left */}
        <group position={[-0.22, 0.24, 0.20]} rotation={[0.07, 0, -0.07]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.014, 0.48, 16]} />
            <meshStandardMaterial color="#2B1E16" roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.015, 0.016, 0.035, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.25} />
          </mesh>
        </group>

        {/* Front Right */}
        <group position={[0.22, 0.24, 0.20]} rotation={[0.07, 0, 0.07]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.014, 0.48, 16]} />
            <meshStandardMaterial color="#2B1E16" roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.015, 0.016, 0.035, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.25} />
          </mesh>
        </group>

        {/* Rear Left */}
        <group position={[-0.22, 0.24, -0.20]} rotation={[-0.09, 0, -0.07]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.014, 0.48, 16]} />
            <meshStandardMaterial color="#2B1E16" roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.015, 0.016, 0.035, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.25} />
          </mesh>
        </group>

        {/* Rear Right */}
        <group position={[0.22, 0.24, -0.20]} rotation={[-0.09, 0, 0.07]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.014, 0.48, 16]} />
            <meshStandardMaterial color="#2B1E16" roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.015, 0.016, 0.035, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.25} />
          </mesh>
        </group>

        {/* Under-Seat Frame */}
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.38]} />
          <meshStandardMaterial color="#241810" roughness={0.4} />
        </mesh>
      </group>

      {/* 2. PREMIUM BEIGE UPHOLSTERED SEAT CUSHION (Reference Image Match) */}
      <group ref={seatRef}>
        {/* Walnut Seat Shell Substrate */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.48, 0.032, 0.46]} />
          <meshStandardMaterial color="#2E2016" roughness={0.35} />
        </mesh>
        {/* Soft Warm Beige Fabric Upholstery */}
        <mesh castShadow receiveShadow position={[0, 0.032, 0.01]}>
          <boxGeometry args={[0.45, 0.045, 0.43]} />
          <meshStandardMaterial
            color="#EDE7DC"
            map={fabricTexture}
            roughness={0.82}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* 3. CURVED BACKREST & INTEGRATED ARMRESTS (Warm Beige Upholstery + Walnut Frame) */}
      <group ref={backrestRef}>
        {/* Curved Upholstered Crest Backrest */}
        <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.48, 0.16, 0.045]} />
          <meshStandardMaterial
            color="#EDE7DC"
            map={fabricTexture}
            roughness={0.82}
            metalness={0.02}
          />
        </mesh>

        {/* Dark Walnut Spine Posts */}
        <mesh position={[-0.20, -0.16, -0.01]}>
          <cylinderGeometry args={[0.014, 0.014, 0.38, 12]} />
          <meshStandardMaterial color="#2B1E16" roughness={0.35} />
        </mesh>
        <mesh position={[0.20, -0.16, -0.01]}>
          <cylinderGeometry args={[0.014, 0.014, 0.38, 12]} />
          <meshStandardMaterial color="#2B1E16" roughness={0.35} />
        </mesh>

        {/* Brushed Gold Accent Inlay on Backrest Crest */}
        <mesh position={[0, 0.13, 0.024]}>
          <boxGeometry args={[0.10, 0.012, 0.006]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

export function ChairAssembly() {
  const [fabricTex, setFabricTex] = useState<THREE.CanvasTexture | undefined>(undefined);

  useEffect(() => {
    const tex = createBeigeFabricTexture();
    setFabricTex(tex);
  }, []);

  // SIX PREMIUM BEIGE UPHOLSTERED DINING CHAIRS - Sequential 3D Curved Assembly
  // Generous durations (27% scroll window per chair) with spinning descent ("gurte gurte ase nambe ar fit hbe")
  const chairConfigs: SingleChairProps[] = [
    // South Side (Long Side facing North) - 2 Chairs
    {
      index: 0,
      basePos: [-0.60, 0, 1.35],
      tuckedPos: [-0.60, 0, 0.72],
      baseRotY: Math.PI,
      timeStart: 0.35,
      timeEnd: 0.62,
    },
    {
      index: 1,
      basePos: [0.60, 0, 1.35],
      tuckedPos: [0.60, 0, 0.72],
      baseRotY: Math.PI,
      timeStart: 0.40,
      timeEnd: 0.67,
    },

    // North Side (Long Side facing South) - 2 Chairs
    {
      index: 2,
      basePos: [-0.60, 0, -1.35],
      tuckedPos: [-0.60, 0, -0.72],
      baseRotY: 0,
      timeStart: 0.46,
      timeEnd: 0.72,
    },
    {
      index: 3,
      basePos: [0.60, 0, -1.35],
      tuckedPos: [0.60, 0, -0.72],
      baseRotY: 0,
      timeStart: 0.52,
      timeEnd: 0.77,
    },

    // West Head Chair (Short End facing East) - 1 Chair
    {
      index: 4,
      basePos: [-1.65, 0, 0],
      tuckedPos: [-1.22, 0, 0],
      baseRotY: Math.PI / 2,
      timeStart: 0.58,
      timeEnd: 0.82,
    },

    // East Head Chair (Short End facing West) - 1 Chair
    {
      index: 5,
      basePos: [1.65, 0, 0],
      tuckedPos: [1.22, 0, 0],
      baseRotY: -Math.PI / 2,
      timeStart: 0.64,
      timeEnd: 0.86,
    },
  ];

  return (
    <group name="six-chairs-assembly">
      {chairConfigs.map((cfg) => (
        <SingleChair
          key={`chair-six-${cfg.index}`}
          {...cfg}
          fabricTexture={fabricTex}
        />
      ))}
    </group>
  );
}
