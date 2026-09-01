import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  Ban,
  CheckCircle,
  HelpCircle,
  WifiOff,
  UserX,
  FileQuestion,
  RefreshCcw,
  Sparkles,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import { ParticipantEdgeState } from '../../types';

export const ParticipantStateShowcase: React.FC = () => {
  const [selectedState, setSelectedState] = useState<ParticipantEdgeState>('DEFAULT');

  const statesList: { id: ParticipantEdgeState; label: string; desc: string }[] = [
    { id: 'DEFAULT', label: 'Normal Flow', desc: 'Standard interactive participant flow' },
    { id: 'LOADING', label: 'Branded Loading', desc: 'College logo, pulsating orbital spinner' },
    { id: 'ALREADY_REGISTERED', label: 'Already Registered', desc: '1-event rule block & redirect notice' },
    { id: 'INVALID_QR', label: 'Invalid / Revoked QR', desc: 'Scanned QR is cancelled or forged' },
    { id: 'EVENT_FULL', label: 'Event Full / No Slots', desc: 'All slots filled for competition' },
    { id: 'REGISTRATION_CLOSED', label: 'Registration Closed', desc: 'Portal registration window ended' },
    { id: 'REGISTRATION_CANCELLED', label: 'Cancelled Event Pass', desc: 'Pass invalidated by event change' },
    { id: 'ERROR_LOOKUP', label: 'Lookup Failed (Generic)', desc: 'DOB / Roll Number mismatch' },
    { id: 'SESSION_EXPIRED', label: 'Session Expired', desc: 'Security token lifetime exceeded' },
    { id: 'NETWORK_ERROR', label: 'Network Error', desc: 'Connection failure fallback' },
    { id: 'EMPTY_EVENTS', label: 'Empty Events List', desc: 'No active events in category' },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-5">
      {/* Selector Toolbar */}
      <div className="bg-white dark:bg-primary-container p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Participant Edge State Showcase</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Select any edge case below to inspect its dedicated UI state design:
        </p>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value as ParticipantEdgeState)}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-secondary focus:outline-none"
        >
          {statesList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.desc}
            </option>
          ))}
        </select>
      </div>

      {/* State Renderings */}
      <div className="bg-white dark:bg-primary-container p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
        {selectedState === 'DEFAULT' && (
          <div className="space-y-2">
            <CheckCircle className="w-12 h-12 text-secondary mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Standard Flow Active</h3>
            <p className="text-xs text-slate-500 max-w-xs">Use the participant portal tabs to navigate normally.</p>
          </div>
        )}

        {selectedState === 'LOADING' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center mx-auto animate-spin [animation-duration:3s]">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Verifying Identity...</h3>
            <p className="text-xs text-slate-400">Loading SPIHER digital registry...</p>
          </div>
        )}

        {selectedState === 'ALREADY_REGISTERED' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">Already Registered</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
              This Roll Number is already registered for <strong>Code-A-Thon Sprint</strong>. Per the 1-Participant-1-Event rule, multiple registrations are prohibited.
            </p>
            <button className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow">
              Open My Existing Pass
            </button>
          </div>
        )}

        {selectedState === 'INVALID_QR' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-red-900 dark:text-red-200">Invalid or Revoked QR Pass</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
              This QR code has been invalidated because the participant changed events or the token expired.
            </p>
          </div>
        )}

        {selectedState === 'EVENT_FULL' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center mx-auto">
              <Ban className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Event Capacity Reached</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              All 50 slots for this competition are currently filled. Please choose another event.
            </p>
          </div>
        )}

        {selectedState === 'REGISTRATION_CLOSED' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Registrations Closed</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              The official registration window for IGNITE 2024 has concluded. On-spot inquiries can be made at the Registration Desk.
            </p>
          </div>
        )}

        {selectedState === 'REGISTRATION_CANCELLED' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <UserX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-red-900 dark:text-red-200">Registration Cancelled</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
              Your previous registration was superseded by an authorized event change.
            </p>
          </div>
        )}

        {selectedState === 'ERROR_LOOKUP' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <FileQuestion className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Participant Not Found</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Invalid credentials. If you have not yet registered, please select New Registration.
            </p>
          </div>
        )}

        {selectedState === 'SESSION_EXPIRED' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 flex items-center justify-center mx-auto">
              <RefreshCcw className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Session Expired</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Your security session timed out. Please enter your Roll Number and DOB to reopen your dashboard.
            </p>
          </div>
        )}

        {selectedState === 'NETWORK_ERROR' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <WifiOff className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Connection Error</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Unable to communicate with the registry. Please check your WiFi or mobile data and retry.
            </p>
          </div>
        )}

        {selectedState === 'EMPTY_EVENTS' && (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 flex items-center justify-center mx-auto">
              <FileQuestion className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Events Found</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              No active events found in this category at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
