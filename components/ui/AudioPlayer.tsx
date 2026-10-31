'use client';

import { useEffect, useRef } from 'react';
import { useFurnitureStore } from '../hooks/useFurnitureStore';

/**
 * Procedural Luxury Audio Engine for 3D Furniture Assembly
 * Synthesizes authentic acoustic wood impacts, brass joinery clicks,
 * gliding kinematic trajectories, and luxury salon completion chimes
 * using pure Web Audio API (100% offline, zero latency, zero dependencies).
 */
export function AudioPlayer() {
  const soundEnabled = useFurnitureStore((state) => state.soundEnabled);
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const glideGainRef = useRef<GainNode | null>(null);
  const glideFilterRef = useRef<BiquadFilterNode | null>(null);

  const prevProgressRef = useRef<number>(0);
  const lastVelocityTimeRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);

  // Trigger tracking so milestone sounds only fire once per threshold cross
  const triggeredMilestones = useRef<Record<string, boolean>>({
    tableDock: false,
    tableLegs: false,
    chair12: false,
    chair34: false,
    chair56: false,
    masterpiece: false,
  });

  // Initialize or resume AudioContext safely upon user interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 1. Ambient Luxury Salon Pad (Calm, warm Mediterranean showroom atmosphere)
      try {
        const ambientGain = ctx.createGain();
        ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        ambientGain.connect(ctx.destination);
        ambientGainRef.current = ambientGain;

        // Warm harmonic chord (A2 - 110Hz & E3 - 164.8Hz)
        [110, 164.81, 220].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle detune for organic warmth
          osc.detune.setValueAtTime((idx - 1) * 3, ctx.currentTime);
          oscGain.gain.setValueAtTime(0.012 / (idx + 1), ctx.currentTime);

          osc.connect(oscGain);
          oscGain.connect(ambientGain);
          osc.start();
        });

        // 2. Dynamic Wood Gliding Resonator (Modulated by scroll speed)
        const glideNoise = createNoiseBuffer(ctx);
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = glideNoise;
        noiseSource.loop = true;

        const glideFilter = ctx.createBiquadFilter();
        glideFilter.type = 'bandpass';
        glideFilter.frequency.setValueAtTime(320, ctx.currentTime);
        glideFilter.Q.setValueAtTime(2.5, ctx.currentTime);
        glideFilterRef.current = glideFilter;

        const glideGain = ctx.createGain();
        glideGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        glideGainRef.current = glideGain;

        noiseSource.connect(glideFilter);
        glideFilter.connect(glideGain);
        glideGain.connect(ctx.destination);
        noiseSource.start();
      } catch (err) {
        console.warn('Audio setup error:', err);
      }
    }

    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Helper: Generates smooth pinkish noise buffer for wood movement
  const createNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.2;
      data[i] = (b0 + b1 + b2) * 0.25;
    }
    return buffer;
  };

  // Sound 1: Solid Walnut Docking Impact (Deep wood resonance + brass dovetail key click)
  const playWoodImpact = (pitchMultiplier = 1.0, isTable = true) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;

    // Body Thud: Deep dense wood resonance
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'triangle';
    const baseFreq = isTable ? 135 * pitchMultiplier : 220 * pitchMultiplier;
    thudOsc.frequency.setValueAtTime(baseFreq * 1.4, t);
    thudOsc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.08);

    thudGain.gain.setValueAtTime(0.18, t);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, t + (isTable ? 0.22 : 0.14));

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(t);
    thudOsc.stop(t + 0.25);

    // Acoustic Cavity: Warm hollow wood filter
    const noiseBuf = createNoiseBuffer(ctx);
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isTable ? 320 : 450, t);
    filter.Q.setValueAtTime(4.0, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

    noiseSrc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(t);
    noiseSrc.stop(t + 0.12);

    // Tactile Click: Fine brushed brass hardware snap
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(1850 * pitchMultiplier, t);
    clickOsc.frequency.exponentialRampToValueAtTime(800, t + 0.03);

    clickGain.gain.setValueAtTime(0.06, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.04);
  };

  // Sound 2: Chair Sequence Glide & Floor Lock
  const playChairDock = (chairIndex: number) => {
    // Each pair of chairs has a slightly higher pitched harmonic signature
    const pitch = 0.95 + chairIndex * 0.08;
    playWoodImpact(pitch, false);
  };

  // Sound 3: Masterpiece Completion Harmony (Warm Italian design salon chord)
  const playMasterpieceChord = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    // Ethereal chord: A2 (110Hz), E3 (164.8Hz), A3 (220Hz), C#4 (277.2Hz), E4 (329.6Hz), G#4 (415.3Hz)
    const chord = [110, 164.81, 220, 277.18, 329.63, 415.3];

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Delicate stagger for a harp-like gentle strum
      const noteTime = t + i * 0.045;
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.07 / (i * 0.5 + 1), noteTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 3.0);
    });
  };

  // Auto-initialize audio on user gesture (click, scroll, keypress)
  useEffect(() => {
    const handleGesture = () => {
      initAudio();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('wheel', handleGesture);
    };

    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    window.addEventListener('wheel', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('wheel', handleGesture);
    };
  }, []);

  // Update Ambient Sound level according to soundEnabled state
  useEffect(() => {
    initAudio();
    if (ambientGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const targetGain = soundEnabled ? 0.035 : 0.0001;
      ambientGainRef.current.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.6);
    }
  }, [soundEnabled]);

  // Synchronize Relative Assembly Sounds with GSAP Timeline milestones
  useEffect(() => {
    const p = scrollProgress;
    const prev = prevProgressRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - lastScrollTimeRef.current);
    const velocity = Math.abs(p - prev) / (dt / 1000); // Progress per second
    lastScrollTimeRef.current = now;

    // 1. Dynamic Gliding Wood Motion (Modulated by scroll speed)
    if (glideGainRef.current && glideFilterRef.current && audioCtxRef.current && soundEnabled) {
      const ctx = audioCtxRef.current;
      const normVel = Math.min(1.0, velocity * 1.5);
      const targetGain = normVel > 0.02 && p < 0.95 ? normVel * 0.045 : 0.0001;
      const targetFreq = 220 + normVel * 480;

      glideGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);
      glideFilterRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
    }

    // 2. Relative Milestone Trigger Points:
    // Milestone A: Tabletop Pieces Align & Lock (Stage 3 peak ~0.38)
    if (p >= 0.38 && prev < 0.38 && !triggeredMilestones.current.tableDock) {
      triggeredMilestones.current.tableDock = true;
      playWoodImpact(1.0, true);
    } else if (p < 0.34) {
      triggeredMilestones.current.tableDock = false;
    }

    // Milestone B: Trestle Legs & Brass Dovetail Keys Lock (Stage 3 end ~0.46)
    if (p >= 0.46 && prev < 0.46 && !triggeredMilestones.current.tableLegs) {
      triggeredMilestones.current.tableLegs = true;
      playWoodImpact(1.15, true);
    } else if (p < 0.42) {
      triggeredMilestones.current.tableLegs = false;
    }

    // Milestone C: Chairs 1 & 2 glide in (Stage 4 start ~0.55)
    if (p >= 0.55 && prev < 0.55 && !triggeredMilestones.current.chair12) {
      triggeredMilestones.current.chair12 = true;
      playChairDock(1);
    } else if (p < 0.51) {
      triggeredMilestones.current.chair12 = false;
    }

    // Milestone D: Chairs 3 & 4 glide in (Stage 4 mid ~0.66)
    if (p >= 0.66 && prev < 0.66 && !triggeredMilestones.current.chair34) {
      triggeredMilestones.current.chair34 = true;
      playChairDock(2);
    } else if (p < 0.62) {
      triggeredMilestones.current.chair34 = false;
    }

    // Milestone E: Chairs 5 & 6 tuck into place (Stage 4 end ~0.76)
    if (p >= 0.76 && prev < 0.76 && !triggeredMilestones.current.chair56) {
      triggeredMilestones.current.chair56 = true;
      playChairDock(3);
    } else if (p < 0.72) {
      triggeredMilestones.current.chair56 = false;
    }

    // Milestone F: Masterpiece Fully Assembled (Stage 5 completion ~0.92)
    if (p >= 0.92 && prev < 0.92 && !triggeredMilestones.current.masterpiece) {
      triggeredMilestones.current.masterpiece = true;
      playMasterpieceChord();
    } else if (p < 0.86) {
      triggeredMilestones.current.masterpiece = false;
    }

    prevProgressRef.current = p;
  }, [scrollProgress, soundEnabled]);

  return null;
}
