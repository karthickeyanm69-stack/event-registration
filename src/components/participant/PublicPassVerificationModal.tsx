import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  User,
  Crown,
  X,
  AlertTriangle,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { AttendanceRecord, CollegeEvent, Registration } from '../../types';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';

interface PublicPassVerificationModalProps {
  registration: Registration | null;
  event?: CollegeEvent | null;
  attendanceRecord?: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  errorState?: string | null;
}

export const PublicPassVerificationModal: React.FC<PublicPassVerificationModalProps> = ({
  registration,
  event,
  attendanceRecord,
  isOpen,
  onClose,
  errorState,
}) => {
  if (!isOpen) return null;

  const isPresent = attendanceRecord?.status === 'PRESENT';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4e8f5] space-y-0 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#002b66] text-white p-6 relative overflow-hidden">
          {/* Subtle watermark logo in background */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <CollegeEmblem size={140} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7af1fc] block font-mono">
                  Official Verification Seal
                </span>
                <h3 className="text-sm font-bold text-white">SPIHER IGNITE 2026</h3>
              </div>
            </div>

            {registration && !errorState && (
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified &amp; Active Pass</span>
                </span>
                <h2 className="text-xl font-bold text-white mt-1.5">{registration.eventTitle}</h2>
              </div>
            )}

            {errorState && (
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-bold inline-flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errorState}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body with Verified Details */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {registration ? (
            <>
              {/* Candidate Info Card */}
              <div className="p-4 rounded-2xl bg-[#e8f5fb] border border-[#d4e8f5] space-y-2.5 text-xs">
                <div className="flex items-start justify-between pb-2 border-b border-[#d4e8f5]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {registration.isTeamEvent ? 'Team Leader / Candidate' : 'Registered Participant'}
                    </span>
                    <h4 className="text-base font-bold text-[#002b66]">{registration.leaderName}</h4>
                    <p className="font-mono text-xs font-bold text-[#0077c8] mt-0.5">
                      Roll No: {registration.leaderRollNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Pass ID</span>
                    <span className="font-mono text-xs font-bold text-[#002b66] bg-white px-2 py-0.5 rounded border border-[#d4e8f5]">
                      {registration.registrationNumber}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-slate-600">
                  <p className="font-medium text-slate-800">{registration.collegeName}</p>
                  <p className="text-[11px] text-slate-500">{registration.department}</p>
                </div>
              </div>

              {/* Team Members List if applicable */}
              {registration.isTeamEvent && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#002b66]">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Team: {registration.teamName}</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      ({registration.members?.length || 1} Members)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {registration.members?.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-semibold text-slate-800">{m.name}</span>
                        <span className="font-mono text-slate-500 text-[10px]">{m.rollNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Schedule & Venue Information */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Event Schedule &amp; Venue
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0077c8]" />
                    <span>{event?.date || 'Oct 24, 2026'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0077c8]" />
                    <span>{event?.time || '09:30 AM'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-700 pt-1 border-t border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-[#0077c8] shrink-0" />
                  <span className="truncate">{event?.venue || 'Main Campus Auditorium'}</span>
                </div>
              </div>

              {/* Attendance Verification Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Venue Check-in Status:</span>
                {isPresent ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Checked In (Present)</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                    ○ Pending Venue Check-in
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">Pass Record Not Found</h4>
              <p className="text-xs text-slate-500">
                The scanned pass token does not match an active registration in the registry.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 font-mono">
            SPIHER Central Symposium Registry
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0077c8] text-white font-bold text-xs hover:bg-[#0066ad] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicPassVerificationModal;
