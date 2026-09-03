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
  Zap,
  Volume2,
  VolumeX,
  AlertOctagon,
  Calendar,
  Clock,
  FlipHorizontal,
  ChevronDown,
} from 'lucide-react';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import { SupabaseService } from '../../services/supabaseService';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEvent, Registration, StaffUser } from '../../types';
import { CollegeEmblem } from '../common/CollegeLogo';

interface QRVerificationScannerProps {
  staffUser: StaffUser;
  onAttendanceRecorded: (registration: Registration) => void;
}

type CameraPermissionState = 'IDLE' | 'PROMPTING' | 'GRANTED' | 'DENIED' | 'UNAVAILABLE';
type ScannerStep = 'SCANNING' | 'VALIDATING' | 'REVIEW_DETAILS' | 'RECORDING' | 'SUCCESS' | 'ERROR';

export const QRVerificationScanner: React.FC<QRVerificationScannerProps> = ({
  staffUser,
  onAttendanceRecorded,
}) => {
  // Step & Event Filter State
  const [currentStep, setCurrentStep] = useState<ScannerStep>('SCANNING');
  const [selectedEventId, setSelectedEventId] = useState<string>(
    staffUser.assignedEventIds && staffUser.assignedEventIds.length > 0
      ? staffUser.assignedEventIds[0]
      : 'ALL'
  );

  // Camera & Stream State
  const [permissionState, setPermissionState] = useState<CameraPermissionState>('IDLE');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Manual Input State
  const [manualToken, setManualToken] = useState('');

  // Verified Data State
  const [verifiedRegistration, setVerifiedRegistration] = useState<Registration | null>(null);
  const [errorDetails, setErrorDetails] = useState<{
    type: string;
    message: string;
    attendedAt?: string;
    attendedBy?: string;
  } | null>(null);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // All events for assignment picker
  const [eventsList, setEventsList] = useState<CollegeEvent[]>([]);

  useEffect(() => {
    const allEvts = MockDatabaseService.getEvents();
    setEventsList(allEvts);
  }, []);

  // Filter staff assigned events
  const staffAssignedEvents = eventsList.filter(
    (e) => staffUser.assignedEventIds.length === 0 || staffUser.assignedEventIds.includes(e.id)
  );

  // Stop active camera stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    stopCamera();
    setPermissionState('PROMPTING');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionState('UNAVAILABLE');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setPermissionState('GRANTED');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        
        // Wait for metadata to avoid AbortError on rapid mount/unmount
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((playErr) => {
              if (playErr.name !== 'AbortError') {
                console.warn('Video stream notice:', playErr);
              }
            });
          }
        };
      }

      // Check torch capabilities
      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities?.() as any) || {};
      setHasTorchSupport(Boolean(capabilities.torch));

      // Start Frame Analysis
      requestAnimationFrame(scanVideoFrame);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.warn('Camera access notice:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('DENIED');
      } else {
        setPermissionState('UNAVAILABLE');
      }
    }
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextTorch = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle error:', e);
    }
  };

  // Switch between front/back cameras
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Continuous Frame Analysis Loop for QR detection
  const scanVideoFrame = () => {
    if (currentStep !== 'SCANNING') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          // Detected QR Code!
          playBeepSound();
          handleProcessScannedIdentifier(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
  };

  // Audio Beep Feedback on QR detection
  const playBeepSound = () => {
    if (!audioFeedback) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  };

  // Lifecycle: start camera when in scanning mode, stop when leaving
  useEffect(() => {
    if (currentStep === 'SCANNING') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [currentStep, facingMode]);

  // Handle Token / ID Validation with Supabase Backend
  const handleProcessScannedIdentifier = async (rawInput: string) => {
    stopCamera();
    setCurrentStep('VALIDATING');
    setErrorDetails(null);
    setVerifiedRegistration(null);

    try {
      // Execute live backend validation against Supabase
      const result = await SupabaseService.validateQRForAttendance({
        tokenOrId: rawInput,
        staffUser,
        selectedEventId,
      });

      if (result.success && result.registration) {
        setVerifiedRegistration(result.registration);
        setCurrentStep('REVIEW_DETAILS');
      } else {
        setErrorDetails({
          type: result.errorType || 'INVALID_QR',
          message: result.errorMessage || 'Invalid QR code or pass not found in registry.',
          attendedAt: result.alreadyAttendedAt,
          attendedBy: result.alreadyAttendedBy,
        });
        setCurrentStep('ERROR');
      }
    } catch (err: any) {
      setErrorDetails({
        type: 'NETWORK_ERROR',
        message: err.message || 'Error communicating with validation server.',
      });
      setCurrentStep('ERROR');
    }
  };

  // Step: Explicit Attendance Confirmation
  const handleConfirmAttendance = async () => {
    if (!verifiedRegistration) return;

    setCurrentStep('RECORDING');

    try {
      // Record attendance directly in Supabase
      const res = await SupabaseService.confirmAndRecordAttendance({
        registration: verifiedRegistration,
        staffUser,
      });

      if (res.success && res.record) {
        // Also update local storage cache for immediate offline reactivity
        MockDatabaseService.recordAttendance(verifiedRegistration.id, staffUser, 'PRESENT');

        try {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { y: 0.6 },
            colors: ['#0077c8', '#00a887', '#10b981'],
          });
        } catch {
          // ignore
        }

        onAttendanceRecorded(verifiedRegistration);
        setCurrentStep('SUCCESS');
      } else {
        setErrorDetails({
          type: 'RECORD_ERROR',
          message: res.error || 'Failed to record attendance in database.',
        });
        setCurrentStep('ERROR');
      }
    } catch (err: any) {
      setErrorDetails({
        type: 'NETWORK_ERROR',
        message: err.message || 'Attendance write error.',
      });
      setCurrentStep('ERROR');
    }
  };

  // Reset Scanner for Next Student
  const handleScanNext = () => {
    setVerifiedRegistration(null);
    setErrorDetails(null);
    setManualToken('');
    setCurrentStep('SCANNING');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Hidden Canvas for QR Analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ========================================================================= */}
      {/* 1. ASSIGNED EVENT SELECTOR & HEADER                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#d4e8f5] shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8f5fb]">
          <div className="flex items-center gap-2.5">
            <CollegeEmblem size={36} />
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#0077c8] tracking-widest block">
                Official Verifier PWA
              </span>
              <h2 className="text-sm sm:text-base font-bold text-[#002b66]">
                QR Entry &amp; Attendance Check
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAudioFeedback(!audioFeedback)}
              title={audioFeedback ? 'Beep On' : 'Beep Muted'}
              className="p-2 rounded-xl text-slate-400 hover:text-[#002b66] hover:bg-[#f0f8fc] transition-colors cursor-pointer"
            >
              {audioFeedback ? <Volume2 className="w-4 h-4 text-[#0077c8]" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Selected Event Context Pill */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#002b66] flex items-center justify-between">
            <span>Stationed Competition Venue:</span>
            {selectedEventId !== 'ALL' && (
              <span className="text-[10px] font-mono text-[#0077c8] font-bold">
                Filtered Validation
              </span>
            )}
          </label>
          <div className="relative">
            <select
              value={selectedEventId}
              disabled={currentStep !== 'SCANNING'}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f8fc] border border-[#d4e8f5] text-[#002b66] text-xs font-bold focus:border-[#0077c8] focus:bg-white focus:outline-none transition-all cursor-pointer disabled:opacity-60"
            >
              {staffUser.role === 'SUPER_ADMIN' || staffUser.role === 'ADMIN' ? (
                <option value="ALL">All Symposium Competitions (Universal Admin Scanner)</option>
              ) : null}
              {staffAssignedEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.category}) — {evt.venue}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE CAMERA SCANNER VIEW                                               */}
      {/* ========================================================================= */}
      {currentStep === 'SCANNING' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#d4e8f5] shadow-xl space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#002b66] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#0077c8]" />
              <span>Live Optical Scanner</span>
            </span>

            {permissionState === 'GRANTED' && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Camera Stream Active</span>
              </span>
            )}
          </div>

          {/* Camera Viewport Frame */}
          <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-3xl bg-slate-950 overflow-hidden border-4 border-[#002b66] shadow-2xl flex items-center justify-center">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${permissionState === 'GRANTED' ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {/* Viewfinder Target Reticle Frame */}
            {permissionState === 'GRANTED' && (
              <>
                <div className="absolute inset-8 border-2 border-dashed border-[#7af1fc]/80 rounded-2xl pointer-events-none" />
                {/* Corner Target Markers */}
                <div className="absolute top-5 left-5 w-7 h-7 border-t-4 border-l-4 border-[#7af1fc] rounded-tl-xl pointer-events-none" />
                <div className="absolute top-5 right-5 w-7 h-7 border-t-4 border-r-4 border-[#7af1fc] rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-5 left-5 w-7 h-7 border-b-4 border-l-4 border-[#7af1fc] rounded-bl-xl pointer-events-none" />
                <div className="absolute bottom-5 right-5 w-7 h-7 border-b-4 border-r-4 border-[#7af1fc] rounded-br-xl pointer-events-none" />

                {/* Animated Glowing Laser Scanline */}
                <div className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#7af1fc] to-transparent animate-laser shadow-[0_0_15px_#7af1fc] pointer-events-none" />
              </>
            )}

            {/* Permission Prompting / Loading State */}
            {permissionState === 'PROMPTING' && (
              <div className="text-center p-6 space-y-3 z-10 text-white">
                <RefreshCw className="w-10 h-10 text-[#7af1fc] animate-spin mx-auto" />
                <p className="text-xs font-bold">Requesting camera permissions...</p>
                <p className="text-[11px] text-white/70">Please allow camera access when prompted.</p>
              </div>
            )}

            {/* Permission Denied State */}
            {permissionState === 'DENIED' && (
              <div className="text-center p-6 space-y-3 z-10 text-white">
                <AlertOctagon className="w-10 h-10 text-rose-400 mx-auto" />
                <p className="text-xs font-bold text-rose-300">Camera Access Blocked</p>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Camera permission was denied in your browser settings. Enable permission or use the manual pass ID entry below.
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  Retry Camera
                </button>
              </div>
            )}

            {/* Camera Controls Overlay (Torch & Flip) */}
            {permissionState === 'GRANTED' && (
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 z-20">
                {hasTorchSupport && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                      isTorchOn
                        ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-lg shadow-amber-400/30'
                        : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                    }`}
                    title="Toggle Flashlight"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                  title="Switch Camera (Front / Back)"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Manual Pass ID or Roll Number Verification */}
          <div className="space-y-2 pt-2 border-t border-[#e8f5fb]">
            <label className="text-xs font-bold text-[#002b66] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#0077c8]" />
              <span>Or Enter Pass ID / Student Roll Number:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProcessScannedIdentifier(manualToken);
                }}
                placeholder="e.g. IGNITE-2024-88421 or 2021CS042"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#d4e8f5] text-[#002b66] text-xs font-mono font-bold focus:ring-2 focus:ring-[#0077c8]/20 focus:border-[#0077c8] focus:bg-white focus:outline-none uppercase"
              />
              <button
                type="button"
                disabled={!manualToken.trim()}
                onClick={() => handleProcessScannedIdentifier(manualToken)}
                className="py-2.5 px-4 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#0077c8]/20 disabled:opacity-50"
              >
                Validate Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VALIDATING WITH SUPABASE LOADING STATE                                 */}
      {/* ========================================================================= */}
      {currentStep === 'VALIDATING' && (
        <div className="bg-white rounded-3xl p-8 border border-[#d4e8f5] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#e8f5fb] text-[#0077c8] flex items-center justify-center mx-auto shadow-inner">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#002b66]">Validating with Supabase Registry...</h3>
            <p className="text-xs text-slate-500">Checking event authorization &amp; duplicate attendance records.</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. READ-ONLY PARTICIPANT / TEAM DETAILS & ATTENDANCE CONFIRMATION         */}
      {/* ========================================================================= */}
      {currentStep === 'REVIEW_DETAILS' && verifiedRegistration && (
        <div className="bg-white rounded-3xl p-6 border border-[#d4e8f5] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
          {/* Header Status */}
          <div className="flex items-start justify-between pb-3 border-b border-[#e8f5fb]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0077c8]">Verified Candidate Record</span>
              <h3 className="text-base font-bold text-[#002b66] mt-0.5">
                {verifiedRegistration.eventTitle}
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Valid Pass</span>
            </span>
          </div>

          {/* Candidate & Team Details (Strictly Read-Only) */}
          <div className="p-4 rounded-2xl bg-[#f8fbfe] border border-[#d4e8f5] space-y-3.5 text-xs">
            {/* Primary Candidate Row */}
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#d4e8f5]/80">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate / Leader</span>
                <p className="font-bold text-[#002b66] text-sm truncate">{verifiedRegistration.leaderName}</p>
                <p className="font-mono text-xs text-[#0077c8] font-bold mt-0.5">
                  {verifiedRegistration.leaderRollNumber}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Registry Pass ID</span>
                <p className="font-mono font-bold text-[#002b66] text-xs">
                  {verifiedRegistration.registrationNumber}
                </p>
                <span
                  className={`inline-block text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full mt-1 ${
                    verifiedRegistration.category === 'Technical'
                      ? 'bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5]'
                      : 'bg-teal-50 text-[#00a887] border border-teal-200'
                  }`}
                >
                  {verifiedRegistration.category}
                </span>
              </div>
            </div>

            {/* Institution & Contact Details */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">College &amp; Department</span>
              <p className="font-semibold text-slate-800 text-xs">{verifiedRegistration.collegeName}</p>
              <p className="text-[11px] text-slate-600">{verifiedRegistration.department}</p>
              {verifiedRegistration.leaderEmail && (
                <p className="text-[10px] font-mono text-slate-500 pt-0.5">{verifiedRegistration.leaderEmail}</p>
              )}
            </div>

            {/* Team Roster Breakdown (For Team Events) */}
            {verifiedRegistration.isTeamEvent && (
              <div className="pt-3 border-t border-[#d4e8f5]/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#002b66]">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Team: {verifiedRegistration.teamName || 'Team'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {verifiedRegistration.members.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#d4e8f5] text-[10px] font-mono font-bold text-slate-700 shadow-xs"
                    >
                      {m.name} ({m.rollNumber})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Cancel vs Explicit Confirm Attendance */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleScanNext}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back / Cancel</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmAttendance}
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm Attendance</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUCCESS CONFIRMATION SCREEN                                            */}
      {/* ========================================================================= */}
      {currentStep === 'SUCCESS' && verifiedRegistration && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider">
              Attendance Recorded
            </span>
            <h3 className="text-xl font-bold text-[#002b66]">
              {verifiedRegistration.teamName || verifiedRegistration.leaderName}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Verified for <strong className="text-[#002b66]">{verifiedRegistration.eventTitle}</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0fdf4] border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-mono">
            <span>Pass: {verifiedRegistration.registrationNumber}</span>
            <span className="font-bold">STATUS: PRESENT ✓</span>
          </div>

          <button
            type="button"
            onClick={handleScanNext}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-xs shadow-lg shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Next Participant</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ERROR SCREEN (INVALID / WRONG EVENT / ALREADY ATTENDED)                */}
      {/* ========================================================================= */}
      {currentStep === 'ERROR' && errorDetails && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {errorDetails.type}
              </span>
              <h3 className="text-base font-bold text-slate-900">Verification Rejected</h3>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                {errorDetails.message}
              </p>
            </div>
          </div>

          {errorDetails.attendedAt && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
              <p className="font-bold">Check-in timestamp recorded:</p>
              <p className="font-mono text-slate-700">{new Date(errorDetails.attendedAt).toLocaleString()}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleScanNext}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again / Scan Another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRVerificationScanner;
