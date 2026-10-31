'use client';

import React from 'react';
import { ShieldCheck, Sliders, Leaf, Award } from 'lucide-react';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: '25-Year Structural Integrity Warranty',
    description:
      'We construct our frames and mortise joinery to outlive standard lifetimes. Any mechanical structural failure within a quarter-century is restored without fee by our master conservators.',
  },
  {
    icon: Sliders,
    title: 'Bespoke Architectural Customization',
    description:
      'Every dining table, credenza, and chair silhouette can be proportioned to your specific salon dimensions, wood species, and leather grades upon consultation with our design studio.',
  },
  {
    icon: Leaf,
    title: 'Carbon-Negative Forest Stewardship',
    description:
      'Our Italian and Nordic forestry cooperative plants five endemic hardwood saplings for every mature tree harvested. Our ateliers run on 100% solar and hydroelectric power.',
  },
  {
    icon: Award,
    title: 'White-Glove Private Residence Placement',
    description:
      'Delivered in climate-controlled transport by our internal concierge team. We assemble, align, micro-level, and condition every piece in your salon before removing all sustainable crating.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 md:py-36 bg-surface text-primary border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-nav text-xs uppercase tracking-ultra text-secondary block mb-3">
            The Atelier Standard
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-normal leading-tight">
            Why Discerning Architects & Collectors Choose Kasama.
          </h2>
        </div>

        {/* PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-luxury-cream/40 border border-luxury-border flex flex-col justify-between hover:border-secondary/60 hover:bg-luxury-cream transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-luxury-border/60 flex items-center justify-center text-secondary mb-6 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-normal text-primary mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-primary/70 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-luxury-border/50 font-nav text-[10px] text-secondary uppercase tracking-widest">
                  Pillar 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
