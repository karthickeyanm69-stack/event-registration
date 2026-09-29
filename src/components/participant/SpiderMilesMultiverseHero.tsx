import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Radio, Activity, Compass, Flame } from 'lucide-react';

interface SpiderMilesMultiverseHeroProps {
  isRevealed?: boolean;
  onRegisterClick?: () => void;
}

export const SpiderMilesMultiverseHero: React.FC<SpiderMilesMultiverseHeroProps> = ({
  isRevealed = true,
  onRegisterClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeDimension, setActiveDimension] = useState<'EARTH-1610' | 'EARTH-65' | 'EARTH-2099'>('EARTH-1610');
  const [venomCharged, setVenomCharged] = useState(false);

  // Mouse Parallax Physics
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const triggerGlitch = () => {
    setIsGlitching(true);
    setVenomCharged(true);
    setTimeout(() => setIsGlitching(false), 800);
    setTimeout(() => setVenomCharged(false), 2500);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[620px] aspect-[9/13] sm:aspect-[3/4] lg:aspect-[4/5] mx-auto flex items-center justify-center select-none overflow-visible group"
      style={{ perspective: '1200px' }}
    >
      {/* ── Outer Multiverse Hexagonal Aura Rings ── */}
      <div
        aria-hidden="true"
        className="absolute inset-[-12%] pointer-events-none z-0 flex items-center justify-center opacity-75"
        style={{
          transform: `rotate(${mousePos.x * 12}deg) scale(${1 + Math.abs(mousePos.y) * 0.05})`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Outer Rotating Hexagon Ring */}
        <svg className="w-full h-full animate-hex-spin" viewBox="0 0 500 500" fill="none">
          <polygon
            points="250,15 455,132 455,368 250,485 45,368 45,132"
            stroke="#FF6B00"
            strokeWidth="2"
            strokeDasharray="18 12"
            strokeOpacity="0.65"
          />
          <polygon
            points="250,45 425,145 425,355 250,455 75,355 75,145"
            stroke="#FF1E42"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Reverse Counter-Rotating Hexagon Ring */}
        <svg className="absolute w-[88%] h-[88%] animate-hex-spin-reverse" viewBox="0 0 500 500" fill="none">
          <polygon
            points="250,30 440,140 440,360 250,470 60,360 60,140"
            stroke="#E000FF"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            strokeOpacity="0.5"
          />
          <polygon
            points="250,70 405,160 405,340 250,430 95,340 95,160"
            stroke="#00F0FF"
            strokeWidth="1"
            strokeDasharray="4 14"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* ── Main Miles Morales Dimensional Card Container with 3D Tilt ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-[#FF1E42]/60 shadow-[0_0_60px_rgba(255,30,66,0.35),0_0_100px_rgba(255,107,0,0.25)] bg-[#090714] z-10"
        style={{
          transform: `rotateY(${mousePos.x * 16}deg) rotateX(${-mousePos.y * 16}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Background Image: Miles Morales Falling through Hexagonal Multiverse Portal */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/spider_miles_portal.jpg"
            alt="Spider-Man Miles Morales Across the Spider-Verse Multiverse Portal"
            className={`w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 ease-out ${
              isGlitching ? 'animate-spider-glitch filter hue-rotate-90' : ''
            }`}
          />
          {/* Dimensional Comic Halftone Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/40 pointer-events-none" />
          <div className="absolute inset-0 halftone-spider-dots opacity-30 pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-spider-grid opacity-20 pointer-events-none" />
        </div>

        {/* Ambient Glowing Spider Neon Rim & Multiverse Vignette */}
        <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/20 pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(255,30,66,0.45)] pointer-events-none" />

        {/* ── Top HUD Bar: Multiverse Coordinate & Live Sensor ── */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          {/* Dimension Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#FF1E42]/50 text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF1E42] animate-ping" />
            <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-widest text-[#FF1E42]">
              {activeDimension} // LENS
            </span>
          </div>

          {/* Interactive Warp Trigger */}
          <button
            type="button"
            onClick={triggerGlitch}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 border border-[#FF6B00]/60 text-[#FFA500] font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
            title="Trigger Dimensional Warp"
          >
            <Zap className={`w-3.5 h-3.5 text-[#FFE600] ${venomCharged ? 'animate-bounce' : ''}`} />
            <span>WARP</span>
          </button>
        </div>

        {/* ── Center Anomaly Hex Laser Crosshair ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#FF1E42]/30 animate-ping opacity-25" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 border border-[#00F0FF]/40 rotate-45 animate-spin" style={{ animationDuration: '14s' }} />
        </div>

        {/* ── Bottom HUD Plate: Dimension Matrix Selector ── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-[#05050a] via-[#090714]/80 to-transparent z-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(['EARTH-1610', 'EARTH-65', 'EARTH-2099'] as const).map((dim) => (
              <button
                key={dim}
                type="button"
                onClick={() => {
                  setActiveDimension(dim);
                  triggerGlitch();
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  activeDimension === dim
                    ? 'bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white shadow-md shadow-[#FF1E42]/40 ring-1 ring-white/30'
                    : 'bg-black/60 text-stone-400 hover:text-white border border-white/10'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-stone-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ONLINE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SpiderMilesMultiverseHero;
