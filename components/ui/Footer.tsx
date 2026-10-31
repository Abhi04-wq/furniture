'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-surface/90 pt-24 pb-12 border-t border-luxury-border/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">
        {/* TOP ROW: BRAND & SHOWROOMS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-surface/10">
          <div className="md:col-span-5 space-y-6">
            <span className="font-heading text-3xl md:text-4xl font-normal tracking-wider block text-surface">
              ATELIER KASAMA
            </span>
            <p className="font-body text-sm text-surface/70 font-light leading-relaxed max-w-sm">
              Conceived in Mumbai and New Delhi. Sculpting solid European & Indian hardwoods,
              hand-patinated unlacquered brass, and bespoke Italian upholstery into
              living architectural heirlooms.
            </p>
            <div className="font-nav text-xs uppercase tracking-widest text-secondary">
              Heirloom Certified · Studio Est. 1994
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            {/* Showroom 1 */}
            <div className="space-y-2">
              <span className="font-nav uppercase tracking-widest text-secondary block font-semibold">
                Mumbai
              </span>
              <p className="text-surface/60 font-body leading-relaxed">
                Apollo Bunder, Colaba<br />
                Mumbai, MH 400001<br />
                +91 22 2288 4100
              </p>
            </div>

            {/* Showroom 2 */}
            <div className="space-y-2">
              <span className="font-nav uppercase tracking-widest text-secondary block font-semibold">
                New Delhi
              </span>
              <p className="text-surface/60 font-body leading-relaxed">
                The Chanakya, Chanakyapuri<br />
                New Delhi, DL 110021<br />
                +91 11 4100 8200
              </p>
            </div>

            {/* Showroom 3 */}
            <div className="space-y-2">
              <span className="font-nav uppercase tracking-widest text-secondary block font-semibold">
                Bengaluru
              </span>
              <p className="text-surface/60 font-body leading-relaxed">
                Lavelle Road, Ashok Nagar<br />
                Bengaluru, KA 560001<br />
                +91 80 4120 7300
              </p>
            </div>

            {/* Showroom 4 */}
            <div className="space-y-2">
              <span className="font-nav uppercase tracking-widest text-secondary block font-semibold">
                Kolkata
              </span>
              <p className="text-surface/60 font-body leading-relaxed">
                Alipore Park Road<br />
                Kolkata, WB 700027<br />
                +91 33 2479 6500
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE SITEMAP NAVIGATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-nav">
          <div className="space-y-3">
            <span className="uppercase tracking-widest text-secondary block font-semibold">
              Permanent Works
            </span>
            <ul className="space-y-2 text-surface/70">
              <li><a href="#featured-collection" className="hover:text-surface transition-colors">The Arcos Dining Suite</a></li>
              <li><a href="#featured-collection" className="hover:text-surface transition-colors">The Kanso Dining Chairs</a></li>
              <li><a href="#featured-collection" className="hover:text-surface transition-colors">The Elysian Fluted Credenza</a></li>
              <li><a href="#featured-collection" className="hover:text-surface transition-colors">The Nuvola Sculptural Lounges</a></li>
              <li><a href="#featured-collection" className="hover:text-surface transition-colors">The Solis Pedestal Table</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="uppercase tracking-widest text-secondary block font-semibold">
              The Discipline
            </span>
            <ul className="space-y-2 text-surface/70">
              <li><a href="#craftsmanship" className="hover:text-surface transition-colors">Master Joinery Traditions</a></li>
              <li><a href="#materials" className="hover:text-surface transition-colors">European Walnut Provenance</a></li>
              <li><a href="#materials" className="hover:text-surface transition-colors">Tuscan Vegetable Tannage</a></li>
              <li><a href="#materials" className="hover:text-surface transition-colors">Unlacquered Living Brass</a></li>
              <li><a href="#craftsmanship" className="hover:text-surface transition-colors">7-Coat Organic Hardwax Oils</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="uppercase tracking-widest text-secondary block font-semibold">
              Architectural Services
            </span>
            <ul className="space-y-2 text-surface/70">
              <li><a href="#inquiry" className="hover:text-surface transition-colors">Private Salon Commissions</a></li>
              <li><a href="#inquiry" className="hover:text-surface transition-colors">Custom CAD / BIM 3D Library</a></li>
              <li><a href="#inquiry" className="hover:text-surface transition-colors">Hospitality & Yacht Fitouts</a></li>
              <li><a href="#inquiry" className="hover:text-surface transition-colors">White-Glove Worldwide Delivery</a></li>
              <li><a href="#inquiry" className="hover:text-surface transition-colors">25-Year Conservator Program</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="uppercase tracking-widest text-secondary block font-semibold">
              Client Privilege
            </span>
            <ul className="space-y-2 text-surface/70">
              <li><a href="#inquiry" className="hover:text-surface transition-colors">Request Material Swatch Folio</a></li>
              <li><a href="#inquiry" className="hover:text-surface transition-colors">Private Salon Appointment</a></li>
              <li><a href="#" className="hover:text-surface transition-colors">Provenance Authentication</a></li>
              <li><a href="#" className="hover:text-surface transition-colors">Sustainability & Forestry Charter</a></li>
              <li><a href="#" className="hover:text-surface transition-colors">Privacy & Data Governance</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM LEGAL & SCROLL TO TOP */}
        <div className="pt-8 border-t border-surface/10 flex flex-col sm:flex-row items-center justify-between text-xs font-nav text-surface/50 gap-4">
          <p>© 2026 Atelier Kasama Pvt. Ltd. All rights reserved. Registered in Mumbai & New Delhi.</p>

          <div className="flex items-center space-x-6">
            <span>Crafted to Come Together.</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-surface/10 hover:bg-surface/20 text-surface transition-colors flex items-center justify-center"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
