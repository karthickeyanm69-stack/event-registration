import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Users,
  User,
  Clock,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Layers3,
  CheckCircle2,
  Info,
  X,
  Zap,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { CollegeEvent, EventCategory, Participant } from '../../types';

interface EventSelectionViewProps {
  events: CollegeEvent[];
  participantData: Partial<Participant>;
  onBackToOnboarding: () => void;
  onSelectEvent: (event: CollegeEvent) => void;
}

export const EventSelectionView: React.FC<EventSelectionViewProps> = ({
  events,
  participantData,
  onBackToOnboarding,
  onSelectEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Technical');
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [inspectingEvent, setInspectingEvent] = useState<CollegeEvent | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isReadyToRelease, setIsReadyToRelease] = useState(false);

  const filteredEvents = events.filter((e) => e.category === selectedCategory);
  const currentEvent = filteredEvents[activeIndex] || filteredEvents[0];

  const techCount = events.filter((e) => e.category === 'Technical').length;
  const nonTechCount = events.filter((e) => e.category === 'Non-Technical').length;

  const PULL_THRESHOLD = 85;

  const handleCategoryChange = (cat: EventCategory) => {
    setSelectedCategory(cat);
    setActiveIndex(0);
    setIsReadyToRelease(false);
  };

  const handleNext = () => {
    setIsReadyToRelease(false);
    setActiveIndex((prev) => (prev + 1) % filteredEvents.length);
  };

  const handlePrev = () => {
    setIsReadyToRelease(false);
    setActiveIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
  };

  const triggerActivation = (event: CollegeEvent) => {
    setIsActivating(true);
    setTimeout(() => {
      onSelectEvent(event);
    }, 400);
  };

  const handleDrag = (_: any, info: { offset: { x: number; y: number } }) => {
    const isPastThreshold = info.offset.y >= PULL_THRESHOLD;
    if (isPastThreshold !== isReadyToRelease) {
      setIsReadyToRelease(isPastThreshold);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const { x, y } = info.offset;

    if (y >= PULL_THRESHOLD && currentEvent && !isActivating) {
      triggerActivation(currentEvent);
      return;
    }

    setIsReadyToRelease(false);

    const swipeThreshold = 50;
    if (x > swipeThreshold || info.velocity.x > 300) {
      handlePrev();
    } else if (x < -swipeThreshold || info.velocity.x < -300) {
      handleNext();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-white select-none flex flex-col items-center py-4 sm:py-6 px-4 relative overflow-x-hidden">
      {/* Spider-Verse Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#FF1E42]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#FF6B00]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* ── Top Header Navigation Bar ── */}
        <div className="w-full flex items-center justify-between gap-4 mb-4">
          <button
            type="button"
            onClick={onBackToOnboarding}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300 hover:text-white transition-colors cursor-pointer bg-[#110c20] px-3.5 py-1.5 rounded-xl border border-[#FF1E42]/30 shadow-md hover:border-[#FF1E42]"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF1E42]" />
            <span>BACK</span>
          </button>

          {/* Top Right Event Pass Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#110c20] border border-[#FF1E42]/40 text-[#FF6B00] font-mono text-[11px] font-extrabold shadow-md">
              <Ticket className="w-3.5 h-3.5 text-[#FF1E42]" />
              <span>RADIANZA '26</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-white bg-[#110c20] px-3 py-1 rounded-xl border border-white/10 shadow-md font-mono">
              {participantData.name || 'Participant'}
            </div>
          </div>
        </div>

        {/* ── Dynamic Top Marquee / Heading ── */}
        <div className="w-full text-center mb-4 relative min-h-[58px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isReadyToRelease ? (
              <motion.div
                key="release-banner"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#FF1E42]/40 border border-[#FFE600]/40"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FFE600] animate-pulse" />
                <span>RELEASE TO LOCK IN ARENA</span>
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
              </motion.div>
            ) : (
              <motion.div
                key="choose-heading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-0.5"
              >
                <h2 className="text-2xl sm:text-3xl font-['Impact',sans-serif] font-black text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(255,30,66,0.3)]">
                  CHOOSE YOUR ARENA CARD
                </h2>
                <p className="text-xs text-stone-400 font-mono">
                  Swipe left/right to browse • <strong className="text-[#FF6B00]">Pull down</strong> to lock in
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Category & View Mode Switchers ── */}
        <div className="w-full max-w-md flex items-center justify-between gap-3 mb-5">
          {/* Category Tabs */}
          <div className="flex-1 grid grid-cols-2 gap-1.5 p-1 bg-[#110c20] rounded-2xl border border-[#FF1E42]/30 shadow-inner">
            <button
              type="button"
              onClick={() => handleCategoryChange('Technical')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === 'Technical'
                  ? 'bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white shadow-lg shadow-[#FF1E42]/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Technical</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/50">
                {techCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Non-Technical')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === 'Non-Technical'
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#E000FF] text-white shadow-lg shadow-[#FF6B00]/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Non-Tech</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/50">
                {nonTechCount}
              </span>
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-[#110c20] rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('deck')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'deck' ? 'bg-[#FF1E42] text-white shadow-md' : 'text-stone-400 hover:text-white'
              }`}
              title="3D Card Deck"
            >
              <Layers3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#FF1E42] text-white shadow-md' : 'text-stone-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 3D COVERFLOW DECK ── */}
        {viewMode === 'deck' && (
          <div className="relative w-full max-w-md flex flex-col items-center justify-center">
            {/* Deck Main Stage */}
            <div className="relative w-[300px] sm:w-[325px] h-[480px] sm:h-[500px] flex items-center justify-center perspective-[1000px]">
              {/* ── BOTTOM ACTIVATION CRADLE (Drop Slot) ── */}
              <div
                className={`absolute bottom-0 w-[280px] sm:w-[305px] h-32 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-end pb-3 pointer-events-none z-0 ${
                  isReadyToRelease
                    ? 'border-[#FF1E42] bg-[#FF1E42]/20 shadow-[0_0_40px_rgba(255,30,66,0.5)] scale-105'
                    : 'border-white/20 bg-[#110c20]/60 opacity-60'
                }`}
              >
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${
                    isReadyToRelease ? 'text-[#FFE600] animate-bounce' : 'text-stone-500'
                  }`}
                >
                  {isReadyToRelease ? '⚡ DROP TO LOCK IN ARENA' : 'ACTIVATION SLOT'}
                </span>
              </div>

              {/* ── 3D CAROUSEL CARDS ── */}
              {filteredEvents.map((evt, idx) => {
                const diff = idx - activeIndex;
                const isCenter = diff === 0;

                let xOffset = 0;
                let scale = 1;
                let rotateY = 0;
                let zIndex = 10;
                let opacity = 1;

                if (isCenter) {
                  xOffset = 0;
                  scale = 1;
                  rotateY = 0;
                  zIndex = 30;
                  opacity = 1;
                } else if (diff === -1 || (diff > 0 && diff === filteredEvents.length - 1 && filteredEvents.length > 2)) {
                  xOffset = -115;
                  scale = 0.86;
                  rotateY = 20;
                  zIndex = 15;
                  opacity = 0.7;
                } else if (diff === 1 || (diff < 0 && Math.abs(diff) === filteredEvents.length - 1 && filteredEvents.length > 2)) {
                  xOffset = 115;
                  scale = 0.86;
                  rotateY = -20;
                  zIndex = 15;
                  opacity = 0.7;
                } else {
                  xOffset = diff < 0 ? -170 : 170;
                  scale = 0.72;
                  rotateY = diff < 0 ? 30 : -30;
                  zIndex = 5;
                  opacity = 0;
                }

                if (opacity === 0) return null;

                return (
                  <motion.div
                    key={evt.id}
                    drag={isCenter ? true : false}
                    dragSnapToOrigin={!isActivating}
                    dragConstraints={{ left: -70, right: 70, top: 0, bottom: 130 }}
                    dragElastic={{ top: 0.05, bottom: 0.2, left: 0.1, right: 0.1 }}
                    onDrag={isCenter ? handleDrag : undefined}
                    onDragEnd={isCenter ? handleDragEnd : undefined}
                    onClick={() => {
                      if (!isCenter) {
                        setActiveIndex(idx);
                        setIsReadyToRelease(false);
                      }
                    }}
                    animate={{
                      x: xOffset,
                      scale,
                      rotateY,
                      zIndex,
                      opacity,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 28,
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className={`absolute top-0 w-[280px] sm:w-[305px] h-[435px] sm:h-[455px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none border-2 bg-[#090714] text-white ${
                      isCenter
                        ? 'border-[#FF1E42] shadow-[0_0_35px_rgba(255,30,66,0.35)] cursor-grab active:cursor-grabbing'
                        : 'border-white/10 opacity-70 cursor-pointer'
                    }`}
                  >
                    {/* Card Top Media View */}
                    <div className="relative h-[210px] sm:h-[225px] w-full overflow-hidden bg-black pointer-events-none">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090714] via-black/30 to-transparent" />

                      {/* Header Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-md ${
                            evt.category === 'Technical' ? 'bg-[#FF1E42]' : 'bg-[#FF6B00]'
                          }`}
                        >
                          {evt.category}
                        </span>

                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 text-white border border-white/20">
                          {evt.isTeamEvent ? `${evt.minTeamSize}-${evt.maxTeamSize} Members` : 'Solo'}
                        </span>
                      </div>

                      {/* Title & Tagline in Media Bottom */}
                      <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                        <h3 className="text-base sm:text-lg font-bold leading-snug drop-shadow-md">
                          {evt.title}
                        </h3>
                        <p className="text-[11px] text-[#FF6B00] font-mono font-semibold line-clamp-1">
                          {evt.tagline || 'Arena Challenge'}
                        </p>
                      </div>
                    </div>

                    {/* Card Body Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-[#090714] pointer-events-none">
                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1.5 pt-1 border-t border-white/10 text-xs text-stone-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#FF1E42]" />
                          <span className="font-semibold text-white">{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span className="font-semibold text-white">{evt.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-mono font-black text-[#FFE600] bg-[#FFE600]/10 px-2.5 py-1 rounded-lg border border-[#FFE600]/30">
                          ₹{evt.price || 100} Entry
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {evt.slotsLeft} slots remaining
                        </span>
                      </div>
                    </div>

                    {/* Interactive Pull/Tap Button Plate */}
                    <div className="p-3 bg-black/50 border-t border-white/10 flex items-center justify-between gap-2 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingEvent(evt);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Rules
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerActivation(evt);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-md shadow-[#FF1E42]/30 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#FFE600]" />
                        <span>SELECT ARENA</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Deck Navigation Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-[#110c20] border border-[#FF1E42]/30 hover:bg-[#FF1E42] text-white shadow-md transition-colors cursor-pointer"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {filteredEvents.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveIndex(i);
                      setIsReadyToRelease(false);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeIndex === i ? 'w-6 bg-[#FF1E42] shadow-[0_0_8px_#FF1E42]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl bg-[#110c20] border border-[#FF1E42]/30 hover:bg-[#FF1E42] text-white shadow-md transition-colors cursor-pointer"
                aria-label="Next card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── GRID VIEW (Alternative Access) ── */}
        {viewMode === 'grid' && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="card-spider-verse rounded-2xl border border-white/10 overflow-hidden shadow-md hover:border-[#FF1E42] transition-all flex flex-col justify-between group"
              >
                <div className="relative h-40 w-full overflow-hidden bg-black">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090714] via-black/30 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF1E42] text-white">
                      {evt.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="text-sm font-bold">{evt.title}</h4>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-stone-300 line-clamp-2">{evt.description}</p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                    <span className="font-mono font-black text-[#FFE600]">₹{evt.price || 100}</span>
                    <span className="text-[10px] font-mono text-stone-400">{evt.slotsLeft} slots</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setInspectingEvent(evt)}
                      className="py-1.5 rounded-xl bg-white/5 text-stone-300 text-xs font-mono font-bold hover:bg-white/10"
                    >
                      Rules
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerActivation(evt)}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white text-xs font-mono font-bold shadow-md"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INSPECT RULES MODAL ── */}
        <AnimatePresence>
          {inspectingEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#090714] text-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-[#FF1E42]/40 shadow-2xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#FF6B00] uppercase">
                    {inspectingEvent.category} ARENA
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectingEvent(null)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF1E42]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-['Impact',sans-serif]">{inspectingEvent.title}</h3>
                  <p className="text-xs text-stone-300 mt-1">{inspectingEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div>
                    <span className="text-stone-400 font-mono block text-[10px]">TIME</span>
                    <span className="font-bold text-white">{inspectingEvent.time}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-mono block text-[10px]">VENUE</span>
                    <span className="font-bold text-white">{inspectingEvent.venue}</span>
                  </div>
                </div>

                {inspectingEvent.rules && (
                  <div className="space-y-1.5 text-xs text-stone-300">
                    <span className="font-bold text-white uppercase font-mono">Arena Rules:</span>
                    <ul className="space-y-1 pl-1">
                      {inspectingEvent.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#FF1E42] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const evt = inspectingEvent;
                    setInspectingEvent(null);
                    triggerActivation(evt);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white font-mono font-bold text-xs uppercase shadow-lg shadow-[#FF1E42]/30"
                >
                  Select This Event (₹{inspectingEvent.price || 100}) →
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventSelectionView;
