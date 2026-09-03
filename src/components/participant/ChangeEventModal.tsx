import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Layers,
  X,
  Sparkles,
  ArrowLeftRight,
  Calendar,
  MapPin,
  Clock,
  Check,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEvent, Registration } from '../../types';
import { CollegeEmblem } from '../common/CollegeLogo';

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
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Technical' | 'Non-Technical'>('ALL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Filter out current event and zero-slot events
  const eligibleEvents = events.filter((e) => {
    if (e.id === currentRegistration.eventId) return false;
    if (e.slotsLeft <= 0) return false;
    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
    return true;
  });

  const selectedEventObj = events.find((e) => e.id === selectedNewEventId);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#d4e8f5] shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">

        {/* Institutional Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e8f5fb]">
          <div className="flex items-center gap-3">
            <CollegeEmblem size={44} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5]">
                  Policy Protocol
                </span>
                <span className="text-[11px] text-slate-400 font-mono">1-Event Rule</span>
              </div>
              <h3 className="text-base font-bold text-[#002b66] mt-0.5">
                Event Switch &amp; Pass Reissuance
              </h3>
              <p className="text-[11px] text-slate-500">
                Official symposium competition transfer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Policy Explanation & Invalidation Notice */}
        {step === 'WARNING' && (
          <div className="space-y-4">
            {/* Elegant Notice Card */}
            <div className="p-4 rounded-2xl bg-[#f8fbfe] border border-[#d4e8f5] space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#e8f5fb] text-[#0077c8] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4 text-[#0077c8]" />
                </div>
                <div className="text-xs space-y-1.5 text-slate-700">
                  <p className="font-bold text-[#002b66]">
                    1-Participant-1-Event Transfer Policy
                  </p>
                  <p className="leading-relaxed text-[12px] text-slate-600">
                    Switching your participation will immediately <strong className="text-[#002b66]">revoke and cancel your current pass</strong> and issue a new verified pass for your chosen competition.
                  </p>
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8]" />
                      <span>Existing pass (<strong className="font-mono">{currentRegistration.registrationNumber}</strong>) is deactivated immediately.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8]" />
                      <span>Capacity slot for current event is released for other students.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8]" />
                      <span>A new encrypted QR entry pass will be generated instantly.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Registered Event Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-0.5">
                  Currently Registered For
                </span>
                <p className="font-bold text-[#002b66] text-sm">{currentRegistration.eventTitle}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Leader: {currentRegistration.leaderName} ({currentRegistration.leaderRollNumber})
                </p>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5]">
                {currentRegistration.category}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Current Event
              </button>

              <button
                type="button"
                onClick={() => setStep('SELECT_EVENT')}
                className="flex-1 py-2.5 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white text-xs font-bold shadow-md shadow-[#0077c8]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Choose New Event</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: New Event Selection */}
        {step === 'SELECT_EVENT' && (
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Category Filter Chips */}
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-[#002b66]">
                Select New Competition *
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                {(['ALL', 'Technical', 'Non-Technical'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 rounded-md font-bold transition-colors ${categoryFilter === cat
                        ? 'bg-[#0077c8] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {cat === 'ALL' ? 'All (10)' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Eligible Events List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {eligibleEvents.map((evt) => {
                const isSelected = selectedNewEventId === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedNewEventId(evt.id);
                      setErrorMessage(null);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${isSelected
                        ? 'border-[#0077c8] bg-[#e8f5fb] shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${evt.category === 'Technical'
                              ? 'bg-[#e8f5fb] text-[#0077c8]'
                              : 'bg-teal-50 text-[#00a887]'
                            }`}
                        >
                          {evt.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {evt.venue} • <span className="font-bold text-emerald-600">{evt.slotsLeft} slots remaining</span>
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected
                          ? 'border-[#0077c8] bg-[#0077c8] text-white'
                          : 'border-slate-300 bg-white'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}

              {eligibleEvents.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No other open competitions match the selected filter.
                </div>
              )}
            </div>

            {/* Reason for Change Input */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">
                Reason for Event Switch (Recorded in Audit Ledger)
              </label>
              <input
                type="text"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="e.g. Prefer coding challenge or schedule preference"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-[#0077c8] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Step 2 Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('WARNING');
                  setErrorMessage(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                disabled={isProcessing || !selectedNewEventId}
                onClick={handleConfirmChange}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-xs shadow-md shadow-[#0077c8]/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reissuing Official Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Switch to {selectedEventObj?.title || 'Selected Event'}</span>
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
