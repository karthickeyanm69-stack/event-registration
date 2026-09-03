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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-700">Official Scanner Module</span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <Camera className="w-4 h-4 text-teal-600" />
                <span>Live QR Viewfinder</span>
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Camera Active</span>
            </span>
          </div>

          {/* Animated Camera Viewfinder Simulation (Visily / Stitch Design System) */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl bg-slate-900 overflow-hidden border-4 border-slate-800 flex items-center justify-center shadow-2xl">
            {/* Viewfinder Target Reticle Frame */}
            <div className="absolute inset-6 border-2 border-dashed border-teal-400/80 rounded-2xl pointer-events-none" />

            {/* Corner Target Markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />

            {/* Glowing Laser Scanline */}
            <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-laser shadow-[0_0_15px_#2dd4bf]" />

            <div className="text-center space-y-2.5 z-10 px-4">
              <QrCode className="w-16 h-16 text-teal-400/90 mx-auto animate-pulse" />
              <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
                Position participant's Digital Pass QR within frame to auto-detect registration
              </p>
            </div>
          </div>

          {/* Manual Token / Roll Number Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>Manual Pass ID or Roll Number Verification:</span>
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
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSimulateScan()}
                className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-teal-600/20"
              >
                Scan Pass
              </button>
            </div>
          </div>

          {/* Quick Real-Time Registration Select */}
          {relevantRegistrations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Live Active Participants ({relevantRegistrations.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {relevantRegistrations.slice(0, 6).map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => handleSimulateScan(reg.qrToken)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-900 text-xs font-semibold border border-slate-200 hover:border-teal-300 text-left transition-colors truncate"
                  >
                    <div className="font-bold text-slate-900 truncate">{reg.teamName || reg.leaderName}</div>
                    <div className="text-[10px] font-mono text-teal-700 font-bold">
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5 animate-in fade-in duration-200">
          {/* Header Status */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Scanned Pass Result</span>
              <h3 className="text-base font-bold text-slate-900">
                {scanResult.registration?.eventTitle || scanResult.event?.title || 'Unknown Event'}
              </h3>
            </div>

            {scanResult.valid && !scanResult.errorState && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Valid Pass</span>
              </span>
            )}

            {(scanResult.errorState || scanResult.errorType) && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>{scanResult.errorState || scanResult.errorType}</span>
              </span>
            )}
          </div>

          {/* Success Message Banner */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Message Details */}
          {(scanResult.errorMessage || scanResult.error) && !successNotice && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium space-y-1">
              <p className="font-bold text-sm text-red-900">{scanResult.errorMessage || scanResult.error}</p>
              <p className="text-[11px] text-red-700">
                Double-check the roll number or verify with the Event Coordinator.
              </p>
            </div>
          )}

          {/* Candidate & Team Details Breakdown */}
          {scanResult.registration && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Candidate / Leader</span>
                  <p className="font-bold text-slate-900 text-sm">{scanResult.registration.leaderName}</p>
                  <p className="font-mono text-xs text-teal-700 font-bold">
                    {scanResult.registration.leaderRollNumber}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Pass Registry ID</span>
                  <p className="font-mono font-bold text-slate-900 text-xs">
                    {scanResult.registration.registrationNumber}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">College &amp; Department</span>
                <p className="font-semibold text-slate-800">{scanResult.registration.collegeName}</p>
                <p className="text-[11px] text-slate-600">{scanResult.registration.department}</p>
              </div>

              {scanResult.registration.isTeamEvent && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-800">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Team Name: {scanResult.registration.teamName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {scanResult.registration.members.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-sm"
                      >
                        {m.name} ({m.rollNumber})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: Back / Scan Next OR Confirm Attendance */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetScanner}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back / Scan Next</span>
            </button>

            {scanResult.valid && !successNotice && (
              <button
                type="button"
                disabled={isRecording}
                onClick={handleConfirmAttendance}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isRecording ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Attendance</span>
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
