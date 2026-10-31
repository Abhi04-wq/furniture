'use client';

import React, { useState, useEffect } from 'react';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { ShoppingBag, Volume2, VolumeX, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const isHeroPast = useFurnitureStore((state) => state.isHeroPast);
  const soundEnabled = useFurnitureStore((state) => state.soundEnabled);
  const toggleSound = useFurnitureStore((state) => state.toggleSound);
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
    { label: 'Collection', href: '/collection' },
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        isHeroEnded
          ? 'bg-surface/95 backdrop-blur-md py-4 border-b border-gold-muted/30 shadow-xs'
          : 'bg-transparent py-5 md:py-6 border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* BRAND LOGO */}
        <a
          href="/"
          className="group flex flex-col items-start focus:outline-none"
        >
          <span className="font-heading text-xl md:text-2xl font-normal tracking-wider text-primary group-hover:text-gold-primary transition-colors duration-300">
            ATELIER KASAMA
          </span>
          <span className="font-nav text-[9px] tracking-ultra text-taupe uppercase group-hover:text-gold-antique transition-colors duration-300">
            Milan · Stockholm · Tokyo
          </span>
        </a>

        {/* DESKTOP NAV LINKS WITH EXPANDING GOLD UNDERLINE */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative group py-1 font-nav text-xs uppercase tracking-widest text-primary/85 hover:text-gold-primary transition-colors duration-300"
            >
              <span>{link.label}</span>
              {/* Expanding Champagne Gold Underline */}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* RIGHT CONTROLS: AUDIO & SHOPPING BAG */}
        <div className="flex items-center space-x-3.5">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              isHeroEnded
                ? 'border border-gold-muted/40 text-primary hover:border-gold-primary hover:bg-gold-pale/20'
                : 'border border-gold-muted/40 bg-surface/70 backdrop-blur-xs text-primary hover:border-gold-primary hover:bg-surface'
            }`}
            title={soundEnabled ? 'Mute ambient sound' : 'Enable ambient atelier sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-gold-primary animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-taupe hover:text-gold-primary transition-colors" />
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-primary text-white hover:bg-white hover:text-primary hover:border hover:border-gold-primary transition-all duration-300 cursor-pointer shadow-xs group"
            title="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-primary text-primary text-[10px] font-nav font-bold flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-full transition-all cursor-pointer ${
              isHeroEnded
                ? 'border border-gold-muted/40 text-primary'
                : 'border border-gold-muted/40 bg-surface/70 backdrop-blur-xs text-primary'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/98 backdrop-blur-xl border-b border-gold-muted/30 px-8 py-6 space-y-4 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-nav text-sm uppercase tracking-widest text-primary py-2 hover:text-gold-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
