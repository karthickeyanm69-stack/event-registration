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
import { CollegeEmblem } from '../common/CollegeLogo';

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
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0077c8', '#00a887', '#7af1fc', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    // Generate high-resolution vector QR with universal verification URL
    if (registration.qrToken) {
      const origin = window.location.origin;
      const verifyUrl = `${origin}/?verify=${encodeURIComponent(registration.registrationNumber)}&token=${encodeURIComponent(registration.qrToken)}`;

      QRCode.toDataURL(verifyUrl, {
        width: 340,
        margin: 1.5,
        color: {
          dark: '#001a40',
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
    a.download = `${registration.registrationNumber}-SPIHER-Pass.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-1 shadow-lg ring-4 ring-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#002b66]">
          Registration Confirmed!
        </h2>
        <p className="text-xs text-slate-600 font-medium">
          Your official digital entry pass has been minted and secured in the registry.
        </p>
      </div>

      {/* Official Digital Pass Card (High-Contrast Rich Navy Institutional Design) */}
      <div
        ref={passCardRef}
        className="relative bg-gradient-to-b from-[#001f4d] via-[#002b66] to-[#001838] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 overflow-hidden space-y-5"
      >
        {/* Holographic Watermark Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#0077c8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#00a887]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Pass Top Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15 relative z-10">
          <div className="flex items-center gap-2.5">
            <CollegeEmblem size={34} />
            <div>
              <span className="font-serif font-bold text-sm tracking-tight text-white block">
                SPIHER IGNITE 2026
              </span>
              <p className="text-[10px] text-[#7af1fc] font-medium">Official Digital Pass</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-white/70 block">Pass ID</span>
            <span className="font-mono text-xs font-extrabold text-[#7af1fc] bg-white/10 px-2 py-0.5 rounded border border-white/15">
              {registration.registrationNumber}
            </span>
          </div>
        </div>

        {/* QR Code Centrepiece with High Contrast */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl max-w-[230px] mx-auto border-2 border-[#7af1fc]/40 relative z-10">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Registration QR Code"
              className="w-44 h-44 object-contain rounded-lg shadow-xs"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
              <QrIcon className="w-8 h-8 animate-spin text-[#0077c8]" />
            </div>
          )}
          <span className="text-[9px] text-[#002b66] font-mono font-bold tracking-widest mt-2 uppercase">
            Scan for Entry &amp; Scoring
          </span>
        </div>

        {/* Event & Candidate Details (Crystal Clear White & Cyan Text) */}
        <div className="space-y-3 pt-1 text-xs relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span
                className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                  registration.category === 'Technical'
                    ? 'bg-[#0077c8] text-white'
                    : 'bg-[#00a887] text-white'
                }`}
              >
                {registration.category}
              </span>
              <span className="text-[10px] text-white/80 font-medium">
                {registration.isTeamEvent ? 'Team Event' : 'Solo Participation'}
              </span>
            </div>
            <h4 className="font-bold text-base text-white">{registration.eventTitle}</h4>
            {registration.teamName && (
              <p className="text-xs text-[#7af1fc] font-semibold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{registration.teamName}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="space-y-0.5">
              <span className="text-[10px] text-white/70 uppercase font-bold block">Participant</span>
              <p className="font-bold text-white truncate text-xs">{registration.leaderName}</p>
              <p className="font-mono text-[10px] text-[#7af1fc] font-bold">{registration.leaderRollNumber}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-white/70 uppercase font-bold block">Institution</span>
              <p className="font-semibold text-white truncate text-xs">{registration.collegeName}</p>
              <p className="text-[10px] text-white/80 truncate">{registration.department}</p>
            </div>
          </div>

          {registration.members && registration.members.length > 1 && (
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-[11px]">
              <span className="text-[10px] text-white/70 uppercase font-bold block mb-1.5">
                Team Roster ({registration.members.length} Members)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {registration.members.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-white/20 text-white text-[10px] font-mono font-medium border border-white/20"
                  >
                    {m.name.split(' ')[0]} ({m.rollNumber})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-between text-[10px] text-white/70 pt-2 border-t border-white/15 relative z-10">
          <div className="flex items-center gap-1 text-[#7af1fc] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Verified Pass</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
            Confirmed Active
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleDownloadPass}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#002b66] font-bold text-xs flex items-center justify-center gap-2 border border-[#d4e8f5] shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#0077c8]" />
          <span>Save Pass to Photos / Files</span>
        </button>

        <button
          type="button"
          onClick={onProceedToDashboard}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white font-bold text-xs shadow-lg shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>Enter Participant Dashboard</span>
          <ArrowRight className="w-4 h-4 text-[#7af1fc]" />
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessPass;
