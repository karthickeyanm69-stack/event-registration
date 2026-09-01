import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  Users,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Shield,
  Layers,
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
  const [inspectingEvent, setInspectingEvent] = useState<CollegeEvent | null>(null);

  const filteredEvents = events.filter((e) => e.category === selectedCategory);

  const techCount = events.filter((e) => e.category === 'Technical').length;
  const nonTechCount = events.filter((e) => e.category === 'Non-Technical').length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToOnboarding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Registering for:
          </span>
          <span className="text-xs font-bold text-primary dark:text-white bg-slate-100 dark:bg-primary-container px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 font-mono">
            {participantData.name} ({participantData.rollNumber})
          </span>
        </div>
      </div>

      {/* Title & Instructions */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Step 2 of 3: Event Selection</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary dark:text-white">
          Choose Your Competition
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Remember: A participant can register for <strong>only ONE event</strong> across the entire symposium.
        </p>
      </div>

      {/* Category Toggle Tabs */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto p-1.5 bg-slate-100 dark:bg-primary-container/90 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => setSelectedCategory('Technical')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
            selectedCategory === 'Technical'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
              : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Technical Events</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white">
            {techCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Non-Technical')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
            selectedCategory === 'Non-Technical'
              ? 'bg-secondary text-white shadow-md shadow-secondary/30 scale-[1.02]'
              : 'text-slate-600 dark:text-slate-300 hover:text-secondary'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Non-Technical Events</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 text-white">
            {nonTechCount}
          </span>
        </button>
      </div>

      {/* Events Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="group bg-white dark:bg-primary-container rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Header with Badges */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={evt.imageUrl}
                alt={evt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Prize Pool Tag */}
              <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md">
                <Trophy className="w-3.5 h-3.5" />
                <span>{evt.prizePool}</span>
              </div>

              {/* Team / Solo Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                {evt.isTeamEvent ? (
                  <>
                    <Users className="w-3.5 h-3.5 text-secondary-fixed" />
                    <span>Team ({evt.minTeamSize} - {evt.maxTeamSize} members)</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-secondary-fixed" />
                    <span>Individual Event</span>
                  </>
                )}
              </div>

              {/* Title & Tagline in Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-bold leading-snug">{evt.title}</h3>
                <p className="text-xs text-slate-200 line-clamp-1 opacity-90">{evt.tagline}</p>
              </div>
            </div>

            {/* Event Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {evt.description}
              </p>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">{evt.venue}</span>
                </div>
              </div>

              {/* Slots Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Availability</span>
                  <span className={evt.slotsLeft <= 10 ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>
                    {evt.slotsLeft} slots remaining
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      evt.slotsLeft <= 10 ? 'bg-red-500' : 'bg-secondary'
                    }`}
                    style={{
                      width: `${Math.max(10, ((evt.totalSlots - evt.slotsLeft) / evt.totalSlots) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectingEvent(evt)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  View Details & Rules
                </button>

                <button
                  type="button"
                  onClick={() => onSelectEvent(evt)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-primary font-bold text-xs shadow-md shadow-secondary/20 flex items-center gap-1.5 hover:opacity-95 transition-opacity"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details & Rules Inspector Modal */}
      {inspectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-primary-container rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/30">
                  {inspectingEvent.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-primary dark:text-white mt-1">
                  {inspectingEvent.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{inspectingEvent.tagline}</p>
              </div>
              <button
                onClick={() => setInspectingEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Prize & Rules Section */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Total Prize Pool</span>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-200">{inspectingEvent.prizePool}</p>
              </div>
              <div className="text-right text-xs text-amber-800 dark:text-amber-300">
                <p>1st: {inspectingEvent.firstPrize || 'Trophy + Cash'}</p>
                <p>2nd: {inspectingEvent.secondPrize || 'Shield'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span>Official Rules & Guidelines</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {inspectingEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coordinators Section */}
            {inspectingEvent.coordinators && inspectingEvent.coordinators.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Event Coordinators
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inspectingEvent.coordinators.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-[11px] text-secondary">{c.role}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">{c.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInspectingEvent(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold"
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
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-primary font-bold text-xs shadow-lg shadow-secondary/30 flex items-center justify-center gap-1.5"
              >
                <span>Register for {inspectingEvent.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
