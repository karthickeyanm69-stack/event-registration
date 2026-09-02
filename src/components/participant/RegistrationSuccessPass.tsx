import React, { useEffect, useState, useRef } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  QrCode as QrIcon,
  Crown,
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { CollegeEvent, Registration } from '../../types';

interface RegistrationSuccessPassProps {
  registration: Registration;
  event?: CollegeEvent;
  onProceedToDashboard: () => void;
}

export const RegistrationSuccessPass: React.FC<RegistrationSuccessPassProps> = ({
  registration,
  event,
  onProceedToDashboard,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const passCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7af1fc', '#006970', '#d6e3ff', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    // Generate high-resolution vector QR with universal verification URL
    if (registration.qrToken) {
      const origin = window.location.origin;
      const verifyUrl = `${origin}/?verify=${encodeURIComponent(registration.registrationNumber)}&token=${encodeURIComponent(registration.qrToken)}`;

      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#000a1e',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [registration]);

  const handleDownloadPass = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${registration.registrationNumber}-Pass.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-6">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-1 shadow-lg ring-4 ring-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary dark:text-white">
          Registration Confirmed!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your official digital pass has been minted and secured in the registry.
        </p>
      </div>

      {/* Official Digital Pass Card (Modern Holographic Look) */}
      <div
        ref={passCardRef}
        className="relative bg-gradient-to-b from-primary via-primary-container to-primary text-white rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden space-y-5"
      >
        {/* Holographic accent glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-xl pointer-events-none" />

        {/* Pass Top Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary to-secondary-container flex items-center justify-center text-primary font-bold shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-tight">SPIHER IGNITE</span>
              <p className="text-[10px] text-secondary-fixed">Official Entry Pass</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Pass ID</span>
            <span className="font-mono text-xs font-bold text-secondary-fixed">
              {registration.registrationNumber}
            </span>
          </div>
        </div>

        {/* QR Code Centrepiece */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner max-w-[220px] mx-auto border-2 border-secondary/30">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Registration QR Code"
              className="w-44 h-44 object-contain rounded-lg"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
              <QrIcon className="w-8 h-8 animate-spin" />
            </div>
          )}
          <span className="text-[9px] text-slate-500 font-mono tracking-widest mt-1.5 uppercase">
            Scan for Entry & Scoring
          </span>
        </div>

        {/* Event & Candidate Details */}
        <div className="space-y-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-secondary-fixed">
                {registration.category}
              </span>
              <span className="text-[10px] text-slate-300">
                {registration.isTeamEvent ? 'Team Participation' : 'Solo Participation'}
              </span>
            </div>
            <h4 className="font-bold text-base text-white">{registration.eventTitle}</h4>
            {registration.teamName && (
              <p className="text-xs text-secondary-fixed font-semibold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{registration.teamName}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Leader Name</span>
              <p className="font-bold text-white truncate">{registration.leaderName}</p>
              <p className="font-mono text-[10px] text-secondary-fixed">{registration.leaderRollNumber}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">College</span>
              <p className="font-medium text-white truncate">{registration.collegeName}</p>
              <p className="text-[10px] text-slate-300 truncate">{registration.department}</p>
            </div>
          </div>

          {registration.members && registration.members.length > 1 && (
            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">
                Team Roster ({registration.members.length} Members)
              </span>
              <div className="flex flex-wrap gap-1">
                {registration.members.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono"
                  >
                    {m.name.split(' ')[0]} ({m.rollNumber})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-fixed" />
            <span>Cryptographically Signed Pass</span>
          </div>
          <span>Active Status</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleDownloadPass}
          className="w-full py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-white/15 transition-colors"
        >
          <Download className="w-4 h-4 text-secondary" />
          <span>Save Pass to Photos / Files</span>
        </button>

        <button
          type="button"
          onClick={onProceedToDashboard}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-primary font-bold text-xs shadow-lg shadow-secondary/30 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
        >
          <span>Enter Participant Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
