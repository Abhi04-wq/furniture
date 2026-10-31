'use client';

import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFurnitureStore, CameraMode } from '../hooks/useFurnitureStore';
import { Compass, Lock, Unlock } from 'lucide-react';

const STAGES = [
  { id: 1, name: 'Deconstruction', range: '0% - 15%' },
  { id: 2, name: 'Component Alignment', range: '15% - 30%' },
  { id: 3, name: 'Table Assembly', range: '30% - 50%' },
  { id: 4, name: 'Six Chairs Architecture', range: '50% - 82%' },
  { id: 5, name: 'Masterpiece Setup', range: '82% - 100%' },
];

const CAMERAS: { id: CameraMode; label: string; short: string }[] = [
  { id: 'cinematic', label: 'Cinematic', short: 'Cine' },
  { id: 'top', label: 'Top View', short: 'Top' },
  { id: 'front', label: 'Front Elevation', short: 'Front' },
  { id: 'detail', label: 'Joinery Detail', short: 'Detail' },
];

export function ScrollProgressIndicator() {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);
  const activeStage = useFurnitureStore((state) => state.activeStage);
  const cameraMode = useFurnitureStore((state) => state.cameraMode);
  const setCameraMode = useFurnitureStore((state) => state.setCameraMode);

  // Jump to stage position by scrolling window
  const jumpToStage = (stageId: number) => {
    gsap.registerPlugin(ScrollTrigger);
    const heroSt = ScrollTrigger.getById('hero-st');
    const targets = [0.0, 0.22, 0.40, 0.66, 0.96];
    const target = targets[stageId - 1];

    if (heroSt) {
      const targetScroll = heroSt.start + target * (heroSt.end - heroSt.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: target * 6000,
        behavior: 'smooth',
      });
    }
  };

  const isCompleted = scrollProgress >= 0.98;

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-30 pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4">
      {/* LEFT: Active Stage Indicator & Timeline Bar with Champagne Gold accents */}
      <div className="pointer-events-auto bg-[#F3EFE7]/92 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-gold-muted/40 shadow-sm flex items-center justify-between md:justify-start space-x-3 sm:space-x-6">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse flex-shrink-0" />
          <div>
            <div className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] uppercase font-nav tracking-widest text-taupe">
              {isCompleted ? (
                <>
                  <Unlock className="w-3 h-3 text-gold-primary" />
                  <span className="text-gold-primary font-medium">Assembly Complete</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-taupe" />
                  <span>3D Assembly Locked</span>
                </>
              )}
            </div>
            <div className="text-xs font-semibold text-primary tracking-wide truncate max-w-[140px] sm:max-w-none">
              {STAGES[activeStage - 1].name}
            </div>
          </div>
        </div>

        {/* Stage Progress Bar & Champagne Gold Pills */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => jumpToStage(s.id)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                activeStage === s.id
                  ? 'w-6 sm:w-8 bg-gold-primary shadow-2xs'
                  : activeStage > s.id
                  ? 'w-2.5 sm:w-3 bg-primary/45'
                  : 'w-2.5 sm:w-3 bg-gold-muted/35'
              }`}
              title={`${s.name} (${s.range}) - Click to jump`}
            />
          ))}
        </div>

        {/* Live Percent Badge */}
        <div className="border-l border-gold-muted/40 pl-3 sm:pl-4 font-nav text-xs font-semibold text-gold-antique">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>

      {/* RIGHT: Camera View Switcher (Desktop & Tablet) */}
      <div className="hidden sm:flex pointer-events-auto bg-[#F3EFE7]/92 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-gold-muted/40 shadow-sm items-center justify-center space-x-1">
        <div className="px-1.5 py-1 text-taupe flex items-center space-x-1">
          <Compass className="w-3.5 h-3.5 text-gold-primary" />
          <span className="hidden xl:inline text-[10px] uppercase font-nav tracking-widest">
            Perspective:
          </span>
        </div>
        {CAMERAS.map((cam) => {
          const isActive = cameraMode === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => setCameraMode(cam.id)}
              className={`px-3.5 py-1.5 text-[11px] sm:text-xs font-nav rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-primary !text-white font-medium shadow-sm border border-gold-primary/30'
                  : 'text-primary hover:text-primary hover:bg-white border border-transparent'
              }`}
            >
              <span className={isActive ? '!text-white font-semibold' : ''}>
                {cam.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
