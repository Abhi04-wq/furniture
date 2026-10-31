'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useFurnitureStore } from '../hooks/useFurnitureStore';

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function CameraController() {
  const { camera, size } = useThree();
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);
  const cameraMode = useFurnitureStore((state) => state.cameraMode);

  // Target vectors for smooth damping
  // Target lookAt is set to y = 1.05 so that the entire dining suite (table, 6 chairs, legs, floor)
  // and architectural elements (chandeliers, marble wall, vitrines) are in cinematic, symmetrical balance!
  const targetCamPos = useRef(new THREE.Vector3(0, 2.2, 7.6));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.05, -0.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.05, -0.2));
  const smoothP = useRef(0);

  // Determine mobile aspect ratio dynamically
  const isMobile = size.width < 768 || size.width < size.height;
  const mobileDistanceMult = isMobile ? 1.35 : 1.0;
  const mobileHeightOffset = isMobile ? 0.25 : 0.0;

  useFrame((state, delta) => {
    // Buttery smooth frame-rate independent dampening matching furniture geometry
    smoothP.current = THREE.MathUtils.damp(smoothP.current, scrollProgress, 11, delta);
    const p = smoothP.current;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // [-1 to 1] normalized mouse position for subtle parallax

    // Gentle camera parallax from user mouse movement (desktop)
    const parallaxX = isMobile ? 0 : pointer.x * 0.25;
    const parallaxY = isMobile ? 0 : pointer.y * 0.12;

    // Camera Modes (Top, Front, Detail, Cinematic)
    if (cameraMode === 'top') {
      targetCamPos.current.set(0, 7.8 * mobileDistanceMult, 0.001);
      targetLookAt.current.set(0, 0.78, 0);
    } else if (cameraMode === 'front') {
      targetCamPos.current.set(
        parallaxX * 0.35,
        (1.9 + mobileHeightOffset),
        6.4 * mobileDistanceMult
      );
      targetLookAt.current.set(0, 1.0, -0.2);
    } else if (cameraMode === 'detail') {
      targetCamPos.current.set(0.65, 1.35, 1.3);
      targetLookAt.current.set(0, 0.82, 0);
    } else {
      // DEFAULT: CINEMATIC SCROLL TIMELINE
      // Standardized around y = 1.05 lookAt for balanced floor, furniture, chandeliers & marble framing
      if (p < 0.18) {
        // Stage 1: Wide perspective sweeping gently as user begins scrolling
        const t = Math.max(0, p / 0.18);
        const easeT = easeInOutCubic(t);
        targetCamPos.current.set(
          THREE.MathUtils.lerp(0.0, -1.2, easeT) + parallaxX,
          THREE.MathUtils.lerp(2.2, 2.0, easeT) + mobileHeightOffset + parallaxY,
          THREE.MathUtils.lerp(7.6, 7.0, easeT) * mobileDistanceMult
        );
        targetLookAt.current.set(0, 1.05, -0.2);
      } else if (p < 0.46) {
        // Stage 3: Table architecture assembly & brass butterfly keys
        const t = (p - 0.18) / 0.28;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(-1.2, 2.2, t) + parallaxX,
          THREE.MathUtils.lerp(2.0, 1.85, t) + mobileHeightOffset + parallaxY,
          THREE.MathUtils.lerp(7.0, 6.2, t) * mobileDistanceMult
        );
        targetLookAt.current.set(0, 0.95, -0.2);
      } else if (p < 0.75) {
        // Stage 4: Framing the 6 chairs sequential 3D assembly around the walnut table
        const t = (p - 0.46) / 0.29;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(2.2, -1.8, t) + parallaxX,
          THREE.MathUtils.lerp(1.85, 1.9, t) + mobileHeightOffset + parallaxY,
          THREE.MathUtils.lerp(6.2, 6.4, t) * mobileDistanceMult
        );
        targetLookAt.current.set(0, 0.95, -0.2);
      } else {
        // Stage 5: Masterpiece Joinery Detail View (p: 0.75 -> 1.00)
        // Camera smoothly glides from wide shot directly into the intimate Joinery Detail angle,
        // showcasing the 3D golden brand text ATELIER KASAMA and the brass dovetail keys on the tabletop!
        const t = Math.max(0, Math.min(1, (p - 0.75) / 0.12));
        const ease = easeInOutCubic(t);

        // Start at wide shot [-1.8, 1.9, 6.4], swoop smoothly into close-up Joinery Detail view [0.55, 1.25, 1.25]
        const widePos = new THREE.Vector3(-1.8, 1.9 + mobileHeightOffset, 6.4 * mobileDistanceMult);
        const detailPos = new THREE.Vector3(
          0.55 * mobileDistanceMult,
          1.25 + mobileHeightOffset,
          1.25 * mobileDistanceMult
        );

        // Subtle slow cinematic orbit while admiring the joinery detail
        const orbitP = Math.max(0, (p - 0.84) / 0.16);
        const orbitX = Math.sin(orbitP * 0.4 + time * 0.1) * 0.12;
        const orbitZ = Math.cos(orbitP * 0.4 + time * 0.1) * 0.08;

        targetCamPos.current.set(
          THREE.MathUtils.lerp(widePos.x, detailPos.x + orbitX, ease) + parallaxX,
          THREE.MathUtils.lerp(widePos.y, detailPos.y, ease) + parallaxY,
          THREE.MathUtils.lerp(widePos.z, detailPos.z + orbitZ, ease)
        );

        targetLookAt.current.set(
          THREE.MathUtils.lerp(0, 0, ease),
          THREE.MathUtils.lerp(0.95, 0.84, ease),
          THREE.MathUtils.lerp(-0.2, 0.0, ease)
        );
      }
    }

    // High performance smooth damping (Apple-smooth 60 FPS)
    const damping = Math.min(delta * 4.2, 0.22);
    camera.position.lerp(targetCamPos.current, damping);

    currentLookAt.current.lerp(targetLookAt.current, damping);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
