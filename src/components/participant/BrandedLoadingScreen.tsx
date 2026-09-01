import React, { useEffect, useState } from 'react';
import { CollegeEmblem } from '../common/CollegeLogo';

interface BrandedLoadingScreenProps {
  collegeName?: string;
  symposiumName?: string;
  onFinish: () => void;
  durationMs?: number;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  collegeName = "St. Peter's Institute of Higher Education & Research",
  symposiumName = 'IGNITE 2024 • National Level Symposium',
  onFinish,
  durationMs = 1400,
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 350);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white spiher-pattern-bg transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center p-8 max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Official College Emblem with Animated Glow Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#0077c8]/20 to-[#00a887]/20 blur-xl animate-pulse" />
          <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-[#d4e8f5]">
            <CollegeEmblem size={84} />
          </div>
        </div>

        {/* Institution Branding */}
        <div className="space-y-2">
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#002b66] tracking-tight">
            St. PETER'S
          </h1>
          <h2 className="text-xs font-black uppercase tracking-wider text-[#002b66]">
            INSTITUTE OF HIGHER EDUCATION & RESEARCH
          </h2>
          <div className="bg-[#0095d9] px-3 py-1 rounded text-center max-w-xs mx-auto mt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-white">
              DEEMED TO BE UNIVERSITY U/S 3 OF THE UGC ACT 1956
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="w-8 h-8 border-3 border-[#0077c8] border-t-[#00a887] rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#002b66] tracking-wide">
            Loading Event Portal...
          </span>
        </div>
      </div>
    </div>
  );
};
