'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Malabar Hill Sky Villa',
    location: 'Mumbai, Maharashtra',
    architect: 'Studio Mumbai Associates',
    pieces: 'Arcos Dining Setup & Kanso Chairs in Saddle Leather',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
  },
  {
    title: 'Chanakyapuri Heritage Estate',
    location: 'New Delhi, Delhi',
    architect: 'Khanna & Partners Architecture',
    pieces: 'Custom 3.2m Arcos Table & Elysian Credenza',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    year: '2026',
  },
  {
    title: 'Sadashivanagar Contemporary Residence',
    location: 'Bengaluru, Karnataka',
    architect: 'Reddy Architectural Lab',
    pieces: 'Solis Pedestal Table & Nuvola Sculptural Lounges',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
  },
  {
    title: 'Alipore Garden Villa',
    location: 'Kolkata, West Bengal',
    architect: 'Bose & Sen Atelier',
    pieces: 'Arcos Trestle Suite & Vesper Floor Lamps',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    year: '2026',
  },
];

export function InteriorProjects() {
  return (
    <section id="interior-projects" className="py-24 md:py-36 bg-background border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-nav text-xs uppercase tracking-ultra text-secondary block mb-3">
              Architectural Context
            </span>
            <h2 className="font-heading text-4xl md:text-6xl text-primary font-normal leading-tight">
              Spaces Transformed by Kasama.
            </h2>
          </div>
          <p className="font-body text-base text-primary/70 max-w-md font-light">
            Our pieces anchor private villas, contemporary pavilions, and luxury
            residences across five continents in quiet architectural communion.
          </p>
        </div>

        {/* PROJECTS SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((proj, idx) => (
            <div
              key={idx}
              className="group relative bg-surface rounded-3xl overflow-hidden border border-luxury-border shadow-xs hover:shadow-xl transition-all duration-500"
            >
              <div className="relative w-full h-64 sm:h-80 md:h-[340px] overflow-hidden bg-luxury-cream">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  unoptimized={true}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-surface/90 backdrop-blur-md font-nav text-xs uppercase tracking-widest text-primary border border-luxury-border/60">
                  {proj.location} · {proj.year}
                </div>
              </div>

              <div className="p-8 flex items-start justify-between">
                <div>
                  <span className="font-nav text-[10px] uppercase tracking-widest text-secondary block mb-1">
                    {proj.architect}
                  </span>
                  <h3 className="font-heading text-2xl text-primary font-normal group-hover:text-secondary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="font-body text-xs text-primary/60 mt-2">
                    Installation: {proj.pieces}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full border border-luxury-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface group-hover:border-primary transition-all flex-shrink-0 ml-4">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
