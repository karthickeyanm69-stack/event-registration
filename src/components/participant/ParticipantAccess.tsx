import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  KeyRound,
  Calendar,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { Participant, Registration } from '../../types';

interface ParticipantAccessProps {
  onSuccessfulAccess: (participant: Participant, registration?: Registration) => void;
  onStartNewRegistration: () => void;
}

export const ParticipantAccess: React.FC<ParticipantAccessProps> = ({
  onSuccessfulAccess,
  onStartNewRegistration,
}) => {
  const [activeMode, setActiveMode] = useState<'EXISTING' | 'NEW'>('EXISTING');

  // Form State
  const [rollNumber, setRollNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleVerifyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!rollNumber.trim() || !dateOfBirth) {
      setErrorMessage('Please enter both your Roll Number and Date of Birth.');
      return;
    }

    if (failedAttempts >= 5) {
      setErrorMessage('Too many failed attempts. Please wait 15 minutes or contact your event coordinator.');
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
        setErrorMessage(result.error || 'Invalid credentials. If you have not registered yet, select New Registration.');
      }
    }, 600);
  };

  const handleFillDemoUser = (demoRoll: string, demoDOB: string) => {
    setRollNumber(demoRoll);
    setDateOfBirth(demoDOB);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      {/* College & Event Header Banner */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-secondary to-secondary-container text-primary shadow-lg shadow-secondary/30 mb-2">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary dark:text-white">
          Participant Portal
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
          Access your digital event pass, event rules, and schedule with your institutional credentials.
        </p>
      </div>

      {/* Choice Selector: Existing Participant Access vs New Registration */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-primary-container/80 rounded-2xl border border-slate-200 dark:border-white/10 mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveMode('EXISTING');
            setErrorMessage(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeMode === 'EXISTING'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Existing Pass</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('NEW');
            onStartNewRegistration();
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeMode === 'NEW'
              ? 'bg-secondary text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-secondary'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>New Registration</span>
        </button>
      </div>

      {/* Existing Participant Access Card */}
      {activeMode === 'EXISTING' && (
        <div className="bg-white dark:bg-primary-container rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-primary dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-secondary" />
              <span>Verify Institutional Identity</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No password or OTP required. Enter your normalized Roll No and Date of Birth.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                  Ensure Roll Number format matches your College ID card.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyAccess} className="space-y-4">
            {/* Roll / Register Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Roll Number / Register Number</span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. 2021CS042</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  placeholder="ENTER ROLL NO"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Date of Birth</span>
                <span className="text-[10px] text-slate-400 font-normal">Security Credential</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Open My Dashboard & Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Preset Helper (For Instant Evaluation) */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
              <span>Quick Test Credential:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemoUser('2021CS042', '2003-05-14')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 font-mono transition-colors"
              >
                Alex (2021CS042)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemoUser('2021EC108', '2002-11-03')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 font-mono transition-colors"
              >
                Sneha (2021EC108)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security & 1-Event Rule Notice */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-300 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Strict One-Participant-to-One-Event Policy</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400/90 pl-6">
          Each student is authorized to participate in only 1 event across the entire symposium. Duplicate registrations will be automatically blocked by the institutional registry.
        </p>
      </div>
    </div>
  );
};
