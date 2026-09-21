import React, { useState, useEffect, useRef } from 'react';
import { FloatingPetals } from './FloatingPetals';

interface HeroArtworkProps {
  isMobile?: boolean;
  className?: string;
}

export const HeroArtwork: React.FC<HeroArtworkProps> = ({ isMobile = false, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Subtle, elegant mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      setTilt({ x: nx * 10, y: ny * 8 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* ── Background Poster Artwork Layer with Parallax ── */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `scale(1.03) translate3d(${tilt.x * 0.4}px, ${tilt.y * 0.4}px, 0px)`,
        }}
      >
        <img
          src="/radianza-hero-bg.jpg"
          alt=""
          className={`w-full h-full ${
            isMobile
              ? 'object-cover object-center'
              : 'object-contain object-right-bottom lg:object-center'
          } select-none pointer-events-none drop-shadow-2xl`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* ── Subtle Atmospheric Gradients & Glow Accents ── */}
      {/* Electric cyan glow around cyber hand wrist */}
      <div
        className="absolute bottom-1/4 right-1/6 w-64 h-64 rounded-full bg-[#00f2fe]/10 blur-3xl pointer-events-none"
        style={{
          transform: `translate3d(${tilt.x * 0.8}px, ${tilt.y * 0.8}px, 0px)`,
        }}
      />

      {/* Crimson velvet warmth behind the rose blossom */}
      <div
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-[#b51f35]/15 blur-3xl pointer-events-none"
        style={{
          transform: `translate3d(${tilt.x * 0.6}px, ${tilt.y * 0.6}px, 0px)`,
        }}
      />

      {/* Golden divine aura behind the mandala */}
      <div
        className="absolute top-1/5 right-1/4 w-80 h-80 rounded-full bg-[#f5b942]/12 blur-3xl pointer-events-none"
        style={{
          transform: `translate3d(${tilt.x * 0.5}px, ${tilt.y * 0.5}px, 0px)`,
        }}
      />

      {/* ── Dynamic Floating Rose Petals Layer ── */}
      <FloatingPetals count={isMobile ? 12 : 18} />

      {/* ── Bottom-Right Traditional Sacred Lotus Motif ── */}
      <div className="absolute bottom-4 right-5 sm:bottom-6 sm:right-8 opacity-75 pointer-events-none z-20">
        <svg
          width="36"
          height="24"
          viewBox="0 0 48 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-[#f5b942]"
        >
          {/* Central Lotus Petal */}
          <path d="M24 4 C27 12, 27 22, 24 28 C21 22, 21 12, 24 4 Z" strokeWidth="1.2" />
          {/* Left Inner Petal */}
          <path d="M24 28 C20 22, 14 18, 12 12 C16 10, 21 18, 24 28 Z" strokeWidth="1" />
          {/* Right Inner Petal */}
          <path d="M24 28 C28 22, 34 18, 36 12 C32 10, 27 18, 24 28 Z" strokeWidth="1" />
          {/* Left Outer Petal */}
          <path d="M24 28 C16 26, 8 22, 4 18 C10 16, 18 24, 24 28 Z" strokeWidth="0.8" opacity="0.8" />
          {/* Right Outer Petal */}
          <path d="M24 28 C32 26, 40 22, 44 18 C38 16, 30 24, 24 28 Z" strokeWidth="0.8" opacity="0.8" />
          {/* Base Curved Stem Accent */}
          <path d="M16 28 Q24 31 32 28" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  );
};
