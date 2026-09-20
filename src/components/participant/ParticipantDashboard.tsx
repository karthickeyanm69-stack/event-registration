import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  BookOpen,
  Calendar,
  PhoneCall,
  QrCode,
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
  Building,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import QRCode from 'qrcode';
import { CollegeEvent, Coordinator, Participant, Registration } from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';
import { ChangeEventModal } from './ChangeEventModal';

interface ParticipantDashboardProps {
  participant?: Participant;
  registration?: Registration;
  events: CollegeEvent[];
  onSignOut: () => void;
  onEventChangedSuccess: (newReg: Registration) => void;
  onStartNewRegistration?: () => void;
  onOpenAccessLogin?: () => void;
}

export type ParticipantTab = 'home' | 'rules' | 'event' | 'contact' | 'pass';

const defaultFallbackRegistration: Registration = {
  id: 'reg-default',
  registrationNumber: 'RAD-2026-88421',
  eventId: 'evt-ai-prompt',
  eventTitle: 'AI Prompt',
  category: 'Technical',
  leaderId: 'part-default',
  leaderName: 'Alex Mercer',
  leaderRollNumber: '2021CS042',
  leaderEmail: 'alex.mercer@spiher.edu.in',
  collegeName: "St. Peter's Institute of Higher Education & Research",
  department: 'Dept. of Information Technology',
  isTeamEvent: true,
  teamName: 'PromptMasters',
  members: [],
  status: 'ACTIVE',
  qrToken: 'SPIHER_RAD_TOKEN_V1_SEC',
  registeredAt: new Date().toISOString(),
};

