'use client';

import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { FeaturedCollection } from '@/components/ui/FeaturedCollection';
import { QuickViewModal } from '@/components/ui/QuickViewModal';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { Footer } from '@/components/ui/Footer';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Shield, Truck, Compass } from 'lucide-react';

export default function CollectionPage() {
  return (
    <main className="relative min-h-screen bg-background text-primary">
      {/* LUXURY NAVBAR */}
      <Navbar />

      {/* QUICK VIEW MODAL WITH "FROM THE SAME COLLECTION" SUITE BROWSER */}
      <QuickViewModal />

      {/* SHOPPING BAG DRAWER */}
      <CartDrawer />

      {/* PAGE HEADER HERO */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-surface/60 border-b border-luxury-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs font-nav uppercase tracking-widest text-luxury-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center space-x-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>3D Atelier</span>
            </Link>
            <span>/</span>
            <span className="text-secondary font-medium">Permanent Collection 2026</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface border border-secondary/30 text-secondary text-[11px] uppercase font-nav tracking-widest mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Bespoke Hardwoods · Italian Upholstery · Architectural Joinery</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-primary font-normal leading-[1.08] tracking-tight">
                The Permanent Collection.
              </h1>
              <p className="font-body text-base sm:text-lg text-primary/75 mt-4 max-w-2xl font-light leading-relaxed">
                Sculptural furniture engineered for timeless architectural spaces. Explore our complete gallery of dining tables, luxury upholstered chairs, low-slung modular sofas, credenzas, and museum-grade lighting.
              </p>

              <div className="mt-6 flex items-center space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#5C3E14] text-white hover:bg-[#8C5E1E] transition-all duration-300 text-xs font-nav uppercase tracking-wider font-semibold shadow-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to 3D Hero Assembly</span>
                </Link>
              </div>
            </div>

            {/* Atelier Guarantees Pill */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface p-4 rounded-2xl border border-luxury-border shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-nav text-primary">
                <Shield className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>25-Year Structural Warranty</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-luxury-border" />
              <div className="flex items-center space-x-2 text-xs font-nav text-primary">
                <Truck className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>White-Glove Insured Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN COLLECTION GRID WITH 3D TILT CARDS & FILTERS */}
      <FeaturedCollection />

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
