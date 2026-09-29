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
  onBackToHome,
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
    <div className="min-h-screen w-full bg-[#05050a] text-white flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#FF1E42] selection:text-white relative overflow-x-hidden">
      {/* Spider-Verse Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF1E42]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF6B00]/10 blur-[120px] pointer-events-none" />

      {/* Main Split-Hero Card Container */}
      <div className="w-full max-w-5xl bg-[#090714] rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-[#FF1E42]/30 grid grid-cols-1 lg:grid-cols-12 min-h-auto lg:min-h-[580px] relative z-10 overflow-hidden">
        {/* ========================================================================= */}
        {/* LEFT BRANDING & INFORMATION HERO (Visible ONLY on Desktop lg+)           */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#12061e] via-[#090714] to-[#05050a] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden border-r border-[#FF1E42]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1E42]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6B00]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] font-mono font-bold text-[#FF6B00]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>RADIANZA '26 MULTIVERSE PORTAL</span>
            </div>

            <div className="flex items-center gap-3">
              <CollegeEmblem size={44} />
              <div>
                <h1 className="font-['Impact',sans-serif] text-xl leading-tight tracking-tight text-white uppercase">
                  RADIANZA <span className="text-[#FF1E42]">'26</span>
                </h1>
                <p className="text-[11px] text-[#FF6B00] font-mono font-bold tracking-wide">
                  Department of IT • SPIHER
                </p>
                <p className="text-[9px] text-stone-400 uppercase tracking-wider">
                  Verified Pass Verification Mainframe
                </p>
              </div>
            </div>
          </div>

          {/* Center Info Points */}
          <div className="relative z-10 space-y-3 py-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <QrCode className="w-5 h-5 text-[#FF1E42] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block text-xs">Holographic QR Entry Pass</span>
                <span className="text-[11px] text-stone-300 leading-snug block mt-0.5">
                  Access your encrypted entry credential with real-time check-in validation.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <Trophy className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block text-xs">Multiverse Competition Matrix</span>
                <span className="text-[11px] text-stone-300 leading-snug block mt-0.5">
                  View your registered arena tracks, rules, venue coordinates, and live scores.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Accreditation Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>NAAC 'A' Grade Accredited</span>
            <span className="text-[#FF6B00]">October 15-16, 2026</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT INTERACTIVE LOGIN & REGISTRATION SELECTION PANEL                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
          {/* Top Toggle Switcher */}
          <div className="flex items-center justify-between gap-2 p-1.5 bg-black/50 rounded-2xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveMode('EXISTING');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === 'EXISTING'
                  ? 'bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Access Existing Pass</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('NEW');
                onStartNewRegistration();
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === 'NEW'
                  ? 'bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>New Registration</span>
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-['Impact',sans-serif] text-white uppercase tracking-wide">
              {activeMode === 'EXISTING' ? 'DELEGATE PASS LOGIN' : 'NEW REGISTRATION'}
            </h2>
            <p className="text-xs text-stone-400">
              {activeMode === 'EXISTING'
                ? 'Enter your Roll Number and Date of Birth to view your pass and arena schedule.'
                : 'Initialize your registration for RADIANZA ’26 national symposium.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#FF1E42]/10 border border-[#FF1E42]/40 text-[#FF1E42] text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="access-roll-input" className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF1E42]" />
                <span>Roll Number / Register Number <span className="text-[#FF1E42]">*</span></span>
              </label>
              <input
                id="access-roll-input"
                name="rollNumber"
                type="text"
                autoComplete="username"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 2021CS042"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono font-bold placeholder-stone-500 text-sm focus:ring-2 focus:ring-[#FF1E42]/30 focus:border-[#FF1E42] focus:outline-none transition-all uppercase shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <CustomDatePicker
                id="access-dob-input"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                label="Date of Birth"
                placeholder="Select Date of Birth"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF1E42]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? (
                <span>VERIFYING PASS CREDENTIALS...</span>
              ) : (
                <>
                  <span>AUTHENTICATE &amp; OPEN PASS</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
            <span>Demo User:</span>
            <button
              type="button"
              onClick={() => handleFillDemoUser('2021CS042', '2003-05-14')}
              className="text-[#FF6B00] hover:text-[#FFA500] underline font-bold cursor-pointer"
            >
              Autofill 2021CS042
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantAccess;
