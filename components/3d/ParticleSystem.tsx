'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useFurnitureStore } from '../hooks/useFurnitureStore';

const PARTICLE_COUNT = 450;

export function ParticleSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  // Generate initial scattered positions and converged target positions
  // Kept in the open center / upper space so no particles are ever hidden at the bottom
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scattered broken positions (Stage 1 cloud)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.2 + Math.random() * 5.0;

      const scatterX = r * Math.sin(phi) * Math.cos(theta);
      const scatterY = 0.8 + Math.random() * 3.0; // Lifted off the floor so none are cut off at bottom
      const scatterZ = r * Math.sin(phi) * Math.sin(theta);

      // Random rotation
      const rotX = Math.random() * Math.PI * 2;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = Math.random() * Math.PI * 2;
      const rotSpeedX = (Math.random() - 0.5) * 1.5;
      const rotSpeedY = (Math.random() - 0.5) * 1.5;

      // Converged target positions (centered gracefully onto the tabletop surface at y = 0.78m)
      const targetX = (Math.random() - 0.5) * 2.3;
      const targetY = 0.82 + (Math.random() - 0.5) * 0.22;
      const targetZ = (Math.random() - 0.5) * 1.2;

      // Particle scale (wood shavings / chips)
      const baseScale = 0.035 + Math.random() * 0.055;
      const aspectX = 0.8 + Math.random() * 1.5;
      const aspectY = 0.2 + Math.random() * 0.4;
      const aspectZ = 0.8 + Math.random() * 1.5;

      // Curved trajectory control point offset (arching upward toward center)
      const curveHeight = 1.5 + Math.random() * 2.2;
      const curveSide = (Math.random() - 0.5) * 2.8;

      data.push({
        scatterPos: new THREE.Vector3(scatterX, scatterY, scatterZ),
        targetPos: new THREE.Vector3(targetX, targetY, targetZ),
        curveOffset: new THREE.Vector3(curveSide, curveHeight, curveSide),
        rot: new THREE.Euler(rotX, rotY, rotZ),
        rotSpeedX,
        rotSpeedY,
        baseScale,
        aspect: new THREE.Vector3(aspectX, aspectY, aspectZ),
        convergeDelay: Math.random() * 0.08, // Staggered attraction start
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const rawProgress = scrollProgress;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particleData[i];

      // Normalized progress for this particle with stagger
      const particleProgress = Math.max(
        0,
        Math.min(1, (rawProgress - p.convergeDelay) / 0.20)
      );

      // Smooth cubic easing for attraction
      const ease =
        particleProgress < 0.5
          ? 4 * particleProgress * particleProgress * particleProgress
          : 1 - Math.pow(-2 * particleProgress + 2, 3) / 2;

      // Quadratic Bezier interpolation from scatterPos -> controlPoint -> targetPos
      const p0 = p.scatterPos;
      const p1 = new THREE.Vector3()
        .addVectors(p.scatterPos, p.targetPos)
        .multiplyScalar(0.5)
        .add(p.curveOffset);
      const p2 = p.targetPos;

      const t = ease;
      const invT = 1 - t;
      const currentX = invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x;
      const currentY = invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y;
      const currentZ = invT * invT * p0.z + 2 * invT * t * p1.z + t * t * p2.z;

      // Idle floating movement in broken state
      const idleFloat = Math.sin(time * 1.2 + i) * 0.08 * (1 - ease);
      const idleSway = Math.cos(time * 0.9 + i * 2) * 0.05 * (1 - ease);

      dummy.position.set(
        currentX + idleSway,
        currentY + idleFloat,
        currentZ + idleFloat
      );

      // Rotation during flight
      dummy.rotation.x = p.rot.x + time * p.rotSpeedX + ease * Math.PI * 4;
      dummy.rotation.y = p.rot.y + time * p.rotSpeedY + ease * Math.PI * 4;
      dummy.rotation.z = p.rot.z + ease * Math.PI * 2;

      // Particles dissolve/scale down as they absorb into the furniture
      let scaleMult = 1.0;
      if (ease > 0.8) {
        scaleMult = Math.max(0, 1 - (ease - 0.8) / 0.2);
      }

      dummy.scale.set(
        p.baseScale * p.aspect.x * scaleMult,
        p.baseScale * p.aspect.y * scaleMult,
        p.baseScale * p.aspect.z * scaleMult
      );

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#3E2B1D"
        roughness={0.55}
        metalness={0.06}
      />
    </instancedMesh>
  );
}
