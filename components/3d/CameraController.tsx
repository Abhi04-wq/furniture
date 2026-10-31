'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useFurnitureStore } from '../hooks/useFurnitureStore';

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

  // Determine mobile aspect ratio dynamically
  const isMobile = size.width < 768 || size.width < size.height;
  const mobileDistanceMult = isMobile ? 1.35 : 1.0;
  const mobileHeightOffset = isMobile ? 0.25 : 0.0;

  useFrame((state, delta) => {
    const p = scrollProgress;
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
        // Stage 1 -> 2: Wide cinematic overview of disassembled floating elements
        const t = p / 0.18;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(0.0, -1.2, t) + parallaxX,
          THREE.MathUtils.lerp(2.2, 2.0, t) + mobileHeightOffset + parallaxY,
          THREE.MathUtils.lerp(7.6, 7.0, t) * mobileDistanceMult
        );
        targetLookAt.current.set(0, 1.05, -0.2);
      } else if (p < 0.48) {
        // Stage 3: Table architecture assembly & brass butterfly keys
        const t = (p - 0.18) / 0.30;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(-1.2, 2.2, t) + parallaxX,
          THREE.MathUtils.lerp(2.0, 1.85, t) + mobileHeightOffset + parallaxY,
          THREE.MathUtils.lerp(7.0, 6.2, t) * mobileDistanceMult
        );
        targetLookAt.current.set(0, 0.95, -0.2);
      } else if (p < 0.82) {
        // Stage 4: Framing the 6 chairs sequential 3D assembly around the walnut table
        const t = (p - 0.48) / 0.34;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(2.2, -2.0, t) + parallaxX,
          THREE.MathUtils.lerp(1.85, 1.9, t) + mobileHeightOffset + parallaxY,
          THREE.MathUtils.lerp(6.2, 6.4, t) * mobileDistanceMult
        );
        targetLookAt.current.set(0, 0.95, -0.2);
      } else {
        // Stage 5: Final Luxury Italian Dining Salon Masterpiece
        // Symmetrical architecture, visible dark walnut vitrines on both sides,
        // bookmatched Calacatta Gold marble, glowing brass chandeliers above, and tucked chairs!
        const finalP = (p - 0.82) / 0.18; // 0 to 1
        const orbitAngle = -0.18 + finalP * 0.36 + Math.sin(time * 0.15) * 0.04;
        const radius = 6.6 * mobileDistanceMult;
        const height = 1.95 + mobileHeightOffset + parallaxY;

        targetCamPos.current.set(
          Math.sin(orbitAngle) * radius + parallaxX,
          height,
          Math.cos(orbitAngle) * radius
        );
        targetLookAt.current.set(0, 1.05, -0.3);
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
