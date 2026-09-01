import React from 'react';
import { ParticipantInfo } from '../types';

interface ParticipantProfileProps {
  participant: ParticipantInfo;
  onViewPass: () => void;
  onNavigateToEvents: () => void;
}

export const ParticipantProfile: React.FC<ParticipantProfileProps> = ({
  participant,
  onViewPass,
  onNavigateToEvents,
}) => {
  return (
    <div id="participant-profile-screen" className="flex flex-col min-h-screen pb-28 bg-background">
      {/* Header */}
      <header
        id="profile-header"
        className="w-full top-0 sticky bg-surface border-b border-outline-variant shadow-sm z-40"
      >
        <div className="flex justify-between items-center px-4 h-16 max-w-md mx-auto w-full">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
            <span className="font-serif text-lg font-bold text-primary">Student Profile</span>
          </div>
          <span className="bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-1 rounded-full border border-secondary/20">
            Active
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-ambient flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary-container to-secondary opacity-90" />

          <div className="w-20 h-20 rounded-full bg-surface-container-lowest p-1 shadow-md relative z-10 mt-4 overflow-hidden border-2 border-white">
            <img
              src={participant.avatarUrl}
              alt={participant.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h2 className="font-serif text-xl font-bold text-primary mt-3">{participant.name}</h2>
          <p className="font-label-md text-xs text-secondary font-semibold">{participant.department}</p>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            {participant.college}
          </p>

          <div className="w-full grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-outline-variant/40">
            <div className="bg-surface-container-low p-2.5 rounded-lg text-left">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Roll Number
              </span>
              <span className="text-xs font-semibold text-primary font-mono">
                {participant.rollNumber}
              </span>
            </div>
            <div className="bg-surface-container-low p-2.5 rounded-lg text-left">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Team
              </span>
              <span className="text-xs font-semibold text-primary">{participant.team}</span>
            </div>
          </div>
        </div>

        {/* Registered Events */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-headline-sm text-base font-bold text-on-background">
              My Registrations
            </h3>
            <button
              onClick={onNavigateToEvents}
              className="text-xs text-secondary font-bold hover:underline"
            >
              Browse More
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-ambient flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full mb-1.5 border border-secondary/20">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Confirmed
                </span>
                <h4 className="font-serif text-sm font-bold text-primary">
                  {participant.activeEvent.title}
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {participant.activeEvent.date} • {participant.activeEvent.venue}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/40 flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-mono">
                Pass ID: {participant.activeEvent.qrData}
              </span>
              <button
                onClick={onViewPass}
                className="bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">qr_code</span> Show QR
              </button>
            </div>
          </div>
        </div>

        {/* Perks & Food Pass */}
        <div>
          <h3 className="font-headline-sm text-base font-bold text-on-background mb-3">
            Pass Privileges & Food Tokens
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 shadow-sm flex flex-col gap-1">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
              </div>
              <span className="text-xs font-bold text-primary">Lunch Token</span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active (Auditorium Hall)
              </span>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 shadow-sm flex flex-col gap-1">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <span className="text-xs font-bold text-primary">Event Kit & Lanyard</span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Desk Verification Ready
              </span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Need assistance?</p>
              <p className="text-[11px] text-on-surface-variant">Campus Helpdesk • Block A Room 102</p>
            </div>
          </div>
          <span className="text-xs font-bold text-secondary font-mono">+91 44 2655 8000</span>
        </div>
      </main>
    </div>
  );
};
