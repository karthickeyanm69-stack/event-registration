import React from 'react';
import { motion } from 'motion/react';

interface CyberWebBackgroundProps {
  className?: string;
}

/**
 * CyberWebBackground:
 * Dark futuristic cyber-web and geometric laser grid background.
 * - 70% Near-Black base (#050505)
 * - 20% Deep Crimson accents (#C1121F)
 * - 5% Bright Red glow accents (#FF1738)
 * - Subtle geometric polygonal web lattice lines & intersecting cyber nodes
 * - Zero traditional motifs, zero copyrighted character art/logos
 */
export const CyberWebBackground: React.FC<CyberWebBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {/* 1. Deep Atmospheric Radial Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full bg-[#C1121F]/15 blur-[120px]" />
      <div className="absolute -top-20 right-10 w-96 h-96 rounded-full bg-[#FF1738]/10 blur-[100px]" />
      <div className="absolute bottom-1/3 left-10 w-80 h-80 rounded-full bg-[#780016]/15 blur-[90px]" />

      {/* 2. Geometric Hex-Web & Radar Lattice SVG */}
      <svg
        className="absolute -top-16 right-[-8%] sm:right-[5%] lg:right-[15%] w-[580px] h-[580px] sm:w-[720px] sm:h-[720px] opacity-35"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="webCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF1738" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#C1121F" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#050505" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1738" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF1738" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C1121F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="400" cy="400" r="320" fill="url(#webCenterGlow)" />

        {/* Radial Web Strands (Laser Beams) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 400 + Math.cos(rad) * 360;
          const y2 = 400 + Math.sin(rad) * 360;
          return (
            <line
              key={`radial-${deg}`}
              x1="400"
              y1="400"
              x2={x2}
              y2={y2}
              stroke="#C1121F"
              strokeWidth="0.8"
              strokeOpacity="0.35"
              strokeDasharray={deg % 60 === 0 ? 'none' : '4 6'}
            />
          );
        })}

        {/* Concentric Polygonal Web Rings (Dodecagons) */}
        {[80, 140, 200, 260, 320, 380].map((radius, rIdx) => {
          const points = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            .map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x = 400 + Math.cos(rad) * radius;
              const y = 400 + Math.sin(rad) * radius;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

          const isMajor = rIdx % 2 === 1;
          return (
            <polygon
              key={`ring-${radius}`}
              points={points}
              stroke={isMajor ? '#FF1738' : '#C1121F'}
              strokeWidth={isMajor ? '1.2' : '0.75'}
              strokeOpacity={isMajor ? '0.5' : '0.25'}
              fill="none"
            />
          );
        })}

        {/* Web Intersection Nodes / Light Sparks */}
        {[140, 260].map((radius) =>
          [0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 400 + Math.cos(rad) * radius;
            const cy = 400 + Math.sin(rad) * radius;
            return (
              <g key={`node-${radius}-${deg}`}>
                <circle cx={cx} cy={cy} r="2.5" fill="#FF1738" opacity="0.85" />
                <circle cx={cx} cy={cy} r="6" fill="#FF1738" opacity="0.2" />
              </g>
            );
          })
        )}

        {/* Central Core Hexagon */}
        <polygon
          points={[0, 60, 120, 180, 240, 300]
            .map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return `${(400 + Math.cos(rad) * 26).toFixed(1)},${(400 + Math.sin(rad) * 26).toFixed(1)}`;
            })
            .join(' ')}
          stroke="#FF1738"
          strokeWidth="1.5"
          fill="#C1121F"
          fillOpacity="0.12"
        />
        <circle cx="400" cy="400" r="3" fill="#FFFFFF" />
      </svg>

      {/* 3. Subtle Cyber Perspective Grid Floor on bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(to_bottom,transparent_0%,rgba(193,18,31,0.06)_100%)]">
        <div
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(193, 18, 31, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(193, 18, 31, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(400px) rotateX(60deg)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* 4. Glowing Red Hairline Laser Accent Across Hero */}
      <div className="absolute top-[38%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF1738]/40 to-transparent pointer-events-none" />
      <div className="absolute top-[68%] left-1/4 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C1121F]/30 to-transparent pointer-events-none" />
    </div>
  );
};
