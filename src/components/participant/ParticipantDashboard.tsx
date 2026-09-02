import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  BookOpen,
  Calendar,
  PhoneCall,
  QrCode as QrIcon,
  RefreshCw,
  Sparkles,
  MapPin,
  Clock,
  Users,
  Trophy,
  Download,
  AlertTriangle,
  LogOut,
  Bell,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Crown,
  Share2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { CollegeEvent, Coordinator, Participant, Registration } from '../../types';
import { ChangeEventModal } from './ChangeEventModal';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';

interface ParticipantDashboardProps {
  participant: Participant;
  registration: Registration;
  events: CollegeEvent[];
  onSignOut: () => void;
  onEventChangedSuccess: (newReg: Registration) => void;
}

export type ParticipantTab = 'home' | 'rules' | 'event' | 'contact' | 'pass';

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  participant,
  registration,
  events,
  onSignOut,
  onEventChangedSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<ParticipantTab>('home');
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const currentEvent = events.find((e) => e.id === registration.eventId) || events[0];

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    if (registration.qrToken) {
      const origin = window.location.origin;
      const verifyUrl = `${origin}/?verify=${encodeURIComponent(registration.registrationNumber)}&token=${encodeURIComponent(registration.qrToken)}`;

      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1.5,
        color: { dark: '#002147', light: '#ffffff' },
      }).then(setQrDataUrl);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [registration]);

  const handleDownloadPass = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${registration.registrationNumber}-Pass.png`;
    a.click();
  };

  const navItems: { id: ParticipantTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Overview', icon: HomeIcon },
    { id: 'rules', label: 'Event Rules', icon: BookOpen },
    { id: 'pass', label: 'My QR Pass', icon: QrIcon },
    { id: 'event', label: 'Countdown & Schedule', icon: Calendar },
    { id: 'contact', label: 'Coordinators', icon: PhoneCall },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Bar with Official College Logo */}
      <header className="h-16 bg-white border-b border-[#d4e8f5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsChangeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change Event</span>
          </button>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / HOME */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Top Symposium Hero Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 z-10 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Official Participant Pass Active
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Oct 24, 2024</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                  St. Peter's Institute of Higher Education & Research
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {participant.department} • Welcome to IGNITE 2024 National Level Symposium.
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                    HOD
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. K. Senthil Nathan (Convenor)</p>
                    <p className="text-[11px] text-slate-500">Please carry your digital QR Pass for venue verification & cafeteria tokens.</p>
                  </div>
                </div>
              </div>

              {/* Quick Status Pill Box */}
              <div className="z-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shrink-0 min-w-[240px]">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Digital Registry Pass</span>
                <p className="font-mono text-sm font-bold text-teal-700">{registration.registrationNumber}</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmed & Active</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('pass')}
                  className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <QrIcon className="w-3.5 h-3.5" />
                  <span>Show Entry Pass</span>
                </button>
              </div>
            </div>

            {/* Split Content: Selected Event & Live Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Selected Event Card */}
              <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {registration.category} Event
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{registration.eventTitle}</h3>
                    {registration.teamName && (
                      <p className="text-xs text-teal-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        <span>Team: {registration.teamName}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-500 block font-bold">Category</span>
                    <span className="text-xs font-bold text-[#0077c8] font-mono">{registration.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Timing & Schedule</span>
                    </div>
                    <p className="font-bold text-slate-900">{currentEvent.time}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Venue Location</span>
                    </div>
                    <p className="font-bold text-slate-900 truncate">{currentEvent.venue}</p>
                  </div>
                </div>

                {registration.members && registration.members.length > 1 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Team Roster ({registration.members.length} Members)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {registration.members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{m.name} {m.isLeader ? '(Leader)' : ''}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{m.rollNumber}</p>
                          </div>
                          <span className="text-[10px] text-teal-700 font-semibold">{m.department}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Announcements Panel */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-200">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span>Symposium Bulletin</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">Reporting Time</p>
                    <p className="text-slate-600">All registered candidates must report at the help desk by 09:00 AM for badge verification.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">Cafeteria Lunch Tokens</p>
                    <p className="text-slate-600">Complimentary lunch can be availed at Block 2 by scanning your Pass QR code.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RULES */}
        {/* ========================================================================= */}
        {activeTab === 'rules' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-[10px] uppercase font-bold text-teal-700">Rulebook & Guidelines</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentEvent.title}</h3>
              <p className="text-xs text-slate-500">{currentEvent.tagline}</p>
            </div>


            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evaluation Guidelines ({currentEvent.rules.length})
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MY PASS */}
        {activeTab === 'pass' && (
          <div className="max-w-md mx-auto space-y-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-md border border-[#d4e8f5] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e8f5fb]">
                <div className="flex items-center gap-3">
                  <CollegeEmblem size={40} />
                  <div>
                    <span className="font-serif font-black text-base text-[#002b66]">St. PETER'S</span>
                    <p className="text-[10px] text-[#0077c8] uppercase tracking-wider font-bold">Official Registry Pass</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#0077c8]">{registration.registrationNumber}</span>
              </div>

              {/* QR Code Centrepiece */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl shadow-inner max-w-[240px] mx-auto border border-slate-200">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Pass QR" className="w-48 h-48 object-contain rounded-lg shadow-sm" />
                ) : (
                  <QrIcon className="w-20 h-20 text-slate-400 animate-pulse" />
                )}
                <span className="text-[9px] text-slate-500 font-mono tracking-widest mt-1.5 uppercase font-semibold">
                  Scan for Gate & Scoring
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-lg text-slate-900">{registration.eventTitle}</h4>
                {registration.teamName && (
                  <p className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{registration.teamName}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Candidate</span>
                    <span className="font-bold text-slate-900">{registration.leaderName}</span>
                    <span className="text-[10px] font-mono text-teal-700 block font-semibold">{registration.leaderRollNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Venue</span>
                    <span className="font-medium text-slate-900">{currentEvent.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPass}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital Pass</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COUNTDOWN & SCHEDULE */}
        {activeTab === 'event' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-8 rounded-3xl bg-white text-slate-900 text-center shadow-sm space-y-4 border border-slate-200/90">
              <span className="text-[11px] uppercase tracking-widest font-bold text-teal-700">
                Competition Commences In
              </span>
              <div className="flex items-center justify-center gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[80px]">
                  <span className="text-3xl font-bold font-mono text-slate-900">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-500 font-semibold">Hours</span>
                </div>
                <span className="text-3xl font-bold text-slate-400">:</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[80px]">
                  <span className="text-3xl font-bold font-mono text-slate-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-500 font-semibold">Mins</span>
                </div>
                <span className="text-3xl font-bold text-slate-400">:</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[80px]">
                  <span className="text-3xl font-bold font-mono text-teal-700">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-500 font-semibold">Secs</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">Scheduled for {currentEvent.date} @ {currentEvent.time}</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Venue & Location Navigation</span>
              </h3>
              <p className="text-xs text-slate-700">{currentEvent.venue}</p>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p>📍 St. Peter's Institute Main Campus, Block C</p>
                <p>💡 Follow physical signage for "{currentEvent.title}".</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT COORDINATORS */}
        {activeTab === 'contact' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-[10px] uppercase font-bold text-teal-700">Support Directory</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Event Coordinators</h3>
              <p className="text-xs text-slate-500">Direct contacts for {currentEvent.title}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentEvent.coordinators.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-600/20" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                      <p className="text-[11px] text-teal-700 font-semibold">{c.role}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.phone}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${c.phone}`}
                    className="p-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
                    title="Call Coordinator"
                  >
                    <PhoneCall className="w-4 h-4 font-bold" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation (Visible on mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Change Event Modal */}
      <ChangeEventModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentRegistration={registration}
        events={events}
        onEventChangedSuccess={onEventChangedSuccess}
      />
    </div>
  );
};
