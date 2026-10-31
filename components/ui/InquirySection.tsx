'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Building, Mail, User, Phone, MessageSquare } from 'lucide-react';

export function InquirySection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Salon',
    selectedProduct: 'The Arcos Dining Table Set',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setResponseMsg(data.message || 'Thank you. A private curator has received your dossier.');
      } else {
        setStatus('error');
        setResponseMsg(data.message || 'Unable to submit inquiry. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setResponseMsg('Network connection error. Please verify your connection.');
    }
  };

  return (
    <section id="inquiry" className="py-24 md:py-36 bg-background border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: EDITORIAL COPY */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-nav text-xs uppercase tracking-ultra text-secondary block">
              Bespoke Atelier Commission
            </span>
            <h2 className="font-heading text-4xl md:text-6xl text-primary font-normal leading-tight">
              Begin a Private Dialogue.
            </h2>
            <p className="font-body text-base text-primary/70 leading-relaxed font-light">
              Whether you require custom table dimensions to seat eighteen guests,
              exclusive leather grade selections, or white-glove overseas salon delivery,
              our design principals stand ready.
            </p>

            <div className="space-y-4 pt-6 border-t border-luxury-border/60">
              <div className="flex items-center space-x-3 text-xs font-nav text-primary/80">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Complimentary 3D Architectural CAD Models Provided</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-nav text-primary/80">
                <Building className="w-4 h-4 text-secondary" />
                <span>Private Showrooms in Mumbai, New Delhi, Bengaluru, Kolkata</span>
              </div>
            </div>
          </div>

          {/* RIGHT: INQUIRY FORM */}
          <div className="lg:col-span-7 bg-surface rounded-3xl p-8 md:p-12 border border-luxury-border shadow-xs">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-3xl text-primary font-normal">
                  Inquiry Dispatched
                </h3>
                <p className="font-body text-sm text-primary/70 max-w-sm mx-auto leading-relaxed">
                  {responseMsg}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-3 border border-luxury-border rounded-full font-nav text-xs uppercase tracking-widest text-primary hover:bg-luxury-cream transition-all"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="font-nav text-xs uppercase tracking-widest text-luxury-muted block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted" />
                      <input
                        type="text"
                        required
                        placeholder="Contessa Alessandra Rossi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-luxury-cream/40 border border-luxury-border rounded-xl pl-11 pr-4 py-3 text-sm font-body text-primary placeholder:text-luxury-muted focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="font-nav text-xs uppercase tracking-widest text-luxury-muted block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted" />
                      <input
                        type="email"
                        required
                        placeholder="alessandra@rossi-architettura.it"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-luxury-cream/40 border border-luxury-border rounded-xl pl-11 pr-4 py-3 text-sm font-body text-primary placeholder:text-luxury-muted focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="font-nav text-xs uppercase tracking-widest text-luxury-muted block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted" />
                      <input
                        type="tel"
                        placeholder="+39 02 8492 8110"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-luxury-cream/40 border border-luxury-border rounded-xl pl-11 pr-4 py-3 text-sm font-body text-primary placeholder:text-luxury-muted focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="font-nav text-xs uppercase tracking-widest text-luxury-muted block">
                      Project Scale
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-luxury-cream/40 border border-luxury-border rounded-xl px-4 py-3 text-sm font-body text-primary focus:outline-none focus:border-secondary focus:bg-surface transition-all cursor-pointer"
                    >
                      <option value="Residential Salon">Private Residential Salon</option>
                      <option value="Penthouse / Villa">Villa or Penthouse Estate</option>
                      <option value="Boutique Hospitality">Boutique Hospitality / Yacht</option>
                      <option value="Architectural Spec">Architectural Firm Specification</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="font-nav text-xs uppercase tracking-widest text-luxury-muted block">
                    Project Vision & Specifications
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      placeholder="Outline room dimensions, timber species preferences, seating requirements, or project delivery target dates..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-luxury-cream/40 border border-luxury-border rounded-xl p-4 text-sm font-body text-primary placeholder:text-luxury-muted focus:outline-none focus:border-secondary focus:bg-surface transition-all resize-none"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 font-nav">{responseMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-primary text-surface rounded-full font-nav text-xs uppercase tracking-widest hover:bg-secondary transition-all duration-300 flex items-center justify-center space-x-2 font-medium disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {status === 'submitting' ? 'Transmitting Dossier...' : 'Submit Bespoke Inquiry'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
