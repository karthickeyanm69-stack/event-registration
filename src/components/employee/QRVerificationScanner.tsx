import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  Building,
  User,
  Crown,
  Users,
  Sparkles,
  Camera,
  RefreshCw,
  Search,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEvent, Registration, StaffUser } from '../../types';

interface QRVerificationScannerProps {
  staffUser: StaffUser;
  onAttendanceRecorded: (registration: Registration) => void;
}

export const QRVerificationScanner: React.FC<QRVerificationScannerProps> = ({
  staffUser,
  onAttendanceRecorded,
}) => {
  const [manualToken, setManualToken] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<{
    valid?: boolean;
    success?: boolean;
    registration?: Registration;
    event?: CollegeEvent;
    errorType?: string;
    errorState?: string;
    errorMessage?: string;
    error?: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [activeRegistrations, setActiveRegistrations] = useState<Registration[]>([]);

  // Load all current registrations from database
  useEffect(() => {
    const regs = MockDatabaseService.getRegistrations().filter((r) => r.status === 'ACTIVE');
    setActiveRegistrations(regs);
  }, [isScanning]);

  const handleSimulateScan = (tokenToScan?: string) => {
    const token = tokenToScan || manualToken.trim();
    if (!token) return;

    const res = MockDatabaseService.verifyQRToken(token, staffUser);
    setScanResult(res);
    setIsScanning(false);
    setSuccessNotice(null);
  };

  const handleConfirmAttendance = () => {
    if (!scanResult?.registration) return;

    setIsRecording(true);
    setTimeout(() => {
      const res = MockDatabaseService.recordAttendance(
        scanResult.registration!.id,
        staffUser,
        'PRESENT',
        `Scanned & verified via Evaluator PWA by ${staffUser.name}`
      );
      setIsRecording(false);

      if (res.success) {
        setSuccessNotice(`Attendance successfully recorded for ${scanResult.registration!.teamName || scanResult.registration!.leaderName}!`);
        onAttendanceRecorded(scanResult.registration!);
      }
    }, 400);
  };

  const handleResetScanner = () => {
    setScanResult(null);
    setManualToken('');
    setIsScanning(true);
    setSuccessNotice(null);
  };

  // Filter registrations relevant to this staff user
  const relevantRegistrations = activeRegistrations.filter(
    (r) =>
      staffUser.assignedEventIds.length === 0 ||
      staffUser.assignedEventIds.includes(r.eventId)
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Scanner Mode */}
      {isScanning && (
        <div className="bg-white dark:bg-primary-container rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-600" />
              <span>Live QR Scanner Viewfinder</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Ready
            </span>
          </div>

          {/* Animated Camera Viewfinder Simulation */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl bg-slate-950 overflow-hidden border-2 border-dashed border-teal-500/50 flex items-center justify-center shadow-inner">
            {/* Viewfinder Target Reticle */}
            <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none" />

            {/* Glowing Laser Scanline */}
            <div className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-laser shadow-[0_0_12px_#2dd4bf]" />

            <div className="text-center space-y-2 z-10">
              <QrCode className="w-16 h-16 text-teal-400/80 mx-auto animate-pulse" />
              <p className="text-[11px] text-slate-300 font-medium px-4">
                Point camera at participant's digital pass or enter details below
              </p>
            </div>
          </div>

          {/* Manual Token / Roll Number Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>Verify by Token, Roll No, or Pass ID:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSimulateScan();
                }}
                placeholder="e.g. 2021CS042 or IGNITE-2024-88421"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSimulateScan()}
                className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Scan Pass
              </button>
            </div>
          </div>

          {/* Quick Real-Time Registration Quick Select */}
          {relevantRegistrations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                1-Tap Live Simulation ({relevantRegistrations.length} Active Participants):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {relevantRegistrations.slice(0, 6).map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => handleSimulateScan(reg.qrToken)}
                    className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-200 text-xs font-semibold border border-teal-200 dark:border-teal-800 text-left transition-colors truncate"
                  >
                    <div className="font-bold truncate">{reg.teamName || reg.leaderName}</div>
                    <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400">
                      {reg.leaderRollNumber} • {reg.eventTitle.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Screen After Scanning */}
      {!isScanning && scanResult && (
        <div className="bg-white dark:bg-primary-container rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5 animate-in fade-in duration-200">
          {/* Header Status */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Scanned Pass Verification</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {scanResult.registration?.eventTitle || scanResult.event?.title || 'Unknown Event'}
              </h3>
            </div>

            {scanResult.valid && !scanResult.errorState && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid Pass</span>
              </span>
            )}

            {(scanResult.errorState || scanResult.errorType) && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{scanResult.errorState || scanResult.errorType}</span>
              </span>
            )}
          </div>

          {/* Success Message Banner */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Message Details */}
          {(scanResult.errorMessage || scanResult.error) && !successNotice && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-medium space-y-1">
              <p className="font-bold">{scanResult.errorMessage || scanResult.error}</p>
              <p className="text-[11px] text-red-600 dark:text-red-400">
                Please double-check with the participant or contact the Event Admin.
              </p>
            </div>
          )}

          {/* Candidate & Team Details Breakdown */}
          {scanResult.registration && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/60 dark:border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Candidate / Leader</span>
                  <p className="font-bold text-slate-900 dark:text-white">{scanResult.registration.leaderName}</p>
                  <p className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                    {scanResult.registration.leaderRollNumber}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Pass ID</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">
                    {scanResult.registration.registrationNumber}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">College & Department</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{scanResult.registration.collegeName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{scanResult.registration.department}</p>
              </div>

              {scanResult.registration.isTeamEvent && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-300">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Team: {scanResult.registration.teamName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {scanResult.registration.members.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px] font-mono"
                      >
                        {m.name.split(' ')[0]} ({m.rollNumber})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: Back OR Confirm Attendance */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetScanner}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back / Scan Next</span>
            </button>

            {scanResult.valid && !scanResult.alreadyAttended && !successNotice && (
              <button
                type="button"
                disabled={isRecording}
                onClick={handleConfirmAttendance}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isRecording ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Mark Present</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRVerificationScanner;
