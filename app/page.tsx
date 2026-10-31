'use client';

import React from 'react';
import { useLenis } from '@/components/hooks/useLenis';
import { Navbar } from '@/components/ui/Navbar';
import { FurnitureHero } from '@/components/3d/FurnitureHero';
import { FeaturedCollection } from '@/components/ui/FeaturedCollection';
import { CraftsmanshipSection } from '@/components/ui/CraftsmanshipSection';
import { PremiumMaterials } from '@/components/ui/PremiumMaterials';
import { WhyChooseUs } from '@/components/ui/WhyChooseUs';
import { InteriorProjects } from '@/components/ui/InteriorProjects';
import { TestimonialsSection } from '@/components/ui/TestimonialsSection';
import { InquirySection } from '@/components/ui/InquirySection';
import { NewsletterSection } from '@/components/ui/NewsletterSection';
import { Footer } from '@/components/ui/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { QuickViewModal } from '@/components/ui/QuickViewModal';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

export default function Home() {
  // Initialize Lenis smooth scroll coordinated with GSAP ScrollTrigger
  useLenis();

  return (
    <main className="relative min-h-screen bg-background">
      {/* AMBIENT SOUND GENERATOR */}
      <AudioPlayer />

      {/* LUXURY MINIMAL NAVBAR */}
      <Navbar />

      {/* FULL-SCREEN SCROLL-DRIVEN 3D FURNITURE ASSEMBLY HERO SECTION */}
      <FurnitureHero />

      {/* FEATURED FURNITURE COLLECTION */}
      <FeaturedCollection />

      {/* OUR CRAFTSMANSHIP & ATELIER METHODOLOGY */}
      <CraftsmanshipSection />

      {/* NOBLE MATERIALS LAB */}
      <PremiumMaterials />

      {/* WHY DISCERNING COLLECTORS CHOOSE KASAMA */}
      <WhyChooseUs />

      {/* FEATURED ARCHITECTURAL INTERIOR PROJECTS */}
      <InteriorProjects />

      {/* EDITORIAL PRAISE & REVIEWS */}
      <TestimonialsSection />

      {/* PRIVATE COMMISSION & CONSULTATION FORM */}
      <InquirySection />

      {/* THE PRIVATE GAZETTE (NEWSLETTER) */}
      <NewsletterSection />

      {/* MASTER FOOTER */}
      <Footer />

      {/* INTERACTIVE MODALS & DRAWERS */}
      <CartDrawer />
      <QuickViewModal />
    </main>
  );
}
