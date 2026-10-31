'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Layers, Shield, Droplets } from 'lucide-react';

const MATERIALS = [
  {
    id: 'walnut',
    name: 'Canaletto Walnut',
    origin: 'Piedmont, Northern Italy',
    family: 'Juglans regia',
    description:
      'Celebrated for its deep chocolate heartwood, gentle caramel sapwood marbling, and interlocking grain. Naturally dense with superior structural elasticity and shock absorption.',
    properties: [
      { label: 'Density', value: '660 kg/m³' },
      { label: 'Hardness', value: '1,010 lbf (Janka)' },
      { label: 'Finish', value: 'Breathable Botanical Wax-Oil' },
      { label: 'Sustainability', value: 'PEFC & FSC Certified 100%' },
    ],
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80',
    colorHex: '#3D2B1F',
  },
  {
    id: 'brass',
    name: 'Brushed Solid Brass',
    origin: 'Lombardy, Italy',
    family: 'CuZn39Pb3 Alloy',
    description:
      'Machined from extruded solid billets rather than stamped zinc. Left unlacquered to develop a deep, personalized amber patina through years of touch and atmospheric interaction.',
    properties: [
      { label: 'Composition', value: '62% Copper / 38% Zinc' },
      { label: 'Tensile Strength', value: '440 MPa' },
      { label: 'Patina Profile', value: 'Living Unlacquered Oxidation' },
      { label: 'Recyclability', value: 'Infinite 100% Circular' },
    ],
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    colorHex: '#C5A059',
  },
  {
    id: 'leather',
    name: 'Tuscan Saddle Hide',
    origin: 'San Miniato, Tuscany',
    family: 'Vegetable-Tanned Cowhide',
    description:
      'Tanned over 60 days in wooden drums using chestnut and mimosa bark extracts. Retains all natural pore markings and grain pebbling, aging into a buttery, lustrous leather patina.',
    properties: [
      { label: 'Thickness', value: '2.8 mm - 3.2 mm' },
      { label: 'Tannage', value: '100% Organic Tree Bark' },
      { label: 'Tear Resistance', value: '180 N/mm' },
      { label: 'Biodegradable', value: 'Completely Compostable' },
    ],
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    colorHex: '#4A3528',
  },
  {
    id: 'marble',
    name: 'Calacatta Viola Marble',
    origin: 'Apuan Alps, Carrara, Italy',
    family: 'Metamorphic Breccia Limestone',
    description:
      'Characterized by vivid cabernet-violet veining blooming across a milky calcite field. Each slab is custom cut, hand-honed to a tactile matte satin finish, and treated with non-toxic oleophobic mineral sealer.',
    properties: [
      { label: 'Specific Gravity', value: '2.71 g/cm³' },
      { label: 'Water Absorption', value: '0.14%' },
      { label: 'Surface Profile', value: 'Honed Velvet Satin' },
      { label: 'Extraction', value: 'Zero-Dynamite Diamond Wire' },
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    colorHex: '#EAE6E1',
  },
];

export function PremiumMaterials() {
  const [selectedMat, setSelectedMat] = useState(MATERIALS[0]);

  return (
    <section id="materials" className="py-24 md:py-36 bg-background border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-nav text-xs uppercase tracking-ultra text-secondary block mb-3">
              Noble Mediums
            </span>
            <h2 className="font-heading text-4xl md:text-6xl text-primary font-normal leading-tight">
              Materials of Enduring Character.
            </h2>
          </div>
          <p className="font-body text-base text-primary/70 max-w-md font-light">
            We reject synthetic substitutes. Every timber slab, bronze dowel, and
            hide is chosen for its organic longevity and tactile warmth.
          </p>
        </div>

        {/* MATERIAL CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {MATERIALS.map((mat) => {
            const isSelected = selectedMat.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setSelectedMat(mat)}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-40 ${
                  isSelected
                    ? 'bg-surface border-secondary shadow-md ring-1 ring-secondary/30'
                    : 'bg-surface/70 border-luxury-border/60 hover:border-luxury-border hover:bg-surface'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className="w-5 h-5 rounded-full border border-luxury-border/80 shadow-xs"
                    style={{ backgroundColor: mat.colorHex }}
                  />
                  {isSelected && (
                    <span className="font-nav text-[10px] uppercase tracking-widest text-secondary font-medium">
                      Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading text-lg font-normal text-primary">
                    {mat.name}
                  </h3>
                  <p className="font-nav text-[10px] uppercase tracking-wider text-luxury-muted mt-0.5">
                    {mat.origin}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE MATERIAL DEEP DIVE */}
        <div className="bg-surface rounded-3xl p-8 md:p-14 border border-luxury-border grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xs">
          <div className="lg:col-span-6 relative w-full h-72 sm:h-80 md:h-[380px] rounded-2xl overflow-hidden bg-luxury-cream shadow-md">
            <Image
              src={selectedMat.image}
              alt={selectedMat.name}
              fill
              unoptimized={true}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-luxury-border/60 flex justify-between items-center text-xs font-nav text-primary">
              <span className="uppercase tracking-widest text-secondary">
                Provenance:
              </span>
              <span>{selectedMat.origin}</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-nav text-xs uppercase tracking-widest text-secondary block mb-1">
                {selectedMat.family}
              </span>
              <h3 className="font-heading text-3xl md:text-4xl text-primary font-normal">
                {selectedMat.name}
              </h3>
            </div>

            <p className="font-body text-base text-primary/75 leading-relaxed font-light">
              {selectedMat.description}
            </p>

            {/* Technical Properties Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-luxury-border/60">
              {selectedMat.properties.map((prop, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-luxury-cream/50 border border-luxury-border/50">
                  <span className="font-nav text-[10px] uppercase tracking-widest text-luxury-muted block">
                    {prop.label}
                  </span>
                  <span className="font-heading text-sm text-primary font-medium mt-1 block">
                    {prop.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
