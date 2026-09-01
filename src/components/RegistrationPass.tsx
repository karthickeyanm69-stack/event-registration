import React, { useState } from 'react';
import { ParticipantInfo } from '../types';

interface RegistrationPassProps {
  participant: ParticipantInfo;
  onBackToEvents?: () => void;
}

export const RegistrationPass: React.FC<RegistrationPassProps> = ({ participant }) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleOfflineSave = () => {
    setSaveStatus('Pass saved to device for offline use!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSharePass = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SPITHR Event Pass - ${participant.name}`,
          text: `Here is my event pass for ${participant.activeEvent.title} at St. Peter's Institute. Pass ID: ${participant.activeEvent.qrData}`,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `SPITHR Event Pass: ${participant.name} | ID: ${participant.activeEvent.qrData} | Venue: ${participant.activeEvent.venue}`
      );
      setSaveStatus('Pass details copied to clipboard!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div id="registration-pass-screen" className="flex flex-col min-h-screen pb-28 bg-background">
      {/* Top App Bar */}
      <header
        id="pass-top-bar"
        className="w-full top-0 sticky bg-surface border-b border-outline-variant shadow-sm z-40"
      >
        <div className="flex justify-between items-center px-4 h-16 max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer active:opacity-80">
            <span
              className="material-symbols-outlined text-primary text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <div className="text-lg font-bold text-primary tracking-tight font-headline-sm">
            SPITHR Events
          </div>
          <div className="flex items-center gap-2 cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined text-primary text-[24px]">notifications</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="px-4 py-6 max-w-md mx-auto w-full flex flex-col items-center">
        {/* Toast / Notification */}
        {saveStatus && (
          <div className="w-full mb-4 bg-primary text-on-primary p-3 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md animate-fade-in">
            <span className="material-symbols-outlined text-[16px] text-secondary-container">
              check_circle
            </span>
            {saveStatus}
          </div>
        )}

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container/30 text-secondary mb-3 border border-secondary/20 shadow-xs">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary-container mb-2 tracking-tight">
            Registration Complete!
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-xs mx-auto">
            Your spot is secured. Present this QR code at the registration desk for quick entry.
          </p>
        </div>

        {/* Main QR Card */}
        <div
          id="main-qr-pass-card"
          className="w-full max-w-sm glass-card rounded-xl overflow-hidden mb-6 relative border border-outline-variant shadow-ambient"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />

          <div className="p-6 flex flex-col items-center border-b border-outline-variant/30 pt-7">
            {/* Verified badge */}
            <div className="bg-secondary/10 text-secondary font-label-md text-xs font-semibold px-3.5 py-1 rounded-full flex items-center gap-1.5 mb-5 border border-secondary/20">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              Verified Participant
            </div>

            {/* QR Code Graphic Box */}
            <div className="w-48 h-48 bg-white border border-outline-variant rounded-xl p-3 flex items-center justify-center mb-5 shadow-sm relative overflow-hidden group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmMPUMw8_rJHca_CvEdXZSTFmlck-RsgqHvuAhF1b0sE_PPgx2A9_s-VLnz5R8xdTXW9WibuIcnu3EOrQ6_7Ds9yB3e2cHfR5Cd3MDd49S0oJN14LEeLbDIK2gsMqOD2VfJy98FVHs6qDfv8httqNgv_MtwluPtTfLY5c1qIKSq1erAulOuumJKzEvBfuS-TNBzJzdTYL38c1gWD9sLLpRKZRtfwx5n0QguxTR4u0gi8ftrjPmYMsbjQ"
                alt="SPITHR Event Pass QR Code"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <h2 className="font-serif text-xl font-bold text-primary-container mb-0.5">
              {participant.name === 'Alex Mercer' ? 'Aditya Kumar' : participant.name}
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant font-medium mb-4">
              ID: {participant.activeEvent.qrData}
            </p>

            <div className="w-full grid grid-cols-2 gap-4 mt-1 pt-3 border-t border-outline-variant/30">
              <div className="text-center">
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">
                  Date
                </p>
                <p className="font-body-md text-sm text-primary font-bold">
                  {participant.activeEvent.date}
                </p>
              </div>
              <div className="text-center">
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">
                  Time
                </p>
                <p className="font-body-md text-sm text-primary font-bold">09:00 AM</p>
              </div>
            </div>
          </div>

          {/* Venue Info inside Card */}
          <div className="p-4 bg-surface-container-lowest flex items-start gap-3">
            <div className="mt-0.5 p-2 rounded-full bg-surface-variant text-primary shrink-0">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
            </div>
            <div>
              <h3 className="font-label-md text-xs font-bold text-primary-container mb-0.5">
                Main Auditorium
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                St. Peter's Institute of Higher Education & Research, North Campus Block A.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm flex flex-col sm:flex-row gap-3 mb-6">
          <button
            id="btn-offline-save"
            onClick={handleOfflineSave}
            className="flex-1 bg-primary-container text-on-primary h-12 rounded-lg font-label-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Offline Save
          </button>
          <button
            id="btn-share-pass"
            onClick={handleSharePass}
            className="flex-1 bg-surface-container-highest text-primary-container h-12 rounded-lg font-label-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors border border-outline-variant/50 active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share Pass
          </button>
        </div>

        {/* Instructions Section */}
        <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-4 shadow-sm">
          <h3 className="font-headline-sm text-sm font-bold text-primary-container mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
            Entry Instructions
          </h3>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-sm text-xs font-bold shrink-0 mt-0.5 border border-outline-variant/40">
                1
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Have this screen open and brightness turned up as you approach the desk.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-sm text-xs font-bold shrink-0 mt-0.5 border border-outline-variant/40">
                2
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Present the QR code to the scanning volunteer.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-sm text-xs font-bold shrink-0 mt-0.5 border border-outline-variant/40">
                3
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Collect your physical lanyard and event materials.
              </p>
            </li>
          </ul>
        </div>

        {/* Accordion: Trouble Scanning */}
        <div className="w-full max-w-sm border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm mb-4">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low transition-colors font-label-md text-xs font-bold text-primary-container text-left"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[18px]">help</span>
              Trouble scanning?
            </div>
            <span
              className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                isAccordionOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
          {isAccordionOpen && (
            <div className="p-4 pt-1 border-t border-outline-variant/30 text-xs font-body-sm text-on-surface-variant bg-surface-container-lowest leading-relaxed">
              If scanners are unable to read your code, please provide your Student ID (
              <strong className="text-primary font-semibold">{participant.activeEvent.qrData}</strong>) to
              the helpdesk staff for manual verification. Ensure your screen isn't cracked over the code
              area.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
