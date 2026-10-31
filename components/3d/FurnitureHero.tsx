'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FurnitureScene } from './FurnitureScene';
import { HeroInitialOverlay } from '../ui/HeroInitialOverlay';
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
    // Locks the viewport on pinTargetRef while user scrolls through the 3D assembly journey.
    // 2400px of travel ensures fast, responsive animation on the very first scroll notch!
    const PIN_DISTANCE = 2400;

    const st = ScrollTrigger.create({
      id: 'hero-st',
      trigger: triggerRef.current,
      pin: pinTargetRef.current,
      start: 'top top',
      end: `+=${PIN_DISTANCE}`,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        setIsHeroPast(self.progress >= 0.99);
      },
      onLeave: () => {
        setIsHeroPast(true);
      },
      onEnterBack: () => {
        setIsHeroPast(false);
      },
    });

    // Native scroll listener guarantee: ensures scrollProgress is updated on every scroll tick
    // even during fast scrolls, touchpad swipes, or Lenis sync frames
    const handleScroll = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const dist = -rect.top;
      const p = Math.max(0, Math.min(1, dist / PIN_DISTANCE));
      setScrollProgress(p);
      setIsHeroPast(p >= 0.99);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      handleScroll();
    }, 150);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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

        {/* Initial Golden Title Framing White Marble Backdrop (Dissolves as user scrolls down) */}
        <HeroInitialOverlay />
      </div>
    </div>
  );
}
