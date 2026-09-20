import React from 'react';

interface CollegeLogoProps {
  variant?: 'full' | 'emblem' | 'compact' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

/**
 * Official Multi-Colored Starburst Logo from the Reference Video
 */
export const SpiherStarburstLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  const rays = [
    { angle: 0,   color: '#e11d48' }, // Rose
    { angle: 22.5, color: '#f97316' }, // Orange
    { angle: 45,  color: '#f59e0b' }, // Amber
    { angle: 67.5, color: '#eab308' }, // Yellow
    { angle: 90,  color: '#84cc16' }, // Lime
    { angle: 112.5, color: '#10b981' }, // Emerald
    { angle: 135, color: '#06b6d4' }, // Cyan
    { angle: 157.5, color: '#0077c8' }, // SPIHER Blue
    { angle: 180, color: '#002b66' }, // Navy
    { angle: 202.5, color: '#4f46e5' }, // Indigo
    { angle: 225, color: '#7c3aed' }, // Purple
    { angle: 247.5, color: '#9333ea' }, // Violet
    { angle: 270, color: '#c026d3' }, // Fuchsia
    { angle: 292.5, color: '#db2777' }, // Pink
    { angle: 315, color: '#f43f5e' }, // Coral
    { angle: 337.5, color: '#ef4444' }, // Red
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <g transform="translate(50, 50)">
        {rays.map((ray, idx) => (
          <path
            key={idx}
            d="M -3.2 0 L 0 -46 L 3.2 0 Z"
            fill={ray.color}
            transform={`rotate(${ray.angle})`}
          />
        ))}
        {/* Core white center */}
        <circle cx="0" cy="0" r="6" fill="#ffffff" />
      </g>
    </svg>
  );
};

/**
 * Official St. Peter's Institute of Higher Education & Research Emblem
 * Vector Cross with Blue Vertical Arms, Teal/Green Horizontal Arms, Circuit Nodes, and Base Line.
 */
export const CollegeEmblem: React.FC<{ size?: number | string; className?: string; roundedBg?: boolean }> = ({
  size = 48,
  className = '',
  roundedBg = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {roundedBg && (
        <rect width="100" height="110" rx="20" fill="url(#emblemBgGrad)" />
      )}
      <defs>
        <linearGradient id="emblemBgGrad" x1="0" y1="0" x2="0" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#005fa3" />
          <stop offset="1" stopColor="#002b66" />
        </linearGradient>
      </defs>

      {/* Top Vertical Arm (Royal Blue) */}
      <path d="M37 5 H63 V37 H37 Z" fill="#0066cc" rx="3" />
      {/* Bottom Vertical Arm (Royal Blue) */}
      <path d="M37 63 H63 V95 H37 Z" fill="#0066cc" rx="3" />
      {/* Left Horizontal Arm (Teal / Green) */}
      <path d="M5 37 H37 V63 H5 Z" fill="#00a887" rx="3" />
      {/* Right Horizontal Arm (Teal / Green) */}
      <path d="M63 37 H95 V63 H63 Z" fill="#00a887" rx="3" />

      {/* Central Node & Circuit Lines (White) */}
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" />

      <line x1="50" y1="50" x2="50" y2="20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="20" r="3.5" fill="#ffffff" />

      <line x1="50" y1="50" x2="50" y2="80" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="80" r="3.5" fill="#ffffff" />

      <line x1="50" y1="50" x2="20" y2="50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="50" r="3.5" fill="#ffffff" />

      <line x1="50" y1="50" x2="80" y2="50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="50" r="3.5" fill="#ffffff" />

      {/* Motto Bar matching reference Image 2 */}
      <rect x="2" y="99" width="96" height="9" rx="1.5" fill="#0066cc" />
      <text
        x="50"
        y="105.8"
        fill="#ffffff"
        fontSize="4.5"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="0.2"
        fontFamily="sans-serif"
      >
        IGNITE • INSPIRE • INNOVATE
      </text>
    </svg>
  );
};

/**
 * Full Authentic College Header Banner Lockup
 */
export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  if (variant === 'emblem') {
    const emblemSize = size === 'sm' ? 36 : size === 'md' ? 44 : size === 'lg' ? 60 : 76;
    return <CollegeEmblem size={emblemSize} className={className} />;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <CollegeEmblem size={size === 'sm' ? 36 : 42} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-black tracking-tight text-[#002b66] text-base leading-none">
              St. PETER'S
            </span>
          </div>
          <span className="text-[9.5px] font-extrabold uppercase tracking-wide text-[#002b66] mt-0.5">
            Institute of Higher Education & Research
          </span>
          {showSubtitle && (
            <span className="text-[8.5px] font-bold text-[#0077c8] tracking-tight">
              Deemed to be University • UGC Act 1956
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Institutional Lockup with UGC Banner
  return (
    <div className={`flex items-stretch gap-3.5 bg-white ${className}`}>
      {/* Official Emblem */}
      <div className="flex items-center justify-center shrink-0">
        <CollegeEmblem size={size === 'sm' ? 44 : size === 'lg' ? 68 : 54} />
      </div>

      {/* Typography and UGC Banner */}
      <div className="flex flex-col justify-center">
        {/* Main Title */}
        <h1 className="font-serif font-black text-[#002b66] text-lg sm:text-xl md:text-2xl leading-none tracking-tight">
          St. PETER’S
        </h1>

        {/* Institution Subtitle */}
        <h2 className="text-[10px] sm:text-xs font-black uppercase text-[#002b66] tracking-wide mt-1 leading-tight">
          INSTITUTE OF HIGHER EDUCATION & RESEARCH
        </h2>

        {showSubtitle && (
          <div className="mt-1.5 flex flex-col">
            {/* Blue Banner Bar */}
            <div className="bg-[#0095d9] px-2.5 py-0.5 rounded-sm text-center">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                DEEMED TO BE UNIVERSITY U/S 3 OF THE UGC ACT 1956
              </p>
            </div>
            {/* Accreditation Bar */}
            <p className="text-[8.5px] sm:text-[9.5px] font-bold text-[#002b66] text-center mt-0.5 tracking-tight">
              AICTE Approved and ISO 9001:2015 Certified
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeLogo;
