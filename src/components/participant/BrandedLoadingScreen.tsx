import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CollegeEmblem, SpiherStarburstLogo } from '../common/CollegeLogo';
import { Sparkles, Zap } from 'lucide-react';

interface BrandedLoadingScreenProps {
  onFinish: () => void;
  videoSrc?: string;
  collegeName?: string;
  symposiumName?: string;
}

const STATUS_MESSAGES = [
  { threshold: 0,  text: 'INITIALIZING CAMPUS PORTAL...' },
  { threshold: 28, text: 'LOADING EVENT MATRIX...' },
  { threshold: 55, text: 'CALIBRATING PASS ENGINE...' },
  { threshold: 82, text: 'RADIANZA IS READY.' },
];

export const BrandedLoadingScreen: React.FC<BrandedLoadingScreenProps> = ({
  onFinish,
}) => {
  const [progress, setProgress]     = useState(0);
  const [isExiting, setIsExiting]   = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsExiting(true);
    setTimeout(onFinish, 700);
  };

  useEffect(() => {
    // Show skip button after 1 s
    const skipTimer = setTimeout(() => setSkipVisible(true), 1000);

    // Organic progress counter
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(finish, 350);
          return 100;
        }
        // Slows near 80 for drama, then rushes to 100
        const speed = prev < 75 ? Math.random() * 7 + 4 : Math.random() * 3 + 1;
        return Math.min(prev + speed, 100);
      });
    }, 90);

    // Hard safety cap at 5 s
    const safety = setTimeout(finish, 5500);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(interval);
      clearTimeout(safety);
    };
  }, []);

  const statusText = STATUS_MESSAGES
    .filter(m => progress >= m.threshold)
    .at(-1)?.text ?? STATUS_MESSAGES[0].text;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="loading"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden select-none"
          style={{
            background: 'linear-gradient(160deg, #ffffff 0%, #f0f8fc 45%, #e4f0fb 100%)',
          }}
        >
          {/* ── Radiant ambient orbs ── */}
          <div className="pointer-events-none absolute inset-0">
            {/* Blue orb — top right */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,119,200,0.22) 0%, transparent 70%)' }}
            />
            {/* Cyan orb — bottom left */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
              className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.18) 0%, transparent 70%)' }}
            />
            {/* Purple orb — center background */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.3, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)' }}
            />
          </div>

          {/* ── Top bar ── */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pt-5 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-light text-[11px] font-bold text-[#002b66] tracking-wider uppercase"
            >
              <span
                className="w-2 h-2 rounded-full bg-[#00a887] animate-radianza-ping"
                style={{ display: 'inline-block' }}
              />
              SPIHER • Deemed to be University
            </motion.div>

            <AnimatePresence>
              {skipVisible && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  type="button"
                  onClick={finish}
                  className="px-4 py-1.5 rounded-full glass-light text-[11px] font-bold text-[#002b66] hover:text-white hover:bg-[#002b66] border border-[#d4e8f5] transition-all duration-200 cursor-pointer"
                >
                  Skip ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Center: Emblem + Title ── */}
          <div className="relative z-10 flex flex-col items-center text-center px-5 gap-6 my-auto">

            {/* Radiant aura + official SPIHER emblem */}
            <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
              {/* Subtle ambient radiant halo */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(0,242,254,0.3) 0%, rgba(0,119,200,0.2) 50%, rgba(124,58,237,0.1) 100%)',
                  filter: 'blur(16px)',
                }}
              />

              {/* Official SPIHER emblem card */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white flex flex-col items-center justify-center
                           shadow-[0_15px_40px_-10px_rgba(0,119,200,0.3)]
                           border border-[#d4e8f5]"
              >
                <div className="flex items-center justify-center p-3">
                  <CollegeEmblem size={64} />
                </div>
              </motion.div>
            </div>

            {/* RADIANZA '26 typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f8fc] border border-[#d4e8f5] text-[#0077c8] text-[10px] font-bold tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-[#00a887]" />
                SPIHER PRESENTS
              </div>

              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight text-[#001f4d]">
                RADIANZA{' '}
                <span className="text-radianza">'26</span>
              </h1>

              <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#002b66] uppercase">
                National-Level Technical Symposium
              </p>

              <p className="text-xs text-slate-500 italic font-medium">
                "Igniting Ideas, Innovating Tomorrow"
              </p>
            </motion.div>
          </div>

          {/* ── Bottom: Progress bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative z-10 w-full max-w-md mx-auto px-6 pb-10 space-y-3 flex flex-col items-center"
          >
            {/* Status + percentage */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono font-semibold">
              <span className="flex items-center gap-1.5 text-[#0077c8]">
                <Zap className="w-3 h-3 text-[#00a887] animate-pulse" />
                {statusText}
              </span>
              <span className="font-bold text-[#001f4d]">
                {Math.floor(progress)}%
              </span>
            </div>

            {/* Track */}
            <div className="w-full h-1.5 rounded-full bg-white border border-[#d4e8f5] overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, #002b66 0%, #0077c8 50%, #00f2fe 100%)',
                  boxShadow: '0 0 12px rgba(0,242,254,0.7)',
                }}
                transition={{ ease: 'linear', duration: 0.08 }}
              />
            </div>

            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              October 15 – 16, 2026 · Coimbatore
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandedLoadingScreen;
