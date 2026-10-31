'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { initialProducts, initialCategories } from '@/server/seedData.js';
import { useFurnitureStore, Product } from '../hooks/useFurnitureStore';
import { TiltCard } from './TiltCard';
import {
  Eye,
  ShoppingBag,
  Star,
  Search,
  ArrowUpRight,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, string>>({});

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const addToCart = useFurnitureStore((state) => state.addToCart);
  const setQuickViewProduct = useFurnitureStore((state) => state.setQuickViewProduct);

  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: dir === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  // Fetch from API or local fallback
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory !== 'all') queryParams.set('category', activeCategory);
        if (searchQuery) queryParams.set('search', searchQuery);
        if (sortBy) queryParams.set('sort', sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setProducts(json.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to local filter
      }

      // Local filtering
      let filtered = [...initialProducts];
      if (activeCategory !== 'all') {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
        );
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.collection?.toLowerCase().includes(q)
        );
      }
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      setProducts(filtered);
      setLoading(false);
    }

    const timer = setTimeout(loadProducts, 150);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="featured-collection" className="py-24 md:py-36 bg-background border-t border-gold-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-gold-primary/35 text-gold-primary text-[10px] uppercase font-nav tracking-widest mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-primary" />
              <span>Permanent Collection Edition 2026</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary font-normal leading-tight">
              Curated <span className="text-gold-primary italic font-serif">Silhouettes</span>.
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-taupe max-w-md font-light leading-relaxed">
            Each piece is individually numbered and sculpted from kiln-dried
            European hardwoods with architectural joinery, Italian upholstery, and hand-rubbed botanical oils.
          </p>
        </div>

        {/* FILTERS & SEARCH CONTROLS */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-12 pb-6 border-b border-gold-muted/30">
          {/* Category Filter Pills: Active & Hover = Crisp White with Gold Accents */}
          <div className="relative flex items-center flex-1 max-w-full overflow-hidden">
            <button
              onClick={() => scrollCategories('left')}
              className="hidden sm:flex p-1.5 rounded-full bg-surface border border-gold-muted/40 text-taupe hover:bg-white hover:text-primary hover:border-gold-primary mr-2 flex-shrink-0 cursor-pointer shadow-xs transition-all"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              data-lenis-prevent
              className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none no-scrollbar scroll-smooth flex-1"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-nav text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer flex-shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white border border-primary shadow-sm font-semibold'
                      : 'bg-surface/85 text-taupe hover:bg-white hover:text-primary hover:border-gold-primary border border-gold-muted/30 shadow-2xs'
                  }`}
                >
                  <span className={activeCategory === cat.id ? 'text-white' : ''}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollCategories('right')}
              className="hidden sm:flex p-1.5 rounded-full bg-surface border border-gold-muted/40 text-taupe hover:bg-white hover:text-primary hover:border-gold-primary ml-2 flex-shrink-0 cursor-pointer shadow-xs transition-all"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input
                type="text"
                placeholder="Search tables, chairs, sofas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-gold-muted/40 rounded-full pl-9 pr-4 py-2 text-xs font-body text-primary placeholder:text-taupe/60 focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-gold-muted/40 rounded-full px-4 py-2 text-xs font-nav uppercase tracking-wider text-primary focus:outline-none focus:border-gold-primary transition-colors cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* 3D TILT PRODUCT GRID */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-3xl border border-gold-muted/30">
            <p className="font-heading text-2xl text-primary font-normal">
              No matching silhouettes found.
            </p>
            <p className="font-body text-sm text-taupe mt-2">
              Try modifying your search or select a different category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <TiltCard
                key={product.id}
                maxTilt={6}
                scale={1.015}
                onClick={() => setQuickViewProduct(product)}
                className="group bg-surface rounded-3xl overflow-hidden border border-gold-muted/30 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Card Image Container with Guaranteed Fallback Protection */}
                <div className="relative w-full h-64 sm:h-72 md:h-80 bg-[#EAE4D9]/70 overflow-hidden">
                  <Image
                    src={imgErrors[product.id] || product.image}
                    alt={product.name}
                    fill
                    unoptimized={true}
                    onError={() => {
                      setImgErrors((prev) => ({
                        ...prev,
                        [product.id]:
                          product.category === 'Seating'
                            ? 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'
                            : product.category === 'Sofas'
                            ? 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80'
                            : 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
                      }));
                    }}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
                    <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md font-nav text-[10px] uppercase tracking-widest text-primary border border-gold-muted/40 shadow-xs font-medium">
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-[11px] font-nav text-primary border border-gold-muted/30 shadow-xs">
                      <Star className="w-3 h-3 text-gold-primary fill-gold-primary" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </div>

                  {/* Badge Highlight if present */}
                  {product.badge && (
                    <div className="absolute bottom-3 left-4 z-10 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-md bg-primary/90 text-white font-nav text-[9px] uppercase tracking-widest backdrop-blur-xs font-medium border border-gold-primary/30">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Hover Action Overlay: Buttons turn crisp White on hover */}
                  <div className="absolute inset-0 bg-primary/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="px-5 py-2.5 bg-surface text-primary border border-gold-muted/40 rounded-full font-nav text-xs uppercase tracking-widest hover:bg-white hover:text-primary hover:border-gold-primary transition-all duration-300 flex items-center space-x-1.5 shadow-md cursor-pointer font-medium"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-primary" />
                      <span>Inspect Piece</span>
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="px-5 py-2.5 bg-primary text-white rounded-full font-nav text-xs uppercase tracking-widest hover:bg-white hover:text-primary hover:border hover:border-gold-primary transition-all duration-300 flex items-center space-x-1.5 shadow-md cursor-pointer font-medium"
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-gold-primary" />
                          <span>Acquired</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Acquire</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {product.collection && (
                      <span className="font-nav text-[10px] uppercase tracking-widest text-gold-primary block mb-1">
                        {product.collection}
                      </span>
                    )}
                    <h3 className="font-heading text-2xl text-primary font-normal group-hover:text-gold-primary transition-colors duration-300 leading-tight">
                      {product.name}
                    </h3>
                    <p className="font-body text-xs text-taupe line-clamp-2 mt-2 leading-relaxed">
                      {product.tagline}
                    </p>

                    {/* Noble Materials Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {product.materials.slice(0, 2).map((mat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#F3EFE7] text-[10px] font-body text-taupe border border-gold-muted/30"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="pt-6 mt-6 border-t border-gold-muted/30 flex items-center justify-between">
                    <div>
                      <span className="font-nav text-[10px] uppercase tracking-widest text-gold-antique block">
                        Investment
                      </span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-nav text-xl font-medium text-primary">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-body text-taupe font-medium">
                          INR
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="w-10 h-10 rounded-full border border-gold-muted/40 flex items-center justify-center text-primary hover:bg-white hover:text-primary hover:border-gold-primary transition-all duration-300 cursor-pointer shadow-2xs"
                      title="Inspect full specifications & matching suite"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
