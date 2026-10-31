'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Compass, Hammer, Trees, Sparkles, ArrowRight } from 'lucide-react';

const CRAFT_STEPS = [
  {
    step: '01',
    title: 'Regenerative Timber Provenance',
    subtitle: '18-Month Open-Air Seasoning & Solar Kiln Drying',
    description:
      'Every log of European Canaletto walnut and Alpine white oak is hand-inspected in sustainable forest tracts across Northern Italy and Scandinavia. Timber rests under natural atmospheric cycles before vacuum solar kiln drying to a stable 7% equilibrium moisture content.',
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    stat: '100%',
    statLabel: 'FSC Certified Alpine Harvest',
  },
  {
    step: '02',
    title: 'Architectural Geometric Milling',
    subtitle: 'Precision Chamfering Meets Hand-Drawn Planes',
    description:
      'Using custom micro-toleranced cutters, we establish the subtle 12-degree undercut bevels that give our tabletops their visual floating weightlessness. Surfaces are subsequent scraped with traditional Japanese Kanna hand-planes to retain natural fiber pores without sanding dust closure.',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80',
    stat: '0.05 mm',
    statLabel: 'Seam Joinery Tolerance',
  },
  {
    step: '03',
    title: 'Dovetail & Butterfly Brass Keys',
    subtitle: 'Mechanical Integrity Engineered Without Nails',
    description:
      'We stabilize natural timber tension splits using machined unlacquered brass butterfly keys. The table undercarriage couples with mortise-and-tenon drawbore pins that cinch tighter over decades as wood breathes through seasonal humidity transitions.',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    stat: '25 Years',
    statLabel: 'Heirloom Structural Warranty',
  },
  {
    step: '04',
    title: 'Organic Botanical Hand Polishing',
    subtitle: 'Seven Coats of Tung & Carnauba Botanical Wax-Oils',
    description:
      'No synthetic plastics or polyurethane lacquers touch our wood. Master finishers hand-rub seven sequential saturations of cold-pressed Swedish flax oil, Brazilian carnauba wax, and citrus solvent. The result is a tactile, breathable satin finish that develops a richer patina with each passing generation.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80',
    stat: '7 Coats',
    statLabel: 'Hand-Rubbed Organic Oil',
  },
];

export function CraftsmanshipSection() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = CRAFT_STEPS[activeStepIdx];

  return (
    <section id="craftsmanship" className="py-24 md:py-36 bg-surface text-primary border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-20">
          <span className="font-nav text-xs uppercase tracking-ultra text-secondary block mb-3">
            The Master Atelier
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-normal leading-tight">
            Craftsmanship as an Uncompromising Discipline.
          </h2>
          <p className="font-body text-base md:text-lg text-primary/70 font-light mt-6 leading-relaxed">
            In our Milanese and Scandinavian workshops, time is treated as a raw material.
            We honor centuries of joinery traditions while deploying aerospace-grade tolerances.
          </p>
        </div>

        {/* INTERACTIVE WORKFLOW DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* STEP SELECTOR LIST (LEFT) */}
          <div className="lg:col-span-5 space-y-4">
            {CRAFT_STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStepIdx === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start space-x-5 ${
                    isActive
                      ? 'bg-luxury-cream/80 border-secondary shadow-xs'
                      : 'bg-surface border-luxury-border/60 hover:border-luxury-border hover:bg-luxury-cream/30'
                  }`}
                >
                  <span
                    className={`font-nav text-sm font-semibold tracking-wider pt-0.5 ${
                      isActive ? 'text-secondary' : 'text-luxury-muted'
                    }`}
                  >
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-normal text-primary">
                      {s.title}
                    </h3>
                    <p className="font-nav text-xs text-luxury-muted uppercase tracking-wider mt-1">
                      {s.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                      isActive
                        ? 'bg-primary text-surface scale-110'
                        : 'bg-luxury-cream text-primary/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE STEP SPOTLIGHT (RIGHT) */}
          <div className="lg:col-span-7 bg-luxury-cream/60 rounded-3xl p-8 md:p-12 border border-luxury-border flex flex-col justify-between">
            <div className="relative w-full h-64 sm:h-80 md:h-[360px] rounded-2xl overflow-hidden shadow-md mb-8">
              <Image
                src={activeStep.image}
                alt={activeStep.title}
                fill
                unoptimized={true}
                className="object-cover transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 650px"
              />
              <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-surface/90 backdrop-blur-md font-nav text-xs uppercase tracking-widest text-primary border border-luxury-border/60">
                Phase {activeStep.step} of 04
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-heading text-4xl text-secondary font-normal">
                  {activeStep.stat}
                </span>
                <span className="font-nav text-xs uppercase tracking-widest text-luxury-muted border-l border-luxury-border pl-4">
                  {activeStep.statLabel}
                </span>
              </div>

              <p className="font-body text-base text-primary/80 leading-relaxed font-light">
                {activeStep.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
