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
  Building,
  ArrowRight,
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

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  participant = MockDatabaseService.getParticipants()[0],
  registration = MockDatabaseService.getRegistrations()[0],
  events,
  onSignOut,
  onEventChangedSuccess,
  onStartNewRegistration,
  onOpenAccessLogin,
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
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Top Header Bar with Official College Logo & Glassmorphism */}
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[#d4e8f5]/80 px-4 sm:px-8 lg:px-12 flex items-center sticky top-0 z-40 shadow-sm w-full transition-all">
        <div className="max-w-[1700px] 2xl:max-w-[1920px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
          </div>

          {/* Desktop Navigation Links with Glassmorphism */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Modern Premium Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Participant Identity Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f0f8fc] border border-[#d4e8f5] text-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#002b66] truncate max-w-[130px]">{participant.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#0077c8] border border-[#d4e8f5] font-bold">
                {participant.rollNumber}
              </span>
            </div>

            {/* Change Event Button (Modern Deep Navy -> Royal Cyan Gradient) */}
            <button
              type="button"
              onClick={() => setIsChangeModalOpen(true)}
              className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white text-xs font-bold transition-all duration-200 shadow-sm shadow-[#0077c8]/20 hover:shadow-md hover:shadow-[#0077c8]/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7af1fc] group-hover:rotate-180 transition-transform duration-500" />
              <span className="tracking-tight whitespace-nowrap">Change Event</span>
            </button>

            {/* Sign Out Button (Refined Icon Button) */}
            <button
              type="button"
              onClick={onSignOut}
              title="Sign Out"
              className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-[#d4e8f5] hover:border-rose-200 shadow-xs transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-[1700px] 2xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 space-y-8 overflow-x-hidden">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / HOME (Professional Full-View Edge-to-Edge Layout) */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-8">
            {/* 1. Full View Bleed Hero Section (Edge-to-Edge Widescreen Optimization) */}
            <div className="relative rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[650px] flex flex-col justify-between shadow-2xl bg-slate-950 w-full border border-slate-200/20">
              {/* Background St. Peter's College Building Facade Photo */}
              <img
                src="/spiher-hero-hd.jpg?v=3"
                alt="St. Peter's Institute Main Building"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/spiher-hero-building.png?v=3';
                }}
              />
              {/* Gradient Overlay for Optimal Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/70" />

              {/* Vertical Accent Ribbon Tag (Top Right) */}
              <div className="absolute top-0 right-8 z-20 hidden md:block">
                <div className="w-12 h-36 bg-[#0077c8] shadow-lg flex flex-col justify-end items-center pb-4 text-white">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="text-[9px] uppercase font-bold tracking-widest rotate-90 origin-bottom whitespace-nowrap mb-8">
                    IGNITE 2026
                  </span>
                </div>
                <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[16px] border-t-[#0077c8]" />
              </div>

              {/* Central Professional Content (Minimal & Clean Hero View) */}
              <div className="relative z-10 p-6 sm:p-12 max-w-4xl mx-auto text-center space-y-4 pt-14 sm:pt-16">
                <div className="flex justify-center mb-1">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                    <CollegeEmblem size={56} />
                  </div>
                </div>

                {/* Floating Translucent Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-teal-200 text-xs font-semibold uppercase tracking-wider shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>St. Peter's Institute of Higher Education &amp; Research</span>
                </div>

                <h1 className="text-3xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                  IGNITE 2026
                </h1>
                <p className="text-xs sm:text-base text-teal-200 font-medium max-w-xl mx-auto drop-shadow">
                  Technical &amp; Non-Technical Fest • Dept. of CSE &amp; IT
                </p>

                {/* Frosted Glass Control Pills */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Building className="w-4 h-4 text-teal-300" />
                    <span>Campus Venue</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rules')}
                    className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-teal-300" />
                    <span>Rules &amp; Specs</span>
                  </button>
                </div>
              </div>

              {/* Bottom Glassmorphic Floating CTA Bar */}
              <div className="relative z-10 p-6 sm:p-8 max-w-5xl mx-auto w-full">
                <div className="p-4 sm:p-5 rounded-2xl sm:rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
                  <div className="flex items-center gap-3 text-xs sm:text-sm px-2">
                    <span className="px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 font-bold uppercase text-[10px] tracking-wider">
                      ACTIVE PASS
                    </span>
                    <span className="text-slate-200 font-mono">
                      Pass ID: <strong className="text-white">{registration.registrationNumber}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('pass')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-teal-50 text-[#002b66] font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>ENTRY PASS</span>
                    <ArrowRight className="w-4 h-4 text-[#0077c8]" />
                  </button>
                </div>
              </div>
            </div>

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
                  IGNITE 2026 brings together South India's top tech delegates to compete, collaborate, and showcase talent.
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
                      <p className="text-xs text-slate-300">Dept. of CSE &amp; IT</p>
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
                  <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[240px] flex items-end group cursor-pointer" onClick={() => setActiveTab('rules')}>
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
                    <div className="space-y-2 cursor-pointer group" onClick={() => setActiveTab('pass')}>
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
                    <div className="space-y-2 cursor-pointer group" onClick={() => setActiveTab('contact')}>
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
                      onClick={() => setActiveTab('pass')}
                      className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <QrIcon className="w-4 h-4" />
                      <span>SHOW ENTRY PASS</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Footer Section Styled As Per SPIHER Official Logo Palette (#002b66 Deep Navy, #0077c8 Royal Blue, #00a887 Emerald Teal) */}
            <footer className="mt-16 rounded-3xl overflow-hidden shadow-2xl text-white relative p-8 sm:p-12 space-y-10 bg-[#002b66] border border-[#0077c8]/30">
              {/* SPIHER Logo Emblem Color Gradient Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0077c8] via-[#00a887] to-[#0077c8]" />

              {/* Soft Subtle Logo Navy Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#002b66] via-[#001e47] to-[#002b66] opacity-95" />

              {/* Content floating over logo themed background */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Column */}
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
                    Avadi, Chennai, Tamil Nadu 600054. IGNITE 2026 Technical &amp; Non-Technical Symposium.
                  </p>
                </div>

                {/* Footer Link Column 1: Contact Details */}
                <div className="space-y-2.5 text-xs">
                  <h5 className="font-bold text-teal-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a887]" />
                    <span>Contact Info</span>
                  </h5>
                  <p className="text-slate-200 font-medium">Dr. K. Senthil Nathan (HOD)</p>
                  <p className="text-teal-300 font-mono font-bold text-sm">+91 98401 23456</p>
                  <p className="text-slate-300">Avadi, Saraswati Nagar, Chennai - 600054</p>
                </div>

                {/* Footer Link Column 2: About Symposium */}
                <div className="space-y-2.5 text-xs">
                  <h5 className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8]" />
                    <span>About Symposium</span>
                  </h5>
                  <p className="text-slate-200 font-medium">IGNITE 2026 Technical Fest</p>
                  <p className="text-slate-300">Dept. of CSE &amp; IT</p>
                  <p className="text-slate-300">SPIHER Campus Avadi</p>
                </div>

                {/* Footer Link Column 3: Quick Actions */}
                <div className="space-y-3 text-xs">
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Navigation</h5>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('pass')}
                      className="px-3.5 py-2 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <QrIcon className="w-3.5 h-3.5" />
                      <span>View Entry Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
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
                  <span>IGNITE 2026</span>
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
              <h2 className="text-2xl font-bold text-slate-900 mt-2">{currentEvent.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentEvent.tagline}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evaluation Guidelines ({currentEvent.rules.length} Rules)
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {currentEvent.rules.map((rule, idx) => (
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
                <span className="font-mono text-xs font-bold text-[#0077c8]">{registration.registrationNumber}</span>
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
                <h4 className="font-bold text-lg text-slate-900">{registration.eventTitle}</h4>
                {registration.teamName && (
                  <p className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{registration.teamName}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Candidate</span>
                    <span className="font-bold text-slate-900">{registration.leaderName}</span>
                    <span className="text-[10px] font-mono text-teal-700 block font-semibold">{registration.leaderRollNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Venue</span>
                    <span className="font-medium text-slate-900">{currentEvent.venue}</span>
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
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-bold mt-1">Hours</span>
                </div>
                <span className="text-3xl font-bold text-slate-300">:</span>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md min-w-[90px] text-center">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-bold mt-1">Mins</span>
                </div>
                <span className="text-3xl font-bold text-slate-300">:</span>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md min-w-[90px] text-center">
                  <span className="text-3xl sm:text-4xl font-bold font-mono text-teal-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-500 font-bold mt-1">Secs</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">Scheduled for {currentEvent.date} @ {currentEvent.time}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Venue &amp; Location Navigation</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-slate-900 text-sm">📍 {currentEvent.venue}</p>
                <p>St. Peter's Institute Main Campus, Block C • Follow physical signage for "{currentEvent.title}".</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT COORDINATORS & COLLEGE MAP (Unboxed Layout) */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* 2 Event Employees Section */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700">Support Directory</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Event Coordinators</h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  2 Event Employees
                </span>
              </div>

              {/* 2 Event Employees Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employee 1 - Faculty Coordinator */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Dr. K. Senthil Nathan"
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal-600"
                    />
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white uppercase">
                        Employee 1 • Faculty Coordinator
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">Dr. K. Senthil Nathan</h4>
                      <p className="text-[11px] text-teal-700 font-semibold">Dept. of Computer Science &amp; Engineering</p>
                      <p className="text-xs text-slate-700 font-mono font-bold mt-1">+91 98401 23456</p>
                    </div>
                  </div>

                  <a
                    href="tel:+919840123456"
                    className="p-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-md shadow-teal-600/20 shrink-0"
                    title="Call Coordinator"
                  >
                    <PhoneCall className="w-5 h-5 font-bold" />
                  </a>
                </div>

                {/* Employee 2 - Event Evaluator */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
                      alt="Praveen Chandran"
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-400"
                    />
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-700 text-white uppercase">
                        Employee 2 • Event Evaluator
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">Praveen Chandran</h4>
                      <p className="text-[11px] text-slate-600 font-semibold">Dept. of Computer Science</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">Contact details available soon</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-200 text-slate-600 text-[10px] font-semibold shrink-0">
                    Coordinator
                  </div>
                </div>
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

      {/* Floating Mobile Bottom Navigation Bar (Floating Dock) */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-slate-900/20 rounded-full px-3 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 font-bold scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-bold tracking-tight">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

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
