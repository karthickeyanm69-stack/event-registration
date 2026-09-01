import React, { useState } from 'react';
import { CollegeEvent } from '../types';

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
    }, 1200);
  };

  return (
    <div
      id="event-details-modal-overlay"
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="event-details-modal-content"
        className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-outline-variant/60 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative h-48 w-full bg-primary-container shrink-0">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div
            className={`absolute bottom-3 left-3 px-3 py-1 rounded font-label-sm text-xs font-bold text-white backdrop-blur-sm ${
              event.category === 'Technical' ? 'bg-secondary/90' : 'bg-primary/90'
            }`}
          >
            {event.category} Event
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-xl font-bold text-primary">{event.title}</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                St. Peter's Institute Annual Campus Festival
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif text-xl font-bold text-secondary block">
                ₹{event.price}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium">per participant</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                calendar_today
              </span>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase block">
                  Date
                </span>
                <span className="text-xs font-semibold text-primary">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase block">
                  Timing
                </span>
                <span className="text-xs font-semibold text-primary">{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                location_on
              </span>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase block">
                  Venue
                </span>
                <span className="text-xs font-semibold text-primary">{event.venue}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                emoji_events
              </span>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase block">
                  Prize Pool
                </span>
                <span className="text-xs font-bold text-primary">{event.prizePool || '₹20,000'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-primary mb-1">About the Event</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {event.description ||
                'Join this competitive and insightful campus challenge designed to test your domain expertise, critical thinking, and team synergy.'}
            </p>
          </div>

          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-primary mb-2">Event Rules</h3>
              <ul className="space-y-1.5 text-xs text-on-surface-variant list-disc pl-4 leading-relaxed">
                {event.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Faculty Coordinators */}
          {event.coordinators && (
            <div className="p-3 bg-surface rounded-lg border border-outline-variant/30 text-xs">
              <span className="font-bold text-primary block mb-0.5">Faculty Coordinators:</span>
              <span className="text-on-surface-variant">{event.coordinators}</span>
            </div>
          )}
        </div>

        {/* Modal Footer / Registration CTA */}
        <div className="p-4 border-t border-outline-variant/50 bg-surface-container-lowest flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                event.slotsLeft <= 20 ? 'bg-error animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span
              className={`font-semibold ${
                event.slotsLeft <= 20 ? 'text-error' : 'text-on-surface-variant'
              }`}
            >
              {event.slotsLeft} seats left
            </span>
          </div>

          <button
            id="btn-confirm-register"
            onClick={handleRegister}
            disabled={isRegisteredSuccess}
            className={`px-6 py-2.5 rounded-lg font-label-md text-sm font-bold text-on-primary transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 ${
              isRegisteredSuccess
                ? 'bg-emerald-600'
                : 'bg-secondary hover:bg-secondary/90'
            }`}
          >
            {isRegisteredSuccess ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Securing Spot...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                Register Now • ₹{event.price}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
