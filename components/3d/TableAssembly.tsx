'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useFurnitureStore } from '../hooks/useFurnitureStore';

// Cubic easing helper
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function TableAssembly() {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  // Component Mesh References
  const slabLeftRef = useRef<THREE.Group>(null);
  const slabRightRef = useRef<THREE.Group>(null);
  const apronRef = useRef<THREE.Group>(null);
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);
  const hardwareRef = useRef<THREE.Group>(null);

  // Pre-calculate initial scattered broken transforms - Floating high in the luxury salon
  const brokenState = useMemo(() => {
    return {
      slabLeft: {
        pos: new THREE.Vector3(-3.8, 3.4, -1.8),
        rot: new THREE.Euler(0.7, 1.2, -0.6),
      },
      slabRight: {
        pos: new THREE.Vector3(3.8, 3.5, 1.8),
        rot: new THREE.Euler(-0.7, -1.2, 0.6),
      },
      apron: {
        pos: new THREE.Vector3(0.0, 3.6, -1.2),
        rot: new THREE.Euler(0.8, 0.5, 0.3),
      },
      legFL: {
        pos: new THREE.Vector3(-3.8, 2.4, 2.5),
        rot: new THREE.Euler(1.6, 0.8, -1.8),
      },
      legFR: {
        pos: new THREE.Vector3(3.8, 2.5, 2.6),
        rot: new THREE.Euler(-1.5, -0.9, 1.6),
      },
      legBL: {
        pos: new THREE.Vector3(-3.6, 2.6, -2.8),
        rot: new THREE.Euler(-1.8, 0.9, 1.2),
      },
      legBR: {
        pos: new THREE.Vector3(3.6, 2.7, -2.7),
        rot: new THREE.Euler(1.4, -0.8, -1.5),
      },
      hardware: {
        pos: new THREE.Vector3(0, 3.6, 0),
        rot: new THREE.Euler(0, Math.PI * 6, 0),
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
      apron: {
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
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const p = scrollProgress;

    // Stage 1 Idle float factor (diminishes as user starts scrolling)
    const idleFactor = Math.max(0, 1 - p / 0.12);
    const idleY = Math.sin(time * 1.5) * 0.12 * idleFactor;
    const idleRot = Math.cos(time * 1.2) * 0.05 * idleFactor;

    // Advanced 3D curved descent with rotational spin ("gurte gurte ase nambe ar fit hbe")
    const interpolatePart = (
      group: THREE.Group | null,
      broken: { pos: THREE.Vector3; rot: THREE.Euler },
      assembled: { pos: THREE.Vector3; rot: THREE.Euler },
      startP: number,
      endP: number,
      options: {
        spinRevolutionsY?: number;
        spinRevolutionsX?: number;
        arcHeight?: number;
        arcLateral?: number;
        idleOffset?: number;
      } = {}
    ) => {
      if (!group) return;

      const normP = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
      const ease = easeInOutCubic(normP);

      const {
        spinRevolutionsY = 1.0,
        spinRevolutionsX = 0.4,
        arcHeight = 0.8,
        arcLateral = 0.5,
        idleOffset = 0,
      } = options;

      // Parabolic flight arc: rises then gracefully descends into position
      const arc = Math.sin(normP * Math.PI);

      // Curved spiral descent in 3D
      const targetX = THREE.MathUtils.lerp(broken.pos.x, assembled.pos.x, ease) + Math.sin(normP * Math.PI * 1.5) * arcLateral * (1 - ease);
      const targetY = THREE.MathUtils.lerp(broken.pos.y, assembled.pos.y, ease) + arc * arcHeight + idleY * Math.cos(idleOffset);
      const targetZ = THREE.MathUtils.lerp(broken.pos.z, assembled.pos.z, ease) + Math.cos(normP * Math.PI * 1.5) * arcLateral * (1 - ease);

      group.position.set(targetX, targetY, targetZ);

      // Dynamic multi-axis rotational spin ("gurte gurte") that dampens to exact 0 at docking
      const spinAngleY = (1 - ease) * (spinRevolutionsY * Math.PI * 2);
      const spinAngleX = (1 - ease) * (spinRevolutionsX * Math.PI * 2);
      const rollWobble = Math.sin(normP * Math.PI) * 0.35;

      group.rotation.x = THREE.MathUtils.lerp(broken.rot.x, assembled.rot.x, ease) + spinAngleX + idleRot * Math.sin(idleOffset);
      group.rotation.y = THREE.MathUtils.lerp(broken.rot.y, assembled.rot.y, ease) + spinAngleY + idleRot * Math.cos(idleOffset);
      group.rotation.z = THREE.MathUtils.lerp(broken.rot.z, assembled.rot.z, ease) + rollWobble;
    };

    // Extended Table Timeline: Progress 0.05 -> 0.48 (Prolonged duration with rich choreography)
    // 1. Apron frame establishes foundation (0.05 -> 0.28)
    interpolatePart(apronRef.current, brokenState.apron, assembledState.apron, 0.05, 0.28, {
      spinRevolutionsY: 1.0,
      spinRevolutionsX: 0.3,
      arcHeight: 0.9,
      arcLateral: 0.6,
      idleOffset: 1.0,
    });

    // 2. Table Legs spin 540°, sweep inward, and descend onto the travertine floor (0.10 -> 0.38)
    interpolatePart(legFLRef.current, brokenState.legFL, assembledState.legFL, 0.10, 0.33, {
      spinRevolutionsY: 1.5,
      spinRevolutionsX: 0.6,
      arcHeight: 1.2,
      arcLateral: 0.8,
      idleOffset: 2.0,
    });
    interpolatePart(legFRRef.current, brokenState.legFR, assembledState.legFR, 0.12, 0.35, {
      spinRevolutionsY: -1.5,
      spinRevolutionsX: 0.6,
      arcHeight: 1.2,
      arcLateral: -0.8,
      idleOffset: 2.5,
    });
    interpolatePart(legBLRef.current, brokenState.legBL, assembledState.legBL, 0.14, 0.37, {
      spinRevolutionsY: 1.5,
      spinRevolutionsX: -0.6,
      arcHeight: 1.1,
      arcLateral: 0.7,
      idleOffset: 3.0,
    });
    interpolatePart(legBRRef.current, brokenState.legBR, assembledState.legBR, 0.16, 0.39, {
      spinRevolutionsY: -1.5,
      spinRevolutionsX: -0.6,
      arcHeight: 1.1,
      arcLateral: -0.7,
      idleOffset: 3.5,
    });

    // 3. Slabs glide in a dramatic sweeping curve, rotate, level out, and connect (0.20 -> 0.46)
    interpolatePart(slabLeftRef.current, brokenState.slabLeft, assembledState.slabLeft, 0.20, 0.44, {
      spinRevolutionsY: 1.0,
      spinRevolutionsX: 0.4,
      arcHeight: 1.3,
      arcLateral: 1.0,
      idleOffset: 4.0,
    });
    interpolatePart(slabRightRef.current, brokenState.slabRight, assembledState.slabRight, 0.22, 0.46, {
      spinRevolutionsY: -1.0,
      spinRevolutionsX: 0.4,
      arcHeight: 1.3,
      arcLateral: -1.0,
      idleOffset: 4.5,
    });

    // 4. Hardware bolts & butterfly keys spin down from the ceiling (0.34 -> 0.48)
    if (hardwareRef.current) {
      const hNormP = Math.max(0, Math.min(1, (p - 0.34) / 0.14));
      const hEase = easeInOutCubic(hNormP);
      const hY = THREE.MathUtils.lerp(brokenState.hardware.pos.y, assembledState.hardware.pos.y, hEase) + Math.sin(hNormP * Math.PI) * 0.4;
      hardwareRef.current.position.set(0, hY, 0);
      hardwareRef.current.rotation.y = (1 - hEase) * Math.PI * 10; // Rapid screw spin
      hardwareRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1.0, hEase));
    }
  });

  return (
    <group name="table-assembly">
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

      {/* APRON / UNDER-TABLE SUBFRAME */}
      <group ref={apronRef}>
        {/* Long Apron Rails */}
        <mesh castShadow position={[0, 0, 0.36]}>
          <boxGeometry args={[1.9, 0.07, 0.04]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0, 0, -0.36]}>
          <boxGeometry args={[1.9, 0.07, 0.04]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        {/* Cross Braces */}
        <mesh castShadow position={[-0.9, 0, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0.9, 0, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.72]} />
          <meshStandardMaterial color="#2C1D14" roughness={0.45} />
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

      {/* BRASS HARDWARE: BUTTERFLY JOINERY & CONNECTOR BOLTS */}
      <group ref={hardwareRef}>
        {/* 3 Brass Butterfly Dovetail Keys along the tabletop centerline */}
        {[-0.35, 0.0, 0.35].map((zPos, idx) => (
          <group key={`butterfly-${idx}`} position={[0, 0.042, zPos]}>
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.04, 0.008, 0.04]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Precision hex bolts securing the apron brackets */}
        {[
          [-0.95, -0.06, 0.38],
          [0.95, -0.06, 0.38],
          [-0.95, -0.06, -0.38],
          [0.95, -0.06, -0.38],
        ].map(([bx, by, bz], bIdx) => (
          <mesh key={`bolt-${bIdx}`} position={[bx, by, bz]}>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 6]} />
            <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.22} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
