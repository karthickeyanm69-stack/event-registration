import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface BrandedLoadingScreenProps {
  collegeName?: string;
  symposiumName?: string;
  onFinish?: () => void;
  durationMs?: number;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  collegeName = "St. Peter's Institute of Higher Education & Research",
  symposiumName = 'IGNITE 2024 — National Level Symposium',
  onFinish,
  durationMs = 1600,
}) => {
  useEffect(() => {
    if (!onFinish) return;
    const timer = setTimeout(() => {
      onFinish();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onFinish, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#000a1e] via-[#001736] to-[#000a1e] text-white px-6 select-none overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary-container/40 rounded-full blur-2xl pointer-events-none" />

      {/* Central Animated Badge */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Pulsing concentric rings */}
        <div className="absolute w-32 h-32 rounded-full border-2 border-secondary/30 animate-ping opacity-60" />
        <div className="absolute w-28 h-28 rounded-full border border-secondary-fixed/40 animate-spin [animation-duration:8s]" />

        {/* Core College Logo Container */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-secondary to-secondary-container flex items-center justify-center shadow-2xl shadow-secondary/40 border border-white/20 z-10">
          <Sparkles className="w-10 h-10 text-[#000a1e] stroke-[2.5]" />
        </div>
      </div>

      {/* College Identity & Symposium Branding */}
      <div className="text-center max-w-sm space-y-2 z-10">
        <span className="inline-block text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/10 text-secondary-fixed border border-white/10 shadow-inner">
          Official Event Portal
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
          SPIHER
        </h1>
        <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
          {collegeName}
        </p>
      </div>

      {/* Animated Loading Bar / Indicator */}
      <div className="w-48 mt-8 space-y-2 z-10">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed rounded-full w-full animate-[shimmer_1.5s_infinite] origin-left bg-[length:200%_100%]" />
        </div>
        <p className="text-[11px] text-center text-slate-400 font-medium tracking-wide">
          Verifying Identity & Loading Events...
        </p>
      </div>

      {/* Trust & Verification Badge */}
      <div className="absolute bottom-8 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-secondary-fixed" />
        <span>Secure 1-Participant-1-Event Architecture</span>
      </div>
    </div>
  );
};
