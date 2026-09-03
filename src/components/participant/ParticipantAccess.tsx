import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  UserPlus,
  HelpCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Lock,
  Trophy,
  QrCode,
  MapPin,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { Participant, Registration } from '../../types';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';
import { CustomDatePicker } from '../common/CustomDatePicker';

interface ParticipantAccessProps {
  onSuccessfulAccess: (participant: Participant, registration?: Registration) => void;
  onStartNewRegistration: () => void;
  onBackToHome?: () => void;
}

export const ParticipantAccess: React.FC<ParticipantAccessProps> = ({
  onSuccessfulAccess,
  onStartNewRegistration,
}) => {
  const [rollNumber, setRollNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [activeMode, setActiveMode] = useState<'EXISTING' | 'NEW'>('EXISTING');

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!rollNumber.trim() || !dateOfBirth) {
      setErrorMessage('Please enter both your Roll Number and Date of Birth.');
      return;
    }

    if (failedAttempts >= 5) {
      setErrorMessage('Too many failed attempts. Please contact your symposium coordinator.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const result = MockDatabaseService.verifyParticipantAccess(rollNumber, dateOfBirth);
      setIsVerifying(false);

      if (result.success && result.participant) {
        onSuccessfulAccess(result.participant, result.registration);
      } else {
        setFailedAttempts((prev) => prev + 1);
        setErrorMessage(
          result.error ||
            'No registration record found for these credentials. If registering for the first time, click New Registration.'
        );
      }
    }, 500);
  };

  const handleFillDemoUser = (demoRoll: string, demoDOB: string) => {
    setRollNumber(demoRoll);
    setDateOfBirth(demoDOB);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#0077c8] selection:text-white">
      {/* Main Split-Hero Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,43,102,0.15)] border border-[#d4e8f5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-auto lg:min-h-[580px]">
        {/* ========================================================================= */}
        {/* LEFT BRANDING & INFORMATION HERO (Visible ONLY on Desktop lg+)           */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#001f4d] via-[#002b66] to-[#001838] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          {/* Luminous Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0077c8]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00a887]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] font-bold text-[#7af1fc]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>IGNITE 2026 Symposium Portal</span>
            </div>

            <div className="flex items-center gap-3">
              <CollegeEmblem size={44} />
              <div>
                <h1 className="font-serif font-bold text-lg leading-tight tracking-tight text-white">
                  St. Peter's
                </h1>
                <p className="text-[11px] text-[#7af1fc] font-medium tracking-wide">
                  Institute of Higher Education &amp; Research
                </p>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">
                  Deemed to be University
                </p>
              </div>
            </div>
          </div>

          {/* Center Value Highlights */}
          <div className="relative z-10 space-y-4 py-6">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
              Official Digital Event &amp; Pass Access
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify your symposium entry, manage team registrations, and retrieve your cryptographically verified QR Pass.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs">
                <div className="p-2 rounded-xl bg-[#0077c8]/40 text-[#7af1fc] shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Instant Passwordless Access</span>
                  <span className="text-[11px] text-slate-300">Login with Roll Number + Date of Birth</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs">
                <div className="p-2 rounded-xl bg-[#00a887]/40 text-emerald-300 shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Digital QR Entry Pass</span>
                  <span className="text-[11px] text-slate-300">Live check-in and stage evaluations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7af1fc]" />
              <span>Official University Registry</span>
            </div>
            <span className="font-mono text-[10px] text-white/50">v2.4 Live</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT INTERACTIVE LOGIN & REGISTRATION CARD                               */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center space-y-5 sm:space-y-6">
          {/* Mobile College Logo Header for small screens */}
          <div className="lg:hidden flex flex-col items-center text-center pb-2 border-b border-[#e8f5fb]">
            <CollegeLogo size="sm" />
            <span className="text-[10px] font-mono font-bold uppercase text-[#0077c8] tracking-widest mt-1">
              IGNITE 2026 Portal
            </span>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#f0f8fc] rounded-2xl border border-[#d4e8f5]">
            <button
              type="button"
              onClick={() => {
                setActiveMode('EXISTING');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeMode === 'EXISTING'
                  ? 'bg-[#0077c8] text-white shadow-md shadow-[#0077c8]/20'
                  : 'text-[#002b66] hover:bg-white/80'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Existing Pass Access</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('NEW');
                onStartNewRegistration();
              }}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeMode === 'NEW'
                  ? 'bg-[#00a887] text-white shadow-md shadow-[#00a887]/20'
                  : 'text-[#002b66] hover:bg-white/80'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>New Registration</span>
            </button>
          </div>

          {/* Existing Participant Access Form */}
          {activeMode === 'EXISTING' && (
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-[#002b66]">
                  Access Your Event Pass
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional credentials to view your digital pass and event schedule.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Roll Number Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#002b66] uppercase tracking-wider">
                    Roll Number / Register Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-[#0077c8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 2021CS042"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-[#d4e8f5] text-[#002b66] placeholder-slate-400 text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#0077c8]/20 focus:border-[#0077c8] focus:bg-white focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Custom Date Picker */}
                <div className="space-y-1.5">
                  <CustomDatePicker
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                    label="Date of Birth"
                    placeholder="Select Date of Birth"
                    required
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Pass...</span>
                    </>
                  ) : (
                    <>
                      <span>Open My Event Pass</span>
                      <ArrowRight className="w-4 h-4 text-[#7af1fc]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Autofill Section */}
          <div className="pt-2 border-t border-[#e8f5fb] space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Quick Demo Profile:
            </span>
            <div className="p-3 rounded-2xl bg-[#f8fbfe] border border-[#d4e8f5] flex items-center justify-between text-xs hover:border-[#0077c8]/40 transition-colors">
              <div>
                <p className="font-bold text-[#002b66]">Alex Mercer (Computer Science)</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Roll: <strong className="text-[#0077c8]">2021CS042</strong> • DOB: 14/05/2003
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemoUser('2021CS042', '2003-05-14')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5] text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Autofill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantAccess;
