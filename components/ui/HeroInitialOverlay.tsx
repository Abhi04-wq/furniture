'use client';

import React from 'react';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { ChevronDown, Sparkles } from 'lucide-react';

/**
 * Initial Hero Screen Overlay
 * Displays the Champagne Gold brand title centered cleanly over the 3D room's white marble wall,
 * with NO floating furniture particles at start. As user scrolls down, the text dissolves upward
 * and the 3D furniture pieces smoothly fly in and assemble.
 */
export function HeroInitialOverlay() {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  // Text dissolves and slides upward as user scrolls down (p: 0.00 -> 0.08)
  // Clean, graceful fade-out as the user begins scrolling down
  const textOpacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.08));
  const textTranslateY = (scrollProgress / 0.08) * -50;

  if (textOpacity <= 0.001) return null;

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between items-center px-4 py-8 sm:py-12 select-none text-center transition-all duration-300"
      style={{
        opacity: textOpacity,
        transform: `translateY(${textTranslateY}px)`,
      }}
    >
      {/* Top spacing aligned with luxury floating navbar */}
      <div className="pt-20 sm:pt-24">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-primary/35 bg-surface/50 backdrop-blur-xs text-gold-primary text-[10px] sm:text-xs font-nav uppercase tracking-[0.25em] shadow-2xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-gold-primary" />
          <span>Haute Ébénisterie · Est. 1994</span>
        </div>
      </div>

      {/* 
        Center: Champagne Gold Brand Title
        Constrained cleanly within the central white marble feature wall in the 3D background.
      */}
      <div className="w-full max-w-[340px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[560px] mx-auto my-auto px-4 py-2">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.14em] uppercase bg-gradient-to-r from-[#A88955] via-[#C6A66B] to-[#D1BA91] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(198,166,107,0.35)] leading-[1.08]">
          ATELIER KASAMA
        </h1>

        <p className="font-nav text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.32em] text-gold-antique font-semibold mt-3 sm:mt-4">
          Mumbai · New Delhi · Bengaluru
        </p>

        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-gold-primary/75 to-transparent mx-auto my-3.5" />

        <p className="font-body text-xs sm:text-sm text-taupe font-light tracking-wide max-w-sm sm:max-w-md mx-auto leading-relaxed">
          Architectural Solid Hardwoods & Precision Dovetail Joinery
        </p>
      </div>

      {/* Bottom: "SCROLL DOWN" with Animated Champagne Gold Icon */}
      <div className="flex flex-col items-center space-y-1.5 pb-6 sm:pb-8">
        <span className="font-nav text-[10px] sm:text-xs uppercase tracking-[0.32em] font-semibold text-gold-primary">
          Scroll Down
        </span>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-5 h-8 sm:w-5.5 sm:h-9 rounded-full border border-gold-primary/80 flex justify-center pt-1.5 shadow-2xs">
            <div className="w-1 h-2 rounded-full bg-gold-primary animate-bounce" />
          </div>
          <ChevronDown className="w-4 h-4 text-gold-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
}
