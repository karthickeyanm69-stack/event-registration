import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  QrCode,
  Trophy,
  Users,
  Building,
} from 'lucide-react';
import { EmployeeEdgeState } from '../../types';

export const EmployeeStateShowcase: React.FC = () => {
  const [selectedState, setSelectedState] = useState<EmployeeEdgeState>('DEFAULT');

  const statesList: { id: EmployeeEdgeState; label: string; desc: string }[] = [
    { id: 'DEFAULT', label: 'Default View', desc: 'Standard staff scanner interface' },
    { id: 'ATTENDANCE_SUCCESS', label: 'Attendance Marked', desc: 'Candidate verified & checked in' },
    { id: 'ALREADY_ATTENDED', label: 'Already Attended', desc: 'Candidate was previously checked in' },
    { id: 'WRONG_EVENT', label: 'Wrong Event Scanned', desc: 'Pass belongs to a different event' },
    { id: 'INVALID_QR', label: 'Invalid / Revoked QR', desc: 'Pass was cancelled or token corrupted' },
    { id: 'PARTICIPANT_NOT_FOUND', label: 'Not Found', desc: 'Token not in database' },
    { id: 'SCORE_SUBMITTED', label: 'Score Recorded', desc: 'Marks successfully saved & locked' },
    { id: 'LOADING', label: 'Verifying with Server', desc: 'Server cryptographic check in progress' },
    { id: 'EMPTY_ASSIGNMENTS', label: 'No Events Assigned', desc: 'Staff account has no active events' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Staff Edge State Showcase</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Inspect how the Employee PWA handles all verification and evaluation states:
        </p>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value as EmployeeEdgeState)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
        >
          {statesList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.desc}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl min-h-[320px] flex flex-col items-center justify-center text-center space-y-3">
        {selectedState === 'DEFAULT' && (
          <div className="space-y-2">
            <QrCode className="w-12 h-12 text-teal-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Scanner Ready</h3>
            <p className="text-xs text-slate-400">Camera view active and waiting for pass.</p>
          </div>
        )}

        {selectedState === 'ATTENDANCE_SUCCESS' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-emerald-400">Attendance Recorded!</h3>
            <p className="text-xs text-slate-300 max-w-xs">
              Candidate Alex Mercer (Binary Mavericks) marked PRESENT for Code-A-Thon Sprint.
            </p>
          </div>
        )}

        {selectedState === 'ALREADY_ATTENDED' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-amber-300">Already Checked In</h3>
            <p className="text-xs text-slate-300 max-w-xs">
              This participant's attendance was already recorded at 09:15 AM today.
            </p>
          </div>
        )}

        {selectedState === 'WRONG_EVENT' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-rose-300">Unassigned Event</h3>
            <p className="text-xs text-slate-300 max-w-xs">
              Scanned pass is for <strong>Free Fire Max</strong>. You are only authorized to evaluate <strong>Code-A-Thon Sprint</strong>.
            </p>
          </div>
        )}

        {selectedState === 'INVALID_QR' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-rose-300">Invalid / Cancelled Pass</h3>
            <p className="text-xs text-slate-300 max-w-xs">
              This QR token was revoked due to an authorized event change.
            </p>
          </div>
        )}

        {selectedState === 'SCORE_SUBMITTED' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-amber-300">Score Locked (94/100)</h3>
            <p className="text-xs text-slate-300 max-w-xs">
              Score submitted successfully to the live leaderboard.
            </p>
          </div>
        )}

        {selectedState === 'LOADING' && (
          <div className="space-y-2">
            <div className="w-10 h-10 border-3 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-xs font-bold text-slate-300">Checking Pass in Registry...</h3>
          </div>
        )}

        {selectedState === 'PARTICIPANT_NOT_FOUND' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Participant Not Found</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              No matching registration record exists for this token.
            </p>
          </div>
        )}

        {selectedState === 'EMPTY_ASSIGNMENTS' && (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No Assigned Events</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Please contact the Super Admin or Event Admin to assign competitions to your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeStateShowcase;
