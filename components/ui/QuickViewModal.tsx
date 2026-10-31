'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useFurnitureStore, Product } from '../hooks/useFurnitureStore';
import { initialProducts } from '@/server/seedData.js';
import {
  X,
  Check,
  Star,
  Ruler,
  Sparkles,
  Shield,
  ShoppingBag,
  ArrowRight,
  Layers,
  Truck,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export function QuickViewModal() {
  const quickViewProduct = useFurnitureStore((state) => state.quickViewProduct);
  const setQuickViewProduct = useFurnitureStore((state) => state.setQuickViewProduct);
  const addToCart = useFurnitureStore((state) => state.addToCart);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIdx(0);
      setQuantity(1);
      setSelectedColor(quickViewProduct.colors?.[0]?.name || '');
      setAddedToast(false);
      setIsZoomed(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const images = quickViewProduct.gallery || [quickViewProduct.image];
  const activeImage = images[activeImageIdx] || quickViewProduct.image;

  // Find related pieces from the same collection
  const sameCollectionProducts = initialProducts.filter(
    (p) =>
      p.id !== quickViewProduct.id &&
      ((quickViewProduct.collectionSlug && p.collectionSlug === quickViewProduct.collectionSlug) ||
        (quickViewProduct.collection && p.collection === quickViewProduct.collection))
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(quickViewProduct);
    }
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2200);
  };

  const installmentPrice = Math.round(quickViewProduct.price / 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="absolute inset-0 bg-primary/75 backdrop-blur-md transition-opacity"
      />

      {/* FULLSCREEN ZOOM MODAL OVERLAY (if user toggles zoom on image) */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-fade-in cursor-zoom-out"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-20 cursor-pointer"
            title="Close zoom"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={activeImage}
              alt={quickViewProduct.name}
              fill
              unoptimized={true}
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Modal Box */}
      <div className="relative w-full max-w-6xl bg-surface rounded-3xl overflow-hidden shadow-2xl border border-gold-muted/40 flex flex-col md:flex-row max-h-[92vh] z-10">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-surface/90 hover:bg-[#F3EFE7] text-primary transition-all border border-gold-muted/40 shadow-sm cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: LARGE IMAGE SHOWCASE & GALLERY */}
        <div
          data-lenis-prevent
          className="w-full md:w-1/2 bg-[#F3EFE7]/50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gold-muted/30 overflow-y-auto"
        >
          <div>
            {/* LARGE HERO IMAGE: Prominent, high-res presentation */}
            <div className="relative w-full h-80 sm:h-96 md:h-[440px] rounded-2xl overflow-hidden bg-surface shadow-md border border-gold-muted/40 group/img">
              <Image
                src={activeImage}
                alt={quickViewProduct.name}
                fill
                unoptimized={true}
                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
              />

              {/* Badge Overlay */}
              {quickViewProduct.badge && (
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-primary text-ivory font-nav text-[10px] uppercase tracking-widest font-medium shadow-sm border border-gold-primary/30">
                    {quickViewProduct.badge}
                  </span>
                </div>
              )}

              {/* Zoom In Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(true);
                }}
                className="absolute bottom-3.5 right-3.5 p-2 rounded-xl bg-surface/90 backdrop-blur-md text-primary hover:text-gold-primary hover:bg-surface border border-gold-muted/40 shadow-sm transition-all cursor-pointer opacity-90 group-hover/img:opacity-100 flex items-center space-x-1.5 text-xs font-nav"
                title="Expand image to large view"
              >
                <Maximize2 className="w-3.5 h-3.5 text-gold-primary" />
                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Enlarge</span>
              </button>
            </div>

            {/* Gallery Thumbnails with Champagne Gold highlight */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                      activeImageIdx === idx
                        ? 'border-gold-primary scale-105 shadow-md ring-2 ring-gold-primary/30'
                        : 'border-transparent opacity-65 hover:opacity-100 hover:border-gold-muted/40'
                    }`}
                  >
                    <Image src={img} alt="thumbnail" fill unoptimized={true} className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Narrative Story */}
            <div className="mt-6 p-4 rounded-2xl bg-surface/90 border border-gold-muted/30 text-xs text-taupe font-body leading-relaxed">
              <span className="text-[10px] font-nav uppercase tracking-widest text-gold-primary block mb-1 font-semibold">
                Atelier Narrative
              </span>
              {quickViewProduct.story}
            </div>
          </div>

          {/* Guarantees & Shipping Badges */}
          <div className="mt-6 pt-5 border-t border-gold-muted/30 grid grid-cols-2 gap-3 text-[11px] text-taupe">
            <div className="flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-gold-primary flex-shrink-0" />
              <span>25-Yr Structural Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-3.5 h-3.5 text-gold-primary flex-shrink-0" />
              <span>White-Glove Insured Delivery</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ECOMMERCE DETAILS, SAME COLLECTION & ACTIONS */}
        <div
          data-lenis-prevent
          className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            {/* Header: Category, Collection, Rating & Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {quickViewProduct.collection && (
                  <span className="font-nav text-[10px] uppercase tracking-widest text-gold-primary font-medium px-2.5 py-0.5 rounded-full bg-gold-primary/10 border border-gold-primary/30">
                    {quickViewProduct.collection}
                  </span>
                )}
                <div className="flex items-center text-xs ml-auto">
                  <Star className="w-3.5 h-3.5 text-gold-primary fill-gold-primary mr-1" />
                  <span className="font-nav font-medium text-primary">
                    {quickViewProduct.rating}
                  </span>
                  <span className="text-taupe ml-1">
                    ({quickViewProduct.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl text-primary font-normal leading-tight">
                {quickViewProduct.name}
              </h2>

              {/* Price & Installments */}
              <div className="mt-3 flex items-baseline space-x-3">
                <span className="font-nav text-2xl font-medium text-primary">
                  ${quickViewProduct.price.toLocaleString()} {quickViewProduct.currency}
                </span>
                <span className="text-xs text-taupe font-body">
                  or 4 interest-free payments of <span className="font-nav font-semibold text-primary">${installmentPrice}</span>
                </span>
              </div>

              <p className="font-body text-xs sm:text-sm text-taupe mt-2.5 leading-relaxed">
                {quickViewProduct.tagline}
              </p>
            </div>

            {/* Finish / Material Options (if colors defined) */}
            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-nav uppercase tracking-widest text-taupe">
                    Bespoke Finish:
                  </span>
                  <span className="font-nav font-medium text-primary">
                    {selectedColor || quickViewProduct.colors[0].name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-nav transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-gold-primary bg-gold-pale/30 text-primary shadow-xs font-medium'
                          : 'border-gold-muted/40 bg-surface text-primary/70 hover:border-gold-primary'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Architectural Dimensions */}
            <div className="p-4 rounded-2xl bg-[#F3EFE7]/60 border border-gold-muted/30 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-nav text-primary uppercase tracking-widest font-medium">
                <Ruler className="w-3.5 h-3.5 text-gold-primary" />
                <span>Dimensions & Mass Specifications</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-body text-primary/80 pt-1">
                {Object.entries(quickViewProduct.dimensions).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-gold-muted/20 pb-1">
                    <span className="capitalize text-taupe">{key}:</span>
                    <span className="font-nav font-medium text-primary">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials Used */}
            <div className="space-y-2">
              <span className="text-xs font-nav text-taupe uppercase tracking-widest">
                Noble Materials
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickViewProduct.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-surface border border-gold-muted/30 text-xs text-primary/80 font-body"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-1.5">
              <span className="text-xs font-nav text-taupe uppercase tracking-widest">
                Artisan Engineering
              </span>
              <ul className="space-y-1.5">
                {quickViewProduct.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-2 text-xs font-body text-taupe"
                  >
                    <Check className="w-3.5 h-3.5 text-gold-primary flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ============================================================== */}
            {/* SAME COLLECTION SECTION (MATCHING SUITE PIECES)                */}
            {/* ============================================================== */}
            {sameCollectionProducts.length > 0 && (
              <div className="pt-5 border-t border-gold-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-gold-primary" />
                    <span className="font-nav text-xs uppercase tracking-widest text-primary font-medium">
                      From the Same Collection
                    </span>
                  </div>
                  <span className="text-[11px] font-nav text-taupe">
                    {quickViewProduct.collection}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sameCollectionProducts.map((relProduct) => (
                    <div
                      key={relProduct.id}
                      onClick={() => setQuickViewProduct(relProduct)}
                      className="group/rel flex items-center space-x-3 p-2.5 rounded-2xl bg-surface hover:bg-[#F3EFE7] border border-gold-muted/30 transition-all cursor-pointer shadow-2xs hover:shadow-xs hover:border-gold-primary/50"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EAE4D9] flex-shrink-0">
                        <Image
                          src={relProduct.image}
                          alt={relProduct.name}
                          fill
                          unoptimized={true}
                          className="object-cover group-hover/rel:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-sm text-primary font-normal truncate group-hover/rel:text-gold-primary transition-colors">
                          {relProduct.name}
                        </h4>
                        <span className="font-nav text-xs font-medium text-primary block mt-0.5">
                          ${relProduct.price.toLocaleString()} USD
                        </span>
                        <span className="text-[10px] text-gold-primary font-nav uppercase tracking-wider flex items-center space-x-1 mt-0.5 font-medium">
                          <span>View Piece</span>
                          <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover/rel:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS & QUANTITY SELECTOR */}
          <div className="pt-5 mt-4 border-t border-gold-muted/30 space-y-3">
            <div className="flex items-center space-x-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-gold-muted/40 rounded-full bg-surface px-3 py-2 space-x-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 text-taupe hover:text-primary transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-nav text-xs font-semibold text-primary w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 text-taupe hover:text-primary transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button: Hover = Crisp White with Gold Accents */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-primary text-white rounded-full font-nav text-xs uppercase tracking-widest hover:bg-white hover:text-primary hover:border hover:border-gold-primary transition-all duration-300 flex items-center justify-center space-x-2 font-medium cursor-pointer shadow-sm group"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>
                  Acquire ({quantity}) · ${(quickViewProduct.price * quantity).toLocaleString()} USD
                </span>
              </button>
            </div>

            {/* Instant Feedback Toast */}
            {addedToast && (
              <div className="text-center py-2 px-4 rounded-xl bg-gold-primary/15 border border-gold-primary/35 text-gold-primary text-xs font-nav tracking-wider uppercase font-medium animate-fade-in flex items-center justify-center space-x-2">
                <Check className="w-3.5 h-3.5" />
                <span>Added to your Atelier Shopping Bag</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-taupe px-2">
              <span>{quickViewProduct.leadTime}</span>
              <span>Complimentary insured shipping worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
