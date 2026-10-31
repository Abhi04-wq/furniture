'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FurnitureScene } from './FurnitureScene';
import { StageOverlayText } from '../ui/StageOverlayText';
import { ScrollProgressIndicator } from '../ui/ScrollProgressIndicator';
import { useFurnitureStore } from '../hooks/useFurnitureStore';

export function FurnitureHero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const setScrollProgress = useFurnitureStore((state) => state.setScrollProgress);
  const setIsHeroPast = useFurnitureStore((state) => state.setIsHeroPast);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!triggerRef.current || !pinTargetRef.current) return;

    // Refresh ScrollTrigger to calculate initial bounds cleanly
    ScrollTrigger.refresh();

    // GSAP ScrollTrigger True Pinning:
    // This locks the viewport on pinTargetRef and pushes all subsequent sections 6000px down.
    // Prolonged scroll travel so pieces glide, spin, and descend with buttery smoothness!
    const st = ScrollTrigger.create({
      id: 'hero-st',
      trigger: triggerRef.current,
      pin: pinTargetRef.current,
      start: 'top top',
      end: '+=5200', // Prolonged smooth scroll travel without dragging
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.6, // Silky smooth response matching Lenis
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        if (self.progress < 0.99) {
          setIsHeroPast(false);
        }
      },
      onLeave: () => {
        setIsHeroPast(true);
      },
      onEnterBack: () => {
        setIsHeroPast(false);
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      st.kill();
    };
  }, [setScrollProgress, setIsHeroPast]);

  return (
    <div
      id="hero-pinned-track"
      ref={triggerRef}
      className="relative w-full bg-background"
    >
      {/* GSAP PINNED VIEWPORT: Locked in place during the entire 0% - 100% animation */}
      <div
        ref={pinTargetRef}
        className="w-full h-screen overflow-hidden relative flex flex-col justify-between select-none"
      >
        {/* 3D WebGL Canvas Layer */}
        <FurnitureScene />

        {/* Apple-style Typographic Synchronized Overlays */}
        <StageOverlayText />

        {/* Live HUD Progress Bar, Stage Indicators & Perspective Controls */}
        <ScrollProgressIndicator />
      </div>
    </div>
  );
}