const defaultFallbackParticipant: Participant = {
  id: 'part-default',
  name: 'Alex Mercer',
  rollNumber: '2021CS042',
  department: 'Dept. of Information Technology',
  collegeName: "St. Peter's Institute of Higher Education & Research",
  email: 'alex.mercer@spiher.edu.in',
  phone: '+91 98765 43210',
  dateOfBirth: '2003-05-14',
  createdAt: new Date().toISOString(),
};

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  participant = MockDatabaseService.getParticipants()[0] || defaultFallbackParticipant,
  registration = MockDatabaseService.getRegistrations()[0] || defaultFallbackRegistration,
  events = MockDatabaseService.getEvents(),
  onSignOut,
  onEventChangedSuccess,
  onStartNewRegistration,
  onOpenAccessLogin,
}) => {
  const getTabFromUrl = (): ParticipantTab => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/dashboard/rules')) return 'rules';
    if (path.includes('/dashboard/pass')) return 'pass';
    if (path.includes('/dashboard/event') || path.includes('/dashboard/schedule')) return 'event';
    if (path.includes('/dashboard/contact')) return 'contact';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<ParticipantTab>(getTabFromUrl());
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const fallbackEvent = MockDatabaseService.getEvents()[0] || {
    id: 'evt-ai-prompt',
    title: 'AI Prompt',
    category: 'Technical',
    tagline: 'Creative Prompt Engineering & Generative AI Challenge',
    description: 'Test your mastery of generative AI models.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Room 251',
    totalSlots: 40,
    slotsLeft: 22,
    rules: ['Individual or team of 2.', 'Allowed to use provided AI model interfaces.'],
    coordinators: [],
    status: 'OPEN',
  };

  const currentEvent =
    events?.find((e) => e?.id === registration?.eventId) ||
    events?.[0] ||
    fallbackEvent;

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tabId: ParticipantTab) => {
    setActiveTab(tabId);
    const targetPath = tabId === 'home' ? '/dashboard' : `/dashboard/${tabId}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    if (registration?.qrToken) {
      const origin = window.location.origin;
      const verifyUrl = `${origin}/?verify=${encodeURIComponent(registration?.registrationNumber || 'RAD-2026-PASS')}&token=${encodeURIComponent(registration?.qrToken || '')}`;

      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1.5,
        color: { dark: '#002147', light: '#ffffff' },
      })
        .then(setQrDataUrl)
        .catch((err) => console.warn('QR generation notice:', err));
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev) return { hours: 2, minutes: 0, seconds: 0 };
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
    a.download = `${registration?.registrationNumber || 'RAD-2026'}-Pass.png`;
    a.click();
  };

  const navItems: { id: ParticipantTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Overview', icon: HomeIcon },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'pass', label: 'Entry Pass', icon: QrIcon },
    { id: 'event', label: 'Schedule', icon: Calendar },
    { id: 'contact', label: 'Coordinators', icon: PhoneCall },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Top Header Bar with Clean Brand & Desktop Navigation / Mobile Menu Trigger */}
      <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center sticky top-0 z-40 shadow-xs w-full transition-all">
        <div className="max-w-[1700px] 2xl:max-w-[1920px] mx-auto w-full flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
          </div>

          {/* Center: Clean Desktop Navigation Pill Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0077c8] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Participant Identity Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-bold text-[#002b66] truncate max-w-[120px]">{participant.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#0077c8] border border-slate-200 font-bold">
                {participant.rollNumber}
              </span>
            </div>

            {/* Change Event Button */}
            <button
              type="button"
              onClick={() => setIsChangeModalOpen(true)}
              className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7af1fc] group-hover:rotate-180 transition-transform duration-500 shrink-0" />
              <span>Change Event</span>
            </button>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={onSignOut}
              title="Sign Out"
              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Right Mobile Menu Button (Clean bordered box matching Reference Image) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-800 shadow-xs transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer Navigation (Matching Reference Image) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-[82%] max-w-xs bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Top Header (Logo + [X] Close Box) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Nav Links (Clean list with subtle dividers like reference image) */}
        <div className="flex-1 py-3 px-5 divide-y divide-slate-100 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-4 text-left text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                  isActive ? 'text-[#0077c8] font-bold' : 'text-slate-800 hover:text-[#0077c8]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#0077c8]" />}
              </button>
            );
          })}

          {/* Participant Profile Badge */}
          <div className="pt-4 mt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Candidate</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{participant.name}</p>
              <p className="font-mono text-slate-500 text-[11px]">{participant.rollNumber}</p>
            </div>
          </div>
        </div>

        {/* Drawer Bottom CTA (Matching red/blue pill button in reference image) */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/60">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsChangeModalOpen(true);
            }}
            className="w-full py-3.5 rounded-full bg-[#0077c8] hover:bg-[#005fa3] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#0077c8]/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>CHANGE EVENT</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onSignOut();
            }}
            className="w-full py-2.5 rounded-full border border-slate-300 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold text-xs tracking-wider transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BRIGHT PANORAMIC CAMPUS HERO (Clean & Free-Floating Modern Layout)        */}
      {/* ========================================================================= */}
      {activeTab === 'home' && (
        <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-slate-950 border-b border-slate-200">
          {/* Bright, Vibrant High-Definition St. Peter's Campus Backdrop */}
          <img
            src="/spiher-hero-hd.jpg?v=9"
            alt="St. Peter's Campus"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] opacity-90 brightness-[1.02] contrast-[1.05] saturate-[1.08] transition-transform duration-1000"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/spiher-hero-building.png?v=9';
            }}
          />

          {/* Smooth directional gradient for cinematic depth and clear text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent w-full md:w-3/4 lg:w-3/5 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

          {/* Clean, Free-Floating Content Stack (No enclosing box) */}
          <div className="relative z-10 px-4 sm:px-8 lg:px-12 max-w-[1700px] 2xl:max-w-[1920px] mx-auto w-full py-12 sm:py-16">
            <div className="max-w-2xl space-y-5 sm:space-y-6 text-left">
              {/* 1. Category Tagline (Free floating, no box) */}
              <div>
                <p className="text-xs sm:text-sm uppercase font-extrabold tracking-widest text-[#38bdf8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  NATIONAL LEVEL SYMPOSIUM
                </p>
              </div>

              {/* 2. Sleek Modern Dominant Headline */}
              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  RADIANZA <span className="text-[#38bdf8] drop-shadow-[0_0_30px_rgba(56,189,248,0.6)]">'26</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Department of Information Technology • Technical &amp; Non-Technical Symposium
                </p>
              </div>

              {/* 3. Bridging Narrative Copy */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Curated collection of 15 flagship technical and non-technical challenges. Every competition prepared, every rule perfected, every participant primed for excellence.
              </p>

              {/* 4. Action Buttons & Active Status (Clean Pill Style) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleTabChange('pass')}
                  className="px-7 py-3 rounded-full bg-[#0077c8] hover:bg-[#005fa3] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-cyan-950/40 border border-cyan-400/30 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-[#7af1fc]" />
                  <span>View My Entry Pass</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('contact')}
                  className="px-7 py-3 rounded-full border border-white/30 hover:border-white bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-sm text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  <Building className="w-4 h-4 text-cyan-300" />
                  <span>Campus Venue</span>
                </button>

                {/* Active Indicator Chip */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/15 text-xs text-slate-200 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-300 text-[10px] tracking-wider uppercase">Active</span>
                  <span className="text-slate-200 font-mono text-xs font-bold">{registration?.registrationNumber || 'RAD-2026-PASS'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Workspace Viewport for Details and Other Tabs */}
      <main className="flex-1 max-w-[1700px] 2xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-8 space-y-12 overflow-x-hidden">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / HOME (Sections Below Full-Screen Hero)                   */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-8">

            {/* 2. Streamlined About & Leadership Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  St. Peter's Institute
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#002b66] tracking-tight leading-tight">
                  Empowering Technical Innovation
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  RADIANZA ’26 brings together South India's top tech delegates to compete, collaborate, and showcase talent.
                </p>

                {/* Convenor Quote */}
                <div className="border-l-4 border-teal-600 pl-4 py-1.5 space-y-1">
                  <p className="text-xs text-slate-700 italic font-medium">
                    "A premier platform where innovation meets opportunity."
                  </p>
                  <p className="text-xs font-bold text-[#002b66]">
                    Dr. K. Senthil Nathan — HOD &amp; Convenor
                  </p>
                </div>
              </div>

              {/* Floating Portrait Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-xs mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    alt="Dr. K. Senthil Nathan - Convenor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-5 text-white">
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white uppercase tracking-wider">
                        HOD &amp; Convenor
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">Dr. K. Senthil Nathan</h3>
                      <p className="text-xs text-slate-300">Dept. of Information Technology</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Streamlined News & Announcements Section */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                    <span>Updates &amp; Schedules</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#002b66] mt-0.5">Announcements &amp; Agenda</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">Oct 24, 2026</span>
              </div>

              {/* Unboxed Grid Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left 8 Cols (Featured Story & Editorial News) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Large Featured News Photo Banner */}
                  <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[240px] flex items-end group cursor-pointer" onClick={() => handleTabChange('rules')}>
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
                      alt="Symposium Keynote"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    <div className="relative z-10 p-6 text-white space-y-1.5 max-w-2xl">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        ANNOUNCEMENT
                      </span>
                      <h3 className="text-xl font-bold text-white leading-snug">
                        {registration.eventTitle} — Official Track Rules &amp; Specs
                      </h3>
                      <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
                        <span>READ RULES &amp; SPECS</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Open Secondary Editorial Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                    {/* Item 1 */}
                    <div className="space-y-2 cursor-pointer group" onClick={() => handleTabChange('pass')}>
                      <div className="relative h-36 rounded-2xl overflow-hidden shadow">
                        <img
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                          alt="Team Collaboration"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-teal-600 text-white">
                          TEAM ROSTER
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#002b66] group-hover:text-teal-700 transition-colors">
                          {registration.teamName ? `Team ${registration.teamName}` : 'Solo Participant Active'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {registration.members?.length || 1} Member(s) Registered
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-2 cursor-pointer group" onClick={() => handleTabChange('contact')}>
                      <div className="relative h-36 rounded-2xl overflow-hidden shadow bg-[#002b66] p-4 text-white flex flex-col justify-between">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 w-fit">
                          VENUE
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-white">Computing Centre, Block C</h4>
                          <p className="text-xs text-slate-300 mt-0.5">{currentEvent.venue}</p>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#002b66] group-hover:text-teal-700 transition-colors">
                          Campus Map &amp; Support
                        </h4>
                        <p className="text-xs text-slate-500">
                          Interactive Google Maps location &amp; contacts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols (Schedule & Action Callout) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Schedule Timeline */}
                  <div className="space-y-3">
                    <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Agenda</h4>
                      <span className="text-xs font-mono font-bold text-teal-700">OCT 26</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <span className="font-bold text-[#002b66]">09:00 AM</span>
                        <span className="text-slate-600 font-medium">Helpdesk Check-In</span>
                      </div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <span className="font-bold text-teal-700">09:30 AM</span>
                        <span className="text-teal-900 font-bold">{registration.eventTitle}</span>
                      </div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <span className="font-bold text-[#002b66]">01:00 PM</span>
                        <span className="text-slate-600 font-medium">Cafeteria Lunch</span>
                      </div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <span className="font-bold text-[#002b66]">03:30 PM</span>
                        <span className="text-slate-600 font-medium">Valedictory &amp; Awards</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Banner */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-200">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-teal-700">
                      ENTRY PASS READY
                    </span>
                    <h3 className="text-base font-bold text-[#002b66]">
                      Official QR Pass Active
                    </h3>

                    <button
                      type="button"
                      onClick={() => handleTabChange('pass')}
                      className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <QrIcon className="w-4 h-4" />
                      <span>SHOW ENTRY PASS</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Footer Section Styled As Per SPIHER Official Logo Palette */}
            <footer className="mt-16 rounded-3xl overflow-hidden shadow-2xl text-white relative p-8 sm:p-12 space-y-10 bg-[#002b66] border border-[#0077c8]/30">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0077c8] via-[#00a887] to-[#0077c8]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#002b66] via-[#001e47] to-[#002b66] opacity-95" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4 md:col-span-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#00a887]/30 shadow-lg">
                      <CollegeEmblem size={40} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-white text-lg tracking-tight">St. PETER'S</h4>
                      <p className="text-[10px] text-teal-300 font-mono font-bold uppercase tracking-wider">
                        Institute of Higher Education &amp; Research
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Avadi, Chennai, Tamil Nadu 600054. RADIANZA ’26 Technical &amp; Non-Technical Symposium.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <h5 className="font-bold text-teal-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a887]" />
                    <span>Contact Info</span>
                  </h5>
                  <p className="text-slate-200 font-medium">Dr. K. Senthil Nathan (HOD)</p>
                  <p className="text-teal-300 font-mono font-bold text-sm">+91 98401 23456</p>
                  <p className="text-slate-300">Avadi, Saraswati Nagar, Chennai - 600054</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <h5 className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8]" />
                    <span>About Symposium</span>
                  </h5>
                  <p className="text-slate-200 font-medium">RADIANZA ’26 Technical Fest</p>
                  <p className="text-slate-300">Dept. of CSE &amp; IT</p>
                  <p className="text-slate-300">SPIHER Campus Avadi</p>
                </div>

                <div className="space-y-3 text-xs">
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Navigation</h5>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('pass')}
                      className="px-3.5 py-2 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <QrIcon className="w-3.5 h-3.5" />
                      <span>View Entry Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('contact')}
                      className="px-3.5 py-2 rounded-xl bg-[#00a887] hover:bg-[#009174] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Campus Map Location</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright Divider */}
              <div className="relative z-10 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>© 2026 St. Peter's Institute of Higher Education and Research (SPIHER). All rights reserved.</p>
                <div className="flex items-center gap-4 text-[11px] text-teal-300 font-mono font-semibold">
                  <span>Dept. of CSE &amp; IT</span>
                  <span>•</span>
                  <span>RADIANZA '26</span>
                </div>
              </div>
            </footer>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RULES (Unboxed Open Layout) */}
        {/* ========================================================================= */}
        {activeTab === 'rules' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Rulebook &amp; Guidelines
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">{currentEvent?.title || 'Competition Rules'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentEvent?.tagline || 'Official Guidelines'}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evaluation Guidelines ({(currentEvent?.rules || []).length} Rules)
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {(currentEvent?.rules || []).map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed text-sm font-medium">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MY PASS */}
        {/* ========================================================================= */}
        {activeTab === 'pass' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <CollegeEmblem size={40} />
                  <div>
                    <span className="font-serif font-black text-base text-[#002b66]">St. PETER'S</span>
                    <p className="text-[10px] text-[#0077c8] uppercase tracking-wider font-bold">Official Registry Pass</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#0077c8]">{registration?.registrationNumber || 'RAD-2026-PASS'}</span>
              </div>

              {/* QR Code Centrepiece */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl shadow-inner max-w-[240px] mx-auto border border-slate-200">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Pass QR" className="w-48 h-48 object-contain rounded-lg shadow-sm" />
                ) : (
                  <QrIcon className="w-20 h-20 text-slate-400 animate-pulse" />
                )}
                <span className="text-[9px] text-slate-500 font-mono tracking-widest mt-2 uppercase font-semibold">
                  Scan for Gate &amp; Scoring
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-lg text-slate-900">{registration?.eventTitle || currentEvent?.title}</h4>
                {registration?.teamName && (
                  <p className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{registration.teamName}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Candidate</span>
                    <span className="font-bold text-slate-900">{registration?.leaderName || participant?.name}</span>
                    <span className="text-[10px] font-mono text-teal-700 block font-semibold">{registration?.leaderRollNumber || participant?.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Venue</span>
                    <span className="font-medium text-slate-900">{currentEvent?.venue || 'Campus Venue'}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPass}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital Pass</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COUNTDOWN & SCHEDULE (Unboxed Layout) */}
        {/* ========================================================================= */}
        {activeTab === 'event' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Competition Commences In
              </span>
              <div className="flex items-center justify-center gap-3 sm:gap-6 pt-2">
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md min-w-[90px] text-center">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900">{String(timeLeft?.hours ?? 2).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-bold mt-1">Hours</span>
                </div>
                <span className="text-3xl font-bold text-slate-300">:</span>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md min-w-[90px] text-center">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900">{String(timeLeft?.minutes ?? 0).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-bold mt-1">Mins</span>
                </div>
                <span className="text-3xl font-bold text-slate-300">:</span>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md min-w-[90px] text-center">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-teal-600">{String(timeLeft?.seconds ?? 0).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-bold mt-1">Secs</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">Scheduled for {currentEvent?.date || 'Oct 24, 2026'} @ {currentEvent?.time || currentEvent?.startTime || '10:00 AM'}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Venue &amp; Location Navigation</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-slate-900 text-sm">📍 {currentEvent?.venue || 'Campus Venue'}</p>
                <p>St. Peter's Institute Main Campus • Follow physical signage for "{currentEvent?.title || 'Registered Event'}".</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT COORDINATORS & COLLEGE MAP (Unboxed Layout) */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Event Coordinators & Organizers Section */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0077c8]">Support Directory</span>
                  <h2 className="text-2xl font-bold text-[#002b66] mt-0.5">
                    {currentEvent.title} Coordinators
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official student organizers &amp; event leads for your registered competition ({currentEvent.venue}).
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f0f8fc] text-[#0077c8] border border-[#d4e8f5] w-fit">
                  {currentEvent.coordinators?.length || 0} Event Leads
                </span>
              </div>

              {/* Dynamic Event Coordinator Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(currentEvent.coordinators || []).map((coord, idx) => (
                  <div
                    key={coord.id || idx}
                    className="p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs flex items-center justify-between gap-4 text-xs hover:border-[#0077c8]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={
                          coord.photoUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                        }
                        alt={coord.name}
                        className="w-13 h-13 rounded-full object-cover border-2 border-[#0077c8] shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#f0f8fc] text-[#0077c8] border border-[#d4e8f5] uppercase inline-block truncate max-w-full">
                          {coord.role}
                        </span>
                        <h4 className="font-bold text-[#002b66] text-sm truncate">{coord.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{coord.department}</p>
                        {coord.phone && (
                          <p className="text-xs text-[#0077c8] font-mono font-bold mt-1 truncate">
                            {coord.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {coord.phone ? (
                      <a
                        href={`tel:${coord.phone.replace(/[^0-9+]/g, '')}`}
                        className="p-3 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white transition-all shadow-md shadow-[#0077c8]/20 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                        title={`Call ${coord.name}`}
                      >
                        <PhoneCall className="w-4 h-4 font-bold" />
                      </a>
                    ) : (
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-semibold shrink-0">
                        Lead
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Full Screen College Map Location Card */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700">Official Location Map</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">St. Peter's Institute Main Campus</h3>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    Address: 4469+553, 5th St, Saraswati Nagar, Avadi, Tamil Nadu 600054
                  </p>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=St.+Peter%27s+Institute+of+Higher+Education+and+Research,+4469%2B553,+5th+St,+Saraswati+Nagar,+Avadi,+Tamil+Nadu+600054"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 shrink-0 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Google Maps</span>
                </a>
              </div>

              {/* Embedded Interactive Map Viewport */}
              <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <iframe
                  title="St. Peter's Institute Location Map"
                  src="https://maps.google.com/maps?q=4469%2B553,+5th+St,+Saraswati+Nagar,+Avadi,+Tamil+Nadu+600054&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PROPER FULL-WIDTH GLOBAL FOOTER (Unboxed, Elegant & Responsive)           */}
      {/* ========================================================================= */}
      <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-[1700px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Column 1: Brand & Institution Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <CollegeEmblem size={28} />
                <span className="font-serif text-2xl font-bold tracking-tight">
                  RADIANZA <span className="text-[#38bdf8]">'26</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                National Level Technical &amp; Non-Technical Symposium presented by the Department of Information Technology at St. Peter's Institute of Higher Education &amp; Research.
              </p>
              <div className="pt-2 text-xs text-slate-400 space-y-1.5 font-mono">
                <p className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span>SPIHER Campus, Avadi, Chennai – 600054, Tamil Nadu</span>
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span>Official Organizing Leads &amp; Student Helpdesk</span>
                </p>
              </div>
            </div>

            {/* Column 2: Dashboard Navigation */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Dashboard Navigation
              </h4>
              <div className="flex flex-col space-y-2 text-xs">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left transition-colors cursor-pointer ${
                      activeTab === item.id ? 'text-[#38bdf8] font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Event & Participant Quick Info */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Participant Pass Status
              </h4>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Registered Event:</span>
                  <span className="font-bold text-white truncate max-w-[160px]">{currentEvent.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Venue:</span>
                  <span className="font-bold text-[#38bdf8]">{currentEvent.venue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Convenor Office</span>
                  <p className="text-slate-200 font-bold">Dr. K. Senthil Nathan</p>
                  <p className="text-slate-400">Dept. of Information Technology</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Inquiries</span>
                  <span className="text-slate-300">Dept. of Information Technology</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Digital Pass ID:</span>
                  <span className="font-mono text-emerald-400 font-bold">{registration.registrationNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 RADIANZA • St. Peter's Institute of Higher Education &amp; Research. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-500 font-mono">Department of Information Technology</p>
          </div>
        </div>
      </footer>

      {/* Modern Event Switcher Modal */}
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
