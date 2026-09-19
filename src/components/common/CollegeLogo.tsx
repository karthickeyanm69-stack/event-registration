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
 * Vector Cross with Blue Vertical Arms, Teal Horizontal Arms, and Circuit Nodes.
 */
export const CollegeEmblem: React.FC<{ size?: number | string; className?: string }> = ({
  size = 48,
  className = '',
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
      {/* Top Vertical Arm (Vibrant Blue #0077c8) */}
      <path
        d="M36 4 H64 V36 H36 Z"
        fill="#0077c8"
        rx="2"
      />
      {/* Bottom Vertical Arm (Vibrant Blue #0077c8) */}
      <path
        d="M36 64 H64 V96 H36 Z"
        fill="#0077c8"
        rx="2"
      />
      {/* Left Horizontal Arm (Vibrant Teal #00a887) */}
      <path
        d="M4 36 H36 V64 H4 Z"
        fill="#00a887"
        rx="2"
      />
      {/* Right Horizontal Arm (Vibrant Teal #00a887) */}
      <path
        d="M64 36 H96 V64 H64 Z"
        fill="#00a887"
        rx="2"
      />

      {/* Central Star/Cross Node Connection (White) */}
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" />

      {/* Top Circuit Line & Node */}
      <line x1="50" y1="50" x2="50" y2="18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="18" r="4" fill="#ffffff" />

      {/* Bottom Circuit Line & Node */}
      <line x1="50" y1="50" x2="50" y2="82" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="82" r="4" fill="#ffffff" />

      {/* Left Circuit Line & Node */}
      <line x1="50" y1="50" x2="18" y2="50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="50" r="4" fill="#ffffff" />

      {/* Right Circuit Line & Node */}
      <line x1="50" y1="50" x2="82" y2="50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="82" cy="50" r="4" fill="#ffffff" />

      {/* Bottom Motto Badge */}
      <rect x="0" y="99" width="100" height="10" rx="1.5" fill="#0077c8" />
      <text
        x="50"
        y="107"
        fill="#ffffff"
        fontSize="5"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="0.4"
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
