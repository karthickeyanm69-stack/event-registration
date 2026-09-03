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
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { Participant, Registration } from '../../types';
import { CollegeLogo } from '../common/CollegeLogo';
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
        setErrorMessage(result.error || 'No registration record found for these credentials. If registering for the first time, click New Registration.');
      }
    }, 500);
  };

  const handleFillDemoUser = (demoRoll: string, demoDOB: string) => {
    setRollNumber(demoRoll);
    setDateOfBirth(demoDOB);
    setErrorMessage(null);
  };

  return (
    <div className="w-full min-h-screen spiher-pattern-bg px-4 py-8 flex flex-col justify-center items-center relative">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#d4e8f5] space-y-6">
        {/* Official College Logo Header */}
        <div className="flex justify-center border-b border-[#e8f5fb] pb-5">
          <CollegeLogo size="md" />
        </div>

        {/* Choice Selector: Existing Participant Access vs New Registration */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#f0f8fc] rounded-2xl border border-[#d4e8f5]">
          <button
            type="button"
            onClick={() => {
              setActiveMode('EXISTING');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeMode === 'EXISTING'
                ? 'bg-[#0077c8] text-white shadow-md'
                : 'text-[#002b66] hover:bg-white/60'
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
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeMode === 'NEW'
                ? 'bg-[#00a887] text-white shadow-md'
                : 'text-[#002b66] hover:bg-white/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>New Registration</span>
          </button>
        </div>

        {/* Existing Participant Access Card */}
        {activeMode === 'EXISTING' && (
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div className="p-3.5 bg-[#e8f5fb] rounded-2xl border border-[#d4e8f5] flex items-center gap-3 text-xs text-[#002b66]">
              <ShieldCheck className="w-5 h-5 text-[#0077c8] shrink-0" />
              <span>
                Zero OTP Required. Verify access using your institutional <strong>Roll Number</strong> &amp; <strong>Date of Birth</strong>.
              </span>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002b66] uppercase tracking-wider">
                  Roll Number / Register Number *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 2021CS042"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e8f5] bg-white text-[#002b66] font-mono text-sm focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/20 focus:outline-none transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* Modern Custom Date Picker without ugly OS popup */}
              <CustomDatePicker
                value={dateOfBirth}
                onChange={setDateOfBirth}
                label="Date of Birth *"
                placeholder="Select Date of Birth"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-sm shadow-lg shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Checking Registry...</span>
              ) : (
                <>
                  <span>Access My Event Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Demo Quick Autofill Helper */}
            <div className="pt-2 border-t border-[#e8f5fb] space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
                Quick Demo Autofill Profile
              </span>
              <button
                type="button"
                onClick={() => handleFillDemoUser('2021CS042', '2003-05-14')}
                className="w-full p-2.5 rounded-xl border border-[#d4e8f5] bg-[#f8fafc] hover:bg-[#e8f5fb] text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-[#002b66]">Alex Mercer (Computer Science)</p>
                  <p className="text-[10px] text-slate-500 font-mono">Roll: 2021CS042 • DOB: 14/05/2003</p>
                </div>
                <span className="text-[10px] font-bold text-[#0077c8] bg-white px-2 py-1 rounded shadow-sm border border-[#d4e8f5]">
                  Autofill
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
