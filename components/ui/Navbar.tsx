'use client';

import React, { useState, useEffect } from 'react';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { ShoppingBag, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const isHeroPast = useFurnitureStore((state) => state.isHeroPast);
  const cartItems = useFurnitureStore((state) => state.cartItems);
  const openCart = useFurnitureStore((state) => state.openCart);

  // Monitor real window scroll position relative to the hero section.
  // Navbar is 100% transparent during the entire Hero section (Stages 1 through 5).
  // Only when the user leaves/finishes the hero section (scrolling down to the collection),
  // or on pages without hero (like /collection), does the navbar turn solid white/ivory.
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero-pinned-track');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // When user has scrolled past the pinned hero track, rect.bottom <= 80
        setScrolledPastHero(rect.bottom <= 80);
      } else {
        // Not on the 3D hero page (e.g. /collection) -> always solid white
        setScrolledPastHero(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHeroEnded = isHeroPast || scrolledPastHero;
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'Collection', href: '/#featured-collection' },
    { label: 'Craftsmanship', href: '/#craftsmanship' },
    { label: 'Materials', href: '/#materials' },
    { label: 'Projects', href: '/#interior-projects' },
    { label: 'Consultation', href: '/#inquiry' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const heroTrack = document.getElementById('hero-pinned-track');
        if (heroTrack && id === 'featured-collection') {
          const rect = heroTrack.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.bottom + 10, behavior: 'smooth' });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex flex-col items-center px-4 sm:px-6 md:px-8 pointer-events-none transition-all duration-500 ease-out">
      <div
        className={`w-full max-w-7xl pointer-events-auto rounded-full transition-all duration-500 ease-out flex items-center justify-between px-5 sm:px-7 md:px-9 py-2.5 sm:py-3.5 ${
          isHeroEnded
            ? 'bg-[#F7F4EE]/55 backdrop-blur-2xl border border-gold-primary/35 shadow-[0_12px_40px_rgba(41,32,25,0.12),inset_0_1px_2px_rgba(255,255,255,0.7)]'
            : 'bg-white/20 backdrop-blur-2xl border border-white/45 shadow-[0_8px_32px_rgba(41,32,25,0.08),inset_0_1px_2px_rgba(255,255,255,0.75)]'
        }`}
      >
        {/* BRAND LOGO */}
        <a
          href="/"
          className="group flex flex-col items-start focus:outline-none"
        >
          <span className="font-heading text-lg sm:text-xl md:text-2xl font-medium tracking-[0.08em] text-[#5C3E14] group-hover:text-[#8C5E1E] transition-colors duration-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            ATELIER KASAMA
          </span>
          <span className="font-nav text-[8px] sm:text-[9px] tracking-ultra text-[#75501B] uppercase font-bold group-hover:text-[#9E712B] transition-colors duration-300">
            Mumbai · New Delhi · Bengaluru
          </span>
        </a>

        {/* DESKTOP NAV LINKS WITH EXPANDING GOLD UNDERLINE */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative group py-1 font-nav text-xs uppercase tracking-widest text-[#5C3E14] hover:text-[#8C5E1E] font-bold transition-colors duration-300"
            >
              <span className="text-[#5C3E14] group-hover:text-[#8C5E1E] transition-colors duration-300">
                {link.label}
              </span>
              {/* Expanding Rich Gold Underline */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#8C5E1E] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* RIGHT CONTROLS: SHOPPING BAG */}
        <div className="flex items-center space-x-3">
          {/* Shopping Bag Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-primary text-[#E8C888] border border-[#8C6328]/60 hover:bg-[#8C6328] hover:text-white transition-all duration-300 cursor-pointer shadow-xs group"
            title="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8C5E1E] text-white text-[10px] font-nav font-bold flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full border border-[#8C6328]/50 bg-white/40 backdrop-blur-xs text-[#5C3E14] transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#5C3E14]" /> : <Menu className="w-5 h-5 text-[#5C3E14]" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN (Floating Glass Card) */}
      {mobileMenuOpen && (
        <div className="w-full max-w-7xl mt-2.5 pointer-events-auto md:hidden bg-[#F3EFE7]/80 backdrop-blur-2xl border border-white/45 rounded-3xl px-8 py-6 space-y-4 animate-fade-in shadow-[0_16px_40px_rgba(41,32,25,0.14),inset_0_1px_2px_rgba(255,255,255,0.6)]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-nav text-sm uppercase tracking-widest text-[#5C3E14] py-2 hover:text-[#8C5E1E] font-bold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
