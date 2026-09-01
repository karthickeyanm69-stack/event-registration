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
      QRCode.toDataURL(registration.qrToken, {
        width: 320,
        margin: 1.5,
        color: { dark: '#000a1e', light: '#ffffff' },
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
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-white tracking-tight">SPIHER</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                IGNITE 2024
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {participant.name} ({participant.rollNumber}) • {participant.collegeName}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change Event</span>
          </button>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
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
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-[#001736] to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 z-10 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Official Participant Pass Active
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Oct 24, 2024</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                  St. Peter's Institute of Higher Education & Research
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {participant.department} • Welcome to IGNITE 2024 National Level Symposium.
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                    HOD
                  </div>
                  <div>
                    <p className="font-bold text-white">Dr. K. Senthil Nathan (Convenor)</p>
                    <p className="text-[11px] text-slate-400">Please carry your digital QR Pass for venue verification & cafeteria tokens.</p>
                  </div>
                </div>
              </div>

              {/* Quick Status Pill Box */}
              <div className="z-10 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shrink-0 min-w-[240px]">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Digital Registry Pass</span>
                <p className="font-mono text-sm font-bold text-teal-400">{registration.registrationNumber}</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmed & Active</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('pass')}
                  className="w-full py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <QrIcon className="w-3.5 h-3.5" />
                  <span>Show Entry Pass</span>
                </button>
              </div>
            </div>

            {/* Split Content: Selected Event & Live Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Selected Event Card */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {registration.category} Event
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{registration.eventTitle}</h3>
                    {registration.teamName && (
                      <p className="text-xs text-teal-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Team: {registration.teamName}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Prize Pool</span>
                    <span className="text-base font-bold text-amber-400 font-mono">{currentEvent.prizePool}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Timing & Schedule</span>
                    </div>
                    <p className="font-bold text-white">{currentEvent.time}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Venue Location</span>
                    </div>
                    <p className="font-bold text-white truncate">{currentEvent.venue}</p>
                  </div>
                </div>

                {registration.members && registration.members.length > 1 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Team Roster ({registration.members.length} Members)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {registration.members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">{m.name} {m.isLeader ? '(Leader)' : ''}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{m.rollNumber}</p>
                          </div>
                          <span className="text-[10px] text-teal-400">{m.department}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Announcements Panel */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
                  <Bell className="w-4 h-4 text-teal-400" />
                  <span>Symposium Bulletin</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="font-bold text-white">Reporting Time</p>
                    <p className="text-slate-400">All registered candidates must report at the help desk by 09:00 AM for badge verification.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="font-bold text-white">Cafeteria Lunch Tokens</p>
                    <p className="text-slate-400">Complimentary lunch can be availed at Block 2 by scanning your Pass QR code.</p>
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
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-teal-400">Rulebook & Guidelines</span>
              <h3 className="text-2xl font-bold text-white mt-1">{currentEvent.title}</h3>
              <p className="text-xs text-slate-400">{currentEvent.tagline}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold block">Total Prize Pool</span>
                <span className="text-lg font-mono font-bold text-amber-400">{currentEvent.prizePool}</span>
              </div>
              <div className="text-right">
                <p>1st: {currentEvent.firstPrize || 'Cash Award + Trophy'}</p>
                <p>2nd: {currentEvent.secondPrize || 'Cash Award + Shield'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evaluation Guidelines ({currentEvent.rules.length})
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800/50">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
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
            <div className="bg-gradient-to-b from-slate-950 via-[#001736] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="font-serif font-bold text-base">SPIHER IGNITE 2024</span>
                  <p className="text-[10px] text-teal-400 uppercase tracking-wider">Official Entry Pass</p>
                </div>
                <span className="font-mono text-xs font-bold text-teal-400">{registration.registrationNumber}</span>
              </div>

              {/* QR Code Centrepiece */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner max-w-[240px] mx-auto border-2 border-teal-500/30">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Pass QR" className="w-48 h-48 object-contain rounded-lg" />
                ) : (
                  <QrIcon className="w-20 h-20 text-slate-400 animate-pulse" />
                )}
                <span className="text-[9px] text-slate-500 font-mono tracking-widest mt-1.5 uppercase">
                  Scan for Gate & Scoring
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-lg text-white">{registration.eventTitle}</h4>
                {registration.teamName && (
                  <p className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>{registration.teamName}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Candidate</span>
                    <span className="font-bold text-white">{registration.leaderName}</span>
                    <span className="text-[10px] font-mono text-teal-400 block">{registration.leaderRollNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Venue</span>
                    <span className="font-medium text-white">{currentEvent.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPass}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
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
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-[#001736] to-slate-950 text-white text-center shadow-xl space-y-4 border border-slate-800">
              <span className="text-[11px] uppercase tracking-widest font-bold text-teal-400">
                Competition Commences In
              </span>
              <div className="flex items-center justify-center gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-w-[80px]">
                  <span className="text-3xl font-bold font-mono text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-400">Hours</span>
                </div>
                <span className="text-3xl font-bold text-slate-500">:</span>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-w-[80px]">
                  <span className="text-3xl font-bold font-mono text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-400">Mins</span>
                </div>
                <span className="text-3xl font-bold text-slate-500">:</span>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-w-[80px]">
                  <span className="text-3xl font-bold font-mono text-teal-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-400">Secs</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">Scheduled for {currentEvent.date} @ {currentEvent.time}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Venue & Location Navigation</span>
              </h3>
              <p className="text-xs text-slate-300">{currentEvent.venue}</p>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>📍 St. Peter's Institute Main Campus, Block C</p>
                <p>💡 Follow physical signage for "{currentEvent.title}".</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT COORDINATORS */}
        {activeTab === 'contact' && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-teal-400">Support Directory</span>
              <h3 className="text-2xl font-bold text-white mt-1">Event Coordinators</h3>
              <p className="text-xs text-slate-400">Direct contacts for {currentEvent.title}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentEvent.coordinators.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/30" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-[11px] text-teal-400 font-semibold">{c.role}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.phone}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${c.phone}`}
                    className="p-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-md"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-white'
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
