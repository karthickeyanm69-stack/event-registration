import React from 'react';
import { motion } from 'motion/react';

interface CyberWebBackgroundProps {
  className?: string;
}

/**
 * CyberWebBackground:
 * Spider-Man Miles Morales Across the Spider-Verse Multiverse Background.
 * - Deep Multiverse Void Base (#05050a)
 * - Dimensional Hex Portal Amber & Neon Crimson Energy Conduits
 * - Multiverse Glitch Magenta & Venom Cyan atmospheric nodes
 * - Geometric Hexagonal Web Rings & Dimensional Speedlines
 */
export const CyberWebBackground: React.FC<CyberWebBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {/* 1. Deep Atmospheric Multiverse Nebulae */}
      <div className="absolute top-1/4 right-1/4 w-[36rem] h-[36rem] rounded-full bg-[#C40030]/15 blur-[130px] animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -top-20 right-10 w-[28rem] h-[28rem] rounded-full bg-[#F07030]/12 blur-[120px]" />
      <div className="absolute bottom-1/4 left-10 w-[30rem] h-[30rem] rounded-full bg-[#E00070]/12 blur-[110px]" />
      <div className="absolute top-1/2 left-1/3 w-[20rem] h-[20rem] rounded-full bg-[#3030FF]/08 blur-[90px]" />

      {/* 2. Geometric Hex-Portal Energy Web SVG */}
      <svg
        className="absolute -top-24 right-[-10%] sm:right-[2%] lg:right-[10%] w-[680px] h-[680px] sm:w-[840px] sm:h-[840px] opacity-40"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="portalCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F07030" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#C40030" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#E00070" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#080006" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="portalLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E00070" stopOpacity="0" />
            <stop offset="50%" stopColor="#C40030" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F07030" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Ambient Portal Core Glow */}
        <circle cx="400" cy="400" r="350" fill="url(#portalCenterGlow)" />

        {/* Radial Spider Laser Beams (30 deg intervals) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 400 + Math.cos(rad) * 380;
          const y2 = 400 + Math.sin(rad) * 380;
          const isPrimary = deg % 60 === 0;
          return (
            <line
              key={`radial-spider-${deg}`}
              x1="400"
              y1="400"
              x2={x2}
              y2={y2}
              stroke={isPrimary ? '#C40030' : '#F07030'}
              strokeWidth={isPrimary ? '1' : '0.6'}
              strokeOpacity={isPrimary ? '0.45' : '0.2'}
              strokeDasharray={isPrimary ? 'none' : '4 6'}
            />
          );
        })}

        {/* Concentric Hexagonal Portal Rings */}
        {[70, 130, 190, 260, 330, 400].map((radius, rIdx) => {
          const points = [0, 60, 120, 180, 240, 300]
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
              key={`hex-ring-${radius}`}
              points={points}
              stroke={rIdx === 1 ? '#F07030' : isMajor ? '#C40030' : '#E00070'}
              strokeWidth={isMajor ? '1.4' : '0.8'}
              strokeOpacity={isMajor ? '0.6' : '0.25'}
              fill="none"
            />
          );
        })}

        {/* Hex Intersection Energy Nodes */}
        {[130, 260].map((radius) =>
          [0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 400 + Math.cos(rad) * radius;
            const cy = 400 + Math.sin(rad) * radius;
            return (
              <g key={`hex-node-${radius}-${deg}`}>
                <circle cx={cx} cy={cy} r="3" fill="#C40030" />
                <circle cx={cx} cy={cy} r="6" stroke="#F07030" strokeWidth="0.8" strokeOpacity="0.8" fill="none" />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
};
