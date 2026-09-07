import React, { useEffect, useState } from 'react';

interface BrandedLoadingScreenProps {
  onFinish: () => void;
  collegeName?: string;
  symposiumName?: string;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  onFinish,
  collegeName = "St. Peter's Institute of Higher Education & Research",
  symposiumName = 'IGNITE 2026',
}) => {
  const [progress, setProgress] = useState(10);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth progress bar animation over ~1.1s
    const p1 = setTimeout(() => setProgress(45), 200);
    const p2 = setTimeout(() => setProgress(80), 550);
    const p3 = setTimeout(() => setProgress(100), 950);

    // Trigger fade-out and finish
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-screen flex flex-col items-center justify-center bg-white select-none transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center max-w-sm px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Official College Logo */}
        <div className="w-24 h-24 mb-5 flex items-center justify-center p-2 rounded-2xl bg-white shadow-sm border border-slate-100">
          <img
            src="/spiher-logo.jpg"
            alt={collegeName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Institution Title */}
        <div className="space-y-1 mb-6">
          <span className="text-[11px] font-black tracking-widest text-[#0077c8] uppercase bg-blue-50 px-3 py-1 rounded-full inline-block border border-blue-100/60">
            {symposiumName} PORTAL
          </span>
          <h1 className="text-lg font-extrabold text-[#001f4d] tracking-tight pt-1">
            St. PETER'S
          </h1>
          <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
            Institute of Higher Education & Research
          </p>
        </div>

        {/* Sleek Smooth Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#002b66] via-[#0077c8] to-[#00a887] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandedLoadingScreen;
