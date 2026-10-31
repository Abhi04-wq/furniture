'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useFurnitureStore } from '../hooks/useFurnitureStore';
import { X, Plus, Minus, Trash2, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';

export function CartDrawer() {
  const isCartOpen = useFurnitureStore((state) => state.isCartOpen);
  const closeCart = useFurnitureStore((state) => state.closeCart);
  const cartItems = useFurnitureStore((state) => state.cartItems);
  const addToCart = useFurnitureStore((state) => state.addToCart);
  const removeFromCart = useFurnitureStore((state) => state.removeFromCart);

  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsOrdered(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A58B68', '#C8B79D', '#25251F', '#D4AF37'],
    });

    setTimeout(() => {
      // Keep state for viewing confirmation
    }, 1000);
  };

  const handleReset = () => {
    setIsOrdered(false);
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface shadow-2xl flex flex-col justify-between border-l border-luxury-border">
          {/* HEADER */}
          <div className="p-6 md:p-8 border-b border-luxury-border flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl text-primary font-normal">
                Curated Selection
              </h2>
              <p className="font-nav text-xs text-luxury-muted uppercase tracking-widest mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'} in Atelier Bag
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-luxury-cream text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {isOrdered ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl text-primary font-normal">
                  Order Reserved With Atelier
                </h3>
                <p className="font-body text-sm text-primary/70 leading-relaxed max-w-xs mx-auto">
                  Your bespoke pieces have been queued for master craftsman allocation.
                  Our concierge will contact you regarding delivery dates and white-glove placement.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 px-6 py-3 bg-primary text-surface rounded-full font-nav text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                >
                  Return to Collection
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="font-body text-base text-luxury-muted">
                  Your shopping bag is currently unoccupied.
                </p>
                <p className="font-body text-xs text-primary/60">
                  Select a centerpiece from our collection to begin crafting your sanctuary.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 border border-primary text-primary rounded-full font-nav text-xs uppercase tracking-widest hover:bg-primary hover:text-surface transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex space-x-4 pb-6 border-b border-luxury-border/60"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-luxury-cream flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading text-base text-primary font-normal">
                          {product.name}
                        </h4>
                        <span className="font-nav text-sm font-medium text-primary">
                          ${(product.price * quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-nav text-[11px] text-secondary tracking-wider uppercase mt-0.5">
                        {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 border border-luxury-border rounded-lg px-2 py-1">
                        <button
                          onClick={() => {
                            if (quantity > 1) {
                              addToCart({ ...product, price: product.price });
                            } else {
                              removeFromCart(product.id);
                            }
                          }}
                          className="text-primary/60 hover:text-primary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-nav text-xs px-1 text-primary">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="text-primary/60 hover:text-primary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-luxury-muted hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER CHECKOUT */}
          {!isOrdered && cartItems.length > 0 && (
            <div className="p-6 md:p-8 bg-luxury-cream/40 border-t border-luxury-border space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-nav text-luxury-muted uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-nav text-luxury-muted uppercase tracking-wider">
                  <span>White-Glove Courier</span>
                  <span className="text-secondary font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-heading text-primary pt-2 border-t border-luxury-border/60">
                  <span>Total Investment</span>
                  <span className="font-nav font-medium">
                    ${subtotal.toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-luxury-muted">
                <Truck className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span>Includes insured white-glove assembly in your salon.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-primary text-surface rounded-full font-nav text-xs uppercase tracking-widest hover:bg-secondary transition-all duration-300 font-medium"
              >
                Proceed to Bespoke Reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
