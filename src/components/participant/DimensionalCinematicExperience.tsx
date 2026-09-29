import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  FastForward,
  User,
  Building,
  Key,
  Compass,
} from 'lucide-react';
import { CollegeEmblem } from '../common/CollegeLogo';

export interface ParticipantGateData {
  name: string;
  collegeName: string;
  participantKey: string;
}

interface DimensionalCinematicExperienceProps {
  onComplete: (data: ParticipantGateData) => void;
  initialData?: Partial<ParticipantGateData>;
}

type ExperiencePhase = 'entry' | 'activating' | 'video_sequence';

const VIDEO_ASSETS = [
  {
    id: 1,
    title: 'Portal Opening & Breach',
    stageLabel: '01 // PORTAL BREACH',
    src: '/videos/dimension_portal_entry_v1.mp4',
  },
  {
    id: 2,
    title: 'Multiverse Convergence & Hero Descent',
    stageLabel: '02 // DIMENSIONAL CONVERGENCE',
    src: '/videos/dimension_tunnel_hero_v2.mp4',
  },
  {
    id: 3,
    title: 'Hero Landing & RADIANZA Revelation',
    stageLabel: '03 // HERO AWAKENING',
    src: '/videos/dimension_hero_landing_v3.mp4',
  },
];

export const DimensionalCinematicExperience: React.FC<DimensionalCinematicExperienceProps> = ({
  onComplete,
  initialData,
}) => {
  // Phase state
  const [phase, setPhase] = useState<ExperiencePhase>('entry');

  // Helper to generate realistic register number
  const generateRandomRegisterNumber = () => {
    const rollNum = Math.floor(100 + Math.random() * 900);
    return `RAD26-IT${rollNum}`;
  };

  // Form State - Pre-fill with auto-generated register number if empty
  const [name, setName] = useState(initialData?.name || '');
  const [collegeName, setCollegeName] = useState(
    initialData?.collegeName || "St. Peter's Institute of Higher Education & Research"
  );
  const [participantKey, setParticipantKey] = useState(
    initialData?.participantKey || generateRandomRegisterNumber()
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Video Sequence Playback State
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // Interactive Participant Actions State
  const [frameActionCharge, setFrameActionCharge] = useState<number>(0);
  const [isHoldingCharge, setIsHoldingCharge] = useState<boolean>(false);
  const [activeComicFx, setActiveComicFx] = useState<{ text: string; x: number; y: number } | null>(null);
  const [webShootTarget, setWebShootTarget] = useState<{ x: number; y: number } | null>(null);
  const [venomBlastActive, setVenomBlastActive] = useState<boolean>(false);

  // Video Element Refs for seamless zero-gap preloading and playback handoff
  const videoRefs = [
    useRef<HTMLVideoElement | null>(null),
    useRef<HTMLVideoElement | null>(null),
    useRef<HTMLVideoElement | null>(null),
  ];

  // Charging interval timer for Frame 1 Hold Action
  useEffect(() => {
    let timer: any;
    if (isHoldingCharge && currentVideoIndex === 0) {
      timer = setInterval(() => {
        setFrameActionCharge((prev) => {
          if (prev >= 100) {
            setIsHoldingCharge(false);
            triggerFrame1Breach();
            return 100;
          }
          return prev + 6;
        });
      }, 50);
    } else if (!isHoldingCharge && frameActionCharge < 100) {
      setFrameActionCharge((prev) => Math.max(0, prev - 4));
    }
    return () => clearInterval(timer);
  }, [isHoldingCharge, currentVideoIndex, frameActionCharge]);

  // Frame 1 Action: Portal Breach Trigger
  const triggerFrame1Breach = () => {
    setActiveComicFx({ text: '*KZZZZT! PORTAL BREACHED*', x: 50, y: 40 });
    setFrameActionCharge(100);
    setTimeout(() => {
      setActiveComicFx(null);
      playCurrentVideo(1);
    }, 700);
  };

  // Frame 2 Action: Web Shoot / Stabilize
  const triggerFrame2WebShoot = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setWebShootTarget({ x, y });
    setActiveComicFx({ text: '*THWIP! TRAJECTORY LOCKED*', x, y });
    setTimeout(() => {
      setActiveComicFx(null);
      playCurrentVideo(2);
    }, 800);
  };

  // Frame 3 Action: Venom Strike Landing
  const triggerFrame3VenomLanding = () => {
    setVenomBlastActive(true);
    setActiveComicFx({ text: '*KRA-KOOOM! HERO AWAKENED*', x: 50, y: 50 });
    setTimeout(() => {
      setActiveComicFx(null);
      setVenomBlastActive(false);
      handleSkipSequence();
    }, 900);
  };

  // Auto-generate key helper
  const handleGenerateKey = () => {
    const generated = generateRandomRegisterNumber();
    setParticipantKey(generated);
    if (!name) setName('Miles Morales');
    setValidationError(null);
  };

  // Form submission handler
  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter your full name to generate dimensional signature.');
      return;
    }
    if (!collegeName.trim()) {
      setValidationError('Please specify your institution or university.');
      return;
    }
    let key = participantKey.trim();
    if (!key) {
      key = `RAD26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setParticipantKey(key);
    }

    setValidationError(null);
    setPhase('activating');

    // Pre-warm Video 1 in background
    const v1 = videoRefs[0].current;
    if (v1) {
      v1.currentTime = 0;
      v1.muted = isAudioMuted;
      v1.load();
    }

    // After 1.3s dramatic confirmation glitch, launch continuous cinematic sequence
    setTimeout(() => {
      setPhase('video_sequence');
      playCurrentVideo(0);
    }, 1350);
  };

  // Skip entire intro directly to interactive website
  const handleSkipSequence = useCallback(() => {
    const finalData: ParticipantGateData = {
      name: name.trim() || 'Multiverse Traveler',
      collegeName: collegeName.trim() || "St. Peter's Institute of Higher Education & Research",
      participantKey: participantKey.trim() || 'RAD26-DIM894',
    };
    onComplete(finalData);
  }, [name, collegeName, participantKey, onComplete]);

  // Zero-gap video playback controller
  const playCurrentVideo = useCallback(
    (index: number) => {
      if (index >= VIDEO_ASSETS.length) {
        handleSkipSequence();
        return;
      }

      setCurrentVideoIndex(index);
      const activeVideo = videoRefs[index].current;
      if (activeVideo) {
        activeVideo.muted = isAudioMuted;
        activeVideo.currentTime = 0;
        const playPromise = activeVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay with sound restricted, fallback to muted playback
            activeVideo.muted = true;
            setIsAudioMuted(true);
            activeVideo.play().catch(() => {});
          });
        }
      }

      // Pre-warm next video
      const nextIndex = index + 1;
      if (nextIndex < VIDEO_ASSETS.length) {
        const nextVideo = videoRefs[nextIndex].current;
        if (nextVideo) {
          nextVideo.preload = 'auto';
          nextVideo.load();
        }
      }
    },
    [isAudioMuted, handleSkipSequence]
  );

  // Audio Toggle
  const toggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    videoRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.muted = nextMuted;
      }
    });
  };

  // Video event listeners for handoff
  useEffect(() => {
    if (phase !== 'video_sequence') return;

    const currentRef = videoRefs[currentVideoIndex]?.current;
    if (!currentRef) return;

    const handleTimeUpdate = () => {
      if (!currentRef.duration) return;
      const prog = (currentRef.currentTime / currentRef.duration) * 100;
      setVideoProgress(prog);

      // Pre-trigger next video when 98% done to guarantee zero black frame
      if (prog > 97.5 && currentVideoIndex + 1 < VIDEO_ASSETS.length) {
        const nextVideo = videoRefs[currentVideoIndex + 1]?.current;
        if (nextVideo && nextVideo.paused) {
          nextVideo.muted = isAudioMuted;
          nextVideo.play().catch(() => {});
        }
      }
    };

    const handleEnded = () => {
      if (currentVideoIndex + 1 < VIDEO_ASSETS.length) {
        playCurrentVideo(currentVideoIndex + 1);
      } else {
        // All 3 videos complete! Transition smoothly to website hero
        handleSkipSequence();
      }
    };

    currentRef.addEventListener('timeupdate', handleTimeUpdate);
    currentRef.addEventListener('ended', handleEnded);

    return () => {
      currentRef.removeEventListener('timeupdate', handleTimeUpdate);
      currentRef.removeEventListener('ended', handleEnded);
    };
  }, [phase, currentVideoIndex, playCurrentVideo, isAudioMuted, handleSkipSequence]);

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#080006] text-white flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      {/* ── 1. BACKGROUND COMIC HALFTONE & ENERGY NODES ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 halftone-spider-dots opacity-30 pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#100010]/80 via-[#080006]/95 to-[#080006] pointer-events-none z-0"
      />

      {/* Atmospheric Ambient Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#C40030]/20 blur-[130px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#E00070]/18 blur-[130px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#200020]/40 blur-[150px] pointer-events-none"
      />

      {/* ── 2. PARTICIPANT ENTRY GATE SCREEN ── */}
      <AnimatePresence mode="wait">
        {phase === 'entry' && (
          <motion.div
            key="phase-entry"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg px-4 sm:px-6 relative z-20 flex flex-col items-center"
          >
            {/* Top Brand Emblem */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1a041c] border border-[#C40030]/50 shadow-[0_0_15px_rgba(196,0,48,0.3)]">
                <CollegeEmblem size={20} />
                <span className="text-[11px] font-mono font-black tracking-widest text-[#E00070] uppercase">
                  DIMENSIONAL ACCESS GATEWAY
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-['Impact',sans-serif] tracking-wide text-white uppercase mt-1">
                RADIANZA <span className="text-[#C40030]">’26</span>
              </h1>
              <p className="text-xs text-[#E2D5DE]/80 max-w-sm font-medium">
                Enter your identity to synchronize with Earth-1610 before the dimensional portal activates.
              </p>
            </div>

            {/* Entry Form Card */}
            <div className="w-full comic-panel-card p-6 sm:p-8 rounded-3xl space-y-5 relative overflow-hidden">
              {/* Halftone Texture Overlay on Card */}
              <div className="absolute inset-0 halftone-spider-dots-dense opacity-20 pointer-events-none" />

              <form onSubmit={handleEntrySubmit} className="space-y-4 relative z-10">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="gate-name"
                    className="text-xs font-mono font-bold text-[#E2D5DE] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#C40030]" />
                    <span>Participant Full Name</span>
                  </label>
                  <input
                    id="gate-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Miles Morales / Aarav Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-[#080006]/90 border border-[#C40030]/40 text-sm font-semibold text-white placeholder:text-[#A38FA0]/50 focus:outline-none focus:border-[#E00070] focus:ring-2 focus:ring-[#E00070]/25 transition-all shadow-inner"
                    required
                  />
                </div>

                {/* College / Institution */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="gate-college"
                    className="text-xs font-mono font-bold text-[#E2D5DE] flex items-center gap-2"
                  >
                    <Building className="w-3.5 h-3.5 text-[#E00070]" />
                    <span>Institution / University</span>
                  </label>
                  <input
                    id="gate-college"
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. SPIHER / Anna University"
                    className="w-full px-4 py-3 rounded-2xl bg-[#080006]/90 border border-[#C40030]/40 text-sm font-semibold text-white placeholder:text-[#A38FA0]/50 focus:outline-none focus:border-[#E00070] focus:ring-2 focus:ring-[#E00070]/25 transition-all shadow-inner"
                    required
                  />
                </div>

                {/* Participant Key */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="gate-key"
                      className="text-xs font-mono font-bold text-[#E2D5DE] flex items-center gap-2"
                    >
                      <Key className="w-3.5 h-3.5 text-[#F07030]" />
                      <span>Participant Register / Roll Number</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateKey}
                      className="text-[10px] font-mono font-bold text-[#FF287D] hover:text-white transition-colors cursor-pointer bg-[#1a041c] px-2 py-0.5 rounded-md border border-[#C40030]/30 hover:border-[#FF287D]"
                    >
                      ⚡ Auto-Generate
                    </button>
                  </div>
                  <input
                    id="gate-key"
                    type="text"
                    value={participantKey}
                    onChange={(e) => setParticipantKey(e.target.value.toUpperCase())}
                    placeholder="e.g. 2021CS042 or RAD26-IT104"
                    className="w-full px-4 py-3 rounded-2xl bg-[#080006]/90 border border-[#C40030]/40 text-sm font-mono font-bold text-[#FF287D] placeholder:text-[#A38FA0]/50 focus:outline-none focus:border-[#E00070] focus:ring-2 focus:ring-[#E00070]/25 transition-all shadow-inner uppercase"
                  />
                </div>

                {/* Error Banner */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-[#C40030]/20 border border-[#C40030]/60 text-xs font-medium text-[#FF287D] text-center"
                  >
                    {validationError}
                  </motion.div>
                )}

                {/* Submit / Activate Portal Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C40030] via-[#E00070] to-[#F04A20] hover:brightness-110 active:scale-[0.98] text-white font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(196,0,48,0.5)] flex items-center justify-center gap-2.5 cursor-pointer transition-all mt-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>INITIALIZE DIMENSIONAL BREACH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Jump for Developers & Returning Users */}
              <div className="pt-3 border-t border-[#C40030]/20 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#A38FA0] font-medium">Already verified?</span>
                <button
                  type="button"
                  onClick={handleSkipSequence}
                  className="px-3 py-1.5 rounded-xl bg-[#1a041c] border border-[#C40030]/30 hover:border-[#E00070] text-[#E00070] font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Direct to Portal</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 3. PHASE: DIMENSIONAL SIGNATURE CONFIRMED MOMENT ── */}
        {phase === 'activating' && (
          <motion.div
            key="phase-activating"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.35 }}
            className="text-center px-6 relative z-30 space-y-5"
          >
            {/* Pulsing Lock Icon */}
            <div className="w-20 h-20 rounded-3xl bg-[#C40030]/20 border-2 border-[#E00070] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(224,0,112,0.6)] animate-pulse">
              <ShieldCheck className="w-10 h-10 text-[#FF287D]" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#C40030]/30 border border-[#FF287D]/50 text-xs font-mono font-black text-[#FF287D] tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>IDENTITY CONFIRMED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Impact',sans-serif] tracking-wider text-white uppercase animate-spider-glitch">
                DIMENSIONAL SIGNATURE FOUND
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[#E2D5DE]/80">
                TRAVELER: <span className="text-[#FF287D] font-bold">{name.toUpperCase()}</span> • KEY:{' '}
                <span className="text-[#F07030] font-bold">{participantKey || 'RAD26-DIM894'}</span>
              </p>
              <p className="text-[11px] font-mono text-[#A38FA0] pt-1">
                COORDINATES LOCKED: EARTH-1610 // SECTOR-SPIHER-IT
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. CONTINUOUS 3-VIDEO CINEMATIC PIPELINE (CONNECTED FRAMES) ── */}
      <div
        className={`absolute inset-0 w-full h-full z-40 transition-opacity duration-700 flex flex-col items-center justify-center bg-[#080006] ${
          phase === 'video_sequence' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Connected Frame Progression Header (Frame 01 ── Frame 02 ── Frame 03) */}
        <div className="relative z-30 w-full max-w-lg px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {VIDEO_ASSETS.map((asset, idx) => {
              const isActive = currentVideoIndex === idx;
              const isPast = currentVideoIndex > idx;
              return (
                <React.Fragment key={asset.id}>
                  <button
                    type="button"
                    onClick={() => playCurrentVideo(idx)}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C40030] to-[#E00070] text-white shadow-[0_0_15px_rgba(196,0,48,0.6)] ring-1 ring-[#FF287D]'
                        : isPast
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : 'bg-black/60 text-stone-400 hover:text-white border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FFE600] animate-ping' : isPast ? 'bg-emerald-400' : 'bg-stone-500'}`} />
                    <span>FRAME 0{idx + 1}</span>
                  </button>

                  {idx < VIDEO_ASSETS.length - 1 && (
                    <div className="w-4 sm:w-8 h-[2px] bg-gradient-to-r from-[#C40030]/60 via-[#E00070]/60 to-[#F07030]/60 relative overflow-hidden">
                      <div
                        className="h-full bg-[#FFE600] transition-all duration-300"
                        style={{ width: currentVideoIndex > idx ? '100%' : currentVideoIndex === idx ? `${videoProgress}%` : '0%' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Quick Skip / Enter Button */}
          <button
            type="button"
            onClick={handleSkipSequence}
            className="px-3 py-1 rounded-xl bg-black/80 hover:bg-[#C40030]/30 border border-white/20 hover:border-[#FF287D] text-[#E2D5DE] hover:text-white text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>Skip To Portal</span>
            <FastForward className="w-3 h-3 text-[#FF287D]" />
          </button>
        </div>

        {/* 9:16 Mobile-First Framing Container with Comic Letterboxing on Desktop */}
        <div className="relative w-full h-[78vh] sm:h-full sm:max-w-[440px] sm:max-h-[780px] aspect-[9/16] bg-black flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(196,0,48,0.4)] rounded-2xl sm:rounded-3xl border-2 border-[#C40030]/60">
          {VIDEO_ASSETS.map((asset, index) => {
            const isActive = currentVideoIndex === index;
            return (
              <video
                key={asset.id}
                ref={(el) => {
                  videoRefs[index].current = el;
                }}
                src={asset.src}
                preload="auto"
                playsInline
                muted={isAudioMuted}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              />
            );
          })}

          {/* Frame Edge Neon Glow Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 ring-1 ring-inset ring-[#FF287D]/40 pointer-events-none z-20"
          />

          {/* Cinematic Comic Scanlines & Vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none z-20"
          />

          {/* ── PARTICIPANT INTERACTIVE ACTION HUD (FRAME-SPECIFIC) ── */}
          <div
            className="absolute inset-0 z-35 flex flex-col items-center justify-center p-6 cursor-crosshair"
            onClick={(e) => {
              if (currentVideoIndex === 1) {
                triggerFrame2WebShoot(e);
              }
            }}
          >
            {/* ── Frame 1 Interactive Action: Charge & Breach Portal ── */}
            {currentVideoIndex === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 text-center pointer-events-auto"
              >
                <button
                  type="button"
                  onMouseDown={() => setIsHoldingCharge(true)}
                  onMouseUp={() => setIsHoldingCharge(false)}
                  onTouchStart={() => setIsHoldingCharge(true)}
                  onTouchEnd={() => setIsHoldingCharge(false)}
                  onClick={() => triggerFrame1Breach()}
                  className="relative group w-20 h-20 rounded-full bg-gradient-to-tr from-[#C40030] to-[#E00070] flex items-center justify-center shadow-[0_0_35px_rgba(196,0,48,0.8)] border-2 border-white/40 active:scale-90 transition-transform cursor-pointer"
                >
                  <Zap className="w-9 h-9 text-[#FFE600] animate-bounce" />
                  {/* Rotating charge SVG ring */}
                  <svg className="absolute inset-[-6px] w-[92px] h-[92px] rotate-[-90deg]">
                    <circle
                      cx="46"
                      cy="46"
                      r="42"
                      stroke="#FFE600"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * frameActionCharge) / 100}
                      className="transition-all duration-75"
                    />
                  </svg>
                </button>

                <div className="space-y-1 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#C40030]/50 shadow-lg">
                  <span className="text-[11px] font-mono font-black text-[#FFE600] tracking-wider uppercase block">
                    ⚡ TAP / HOLD TO CHARGE PORTAL
                  </span>
                  <p className="text-[10px] font-mono text-[#E2D5DE]/80">
                    Synchronize dimensional battery: <strong className="text-white">{Math.round(frameActionCharge)}%</strong>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Frame 2 Interactive Action: Shoot Web / Target Earth-1610 ── */}
            {currentVideoIndex === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 text-center pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00F0FF] flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                  <div className="w-3 h-3 rounded-full bg-[#FF287D] animate-ping" />
                </div>

                <div className="space-y-1 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#00F0FF]/50 shadow-lg">
                  <span className="text-[11px] font-mono font-black text-[#00F0FF] tracking-wider uppercase block">
                    🕸️ TAP SCREEN TO SHOOT WEB
                  </span>
                  <p className="text-[10px] font-mono text-[#E2D5DE]/80">
                    Stabilize Miles Morales through the multiverse tunnel
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Frame 3 Interactive Action: Venom Strike Ground Slam ── */}
            {currentVideoIndex === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 text-center pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={triggerFrame3VenomLanding}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-[#C40030] to-[#E00070] text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(255,107,0,0.8)] border border-white/40 active:scale-95 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <Zap className="w-4 h-4 text-[#FFE600] fill-current" />
                  <span>UNLEASH VENOM SLAM &amp; ENTER</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <p className="text-[10px] font-mono text-[#E2D5DE]/80 bg-black/75 px-3 py-1 rounded-full border border-white/10">
                  Land hero into the RADIANZA '26 Arena Matrix
                </p>
              </motion.div>
            )}

            {/* Floating Comic Action SFX Popups */}
            <AnimatePresence>
              {activeComicFx && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1.2, rotate: 5 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                  style={{ top: `${activeComicFx.y}%`, left: `${activeComicFx.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none px-4 py-2 bg-[#FFE600] text-black font-mono font-black text-sm sm:text-base uppercase tracking-wider shadow-[5px_5px_0px_#000] border-2 border-black rotate-[-8deg]"
                >
                  {activeComicFx.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top Video HUD Controls: Stage Indicator & Audio */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between text-xs">
            {/* Stage Pill */}
            <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#C40030]/60 text-[10px] font-mono font-bold text-[#FF287D] flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#C40030] animate-ping" />
              <span>{VIDEO_ASSETS[currentVideoIndex]?.stageLabel}</span>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#FF287D] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label="Toggle Audio"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#FF287D]" />}
            </button>
          </div>

          {/* Frame Navigation Arrows (Left / Right) */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-between pointer-events-none">
            {currentVideoIndex > 0 ? (
              <button
                type="button"
                onClick={() => playCurrentVideo(currentVideoIndex - 1)}
                className="w-9 h-9 rounded-full bg-black/75 hover:bg-[#C40030] text-white flex items-center justify-center border border-white/20 pointer-events-auto transition-all shadow-lg active:scale-95 cursor-pointer"
                title="Previous Frame"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            ) : <div />}

            {currentVideoIndex < VIDEO_ASSETS.length - 1 ? (
              <button
                type="button"
                onClick={() => playCurrentVideo(currentVideoIndex + 1)}
                className="w-9 h-9 rounded-full bg-black/75 hover:bg-[#C40030] text-white flex items-center justify-center border border-white/20 pointer-events-auto transition-all shadow-lg active:scale-95 cursor-pointer"
                title="Next Frame"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkipSequence}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C40030] to-[#E00070] text-white text-[11px] font-mono font-bold flex items-center gap-1 border border-white/30 pointer-events-auto transition-all shadow-lg active:scale-95 cursor-pointer animate-pulse"
                title="Enter Portal"
              >
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bottom Continuous Progress Bar & Connected Frame Description */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#E2D5DE]">
              <span className="text-white drop-shadow-md">{VIDEO_ASSETS[currentVideoIndex]?.title}</span>
              <span className="text-[#FF287D]">{Math.round(videoProgress)}%</span>
            </div>

            {/* 3-segment connected progress indicator */}
            <div className="w-full grid grid-cols-3 gap-1.5">
              {VIDEO_ASSETS.map((asset, idx) => {
                let fill = 0;
                if (idx < currentVideoIndex) fill = 100;
                else if (idx === currentVideoIndex) fill = videoProgress;
                return (
                  <div
                    key={asset.id}
                    onClick={() => playCurrentVideo(idx)}
                    className="h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer hover:bg-white/30 transition-colors"
                    title={`Jump to Frame 0${idx + 1}`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#C40030] via-[#E00070] to-[#F07030] transition-all duration-100"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
