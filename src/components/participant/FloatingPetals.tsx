import React, { useMemo } from 'react';

interface FloatingPetal {
  id: number;
  left: number; // 0 to 100%
  topStart: number; // initial top %
  size: number; // px width
  duration: number; // seconds
  delay: number; // seconds
  blur: number; // px blur for depth of field
  opacity: number;
  rotStart: number;
  rotEnd: number;
}

export const FloatingPetals: React.FC<{ count?: number; className?: string }> = ({
  count = 16,
  className = '',
}) => {
  const petals = useMemo<FloatingPetal[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Natural distribution around center/right with some foreground and background
      const left = 15 + Math.random() * 80;
      const size = 16 + Math.random() * 28;
      const isForeground = Math.random() > 0.75;
      const isBackground = Math.random() < 0.3;

      return {
        id: i,
        left,
        topStart: -10 - Math.random() * 20,
        size: isForeground ? size * 1.3 : isBackground ? size * 0.75 : size,
        duration: 9 + Math.random() * 11,
        delay: Math.random() * 8,
        blur: isForeground ? 2.5 : isBackground ? 1.5 : 0,
        opacity: isBackground ? 0.55 : 0.85,
        rotStart: Math.random() * 360,
        rotEnd: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-15 ${className}`}
    >
      <style>{`
        @keyframes petalFall {
          0% {
            transform: translateY(-10vh) translateX(0px) rotate(var(--rot-start)) scale(1);
            opacity: 0;
          }
          10% {
            opacity: var(--petal-opacity);
          }
          50% {
            transform: translateY(50vh) translateX(25px) rotate(calc(var(--rot-start) + var(--rot-end) * 0.5)) scale(1.05);
          }
          90% {
            opacity: var(--petal-opacity);
          }
          100% {
            transform: translateY(115vh) translateX(-15px) rotate(calc(var(--rot-start) + var(--rot-end))) scale(0.95);
            opacity: 0;
          }
        }
        .animate-petal {
          animation: petalFall var(--duration) cubic-bezier(0.25, 0.1, 0.25, 1) infinite var(--delay);
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-petal {
            animation: none !important;
            opacity: 0.4;
          }
        }
      `}</style>

      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal"
          style={
            {
              left: `${p.left}%`,
              top: `${p.topStart}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.25}px`,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--petal-opacity': p.opacity,
              '--rot-start': `${p.rotStart}deg`,
              '--rot-end': `${p.rotEnd}deg`,
            } as React.CSSProperties
          }
        >
          {/* Realistic curved crimson rose petal SVG */}
          <svg
            viewBox="0 0 100 125"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(181,31,53,0.45)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`petalGrad-${p.id}`} x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#e63946" />
                <stop offset="45%" stopColor="#b51f35" />
                <stop offset="85%" stopColor="#7a0f1e" />
                <stop offset="100%" stopColor="#4a050f" />
              </linearGradient>
              <radialGradient id={`petalSheen-${p.id}`} cx="40%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#ff758f" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#b51f35" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Natural cup-shaped organic petal path */}
            <path
              d="M50 5 C75 10, 95 35, 92 65 C90 92, 65 115, 50 120 C35 115, 10 92, 8 65 C5 35, 25 10, 50 5 Z"
              fill={`url(#petalGrad-${p.id})`}
            />
            {/* Velvet highlight sheen */}
            <path
              d="M50 12 C70 16, 85 38, 82 62 C78 78, 62 95, 50 105 C38 95, 22 78, 18 62 C15 38, 30 16, 50 12 Z"
              fill={`url(#petalSheen-${p.id})`}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
