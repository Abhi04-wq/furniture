'use client';

import React, { useRef, useCallback, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  onClick?: () => void;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  scale = 1.02,
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const glare = glareRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const xNorm = (x / rect.width - 0.5) * 2;
        const yNorm = (y / rect.height - 0.5) * 2;
        const rotX = -yNorm * maxTilt;
        const rotY = xNorm * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
        card.style.transition = 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)';

        if (glare) {
          const gx = (x / rect.width) * 100;
          const gy = (y / rect.height) * 100;
          glare.style.opacity = '0.35';
          glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`;
        }
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        touchAction: 'pan-y', // Guarantees native/Lenis vertical scrolling is NEVER intercepted or blocked
      }}
      className={`relative cursor-pointer select-none transition-shadow duration-300 ${className}`}
    >
      {/* Specular Light Sheen Reflection */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-30 rounded-3xl opacity-0 transition-opacity duration-300"
      />
      {children}
    </div>
  );
}
