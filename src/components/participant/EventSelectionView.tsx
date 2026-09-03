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
  X,
} from 'lucide-react';
import { CollegeEvent, EventCategory, Participant } from '../../types';
import { CollegeEmblem } from '../common/CollegeLogo';

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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            Registering for:
          </span>
          <span className="text-xs font-bold text-[#002b66] bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-mono">
            {participantData.name} ({participantData.rollNumber})
          </span>
        </div>
      </div>

      {/* Title & Instructions */}
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shadow-sm w-fit">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Step 2 of 3: Event Selection</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#002b66] mt-2">
          Choose Your Competition
        </h2>
        <p className="text-xs text-slate-600 font-medium">
          Remember: A participant can register for <strong>only ONE event</strong> across the entire symposium.
        </p>
      </div>

      {/* Category Toggle Tabs */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setSelectedCategory('Technical')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            selectedCategory === 'Technical'
              ? 'bg-[#002b66] text-white shadow-md scale-[1.02]'
              : 'text-slate-700 hover:text-[#002b66]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Technical Events</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
            {techCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Non-Technical')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            selectedCategory === 'Non-Technical'
              ? 'bg-teal-700 text-white shadow-md scale-[1.02]'
              : 'text-slate-700 hover:text-teal-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Non-Technical Events</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 text-white font-bold">
            {nonTechCount}
          </span>
        </button>
      </div>

      {/* Events Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Header with Badges */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={evt.imageUrl}
                alt={evt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Team / Solo Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                {evt.isTeamEvent ? (
                  <>
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>Team ({evt.minTeamSize} - {evt.maxTeamSize} members)</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-teal-400" />
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
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {evt.description}
              </p>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{evt.venue}</span>
                </div>
              </div>

              {/* Slots Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Availability</span>
                  <span className={evt.slotsLeft <= 10 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {evt.slotsLeft} slots remaining
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      evt.slotsLeft <= 10 ? 'bg-red-500' : 'bg-teal-600'
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
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  View Details &amp; Rules
                </button>

                <button
                  type="button"
                  onClick={() => onSelectEvent(evt)}
                  className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#d4e8f5] shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#e8f5fb]">
              <div className="flex items-center gap-3">
                <CollegeEmblem size={44} />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                        inspectingEvent.category === 'Technical'
                          ? 'bg-[#e8f5fb] text-[#0077c8] border-[#d4e8f5]'
                          : 'bg-teal-50 text-[#00a887] border-teal-200'
                      }`}
                    >
                      {inspectingEvent.category} Competition
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">IGNITE 2024</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002b66] mt-0.5">
                    {inspectingEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500">{inspectingEvent.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingEvent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#f8fbfe] border border-[#d4e8f5] text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue</span>
                <p className="font-bold text-[#002b66] truncate">{inspectingEvent.venue}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Schedule</span>
                <p className="font-bold text-[#002b66]">{inspectingEvent.time}</p>
              </div>
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Capacity</span>
                <p className="font-bold text-emerald-600">{inspectingEvent.slotsLeft} slots available</p>
              </div>
            </div>

            {/* Rules Section */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002b66] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0077c8]" />
                <span>Official Rules &amp; Guidelines</span>
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <ul className="space-y-2 text-xs text-slate-700">
                  {inspectingEvent.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00a887] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coordinators Section */}
            {inspectingEvent.coordinators && inspectingEvent.coordinators.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#e8f5fb]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#002b66]">
                  Faculty &amp; Student Coordinators
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inspectingEvent.coordinators.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-[#f8fbfe] border border-[#d4e8f5] text-xs">
                      <p className="font-bold text-[#002b66]">{c.name}</p>
                      <p className="text-[11px] text-[#0077c8] font-semibold">{c.role}</p>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">{c.phone}</p>
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
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
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
                className="flex-1 py-2.5 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-xs shadow-md shadow-[#0077c8]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
