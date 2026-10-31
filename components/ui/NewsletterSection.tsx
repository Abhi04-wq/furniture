'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMsg(data.message || 'You have been enrolled into The Private Gazette.');
        setEmail('');
      } else {
        setStatus('error');
        setMsg(data.message || 'Subscription failed. Please check your email address.');
      }
    } catch (err) {
      setStatus('error');
      setMsg('Network connection error.');
    }
  };

  return (
    <section className="py-24 md:py-32 bg-primary text-surface relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8B79D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
        <div>
          <span className="font-nav text-xs uppercase tracking-ultra text-accent block mb-3">
            Private Atelier Dispatches
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-normal leading-tight">
            The Private Gazette.
          </h2>
          <p className="font-body text-base md:text-lg text-surface/70 max-w-xl mx-auto mt-4 font-light leading-relaxed">
            Invitations to private India Art & Design Pavilion showcases, limited timber provenance
            releases, and essays on architectural furniture construction.
          </p>
        </div>

        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-surface/10 border border-surface/20 max-w-md mx-auto space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-secondary mx-auto" />
            <h4 className="font-heading text-xl font-normal">Invitation Confirmed</h4>
            <p className="font-body text-xs text-surface/80">{msg}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your private email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface/10 border border-surface/20 rounded-full px-6 py-4 text-sm font-body text-surface placeholder:text-surface/40 focus:outline-none focus:border-secondary focus:bg-surface/20 transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-8 py-4 bg-secondary text-primary font-nav text-xs uppercase tracking-widest rounded-full hover:bg-surface transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <span>{status === 'loading' ? 'Confirming...' : 'Subscribe'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-amber-300 font-nav">{msg}</p>
        )}

        <div className="flex items-center justify-center space-x-2 text-[11px] text-surface/50 font-nav uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-secondary" />
          <span>Strict confidential privilege · Unsubscribe at any time</span>
        </div>
      </div>
    </section>
  );
}
