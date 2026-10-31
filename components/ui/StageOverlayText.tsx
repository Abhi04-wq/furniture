'use client';

import React from 'react';
import Link from 'next/link';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';

export function StageOverlayText() {
  const scrollProgress = useFurnitureStore((state) => state.scrollProgress);

  const scrollToCollection = () => {
    const heroTrack = document.getElementById('hero-pinned-track');
    if (heroTrack) {
      const rect = heroTrack.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.bottom + 10,
        behavior: 'smooth',
      });
    } else {
      const el = document.getElementById('featured-collection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/collection';
      }
    }
  };

  // Card only appears from Phase 03 onwards (Phase 01 and 02 are completely cardless)
  const cardOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.10));

  const stage3Opacity =
    scrollProgress >= 0.28 && scrollProgress <= 0.52
      ? Math.sin(((scrollProgress - 0.28) / (0.52 - 0.28)) * Math.PI)
      : 0;

  const stage4Opacity =
    scrollProgress >= 0.48 && scrollProgress <= 0.82
      ? Math.sin(((scrollProgress - 0.48) / (0.82 - 0.48)) * Math.PI)
      : 0;

  const stage5Opacity = Math.max(0, Math.min(1, (scrollProgress - 0.80) / 0.14));

  // If card is invisible, don't render to avoid any ghost interaction
  if (cardOpacity <= 0.001) return null;

  return (
    <div className="hidden md:flex absolute inset-0 pointer-events-none z-20 flex-col justify-start">
      {/* 
        LUXURY EDITORIAL PLAQUE: 
        Appears starting from Phase 03 (Table Assembly) through Phase 05 (Complete Masterpiece).
        Phase 01 & 02 remain 100% pure, immersive zero-gravity 3D viewing without any card obstruction.
      */}
      <div
        className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-8 md:px-14 w-full pointer-events-none transition-all duration-500"
        style={{
          opacity: cardOpacity,
          transform: `translateY(${(1 - cardOpacity) * -12}px)`,
        }}
      >
        <div className="pointer-events-auto w-full max-w-[360px] sm:max-w-[440px] md:max-w-[480px] bg-[#F3EFE7]/92 backdrop-blur-md p-5 sm:p-6 md:p-7 rounded-2xl border border-gold-muted/40 shadow-[0_12px_40px_rgba(41,32,25,0.08)] relative overflow-hidden transition-all duration-300">
          {/* Subtle champagne gold luxury corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-primary/10 to-transparent pointer-events-none rounded-tr-2xl" />

          {/* Fixed-height container to preserve smooth non-jumping cross-fades */}
          <div className="relative min-h-[220px] sm:min-h-[235px] flex flex-col justify-between">
            {/* STAGE 3: TABLE ASSEMBLY */}
            <div
              className="transition-all duration-300 pointer-events-none absolute inset-0 flex flex-col justify-between"
              style={{
                opacity: stage3Opacity,
                transform: `translateY(${(1 - stage3Opacity) * 10}px)`,
                pointerEvents: stage3Opacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface/90 border border-gold-primary/35 text-gold-primary text-[10px] sm:text-xs uppercase font-nav tracking-widest mb-3 shadow-2xs">
                  <span>Phase 03 · Table Architecture</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-primary font-normal leading-[1.12] tracking-tight mb-2 sm:mb-3">
                  Precision Milled. <span className="text-gold-primary italic font-serif">Hand Joined</span>.
                </h2>
                <p className="font-body text-xs sm:text-sm text-taupe font-light leading-relaxed">
                  Dual bookmatched European walnut slabs align seamlessly, secured with brushed champagne gold butterfly keys.
                </p>
              </div>

              <div className="pt-3 flex items-center space-x-2 text-[11px] uppercase font-nav tracking-widest text-gold-antique font-medium">
                <span className="text-taupe">Scroll to mount tabletop</span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-primary animate-bounce" />
              </div>
            </div>

            {/* STAGE 4: CHAIR ASSEMBLY */}
            <div
              className="transition-all duration-300 pointer-events-none absolute inset-0 flex flex-col justify-between"
              style={{
                opacity: stage4Opacity,
                transform: `translateY(${(1 - stage4Opacity) * 10}px)`,
                pointerEvents: stage4Opacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface/90 border border-gold-primary/35 text-gold-primary text-[10px] sm:text-xs uppercase font-nav tracking-widest mb-3 shadow-2xs">
                  <span>Phase 04 · Ergonomic Sculpting</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-primary font-normal leading-[1.12] tracking-tight mb-2 sm:mb-3">
                  Six Chairs in <span className="text-gold-primary italic font-serif">Sequence</span>.
                </h2>
                <p className="font-body text-xs sm:text-sm text-taupe font-light leading-relaxed">
                  Tapered walnut legs with brushed gold ferrules and plush memory-core seats in warm beige upholstery glide into position.
                </p>
              </div>

              <div className="pt-3 flex items-center space-x-2 text-[11px] uppercase font-nav tracking-widest text-gold-antique font-medium">
                <span className="text-taupe">Scroll to complete dining suite</span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-primary animate-bounce" />
              </div>
            </div>

            {/* STAGE 5: FINAL MASTERPIECE SETUP & CTAS */}
            <div
              className="transition-all duration-300 absolute inset-0 flex flex-col justify-between"
              style={{
                opacity: stage5Opacity,
                transform: `translateY(${(1 - stage5Opacity) * 10}px)`,
                pointerEvents: stage5Opacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-gold-primary/35 text-gold-primary text-[10px] sm:text-xs uppercase font-nav tracking-widest mb-2.5 sm:mb-3 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-gold-primary" />
                  <span>Phase 05 · Complete Masterpiece</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-primary font-normal leading-[1.12] tracking-tight mb-2 sm:mb-2.5">
                  The Italian <span className="text-gold-primary italic font-serif">Dining Salon</span>.
                </h2>
                <p className="font-body text-xs sm:text-sm text-taupe font-light leading-relaxed mb-3">
                  Symmetrical Calacatta Gold marble, dark walnut vitrines, geometric brass chandeliers, and six bespoke dining chairs in quiet harmony.
                </p>
              </div>

              <div>
                {/* CTA Buttons: Hover = Crisp White with Gold Accents */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={scrollToCollection}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-full font-nav text-xs tracking-widest uppercase hover:bg-white hover:text-primary hover:border hover:border-gold-primary transition-all duration-300 flex items-center space-x-2 group shadow-xs cursor-pointer font-medium"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <Link
                    href="/collection"
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-surface/90 text-primary border border-gold-muted/50 rounded-full font-nav text-xs tracking-widest uppercase hover:bg-white hover:text-primary hover:border-gold-primary transition-all duration-300 cursor-pointer font-medium"
                  >
                    Atelier Gallery
                  </Link>
                </div>

                <div className="mt-3 flex items-center space-x-2 text-[10px] sm:text-[11px] uppercase font-nav tracking-widest text-gold-antique font-medium">
                  <span>Scroll down to enter Collection</span>
                  <ChevronDown className="w-3 h-3 text-gold-primary animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
