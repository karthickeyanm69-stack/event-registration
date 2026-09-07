import React, { useEffect, useState } from 'react';

interface BrandedLoadingScreenProps {
  onFinish: () => void;
  collegeName?: string;
  symposiumName?: string;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  onFinish,
}) => {
  const [progress, setProgress] = useState(15);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth progress animation over ~1.1 seconds
    const p1 = setTimeout(() => setProgress(50), 200);
    const p2 = setTimeout(() => setProgress(85), 600);
    const p3 = setTimeout(() => setProgress(100), 950);

    // Fade out and finish
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1150);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1450);

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
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center justify-center max-w-xs w-full px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Full Clean Logo with pure seamless white background */}
        <div className="w-full flex justify-center mb-6">
          <img
            src="/spiher-logo.jpg"
            alt="St. Peter's Institute of Higher Education & Research"
            className="w-48 sm:w-56 h-auto object-contain block select-none drop-shadow-none"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>

        {/* Minimal Smooth Gradient Loading Bar */}
        <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
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
