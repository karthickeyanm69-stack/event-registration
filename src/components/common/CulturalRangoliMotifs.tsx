import React from 'react';

/**
 * EthnicBorderRibbon:
 * Authentic vertical geometric tribal / ethnic ribbon border running down the left edge.
 * Features alternating diamonds, triangles, chevrons, and micro-dots in Crimson (#B51F35), Gold (#F5B942), and Midnight (#020B1C).
 */
export const EthnicBorderRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute top-0 bottom-0 left-0 w-6 sm:w-8 pointer-events-none z-30 select-none overflow-hidden ${className}`}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 32 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="ethnicPattern" width="32" height="64" patternUnits="userSpaceOnUse">
            {/* Dark Midnight Base Strip */}
            <rect width="32" height="64" fill="#020B1C" />
            <line x1="31.5" y1="0" x2="31.5" y2="64" stroke="#F5B942" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="0.5" y1="0" x2="0.5" y2="64" stroke="#bf1c34ff" strokeWidth="1" strokeOpacity="0.5" />

            {/* Central Diamond Motif in Crimson & Gold */}
            <polygon points="16,6 27,22 16,38 5,22" fill="#061A35" stroke="#F5B942" strokeWidth="1.2" />
            <polygon points="16,12 22,22 16,32 10,22" fill="#B51F35" stroke="#F5B942" strokeWidth="0.8" />
            <circle cx="16" cy="22" r="2" fill="#FFF2D5" />

            {/* Corner Triangular Accents */}
            <polygon points="5,6 16,6 10.5,0" fill="#F5B942" opacity="0.85" />
            <polygon points="27,6 16,6 21.5,0" fill="#B51F35" opacity="0.85" />

            <polygon points="5,38 16,38 10.5,44" fill="#B51F35" opacity="0.85" />
            <polygon points="27,38 16,38 21.5,44" fill="#F5B942" opacity="0.85" />

            {/* Interstitial Chevron Band */}
            <polygon points="16,46 28,54 16,62 4,54" fill="none" stroke="#F5B942" strokeWidth="1" />
            <circle cx="16" cy="54" r="1.5" fill="#0878D1" />
            <circle cx="8" cy="54" r="1" fill="#FFF2D5" opacity="0.7" />
            <circle cx="24" cy="54" r="1" fill="#FFF2D5" opacity="0.7" />
          </pattern>
        </defs>
        <rect width="32" height="800" fill="url(#ethnicPattern)" />
      </svg>
    </div>
  );
};

/**
 * TopRangoliMotif:
 * Multi-tiered sacred lotus rangoli / mandala ornament placed in the top-right / center quadrant.
 * Rendered with fine strokes in Gold (#F5B942), Crimson (#B51F35), and Blue (#0878D1) with subtle radiant glow.
 */
export const TopRangoliMotif: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
    >
      <svg
        width="480"
        height="480"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-75 sm:opacity-85 filter drop-shadow-[0_0_12px_rgba(245,185,66,0.25)]"
      >
        <g transform="translate(250, 250)">
          {/* Outer Radiant Aura Rings */}
          <circle r="235" stroke="#F5B942" strokeWidth="0.75" strokeDasharray="6 6" strokeOpacity="0.4" />
          <circle r="215" stroke="#0878D1" strokeWidth="1" strokeOpacity="0.3" />
          <circle r="195" stroke="#F5B942" strokeWidth="1.2" strokeOpacity="0.5" />

          {/* 16 Outer Pointed Lotus Petals (Gold & Crimson Highlights) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={`outer-${i}`} transform={`rotate(${angle})`}>
                <path
                  d="M 0,-140 Q 28,-185 0,-230 Q -28,-185 0,-140 Z"
                  fill="none"
                  stroke={i % 2 === 0 ? '#F5B942' : '#B51F35'}
                  strokeWidth="1.2"
                  strokeOpacity={i % 2 === 0 ? '0.75' : '0.65'}
                />
                <path
                  d="M 0,-155 Q 16,-188 0,-215 Q -16,-188 0,-155 Z"
                  fill="none"
                  stroke="#0878D1"
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                />
                <circle cx="0" cy="-228" r="2" fill="#F5B942" opacity="0.8" />
              </g>
            );
          })}

          {/* Mid Layer Scalloped Petals (Crimson & Gold) */}
          <circle r="140" stroke="#B51F35" strokeWidth="1.5" strokeOpacity="0.6" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            return (
              <g key={`mid-${i}`} transform={`rotate(${angle})`}>
                <path
                  d="M -36,-135 C -20,-175 20,-175 36,-135 C 20,-115 -20,-115 -36,-135 Z"
                  fill="#061A35"
                  fillOpacity="0.35"
                  stroke="#F5B942"
                  strokeWidth="1.2"
                />
                <path
                  d="M -24,-135 C -12,-162 12,-162 24,-135"
                  fill="none"
                  stroke="#B51F35"
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />
                <circle cx="0" cy="-150" r="2.5" fill="#F5B942" />
              </g>
            );
          })}

          {/* Inner Geometrical Star Mandala */}
          <circle r="90" stroke="#0878D1" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle r="70" stroke="#F5B942" strokeWidth="1" strokeOpacity="0.6" />

          {/* Inner 8 Lotus Petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <g key={`inner-${i}`} transform={`rotate(${angle})`}>
                <path
                  d="M 0,-30 Q 18,-55 0,-85 Q -18,-55 0,-30 Z"
                  fill="#B51F35"
                  fillOpacity="0.4"
                  stroke="#F5B942"
                  strokeWidth="1.2"
                />
                <circle cx="0" cy="-60" r="1.5" fill="#FFF2D5" />
              </g>
            );
          })}

          {/* Core Central Bindu */}
          <circle r="22" fill="#020B1C" stroke="#F5B942" strokeWidth="1.5" />
          <circle r="14" fill="#B51F35" stroke="#FFF2D5" strokeWidth="0.8" />
          <circle r="5" fill="#F5B942" />
        </g>
      </svg>
    </div>
  );
};

/**
 * BottomRangoliMotif:
 * Traditional cultural rangoli flourishes and lotus petals situated in the bottom-right corner behind the head.
 */
export const BottomRangoliMotif: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
    >
      <svg
        width="440"
        height="320"
        viewBox="0 0 440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-75 sm:opacity-85 filter drop-shadow-[0_0_10px_rgba(245,185,66,0.2)]"
      >
        <g transform="translate(300, 240)">
          {/* Elegant Arc Sweeps */}
          <path
            d="M -240,-80 C -160,-160 -40,-180 80,-140 C 160,-110 220,-40 240,40"
            fill="none"
            stroke="#B51F35"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path
            d="M -220,-70 C -145,-145 -30,-165 85,-125 C 160,-95 210,-30 225,45"
            fill="none"
            stroke="#F5B942"
            strokeWidth="1.8"
            strokeOpacity="0.75"
          />
          <path
            d="M -200,-60 C -130,-130 -20,-150 90,-110 C 160,-80 200,-20 210,50"
            fill="none"
            stroke="#0878D1"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Decorative Lotus Petal Flourishes */}
          {[-60, -35, -10, 15, 40, 65].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle}) translate(0, -135)`}>
              <path
                d="M 0,0 Q 14,-25 0,-50 Q -14,-25 0,0 Z"
                fill="#061A35"
                fillOpacity="0.5"
                stroke={idx % 2 === 0 ? '#F5B942' : '#B51F35'}
                strokeWidth="1.2"
              />
              <circle cx="0" cy="-48" r="1.5" fill="#FFF2D5" />
            </g>
          ))}

          {/* Cultural Kolam Dot Grid Accents */}
          {[-120, -80, -40, 0, 40, 80, 120].map((x, i) => (
            <circle key={i} cx={x} cy={-20 + (i % 3) * 8} r="1.5" fill="#F5B942" opacity="0.65" />
          ))}
        </g>
      </svg>
    </div>
  );
};
