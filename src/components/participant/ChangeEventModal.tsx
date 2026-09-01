import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Trophy,
  X,
  Sparkles,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEvent, Registration } from '../../types';

interface ChangeEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegistration: Registration;
  events: CollegeEvent[];
  onEventChangedSuccess: (newRegistration: Registration) => void;
}

export const ChangeEventModal: React.FC<ChangeEventModalProps> = ({
  isOpen,
  onClose,
  currentRegistration,
  events,
  onEventChangedSuccess,
}) => {
  const [step, setStep] = useState<'WARNING' | 'SELECT_EVENT'>('WARNING');
  const [selectedNewEventId, setSelectedNewEventId] = useState<string>('');
  const [changeReason, setChangeReason] = useState('Participant requested change');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Filter out current event
  const eligibleEvents = events.filter((e) => e.id !== currentRegistration.eventId && e.slotsLeft > 0);

  const handleConfirmChange = () => {
    if (!selectedNewEventId) {
      setErrorMessage('Please select a new event to switch to.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = MockDatabaseService.changeEvent(
        currentRegistration.id,
        selectedNewEventId,
        changeReason
      );
      setIsProcessing(false);

      if (res.success && res.newRegistration) {
        onEventChangedSuccess(res.newRegistration);
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to switch event.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-primary-container rounded-3xl max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Change Event Workflow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Controlled 1-Participant-1-Event Switch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Strict Cancellation Warning */}
        {step === 'WARNING' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-amber-900 dark:text-amber-200">
                  <p className="font-bold">Important Security Notice & Invalidation</p>
                  <p className="leading-relaxed">
                    Per the 1-Participant-1-Event policy, switching to a new event will{' '}
                    <strong>immediately revoke and cancel your current pass</strong> for{' '}
                    <strong className="underline">{currentRegistration.eventTitle}</strong>.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800 dark:text-amber-300 pt-1">
                    <li>Your old QR code ({currentRegistration.registrationNumber}) will be disabled.</li>
                    <li>Staff QR scanners will reject the old pass.</li>
                    <li>A permanent audit trail will record this modification.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                Current Registered Event
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{currentRegistration.eventTitle}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Leader: {currentRegistration.leaderName} ({currentRegistration.leaderRollNumber})
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Keep Current Event
              </button>

              <button
                type="button"
                onClick={() => setStep('SELECT_EVENT')}
                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>I Understand, Choose New Event</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: New Event Selection */}
        {step === 'SELECT_EVENT' && (
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select New Target Event *
              </label>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {eligibleEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedNewEventId(evt.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedNewEventId === evt.id
                        ? 'border-secondary bg-secondary/10 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {evt.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {evt.venue} • {evt.slotsLeft} slots remaining
                      </p>
                    </div>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                      {selectedNewEventId === evt.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason for Event Switch (Audit Log)
              </label>
              <input
                type="text"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="e.g. Schedule clash or prefer technical sprint"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('WARNING')}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Back
              </button>

              <button
                type="button"
                disabled={isProcessing || !selectedNewEventId}
                onClick={handleConfirmChange}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-primary font-bold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Invalidating Old & Issuing New Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Event Change</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
