import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandedLoadingScreenProps {
  onFinish: () => void;
  videoSrc?: string;
  collegeName?: string;
  symposiumName?: string;
}

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  onFinish,
  videoSrc = '/college_logo_reveal_video.mp4',
}) => {
  const [isExiting, setIsExiting]     = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsExiting(true);
    setTimeout(onFinish, 500);
  };

  useEffect(() => {
    // Attempt playback immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if autoplay is blocked by browser policy
      });
    }

    // Show skip button after 0.6s
    const skipTimer = setTimeout(() => setSkipVisible(true), 600);

    // Dynamic safety cap: finish when video duration ends or after 7s max
    const safetyTimer = setTimeout(finish, 7000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(safetyTimer);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        } catch {}
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      // Set safety timer slightly after video duration
      const durationMs = (videoRef.current.duration + 0.3) * 1000;
      setTimeout(finish, Math.min(durationMs, 8000));
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="video-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden select-none"
        >
          {/* ── Video Container with Seamless Multiply Blending & Radial Mask ── */}
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted
              playsInline
              onEnded={finish}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-contain max-w-5xl mx-auto scale-[1.04]"
              style={{
                mixBlendMode: 'multiply',
                maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 98%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 98%)',
              }}
            />
          </div>

          {/* ── Clean Floating Top-Right Skip Button ── */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-auto">
            <AnimatePresence>
              {skipVisible && (
                <motion.button
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  type="button"
                  onClick={finish}
                  className="px-4 py-2 rounded-full bg-[#002b66]/90 hover:bg-[#002b66] backdrop-blur-md text-white font-mono font-bold text-xs tracking-wider shadow-md active:scale-95 transition-all cursor-pointer border border-[#0077c8]/30"
                >
                  SKIP INTRO ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandedLoadingScreen;
