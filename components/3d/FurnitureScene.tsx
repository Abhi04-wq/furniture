'use client';

import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { TableAssembly } from './TableAssembly';
import { ChairAssembly } from './ChairAssembly';
import { RoomEnvironment } from './RoomEnvironment';
import { CameraController } from './CameraController';
import { ModelFallback } from './ModelFallback';

export function FurnitureScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        shadows
        camera={{
          fov: 46,
          position: [0, 2.1, 7.5],
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
        dpr={[1, 2]} // High-DPI support on retina screens while scaling dynamically
        className="w-full h-full"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={<ModelFallback />}>
          <CameraController />
          <RoomEnvironment />
          <TableAssembly />
          <ChairAssembly />
        </Suspense>
      </Canvas>
    </div>
  );
}
