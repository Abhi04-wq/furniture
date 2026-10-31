'use client';

import React from 'react';
import { Html } from '@react-three/drei';

export function ModelFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className="w-12 h-12 border-2 border-[#A58B68]/30 border-t-[#A58B68] rounded-full animate-spin" />
        <p className="font-nav text-xs tracking-widest text-[#25251F]/70 uppercase">
          Synthesizing Geometry...
        </p>
      </div>
    </Html>
  );
}
