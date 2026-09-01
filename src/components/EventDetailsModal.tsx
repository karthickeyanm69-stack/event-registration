import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  X,
  Shield,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { CollegeEvent } from '../types';
import { CollegeEmblem } from './common/CollegeLogo';

interface EventDetailsModalProps {
  event: CollegeEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRegistration: (event: CollegeEvent) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirmRegistration,
}) => {
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const handleRegister = () => {
    setIsRegisteredSuccess(true);
    setTimeout(() => {
      setIsRegisteredSuccess(false);
      onConfirmRegistration(event);
    }, 900);
  };

  return (
    <div
      id="event-details-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="event-details-modal-content"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#d4e8f5] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative h-44 w-full bg-[#002b66] shrink-0">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase backdrop-blur-md border ${
                event.category === 'Technical'
                  ? 'bg-[#0077c8]/90 text-white border-blue-300/40'
                  : 'bg-[#00a887]/90 text-white border-teal-300/40'
              }`}
            >
              {event.category} Competition
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-white/90 bg-black/40 backdrop-blur-md">
              {event.isTeamEvent ? `Team Event (${event.minTeamSize}-${event.maxTeamSize} members)` : 'Solo Challenge'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[#002b66]">{event.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{event.tagline}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 block">
                Free Registration
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-2.5 bg-[#f8fbfe] p-3 rounded-2xl border border-[#d4e8f5]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0077c8] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Date</span>
                <span className="text-xs font-semibold text-[#002b66]">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0077c8] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Timing</span>
                <span className="text-xs font-semibold text-[#002b66]">{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-[#00a887] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Venue</span>
                <span className="text-xs font-semibold text-[#002b66]">{event.venue}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-[#00a887] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Availability</span>
                <span className="text-xs font-bold text-emerald-600">{event.slotsLeft} slots remaining</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002b66] mb-1">
              About the Event
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {event.description ||
                'Join this competitive and insightful campus challenge designed to test your domain expertise, critical thinking, and technical capability at SPIHER IGNITE 2024.'}
            </p>
          </div>

          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002b66] mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0077c8]" />
                <span>Event Rules &amp; Guidelines</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                {event.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Coordinators */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="p-3 bg-[#f8fbfe] rounded-2xl border border-[#d4e8f5] text-xs">
              <span className="font-bold text-[#002b66] block mb-1">Faculty &amp; Student Convenors:</span>
              <div className="flex flex-wrap gap-3 text-slate-600">
                {event.coordinators.map((c) => (
                  <div key={c.id} className="text-[11px]">
                    <span className="font-semibold text-[#002b66]">{c.name}</span>{' '}
                    <span className="text-slate-400 font-mono">({c.phone})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Registration CTA */}
        <div className="p-4 border-t border-[#e8f5fb] bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                event.slotsLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span
              className={`font-semibold ${
                event.slotsLeft <= 10 ? 'text-red-600' : 'text-slate-600'
              }`}
            >
              {event.slotsLeft} seats left
            </span>
          </div>

          <button
            id="btn-confirm-register"
            onClick={handleRegister}
            disabled={isRegisteredSuccess}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 ${
              isRegisteredSuccess
                ? 'bg-emerald-600'
                : 'bg-[#0077c8] hover:bg-[#0066ad] shadow-[#0077c8]/20'
            }`}
          >
            {isRegisteredSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Securing Registration...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Select &amp; Proceed to Pass</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
