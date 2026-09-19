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

  // Smooth gesture drag handler
  const handleDrag = (_: any, info: { offset: { x: number; y: number } }) => {
    const isPastThreshold = info.offset.y >= PULL_THRESHOLD;
    if (isPastThreshold !== isReadyToRelease) {
      setIsReadyToRelease(isPastThreshold);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const { x, y } = info.offset;

    // Pull down activation trigger
    if (y >= PULL_THRESHOLD && currentEvent && !isActivating) {
      triggerActivation(currentEvent);
      return;
    }

    setIsReadyToRelease(false);

    // Horizontal swipe navigation
    const swipeThreshold = 50;
    if (x > swipeThreshold || info.velocity.x > 300) {
      handlePrev();
    } else if (x < -swipeThreshold || info.velocity.x < -300) {
      handleNext();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 select-none flex flex-col items-center">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full flex items-center justify-between gap-4 mb-4">
        <button
          type="button"
          onClick={onBackToOnboarding}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0077c8] transition-colors cursor-pointer bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#d4e8f5] shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Top Right Event Pass Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef7fc] border border-[#d4e8f5] text-[#002b66] font-mono text-[11px] font-extrabold shadow-xs">
            <Ticket className="w-3.5 h-3.5 text-[#0077c8]" />
            <span>RADIANZA '26</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#002b66] bg-white px-3 py-1 rounded-xl border border-[#d4e8f5] shadow-xs font-mono">
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
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/30 border-2 border-emerald-300 animate-pulse"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ RELEASE TO ACTIVATE EVENT! ⚡</span>
              <Zap className="w-4 h-4 fill-white" />
            </motion.div>
          ) : (
            <motion.div
              key="choose-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0.5"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#001f4d] tracking-tight">
                Choose your event card
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Swipe left/right to browse • <strong>Pull down</strong> to select & lock in
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Category & View Mode Switchers ── */}
      <div className="w-full max-w-md flex items-center justify-between gap-3 mb-5">
        {/* Category Tabs */}
        <div className="flex-1 grid grid-cols-2 gap-1.5 p-1 bg-[#f0f8fc] rounded-2xl border border-[#d4e8f5] shadow-inner">
          <button
            type="button"
            onClick={() => handleCategoryChange('Technical')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedCategory === 'Technical'
                ? 'bg-[#002b66] text-white shadow-md'
                : 'text-[#002b66] hover:bg-white/80'
            }`}
          >
            <span>Technical</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {techCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('Non-Technical')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedCategory === 'Non-Technical'
                ? 'bg-[#00a887] text-white shadow-md'
                : 'text-[#002b66] hover:bg-white/80'
            }`}
          >
            <span>Non-Tech</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {nonTechCount}
            </span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-[#f0f8fc] rounded-2xl border border-[#d4e8f5]">
          <button
            type="button"
            onClick={() => setViewMode('deck')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'deck' ? 'bg-[#002b66] text-white shadow-xs' : 'text-slate-500'
            }`}
            title="3D Card Deck"
          >
            <Layers3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#002b66] text-white shadow-xs' : 'text-slate-500'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 3D COVERFLOW DECK (Hardware Accelerated & Buttery Smooth) ── */}
      {viewMode === 'deck' && (
        <div className="relative w-full max-w-md flex flex-col items-center justify-center">
          {/* Deck Main Stage */}
          <div className="relative w-[300px] sm:w-[325px] h-[480px] sm:h-[500px] flex items-center justify-center perspective-[1000px]">
            {/* ── BOTTOM ACTIVATION CRADLE (Drop Slot) ── */}
            <div
              className={`absolute bottom-0 w-[280px] sm:w-[305px] h-32 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-end pb-3 pointer-events-none z-0 ${
                isReadyToRelease
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_35px_rgba(16,185,129,0.35)] scale-105'
                  : 'border-slate-300/80 bg-white/40 opacity-60'
              }`}
            >
              <span
                className={`text-[11px] font-extrabold font-mono uppercase tracking-wider transition-colors ${
                  isReadyToRelease ? 'text-emerald-700 animate-bounce' : 'text-slate-400'
                }`}
              >
                {isReadyToRelease ? '⚡ Drop to Lock In Event' : 'Activation Slot'}
              </span>
            </div>

            {/* ── 3D CAROUSEL CARDS ── */}
            {filteredEvents.map((evt, idx) => {
              const diff = idx - activeIndex;
              const isCenter = diff === 0;

              // Coverflow positioning
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
                    scale: isCenter && isActivating ? 1.04 : scale,
                    rotateY: rotateY,
                    opacity: opacity,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{ zIndex }}
                  className={`absolute top-0 w-[280px] sm:w-[305px] h-[435px] sm:h-[455px] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between select-none border-2 bg-white ${
                    isCenter
                      ? 'cursor-grab active:cursor-grabbing border-[#d4e8f5] shadow-2xl hover:border-[#0077c8]/50 touch-none'
                      : 'cursor-pointer border-slate-200'
                  } ${
                    isCenter && isReadyToRelease
                      ? 'ring-4 ring-emerald-400 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.5)]'
                      : ''
                  }`}
                >
                  {/* ── CARD COVER IMAGE WITH OVERLAYS ── */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0 pointer-events-none">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover opacity-95 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Category Tag */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs ${
                        evt.category === 'Technical' ? 'bg-[#0077c8]' : 'bg-[#00a887]'
                      }`}
                    >
                      {evt.category}
                    </span>

                    {/* Team Size Tag */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border border-white/20 shadow-xs">
                      {evt.isTeamEvent ? (
                        <>
                          <Users className="w-3.5 h-3.5 text-[#7af1fc]" />
                          <span>Team ({evt.minTeamSize}-{evt.maxTeamSize})</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-[#7af1fc]" />
                          <span>Solo</span>
                        </>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl sm:text-2xl font-serif font-black leading-tight drop-shadow-sm">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 opacity-90">
                        {evt.tagline}
                      </p>
                    </div>
                  </div>

                  {/* ── CARD BODY DETAILS ── */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-white pointer-events-none">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Venue & Timing Chips */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium bg-[#f0f8fc] p-2.5 rounded-2xl border border-[#d4e8f5]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#0077c8] shrink-0" />
                        <span className="truncate">{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#00a887] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>

                    {/* ── BOTTOM PULL / ACTIVATE TRIGGER ── */}
                    <div className="pt-1">
                      {isCenter ? (
                        <div
                          className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                            isReadyToRelease
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-102 animate-pulse'
                              : 'bg-slate-100 text-[#002b66] border border-[#d4e8f5]'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isReadyToRelease ? 'rotate-180 text-white' : 'animate-bounce text-[#0077c8]'
                            }`}
                          />
                          <span>
                            {isReadyToRelease ? '⚡ Release to activate!' : 'Drag down to activate event'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center py-1">
                          <span className="text-[10px] font-mono text-slate-400">Tap to view event</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Navigation Controls & Pagination Dots ── */}
          <div className="w-full flex items-center justify-between mt-3 px-6">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white border border-[#d4e8f5] hover:bg-[#f0f8fc] text-[#002b66] shadow-xs transition-colors cursor-pointer"
              aria-label="Previous Event"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {filteredEvents.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsReadyToRelease(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-6 bg-gradient-to-r from-[#002b66] to-[#0077c8]'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to event ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl bg-white border border-[#d4e8f5] hover:bg-[#f0f8fc] text-[#002b66] shadow-xs transition-colors cursor-pointer"
              aria-label="Next Event"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Fallback & Rules Inspector */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setInspectingEvent(currentEvent)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#d4e8f5] hover:bg-[#f0f8fc] text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Info className="w-3.5 h-3.5 text-[#0077c8]" />
              <span>Event Details</span>
            </button>

            <button
              type="button"
              onClick={() => currentEvent && triggerActivation(currentEvent)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Choose Event (1-Click)</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MODE 2: GRID OVERVIEW ── */}
      {viewMode === 'grid' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-[#d4e8f5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative h-40 overflow-hidden bg-slate-900">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-black/60 backdrop-blur-md">
                  {evt.isTeamEvent ? `Team (${evt.minTeamSize}-${evt.maxTeamSize})` : 'Solo'}
                </span>
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h4 className="font-serif font-bold text-base line-clamp-1">{evt.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{evt.tagline}</p>
                </div>
              </div>

              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2">{evt.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectingEvent(evt)}
                    className="text-[11px] font-bold text-slate-600 hover:text-[#0077c8] transition-colors"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectEvent(evt)}
                    className="px-3 py-1.5 rounded-xl bg-[#002b66] hover:bg-[#001f4d] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Select Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RULES & DETAILS MODAL ── */}
      <AnimatePresence>
        {inspectingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-[#d4e8f5] shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eef7fc] text-[#0077c8]">
                    {inspectingEvent.category} • {inspectingEvent.isTeamEvent ? 'Team' : 'Solo'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-[#001f4d] mt-1">
                    {inspectingEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{inspectingEvent.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingEvent(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">About This Challenge</h4>
                  <p className="leading-relaxed">{inspectingEvent.description}</p>
                </div>

                {inspectingEvent.rules && inspectingEvent.rules.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">Official Rules & Guidelines</h4>
                    <ul className="space-y-1 pl-4 list-disc marker:text-[#0077c8]">
                      {inspectingEvent.rules.map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-[#f0f8fc] p-2.5 rounded-xl border border-[#d4e8f5]">
                    <span className="text-[10px] text-slate-500 font-bold block">Timing</span>
                    <span className="font-bold text-[#002b66]">{inspectingEvent.time}</span>
                  </div>
                  <div className="bg-[#f0f8fc] p-2.5 rounded-xl border border-[#d4e8f5]">
                    <span className="text-[10px] text-slate-500 font-bold block">Venue</span>
                    <span className="font-bold text-[#002b66]">{inspectingEvent.venue}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectingEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const evt = inspectingEvent;
                    setInspectingEvent(null);
                    onSelectEvent(evt);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#002b66] hover:bg-[#001f4d] text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Select & Proceed</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
