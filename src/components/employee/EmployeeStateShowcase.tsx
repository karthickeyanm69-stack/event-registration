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
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { EmployeeEdgeState } from '../../types';

export const EmployeeStateShowcase: React.FC = () => {
  const [selectedState, setSelectedState] = useState<EmployeeEdgeState>('DEFAULT');

  const statesList: {
    id: EmployeeEdgeState;
    label: string;
    desc: string;
    badgeColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'DEFAULT',
      label: 'Scanner Ready',
      desc: 'Standard camera viewfinder waiting for QR pass',
      badgeColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-300 dark:border-teal-700',
      icon: QrCode,
    },
    {
      id: 'ATTENDANCE_SUCCESS',
      label: 'Attendance Recorded',
      desc: 'Candidate identity verified & attendance logged',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      icon: CheckCircle2,
    },
    {
      id: 'ALREADY_ATTENDED',
      label: 'Already Checked In',
      desc: 'Prevents duplicate check-in at event venue',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      icon: AlertTriangle,
    },
    {
      id: 'WRONG_EVENT',
      label: 'Wrong Event / Hall',
      desc: 'Pass scanned belongs to a different competition',
      badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-700',
      icon: ShieldAlert,
    },
    {
      id: 'INVALID_QR',
      label: 'Invalid / Revoked QR',
      desc: 'Token corrupted or invalidated by event change',
      badgeColor: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-300 dark:border-red-700',
      icon: XCircle,
    },
    {
      id: 'PARTICIPANT_NOT_FOUND',
      label: 'Pass Not in Database',
      desc: 'No registration record matches this token',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: HelpCircle,
    },
    {
      id: 'SCORE_SUBMITTED',
      label: 'Score Evaluated & Locked',
      desc: 'Marks recorded and synced with leaderboard',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      icon: Trophy,
    },
    {
      id: 'LOADING',
      label: 'Verifying Security Token',
      desc: 'Server cryptographic check in progress',
      badgeColor: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-300 dark:border-sky-700',
      icon: Loader2,
    },
    {
      id: 'EMPTY_ASSIGNMENTS',
      label: 'No Assigned Events',
      desc: 'Staff account has not been allocated events',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      icon: Users,
    },
  ];

  const currentStateInfo = statesList.find((s) => s.id === selectedState) || statesList[0];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Info Card */}
      <div className="bg-white dark:bg-primary-container p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Staff Edge State Showcase &amp; Simulation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect how the Staff &amp; Judge PWA handles verification, validation, and error states.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hidden sm:inline-block">
            Staff Sandbox
          </span>
        </div>

        {/* Quick Selection Dropdown & Pills */}
        <div className="pt-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as EmployeeEdgeState)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {statesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {s.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {statesList.map((s) => {
            const isSelected = selectedState === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedState(s.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/20'
                    : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated Display Screen Container */}
      <div className="bg-white dark:bg-primary-container p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl min-h-[380px] flex flex-col justify-between space-y-6">
        {/* Status Badge Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${currentStateInfo.badgeColor}`}>
              <currentStateInfo.icon className="w-3.5 h-3.5" />
              <span>{currentStateInfo.label}</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">State: {selectedState}</span>
        </div>

        {/* State Specific Interactive Mock Visualizations */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-4">
          {selectedState === 'DEFAULT' && (
            <div className="space-y-4 max-w-sm">
              <div className="relative w-28 h-28 mx-auto rounded-3xl bg-slate-900 border-2 border-dashed border-teal-400/50 flex items-center justify-center shadow-inner">
                <QrCode className="w-12 h-12 text-teal-400 animate-pulse" />
                <div className="absolute inset-2 border border-white/20 rounded-2xl pointer-events-none" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Live Scanner Viewfinder Ready</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to scan participant QR badges or manually verify roll numbers.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-center gap-2 text-left">
                <Info className="w-4 h-4 shrink-0 text-teal-600" />
                <span>Authorized events for your profile are automatically validated upon scan.</span>
              </div>
            </div>
          )}

          {selectedState === 'ATTENDANCE_SUCCESS' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Attendance Recorded!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Participant identity successfully verified and logged into central registry.
                </p>
              </div>

              {/* Mock Verified Participant Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                      Code-A-Thon Sprint (Technical)
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">Alex Mercer</h5>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    21BCS042
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Team: Binary Mavericks</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Clock className="w-3 h-3" /> Check-in: 09:15 AM
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedState === 'ALREADY_ATTENDED' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto ring-8 ring-amber-500/10">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">Already Checked In</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  This participant's QR pass has already been scanned and verified today.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Alex Mercer (21BCS042)</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                    Status: Present
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Original Check-in recorded at <strong>09:15 AM</strong> by <strong>Praveen Chandran (Lead Evaluator)</strong>.
                </p>
              </div>
            </div>
          )}

          {selectedState === 'WRONG_EVENT' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-500/10">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-rose-600 dark:text-rose-400">Unassigned / Wrong Event</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  This pass is valid, but is registered for a competition outside your assigned evaluation hall.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Scanned Pass Event:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">Free Fire Max (Gaming Arena)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Your Assigned Event:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">Code-A-Thon Sprint</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-rose-200/60 dark:border-rose-800/60">
                  Please direct the candidate to the Gaming Arena (IT Block Lab 3).
                </p>
              </div>
            </div>
          )}

          {selectedState === 'INVALID_QR' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto ring-8 ring-red-500/10">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-red-600 dark:text-red-400">Invalid / Revoked QR Pass</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  This pass token is no longer valid. It may have been revoked due to an authorized event change.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-left space-y-1 text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-red-700 dark:text-red-400">Suggested Action:</p>
                <p className="text-[11px]">
                  Ask the participant to open their Participant Dashboard and present their newly updated QR pass.
                </p>
              </div>
            </div>
          )}

          {selectedState === 'PARTICIPANT_NOT_FOUND' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center mx-auto ring-8 ring-slate-100 dark:ring-white/5">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Participant Not Found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No registered participant or team record matches this token in the system database.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-left space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Suggested Action:</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Check if candidate completed final registration or escort them to Helpdesk / Onboarding counter.
                </p>
              </div>
            </div>
          )}

          {selectedState === 'SCORE_SUBMITTED' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto ring-8 ring-purple-500/10">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-purple-700 dark:text-purple-400">Score Locked (94 / 100)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Evaluation marks submitted and locked into the official symposium standings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-left text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Team Binary Mavericks</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">94/100 PTS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>• Concept: 38/40</span>
                  <span>• Tech Depth: 28/30</span>
                  <span>• Polish: 19/20</span>
                  <span>• Defense: 9/10</span>
                </div>
              </div>
            </div>
          )}

          {selectedState === 'LOADING' && (
            <div className="space-y-4 max-w-sm">
              <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Verifying Security Token...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performing real-time cryptographic token verification with event registry.
                </p>
              </div>
            </div>
          )}

          {selectedState === 'EMPTY_ASSIGNMENTS' && (
            <div className="space-y-4 max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Assigned Competitions</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your staff profile has not been assigned to any events for evaluation or attendance.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-left text-amber-800 dark:text-amber-300">
                Please contact the Convenor or Super Admin to allocate competitions to your evaluator ID.
              </div>
            </div>
          )}
        </div>

        {/* Footer Helper Note */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Cryptographically Verified Edge States</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedState('DEFAULT')}
            className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Reset to Default</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStateShowcase;
