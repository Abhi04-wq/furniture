'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    quote:
      'Kasama has quietly redefined modern heirloom furniture. The Arcos dining suite balances structural audacity with tactile tenderness, proving that true luxury whispers.',
    publication: 'Architectural Digest',
    issue: 'The Collectors Edition',
    stars: 5,
  },
  {
    quote:
      'Winner: Best Dining Collection. The seamless joinery between bookmatched European walnut and unlacquered brass butterfly keys achieves near aerospace precision.',
    publication: 'Wallpaper* Design Awards',
    issue: 'Annual Design Review',
    stars: 5,
  },
  {
    quote:
      'A masterclass in sculptural restraint. Where modern fast-furniture relies on veneer illusions, Kasama honors solid timber grain continuity that grows richer with every passing year.',
    publication: 'Architectural Digest India',
    issue: 'Design Excellence Special',
    stars: 5,
  },
  {
    quote:
      'The tactile organic wax-oil finish is addictive to the touch. Our guests invariably pause to run their palms across the chamfered undercut before even sitting down.',
    publication: 'Vikram & Radhika M.',
    issue: 'Private Estate Collectors, Malabar Hill, Mumbai',
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-36 bg-surface text-primary border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-nav text-xs uppercase tracking-ultra text-secondary block mb-3">
            Critical Reception
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-normal leading-tight">
            Celebrated by Design Critics & Discerning Collectors.
          </h2>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 md:p-12 rounded-3xl bg-luxury-cream/50 border border-luxury-border flex flex-col justify-between hover:bg-luxury-cream/80 transition-colors"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Quote className="w-8 h-8 text-secondary/40" />
                  <div className="flex space-x-1 text-amber-500">
                    {Array.from({ length: rev.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="font-heading text-xl md:text-2xl text-primary font-normal leading-relaxed italic">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-luxury-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-nav text-sm font-semibold tracking-wide text-primary">
                  {rev.publication}
                </span>
                <span className="font-nav text-xs text-luxury-muted uppercase tracking-wider">
                  {rev.issue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
