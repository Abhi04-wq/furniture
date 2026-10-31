'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { createGoldBrandTextTexture } from './materials';

// Cubic easing helper
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function TableAssembly() {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);
  const smoothP = useRef(0);
  const rootRef = useRef<THREE.Group>(null);

  // Component Mesh References
  const slabLeftRef = useRef<THREE.Group>(null);
  const slabRightRef = useRef<THREE.Group>(null);
  const apronLeftRef = useRef<THREE.Group>(null);
  const apronRightRef = useRef<THREE.Group>(null);
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);
  const hardwareRef = useRef<THREE.Group>(null);

  // 3D Golden Brand Text Centerpiece References
  const brandTextGroupRef = useRef<THREE.Group>(null);
  const brandPointLightRef = useRef<THREE.PointLight>(null);
  const [brandTextTex, setBrandTextTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const tex = createGoldBrandTextTexture();
    setBrandTextTex(tex);
  }, []);

  // Outer visible-margin spawn transforms where pieces originate before sweeping gracefully into the room
  // Sweeps in from the camera viewport margins ("animation nie asuk aste aste")
  const spawnState = useMemo(() => {
    return {
      slabLeft: {
        pos: new THREE.Vector3(-4.8, 3.8, 1.6),
        rot: new THREE.Euler(0.3, 1.2, -0.6),
      },
      slabRight: {
        pos: new THREE.Vector3(4.8, 3.8, 1.6),
        rot: new THREE.Euler(-0.3, -1.2, 0.6),
      },
      apronLeft: {
        pos: new THREE.Vector3(-4.3, 4.5, 0.4),
        rot: new THREE.Euler(0.4, 0.9, -0.4),
      },
      apronRight: {
        pos: new THREE.Vector3(4.3, 4.5, 0.4),
        rot: new THREE.Euler(-0.4, -0.9, 0.4),
      },
      legFL: {
        pos: new THREE.Vector3(-4.6, 1.4, 2.5),
        rot: new THREE.Euler(1.8, 0.9, -1.8),
      },
      legFR: {
        pos: new THREE.Vector3(4.6, 1.4, 2.5),
        rot: new THREE.Euler(-1.8, -0.9, 1.8),
      },
      legBL: {
        pos: new THREE.Vector3(-4.1, 1.2, 1.0),
        rot: new THREE.Euler(-1.6, 0.9, 1.4),
      },
      legBR: {
        pos: new THREE.Vector3(4.1, 1.2, 1.0),
        rot: new THREE.Euler(1.6, -0.9, -1.4),
      },
      hardware: {
        pos: new THREE.Vector3(0, 5.2, 0.4),
        rot: new THREE.Euler(0, 0, 0),
      },
    };
  }, []);

  // Pre-calculate initial scattered broken transforms - Floating high in the luxury salon
  // PERFECT EQUAL DISTRIBUTION: Both Left and Right sides hold equal visual weight
  // Left: 1 Slab + 1 Apron Chassis + 1 Front Leg + 1 Back Leg
  // Right: 1 Slab + 1 Apron Chassis + 1 Front Leg + 1 Back Leg
  // Center seam: 3 Solid Brass Butterfly Dovetail Keys
  const brokenState = useMemo(() => {
    return {
      // 1. Solid Timber Slabs (Balanced at |x| = 3.5, y = 3.3, z = 1.4 in front of columns)
      slabLeft: {
        pos: new THREE.Vector3(-3.5, 3.3, 1.4),
        rot: new THREE.Euler(0.5, 0.8, -0.4),
      },
      slabRight: {
        pos: new THREE.Vector3(3.5, 3.3, 1.4),
        rot: new THREE.Euler(-0.5, -0.8, 0.4),
      },
      // 2. Apron Subframe Chassis (Balanced at |x| = 3.1, y = 4.0, z = 0.2)
      apronLeft: {
        pos: new THREE.Vector3(-3.1, 4.0, 0.2),
        rot: new THREE.Euler(0.4, 0.6, -0.3),
      },
      apronRight: {
        pos: new THREE.Vector3(3.1, 4.0, 0.2),
        rot: new THREE.Euler(-0.4, -0.6, 0.3),
      },
      // 3. Front Tapered Legs with Gold Ferrules (Balanced at |x| = 3.7, y = 2.2, z = 2.2)
      legFL: {
        pos: new THREE.Vector3(-3.7, 2.2, 2.2),
        rot: new THREE.Euler(1.5, 0.6, -1.5),
      },
      legFR: {
        pos: new THREE.Vector3(3.7, 2.2, 2.2),
        rot: new THREE.Euler(-1.5, -0.6, 1.5),
      },
      // 4. Back Tapered Legs with Gold Ferrules (Balanced at |x| = 3.0, y = 1.8, z = 0.6)
      legBL: {
        pos: new THREE.Vector3(-3.0, 1.8, 0.6),
        rot: new THREE.Euler(-1.4, 0.7, 1.0),
      },
      legBR: {
        pos: new THREE.Vector3(3.0, 1.8, 0.6),
        rot: new THREE.Euler(1.4, -0.7, -1.0),
      },
      // 5. Solid Brass Butterfly Dovetail Keys centered overhead ready to drop into seam
      hardware: {
        pos: new THREE.Vector3(0, 4.3, 0.2),
        rot: new THREE.Euler(0, 0, 0),
      },
    };
  }, []);

  // Assembled Target Transforms - Calibrated to standard luxury European dining proportions
  // Table top height: 0.78m, leg length: 0.70m, clearance above floor: 0
  const assembledState = useMemo(() => {
    return {
      slabLeft: {
        pos: new THREE.Vector3(-0.56, 0.78, 0),
        rot: new THREE.Euler(0, 0, 0),
      },
      slabRight: {
        pos: new THREE.Vector3(0.56, 0.78, 0),
        rot: new THREE.Euler(0, 0, 0),
      },
      apronLeft: {
        pos: new THREE.Vector3(0, 0.72, 0),
        rot: new THREE.Euler(0, 0, 0),
      },
      apronRight: {
        pos: new THREE.Vector3(0, 0.72, 0),
        rot: new THREE.Euler(0, 0, 0),
      },
      legFL: {
        pos: new THREE.Vector3(-0.95, 0.36, 0.38),
        rot: new THREE.Euler(0.06, 0, 0.06),
      },
      legFR: {
        pos: new THREE.Vector3(0.95, 0.36, 0.38),
        rot: new THREE.Euler(0.06, 0, -0.06),
      },
      legBL: {
        pos: new THREE.Vector3(-0.95, 0.36, -0.38),
        rot: new THREE.Euler(-0.06, 0, 0.06),
      },
      legBR: {
        pos: new THREE.Vector3(0.95, 0.36, -0.38),
        rot: new THREE.Euler(-0.06, 0, -0.06),
      },
      hardware: {
        pos: new THREE.Vector3(0, 0.805, 0),
        rot: new THREE.Euler(0, 0, 0),
      },
    };
  }, []);

  // Frame loop mapping scroll progress to components
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    // Buttery smooth frame-rate independent dampening
    smoothP.current = THREE.MathUtils.damp(smoothP.current, scrollProgress, 11, delta);
    const p = smoothP.current;

    // 0. Initial Screen Cleanliness & Immediate Scroll Entrance
    // Text dissolves between p: 0.00 -> 0.08.
    // At static load (p <= 0.005), table pieces are hidden so initial framing is 100% clean.
    // On the very first scroll touch (p > 0.005), pieces become visible and fly inward!
    if (rootRef.current) {
      if (p <= 0.005) {
        rootRef.current.visible = false;
      } else {
        rootRef.current.visible = true;
      }
    }

    // Gentle hover float during zero-g staging
    const idleFactor = Math.max(0, Math.min(1, (0.22 - p) / 0.10));
    const idleY = Math.sin(time * 1.5) * 0.09 * idleFactor;
    const idleRot = Math.cos(time * 1.2) * 0.03 * idleFactor;

    // UNIFIED TWO-PHASE ANIMATION:
    // Phase 1 (0.00 -> 0.14): Cinematic fly-in entrance from outer margins into balanced hover staging
    // Phase 2 (0.14 -> 0.54): Parabolic docking and rotational spin assembly into the final table
    const animatePart = (
      group: THREE.Group | null,
      spawn: { pos: THREE.Vector3; rot: THREE.Euler },
      broken: { pos: THREE.Vector3; rot: THREE.Euler },
      assembled: { pos: THREE.Vector3; rot: THREE.Euler },
      assembleStartP: number,
      assembleEndP: number,
      options: {
        spinRevolutionsY?: number;
        spinRevolutionsX?: number;
        arcHeight?: number;
        arcLateral?: number;
        idleOffset?: number;
        entranceArc?: number;
      } = {}
    ) => {
      if (!group) return;

      const {
        spinRevolutionsY = 1.0,
        spinRevolutionsX = 0.4,
        arcHeight = 0.8,
        arcLateral = 0.5,
        idleOffset = 0,
        entranceArc = 0.45,
      } = options;

      // PHASE 1: ENTRANCE FLY-IN (p: 0.00 -> 0.14)
      if (p < 0.14) {
        const entNorm = Math.max(0, Math.min(1, p / 0.14));
        const entEase = easeInOutCubic(entNorm);

        // Parabolic rise arc during entrance flight
        const entArc = Math.sin(entNorm * Math.PI) * entranceArc;

        const curX = THREE.MathUtils.lerp(spawn.pos.x, broken.pos.x, entEase);
        const curY = THREE.MathUtils.lerp(spawn.pos.y, broken.pos.y, entEase) + entArc + idleY * entNorm;
        const curZ = THREE.MathUtils.lerp(spawn.pos.z, broken.pos.z, entEase);

        group.position.set(curX, curY, curZ);

        group.rotation.x = THREE.MathUtils.lerp(spawn.rot.x, broken.rot.x, entEase);
        group.rotation.y = THREE.MathUtils.lerp(spawn.rot.y, broken.rot.y, entEase);
        group.rotation.z = THREE.MathUtils.lerp(spawn.rot.z, broken.rot.z, entEase);

        const scale = THREE.MathUtils.lerp(0.05, 1.0, entEase);
        group.scale.setScalar(scale);
      }
      // PHASE 2: HOVER STAGING OR ASSEMBLY DOCKING (p >= 0.14)
      else {
        group.scale.setScalar(1.0);

        if (p < assembleStartP) {
          // Hovering gracefully at broken position with gentle zero-g float
          group.position.set(
            broken.pos.x,
            broken.pos.y + idleY * Math.cos(idleOffset),
            broken.pos.z
          );
          group.rotation.set(
            broken.rot.x + idleRot * Math.sin(idleOffset),
            broken.rot.y + idleRot * Math.cos(idleOffset),
            broken.rot.z
          );
        } else {
          // Docking assembly movement
          const normP = Math.max(0, Math.min(1, (p - assembleStartP) / (assembleEndP - assembleStartP)));
          const ease = easeInOutCubic(normP);

          const arc = Math.sin(normP * Math.PI);
          const curX = THREE.MathUtils.lerp(broken.pos.x, assembled.pos.x, ease) + Math.sin(normP * Math.PI * 1.5) * arcLateral * (1 - ease);
          const curY = THREE.MathUtils.lerp(broken.pos.y, assembled.pos.y, ease) + arc * arcHeight + idleY * (1 - ease) * Math.cos(idleOffset);
          const curZ = THREE.MathUtils.lerp(broken.pos.z, assembled.pos.z, ease) + Math.cos(normP * Math.PI * 1.5) * arcLateral * (1 - ease);

          group.position.set(curX, curY, curZ);

          const spinAngleY = (1 - ease) * (spinRevolutionsY * Math.PI * 2);
          const spinAngleX = (1 - ease) * (spinRevolutionsX * Math.PI * 2);
          const rollWobble = Math.sin(normP * Math.PI) * 0.35;

          group.rotation.x = THREE.MathUtils.lerp(broken.rot.x, assembled.rot.x, ease) + spinAngleX;
          group.rotation.y = THREE.MathUtils.lerp(broken.rot.y, assembled.rot.y, ease) + spinAngleY;
          group.rotation.z = THREE.MathUtils.lerp(broken.rot.z, assembled.rot.z, ease) + rollWobble;
        }
      }
    };

    // 1. Apron Subframe Chassis: fly-in entrance (0.00 -> 0.14) then center join docking (0.14 -> 0.32)
    animatePart(apronLeftRef.current, spawnState.apronLeft, brokenState.apronLeft, assembledState.apronLeft, 0.14, 0.32, {
      spinRevolutionsY: 1.0,
      spinRevolutionsX: 0.3,
      arcHeight: 0.9,
      arcLateral: 0.6,
      idleOffset: 1.0,
      entranceArc: 0.5,
    });
    animatePart(apronRightRef.current, spawnState.apronRight, brokenState.apronRight, assembledState.apronRight, 0.14, 0.32, {
      spinRevolutionsY: -1.0,
      spinRevolutionsX: 0.3,
      arcHeight: 0.9,
      arcLateral: -0.6,
      idleOffset: 1.0,
      entranceArc: 0.5,
    });

    // 2. Table Legs: fly-in entrance (0.00 -> 0.14) then 540° spin descent to floor (0.18 -> 0.36)
    animatePart(legFLRef.current, spawnState.legFL, brokenState.legFL, assembledState.legFL, 0.18, 0.36, {
      spinRevolutionsY: 1.5,
      spinRevolutionsX: 0.6,
      arcHeight: 1.2,
      arcLateral: 0.8,
      idleOffset: 2.0,
      entranceArc: 0.6,
    });
    animatePart(legFRRef.current, spawnState.legFR, brokenState.legFR, assembledState.legFR, 0.18, 0.36, {
      spinRevolutionsY: -1.5,
      spinRevolutionsX: 0.6,
      arcHeight: 1.2,
      arcLateral: -0.8,
      idleOffset: 2.0,
      entranceArc: 0.6,
    });
    animatePart(legBLRef.current, spawnState.legBL, brokenState.legBL, assembledState.legBL, 0.20, 0.38, {
      spinRevolutionsY: 1.5,
      spinRevolutionsX: -0.6,
      arcHeight: 1.1,
      arcLateral: 0.7,
      idleOffset: 2.5,
      entranceArc: 0.5,
    });
    animatePart(legBRRef.current, spawnState.legBR, brokenState.legBR, assembledState.legBR, 0.20, 0.38, {
      spinRevolutionsY: -1.5,
      spinRevolutionsX: -0.6,
      arcHeight: 1.1,
      arcLateral: -0.7,
      idleOffset: 2.5,
      entranceArc: 0.5,
    });

    // 3. Slabs: fly-in entrance (0.00 -> 0.14) then majestic sweeping connection (0.24 -> 0.44)
    animatePart(slabLeftRef.current, spawnState.slabLeft, brokenState.slabLeft, assembledState.slabLeft, 0.24, 0.44, {
      spinRevolutionsY: 1.0,
      spinRevolutionsX: 0.4,
      arcHeight: 1.3,
      arcLateral: 1.0,
      idleOffset: 3.5,
      entranceArc: 0.7,
    });
    animatePart(slabRightRef.current, spawnState.slabRight, brokenState.slabRight, assembledState.slabRight, 0.24, 0.44, {
      spinRevolutionsY: -1.0,
      spinRevolutionsX: 0.4,
      arcHeight: 1.3,
      arcLateral: -1.0,
      idleOffset: 3.5,
      entranceArc: 0.7,
    });

    // 4. Solid Brass Butterfly Dovetail Keys: sky descent entrance (0.00 -> 0.14) then screw docking (0.38 -> 0.50)
    if (hardwareRef.current) {
      if (p < 0.14) {
        const entNorm = Math.max(0, Math.min(1, p / 0.14));
        const entEase = easeInOutCubic(entNorm);
        const curY = THREE.MathUtils.lerp(spawnState.hardware.pos.y, brokenState.hardware.pos.y, entEase);
        hardwareRef.current.position.set(0, curY, 0.2);
        hardwareRef.current.rotation.y = (1 - entEase) * Math.PI * 4;
        hardwareRef.current.scale.setScalar(THREE.MathUtils.lerp(0.05, 1.0, entEase));
      } else if (p < 0.38) {
        hardwareRef.current.position.set(0, brokenState.hardware.pos.y + idleY * 0.5, 0.2);
        hardwareRef.current.scale.setScalar(1.0);
      } else {
        const hNormP = Math.max(0, Math.min(1, (p - 0.38) / 0.12));
        const hEase = easeInOutCubic(hNormP);
        const hY = THREE.MathUtils.lerp(brokenState.hardware.pos.y, assembledState.hardware.pos.y, hEase) + Math.sin(hNormP * Math.PI) * 0.3;
        hardwareRef.current.position.set(0, hY, 0);
        hardwareRef.current.rotation.y = (1 - hEase) * Math.PI * 10;
        hardwareRef.current.scale.setScalar(1.0);
      }
    }

    // 5. 3D GOLDEN BRAND TEXT REVEAL ON TABLETOP (Progress 0.75 -> 1.00)
    // As assembly completes and user enters the Masterpiece Journey View,
    // the 3D golden brand text ascends smoothly onto the solid walnut tabletop.
    if (brandTextGroupRef.current) {
      const journeyP = Math.max(0, Math.min(1, (p - 0.75) / 0.08));
      const journeyEase = easeInOutCubic(journeyP);

      if (journeyP <= 0.001) {
        brandTextGroupRef.current.visible = false;
      } else {
        brandTextGroupRef.current.visible = true;
        // Smoothly scale from 0 to 1 and settle down onto tabletop
        brandTextGroupRef.current.scale.setScalar(journeyEase);
        brandTextGroupRef.current.position.y = 0.824 + (1 - journeyEase) * 0.12;

        // Dedicated subtle warm highlight (gentle sheen, no light blowout)
        if (brandPointLightRef.current) {
          brandPointLightRef.current.intensity = journeyEase * 0.75;
        }
      }
    }
  });

  return (
    <group ref={rootRef} name="table-assembly">
      {/* LEFT TABLETOP SLAB */}
      <group ref={slabLeftRef}>
        {/* Main Timber Slab with Chamfer */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.08, 0.08, 1.05]} />
          <meshStandardMaterial
            color="#3C2A1E"
            roughness={0.32}
            metalness={0.06}
          />
        </mesh>
        {/* Undercut bevel chamfer strip */}
        <mesh position={[0.53, -0.025, 0]}>
          <boxGeometry args={[0.02, 0.03, 1.02]} />
          <meshStandardMaterial color="#2E1F16" roughness={0.4} />
        </mesh>
      </group>

      {/* RIGHT TABLETOP SLAB */}
      <group ref={slabRightRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.08, 0.08, 1.05]} />
          <meshStandardMaterial
            color="#3A281C"
            roughness={0.32}
            metalness={0.06}
          />
        </mesh>
        <mesh position={[-0.53, -0.025, 0]}>
          <boxGeometry args={[0.02, 0.03, 1.02]} />
          <meshStandardMaterial color="#2E1F16" roughness={0.4} />
        </mesh>
      </group>

      {/* LEFT APRON / UNDER-TABLE SUBFRAME CHASSIS */}
      <group ref={apronLeftRef}>
        {/* Front Left Rail Segment */}
        <mesh castShadow position={[-0.475, 0, 0.36]}>
          <boxGeometry args={[0.95, 0.07, 0.04]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Back Left Rail Segment */}
        <mesh castShadow position={[-0.475, 0, -0.36]}>
          <boxGeometry args={[0.95, 0.07, 0.04]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Left Cross Brace */}
        <mesh castShadow position={[-0.9, 0, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Left Center Stiffener */}
        <mesh castShadow position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Left Precision Hex Bolts */}
        <mesh position={[-0.95, -0.06, 0.38]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 6]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[-0.95, -0.06, -0.38]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 6]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.22} />
        </mesh>
      </group>

      {/* RIGHT APRON / UNDER-TABLE SUBFRAME CHASSIS */}
      <group ref={apronRightRef}>
        {/* Front Right Rail Segment */}
        <mesh castShadow position={[0.475, 0, 0.36]}>
          <boxGeometry args={[0.95, 0.07, 0.04]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Back Right Rail Segment */}
        <mesh castShadow position={[0.475, 0, -0.36]}>
          <boxGeometry args={[0.95, 0.07, 0.04]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Right Cross Brace */}
        <mesh castShadow position={[0.9, 0, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Right Center Stiffener */}
        <mesh castShadow position={[0.02, 0, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Right Precision Hex Bolts */}
        <mesh position={[0.95, -0.06, 0.38]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 6]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[0.95, -0.06, -0.38]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 6]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.22} />
        </mesh>
      </group>

      {/* TABLE LEGS (Front-Left, Front-Right, Back-Left, Back-Right) - Height 0.70m */}
      {/* Front Left */}
      <group ref={legFLRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.024, 0.70, 16]} />
          <meshStandardMaterial color="#36251A" roughness={0.35} />
        </mesh>
        {/* Brass Cap Foot */}
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.026, 0.028, 0.035, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
        {/* Brass Top Mounting Bracket */}
        <mesh position={[0, 0.345, 0]}>
          <boxGeometry args={[0.10, 0.015, 0.10]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* Front Right */}
      <group ref={legFRRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.024, 0.70, 16]} />
          <meshStandardMaterial color="#36251A" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.026, 0.028, 0.035, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.345, 0]}>
          <boxGeometry args={[0.10, 0.015, 0.10]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* Back Left */}
      <group ref={legBLRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.024, 0.70, 16]} />
          <meshStandardMaterial color="#36251A" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.026, 0.028, 0.035, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.345, 0]}>
          <boxGeometry args={[0.10, 0.015, 0.10]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* Back Right */}
      <group ref={legBRRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.024, 0.70, 16]} />
          <meshStandardMaterial color="#36251A" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.026, 0.028, 0.035, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.345, 0]}>
          <boxGeometry args={[0.10, 0.015, 0.10]} />
          <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* SOLID BRASS HARDWARE: 3 BUTTERFLY DOVETAIL INLAYS (CENTER SEAM) */}
      <group ref={hardwareRef}>
        {/* 3 Solid Brass Butterfly Dovetail Keys along the tabletop centerline */}
        {[-0.35, 0.0, 0.35].map((zPos, idx) => (
          <group key={`butterfly-${idx}`} position={[0, 0.042, zPos]}>
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.04, 0.008, 0.04]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3D GOLDEN BRAND TEXT CENTERPIECE ON SOLID WALNUT TABLETOP */}
      <group ref={brandTextGroupRef} position={[0, 0.824, 0.0]} visible={false}>
        {/* Soft Warm Dedicated Gold Illumination Spotlight */}
        <pointLight
          ref={brandPointLightRef}
          position={[0, 0.45, 0.5]}
          color="#FFF5DE"
          intensity={0}
          distance={2.0}
          decay={2}
        />

        {/* Solid Brushed Brass Base Plinth with Chamfered Edges */}
        <mesh position={[0, 0.006, 0.02]} receiveShadow castShadow>
          <boxGeometry args={[1.08, 0.012, 0.28]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.94}
            roughness={0.2}
          />
        </mesh>

        {/* Polished Gold Inlaid Border Trim */}
        <mesh position={[0, 0.013, 0.02]}>
          <boxGeometry args={[1.10, 0.003, 0.30]} />
          <meshStandardMaterial
            color="#E5C07B"
            metalness={0.96}
            roughness={0.16}
          />
        </mesh>

        {/* 
          Angled 3D Plaque Displaying the Golden Brand Typography
          Tilted backward by -0.18 rad (~10 degrees) to face the camera head-on!
        */}
        <group position={[0, 0.014, 0.04]} rotation={[-0.18, 0, 0]}>
          {/* Main Solid Brass Plaque Body */}
          <mesh castShadow receiveShadow position={[0, 0.125, 0]}>
            <boxGeometry args={[1.06, 0.265, 0.014]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>

          {/* Front Face with Golden Brand Text Canvas Texture */}
          <mesh position={[0, 0.125, 0.008]}>
            <planeGeometry args={[1.055, 0.26]} />
            <meshStandardMaterial
              map={brandTextTex || undefined}
              color="#FFFFFF"
              metalness={0.85}
              roughness={0.22}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>

          {/* Left & Right Rear Solid Brass Easel Struts */}
          <mesh position={[-0.44, 0.07, -0.06]} rotation={[0.45, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.18, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0.44, 0.07, -0.06]} rotation={[0.45, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.18, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
