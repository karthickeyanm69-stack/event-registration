import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Code2,
  Gamepad2,
  Menu,
  X,
  QrCode,
  Lock,
  CheckCircle2,
  AlertCircle,
  Mic,
  Camera,
  Linkedin,
  Globe,
  Maximize2,
  Flame,
  ChevronRight,
  ChevronLeft,
  Compass,
} from 'lucide-react';
import { CollegeEvent, EventCategory, Participant, Registration } from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEmblem, SpiherStarburstLogo } from '../common/CollegeLogo';
import { CustomDatePicker } from '../common/CustomDatePicker';
import { ThreeDCyberHeadCanvas } from './ThreeDCyberHeadCanvas';

export type LandingPageId = 'home' | 'events' | 'about' | 'contact';

interface PageMeta {
  id: LandingPageId;
  title: string;
  navLabel: string;
  badge: string;
}

const PAGES: PageMeta[] = [
  { id: 'home', title: 'RADIANZA ’26 — Main Experience', navLabel: 'Home', badge: 'SYMPOSIUM' },
  { id: 'events', title: 'Featured Competition Matrix', navLabel: 'Events Matrix', badge: 'ARENA' },
  { id: 'about', title: 'About SPIHER & Legacy', navLabel: 'About SPIHER', badge: 'INSTITUTE' },
  { id: 'contact', title: 'Registration & Portal Gateway', navLabel: 'Contact & Portals', badge: 'CONNECT' },
];

interface RadianzaLandingPageProps {
  events: CollegeEvent[];
  activeLandingPage?: LandingPageId;
  onNavigateLandingPage?: (pageId: LandingPageId) => void;
  onStartNewRegistration: () => void;
  onSelectEvent: (event: CollegeEvent) => void;
  onSuccessfulAccess: (participant: Participant, registration?: Registration) => void;
  onOpenConsole?: () => void;
}

// ── Speakers Data ──
interface SpeakerItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  topic: string;
  bio: string;
  imageUrl: string;
  tag: string;
  socials?: { linkedin?: string; web?: string };
}

const SPEAKERS_DATA: SpeakerItem[] = [
  {
    id: 'spk-1',
    name: 'Dr. Aarav Sundaram',
    role: 'Principal AI Architect',
    organization: 'QuantumAI Labs & IISc Fellow',
    topic: 'Next-Gen Autonomous Agent Architectures',
    bio: 'Pioneering generative reasoning systems and multi-agent coordination models for next-generation computing.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    tag: 'Keynote Speaker',
    socials: { linkedin: '#', web: '#' },
  },
  {
    id: 'spk-2',
    name: 'Meera Nandakumar',
    role: 'VP of Engineering',
    organization: 'CyberShield Global • Ex-ISRO',
    topic: 'Zero-Trust Defense in Cyber-Physical Systems',
    bio: 'Over 15 years designing mission-critical cryptographic protocols and aerospace sensor telemetry defense.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    tag: 'Cybersecurity Jury',
    socials: { linkedin: '#', web: '#' },
  },
  {
    id: 'spk-3',
    name: 'Rohan Varma',
    role: 'Co-Founder & CTO',
    organization: 'HyperLoop Robotics • MIT 35U35',
    topic: 'Hardware-Software Convergence in Swarm Robotics',
    bio: 'Creator of autonomous swarm robotics platforms deployed across smart logistics and autonomous search & rescue.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    tag: 'Tech Visionary',
    socials: { linkedin: '#', web: '#' },
  },
  {
    id: 'spk-4',
    name: 'Ananya Deshmukh',
    role: 'Senior Staff UX Architect',
    organization: 'NeoDesign Collective',
    topic: 'Spatial Computing & Multimodal Human-AI Interfaces',
    bio: 'Author of Spatial Interfaces and design strategist helping next-generation developers craft fluid digital experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    tag: 'Design Lead',
    socials: { linkedin: '#', web: '#' },
  },
];

// ── Gallery Data ──
interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  imageUrl: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Code-A-Thon Grand Hack Sprint',
    category: 'Hackathon',
    caption: 'Over 200 developers sprinting 24 hours non-stop inside the main Computing Center.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-2',
    title: 'Robo-Wars Battle Arena',
    category: 'Robotics',
    caption: 'High-torque combat bots clashing in the steel cage arena before a cheering crowd.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-3',
    title: 'Grand Keynote & Inauguration',
    category: 'Inauguration',
    caption: 'University Chancellor and industry keynote inaugurating RADIANZA in the main auditorium.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-4',
    title: 'Spatial VR & Tech Expo',
    category: 'Exhibition',
    caption: 'Student teams showcasing interactive spatial computing and augmented reality prototypes.',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-5',
    title: 'Jury Evaluation & Pitch Rounds',
    category: 'Jury Review',
    caption: 'Technical delegates presenting their working MVPs to faculty and venture juries.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-6',
    title: 'Valedictory & Champions Trophy',
    category: 'Awards',
    caption: 'Celebrating triumph, cash prize distribution, and overall championship trophy handover.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  },
];

// ── Motion Variants for Directional Page Redirection ──
const pageTransitionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 45 : -45,
    opacity: 0,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -45 : 45,
    opacity: 0,
    scale: 0.985,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const RadianzaLandingPage: React.FC<RadianzaLandingPageProps> = ({
  events,
  activeLandingPage = 'home',
  onNavigateLandingPage,
  onStartNewRegistration,
  onSelectEvent,
  onSuccessfulAccess,
  onOpenConsole,
}) => {
  // ── Multi-Page Navigation State ──
  const [activePage, setActivePage] = useState<LandingPageId>(activeLandingPage || 'home');
  const [pageDirection, setPageDirection] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<'All' | EventCategory>('All');
  const [selectedEventModal, setSelectedEventModal] = useState<CollegeEvent | null>(null);
  const [selectedGalleryModal, setSelectedGalleryModal] = useState<GalleryItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeScheduleDay, setActiveScheduleDay] = useState<1 | 2>(1);

  // ── Quick Pass Access Modal State ──
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [accessRollNumber, setAccessRollNumber] = useState('');
  const [accessDob, setAccessDob] = useState('');
  const [isVerifyingPass, setIsVerifyingPass] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Sync active page when parent prop changes
  useEffect(() => {
    if (activeLandingPage && activeLandingPage !== activePage) {
      const currentIndex = PAGES.findIndex((p) => p.id === activePage);
      const newIndex = PAGES.findIndex((p) => p.id === activeLandingPage);
      setPageDirection(newIndex >= currentIndex ? 1 : -1);
      setActivePage(activeLandingPage);
    }
  }, [activeLandingPage]);

  const navigateToPage = (pageId: LandingPageId) => {
    const currentIndex = PAGES.findIndex((p) => p.id === activePage);
    const newIndex = PAGES.findIndex((p) => p.id === pageId);
    setPageDirection(newIndex >= currentIndex ? 1 : -1);
    setActivePage(pageId);
    if (onNavigateLandingPage) {
      onNavigateLandingPage(pageId);
    } else {
      const cleanPath = pageId === 'home' ? '/' : `/${pageId}`;
      window.history.pushState({}, '', cleanPath);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHomeSection = (sectionId: string) => {
    if (activePage !== 'home') {
      navigateToPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentPageIndex = PAGES.findIndex((p) => p.id === activePage);
  const prevPage = currentPageIndex > 0 ? PAGES[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < PAGES.length - 1 ? PAGES[currentPageIndex + 1] : null;

  // Filter events by selected category
  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((e) => e.category === activeCategory);

  // Calculated Stats
  const totalSlotsLeft = events.reduce((sum, e) => sum + (e.slotsLeft || 0), 0);
  const totalRegisteredCount = 500 + events.reduce((sum, e) => sum + (e.totalSlots - e.slotsLeft), 0);

  // Quick pass lookup submit
  const handlePassLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessError(null);

    if (!accessRollNumber.trim() || !accessDob) {
      setAccessError('Please enter both your Roll Number and Date of Birth.');
      return;
    }

    setIsVerifyingPass(true);
    setTimeout(() => {
      const result = MockDatabaseService.verifyParticipantAccess(accessRollNumber, accessDob);
      setIsVerifyingPass(false);

      if (result.success && result.participant) {
        setIsPassModalOpen(false);
        onSuccessfulAccess(result.participant, result.registration);
      } else {
        setAccessError(
          result.error ||
            'No registration record found for these credentials. Click Register Now if registering for the first time.'
        );
      }
    }, 500);
  };

  const handleDemoFill = (roll: string, dob: string) => {
    setAccessRollNumber(roll);
    setAccessDob(dob);
    setAccessError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fbfe] text-slate-900 font-sans selection:bg-[#0077c8] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. STICKY GLASSMORPHIC HEADER & NAVIGATION BAR                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#d4e8f5]/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo Lockup */}
          <div
            onClick={() => navigateToPage('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#002b66] to-[#0077c8] flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <CollegeEmblem size={28} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight text-[#001f4d]">
                  RADIANZA <span className="text-[#0077c8]">'26</span>
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5]">
                  SPIHER
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                National-Level Technical Symposium
              </p>
            </div>
          </div>

          {/* Desktop Multi-Page Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#f0f8fc] rounded-2xl border border-[#d4e8f5]">
            {PAGES.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(page.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-[#002b66]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePagePill"
                      className="absolute inset-0 bg-[#002b66] rounded-xl shadow-xs"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{page.navLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Access Pass Button */}
            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f0f8fc] hover:bg-[#e4f3fa] text-[#002b66] border border-[#d4e8f5] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#0077c8]" />
              <span>Access Pass</span>
            </button>

            {/* Primary Register CTA Button */}
            <button
              type="button"
              onClick={onStartNewRegistration}
              className="relative px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#002b66] via-[#005fa3] to-[#0077c8] hover:from-[#001f4d] hover:to-[#004f8a] text-white text-xs font-bold shadow-md shadow-[#0077c8]/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7af1fc]" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Page Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Page Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-[#d4e8f5] bg-white px-6 py-5 space-y-4 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {PAGES.map((page, idx) => {
                  const isActive = activePage === page.id;
                  return (
                    <button
                      key={page.id}
                      onClick={() => navigateToPage(page.id)}
                      className={`p-3 rounded-xl text-left flex items-center justify-between border transition-all ${
                        isActive
                          ? 'bg-[#002b66] text-white border-[#002b66] shadow-sm'
                          : 'bg-[#f8fbfe] text-slate-700 border-[#d4e8f5] hover:bg-[#eaf4fb]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider opacity-70 block">
                          0{idx + 1}
                        </span>
                        <span>{page.navLabel}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  );
                })}
              </div>

              {/* In-Home Jump Links (Visible when on Home page) */}
              {activePage === 'home' && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="text-[10px] uppercase font-mono text-slate-400 w-full">Home Sections:</span>
                  <button onClick={() => scrollToHomeSection('highlights')} className="hover:text-[#0077c8]">Why Radianza</button>
                  <span>•</span>
                  <button onClick={() => scrollToHomeSection('schedule')} className="hover:text-[#0077c8]">Schedule</button>
                  <span>•</span>
                  <button onClick={() => scrollToHomeSection('speakers')} className="hover:text-[#0077c8]">Speakers</button>
                  <span>•</span>
                  <button onClick={() => scrollToHomeSection('gallery')} className="hover:text-[#0077c8]">Gallery</button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPassModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#f0f8fc] border border-[#d4e8f5] text-[#002b66] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-[#0077c8]" />
                  <span>Access Existing Pass</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-HEADER BREADCRUMB & SECTION SHORTCUTS STRIP                        */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-b border-[#e8f5fb] px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded bg-[#f0f8fc] border border-[#d4e8f5] text-[#0077c8] font-bold">
              PAGE {currentPageIndex + 1} / {PAGES.length}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-[#001f4d] uppercase tracking-wider">
              {PAGES[currentPageIndex].title}
            </span>
          </div>

          {/* Quick Section Shortcuts on Home or Page Switcher */}
          {activePage === 'home' ? (
            <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold text-slate-600">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Jump To:</span>
              <button onClick={() => scrollToHomeSection('highlights')} className="hover:text-[#0077c8] cursor-pointer">
                Highlights
              </button>
              <button onClick={() => scrollToHomeSection('schedule')} className="hover:text-[#0077c8] cursor-pointer">
                Schedule
              </button>
              <button onClick={() => scrollToHomeSection('speakers')} className="hover:text-[#0077c8] cursor-pointer">
                Speakers
              </button>
              <button onClick={() => scrollToHomeSection('gallery')} className="hover:text-[#0077c8] cursor-pointer">
                Gallery
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold">
              {prevPage && (
                <button
                  onClick={() => navigateToPage(prevPage.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-[#0077c8] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{prevPage.navLabel}</span>
                </button>
              )}
              {prevPage && nextPage && <span className="text-slate-300">|</span>}
              {nextPage && (
                <button
                  onClick={() => navigateToPage(nextPage.id)}
                  className="flex items-center gap-1 text-[#0077c8] hover:text-[#002b66] transition-colors cursor-pointer"
                >
                  <span>{nextPage.navLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MULTI-PAGE ANIMATED ROUTER                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full relative overflow-hidden">
        <AnimatePresence mode="wait" custom={pageDirection}>
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 1: HOME (HERO 3D + HIGHLIGHTS + SCHEDULE + SPEAKERS + GALLERY) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col space-y-0"
            >
              {/* ── 1. HERO SECTION (3D CYBER PROFILE & CTA) ── */}
              <section id="hero" className="relative w-full min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-visible bg-gradient-to-b from-white via-[#f0f8fc] to-white py-6 lg:py-16">
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(#0077c8 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                <div className="absolute top-0 right-1/4 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] rounded-full bg-gradient-to-br from-[#00f2fe]/20 via-[#0077c8]/15 to-transparent blur-3xl pointer-events-none animate-float-slow" />
                <div className="absolute -bottom-20 left-10 w-[350px] lg:w-[550px] h-[350px] lg:h-[550px] rounded-full bg-gradient-to-tr from-[#7c3aed]/12 via-[#00f2fe]/10 to-transparent blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-center overflow-visible">
                  
                  {/* MOBILE-ONLY: Big 3D Cyber Head on TOP */}
                  <div className="lg:hidden w-full h-[360px] sm:h-[440px] flex items-center justify-center relative overflow-visible mb-2">
                    <ThreeDCyberHeadCanvas onRegisterClick={onStartNewRegistration} />
                  </div>

                  {/* Wording: Below 3D head on mobile (centered), Left column on desktop (left-aligned) */}
                  <div className="w-full lg:col-span-6 space-y-4 sm:space-y-6 lg:space-y-7 text-center lg:text-left flex flex-col items-center lg:items-start z-20">
                    {/* Top Institution Tag */}
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-[#d4e8f5] text-[#0077c8] text-xs font-bold tracking-wide"
                    >
                      <SpiherStarburstLogo size={20} />
                      <span className="tracking-widest uppercase font-mono text-[10px] sm:text-[11px] text-[#002b66]">
                        SPIHER PRESENTS
                      </span>
                    </motion.div>

                    {/* Headline Typography & Taglines */}
                    <div className="space-y-2 sm:space-y-3">
                      <motion.h1
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-6xl xl:text-8xl font-serif font-black tracking-tight text-[#001f4d] leading-[1.05]"
                      >
                        RADIANZA <span className="text-[#0077c8]">'26</span>
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] text-[#002b66] uppercase"
                      >
                        NATIONAL-LEVEL TECHNICAL SYMPOSIUM
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-sm sm:text-base text-slate-600 font-medium italic"
                      >
                        "Igniting Ideas, Innovating Tomorrow"
                      </motion.p>
                    </div>

                    {/* Date & Location Chips */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="flex flex-wrap justify-center lg:justify-start items-center gap-2.5 sm:gap-3 pt-0.5 text-xs font-semibold text-slate-700"
                    >
                      <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                        <Calendar className="w-4 h-4 text-[#0077c8]" />
                        <span className="font-bold text-[#001f4d]">15 - 16 OCT 2026</span>
                      </div>
                      <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                        <MapPin className="w-4 h-4 text-[#00a887]" />
                        <span>SPIHER Campus, Coimbatore</span>
                      </div>
                    </motion.div>

                    {/* Action CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto"
                    >
                      <div className="relative group w-full sm:w-auto">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00f2fe] via-[#0077c8] to-[#00a887] opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300 animate-halo-pulse" />
                        <button
                          type="button"
                          onClick={onStartNewRegistration}
                          className="relative w-full sm:w-auto px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#001f4d] via-[#002b66] to-[#0077c8] text-white font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer active:scale-95 transition-transform"
                        >
                          <span className="relative z-10 font-bold">Register Now</span>
                          <ArrowRight className="w-4 h-4 text-[#7af1fc] relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateToPage('events')}
                        className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-[#f0f8fc] border-2 border-[#d4e8f5] hover:border-[#0077c8] text-[#002b66] font-bold text-sm tracking-wide shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <span>View Competition Matrix</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </motion.div>

                    {/* Digital Pass Quick Access */}
                    <div className="pt-1 text-xs text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                      <span>Already registered?</span>
                      <button
                        type="button"
                        onClick={() => setIsPassModalOpen(true)}
                        className="text-[#0077c8] font-bold underline hover:text-[#005fa3] cursor-pointer"
                      >
                        Access your digital pass →
                      </button>
                    </div>
                  </div>

                  {/* DESKTOP-ONLY: 3D Cyber Head in Right Column */}
                  <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative w-full min-h-[560px] overflow-visible">
                    <ThreeDCyberHeadCanvas onRegisterClick={onStartNewRegistration} />
                  </div>
                </div>
              </section>

              {/* ── 2. HIGHLIGHTS SECTION ── */}
              <section id="highlights" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#e8f5fb]">
                <div className="max-w-7xl mx-auto space-y-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl text-left space-y-3"
                  >
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0077c8] bg-[#f0f8fc] px-3 py-1 rounded-full border border-[#d4e8f5]">
                      WHY
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#001f4d] tracking-tight">
                      RADIANZA '26?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                      A platform to learn, build, compete and connect. Join the next generation of innovators, creators and problem solvers at SPIHER's flagship technical symposium.
                    </p>
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                      className="p-6 rounded-3xl bg-[#f0f8fc] border border-[#d4e8f5] hover:border-[#0077c8] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between group cursor-pointer"
                      onClick={() => {
                        setActiveCategory('Technical');
                        navigateToPage('events');
                      }}
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Code2 className="w-6 h-6 text-[#0077c8]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#001f4d]">Technical Events</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Code. Build. Solve. Intense algorithmic sprints, robotics combat, and full-stack challenges.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0077c8] pt-2">
                        <span>View Tracks</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                      className="p-6 rounded-3xl bg-[#f0fdf9] border border-[#ccfbf1] hover:border-[#00a887] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between group cursor-pointer"
                      onClick={() => {
                        setActiveCategory('Non-Technical');
                        navigateToPage('events');
                      }}
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Gamepad2 className="w-6 h-6 text-[#00a887]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#001f4d]">Non-Technical Events</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Showcase. Express. Create. e-Sports, technical quizzes, design marathons, and creative arenas.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#00a887] pt-2">
                        <span>View Tracks</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                      className="p-6 rounded-3xl bg-[#f8fbfe] border border-[#d4e8f5] hover:border-[#002b66] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6 text-[#002b66]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#001f4d]">Networking</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Meet industry experts, professors, and over 500+ ambitious delegates from all across India.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">500+ DELEGATES</span>
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                      className="p-6 rounded-3xl bg-[#fffef5] border border-amber-200 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Trophy className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-bold text-[#001f4d]">Exciting Prizes</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Recognize talent & celebrate innovation with cash prizes, official trophies, and certificates.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 font-mono">₹50,000+ POOL</span>
                    </motion.div>
                  </motion.div>

                  {/* Campus Showcase Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="group relative rounded-3xl overflow-hidden shadow-xl border border-[#d4e8f5] min-h-[220px] sm:min-h-[280px] flex items-end"
                  >
                    <img
                      src="/spiher-hero-hd.jpg"
                      alt="St. Peter's Institute Campus"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/spiher-hero-building.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001f4d]/95 via-[#001f4d]/50 to-transparent" />
                    <div className="relative z-10 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#0077c8] text-white">
                          HOST CAMPUS
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
                          St. Peter's Institute of Higher Education &amp; Research
                        </h3>
                        <p className="text-xs text-slate-200 mt-0.5">
                          Deemed to be University • NAAC 'A' Grade Accredited Campus
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onStartNewRegistration}
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#002b66] text-xs font-bold shadow transition-all cursor-pointer whitespace-nowrap"
                      >
                        Join RADIANZA '26
                      </button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* ── 3. SCHEDULE TIMELINE SECTION ── */}
              <section id="schedule" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-[#e2eff7]">
                <div className="max-w-4xl mx-auto space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-2"
                  >
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0077c8] bg-white px-3 py-1 rounded-full border border-[#d4e8f5]">
                      AGENDA &amp; TIMELINE
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#001f4d]">
                      Symposium Schedule
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Two days packed with innovation, live competition, expert keynotes, and grand recognitions.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto p-1.5 bg-white rounded-2xl border border-[#d4e8f5]">
                    <button
                      type="button"
                      onClick={() => setActiveScheduleDay(1)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeScheduleDay === 1
                          ? 'bg-[#002b66] text-white shadow-xs'
                          : 'text-[#002b66] hover:bg-slate-50'
                      }`}
                    >
                      Day 1 (15 Oct 2026)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveScheduleDay(2)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeScheduleDay === 2
                          ? 'bg-[#002b66] text-white shadow-xs'
                          : 'text-[#002b66] hover:bg-slate-50'
                      }`}
                    >
                      Day 2 (16 Oct 2026)
                    </button>
                  </div>

                  <div className="relative pl-6 sm:pl-10 space-y-6 pt-4">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      style={{ transformOrigin: 'top' }}
                      className="absolute left-3 sm:left-5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#0077c8] via-[#00f2fe] to-[#00a887]"
                    />

                    {activeScheduleDay === 1 ? (
                      <>
                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-[#0077c8] shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#0077c8] text-white font-mono font-bold text-[10px]">
                                09:00 AM - 10:00 AM
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Main Auditorium</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              Inauguration &amp; Grand Keynote Address
                            </h4>
                            <p className="text-xs text-slate-600">
                              Welcome presidential address by University Chancellor and opening by Dr. Aarav Sundaram on AI systems.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-[#002b66] shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#002b66] text-white font-mono font-bold text-[10px]">
                                10:30 AM - 01:00 PM
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Computing Labs &amp; Arenas</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              Technical Tracks: Round 1 Sprint
                            </h4>
                            <p className="text-xs text-slate-600">
                              Algorithmic problem-solving in Code-A-Thon, Web3 design sprints, and Robo-Wars qualifying matches.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-[#00a887] shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#00a887] text-white font-mono font-bold text-[10px]">
                                01:00 PM - 02:00 PM
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Campus Food Court</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              Networking Lunch &amp; Industry Tech Booths
                            </h4>
                            <p className="text-xs text-slate-600">
                              Lunch break provided for all verified badge holders, with live tech demos from sponsor booths.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-[#7c3aed] shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#7c3aed] text-white font-mono font-bold text-[10px]">
                                02:00 PM - 04:30 PM
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Design Studio &amp; Hall B</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              UI/UX Designathon &amp; Technical Quizzes
                            </h4>
                            <p className="text-xs text-slate-600">
                              Rapid wireframing challenge followed by buzzer battle trivia for tech delegates.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-[#0077c8] shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#0077c8] text-white font-mono font-bold text-[10px]">
                                09:30 AM - 12:30 PM
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Main Conference Hall</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              Championship Grand Finals &amp; Hackathon Demos
                            </h4>
                            <p className="text-xs text-slate-600">
                              Top qualifying teams present live working prototypes to our jury panel and venture partners.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-[#002b66] shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#002b66] text-white font-mono font-bold text-[10px]">
                                01:30 PM - 03:30 PM
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Indoor Arena</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              e-Sports Showdown &amp; Creative Battles
                            </h4>
                            <p className="text-xs text-slate-600">
                              Multi-player gaming championships, rapid ad-zap showdowns, and photography competitions.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#fffef5] border border-amber-200 shadow-xs">
                          <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-white border-3 border-amber-500 shadow-xs" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white font-mono font-bold text-[10px]">
                                04:00 PM - 05:30 PM
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 font-mono">VALEDICTORY</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#001f4d]">
                              Grand Valedictory, Trophy Ceremony &amp; Prize Distribution
                            </h4>
                            <p className="text-xs text-slate-600">
                              Handover of the ₹50,000+ cash award pool, official certificates, and rolling championship trophy.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* ── 4. SPEAKERS SECTION ── */}
              <section id="speakers" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#e2eff7]">
                <div className="max-w-7xl mx-auto space-y-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl text-left space-y-3"
                  >
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0077c8] bg-[#f0f8fc] px-3 py-1 rounded-full border border-[#d4e8f5]">
                      THOUGHT LEADERS &amp; JURY
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#001f4d] tracking-tight">
                      Eminent Speakers
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                      Learn directly from researchers, tech executives, and venture founders shaping the forefront of modern engineering and digital transformation.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SPEAKERS_DATA.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="bg-white rounded-3xl border border-[#d4e8f5] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0077c8]/60 transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                          <img
                            src={speaker.imageUrl}
                            alt={speaker.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-[#002b66] shadow-xs">
                            {speaker.tag}
                          </span>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="text-base font-bold leading-tight">{speaker.name}</h3>
                            <p className="text-[11px] text-[#7af1fc] font-medium mt-0.5">{speaker.role}</p>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0077c8] block">
                              {speaker.organization}
                            </span>
                            <h4 className="text-xs font-bold text-[#001f4d] leading-snug line-clamp-2">
                              "{speaker.topic}"
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                              {speaker.bio}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-[11px] text-[#00a887] font-semibold">
                              <Mic className="w-3.5 h-3.5" />
                              <span>Live Session</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (speaker.socials?.linkedin && speaker.socials.linkedin !== '#') {
                                    window.open(speaker.socials.linkedin, '_blank');
                                  }
                                }}
                                className="hover:text-[#0077c8] transition-colors p-1 cursor-pointer"
                                aria-label={`${speaker.name} LinkedIn`}
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (speaker.socials?.web && speaker.socials.web !== '#') {
                                    window.open(speaker.socials.web, '_blank');
                                  }
                                }}
                                className="hover:text-[#0077c8] transition-colors p-1 cursor-pointer"
                                aria-label={`${speaker.name} Website`}
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 5. GALLERY SECTION ── */}
              <section id="gallery" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-[#e2eff7]">
                <div className="max-w-7xl mx-auto space-y-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0077c8] bg-white px-3 py-1 rounded-full border border-[#d4e8f5]">
                        CAMPUS PULSE
                      </span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#001f4d] tracking-tight">
                        Moments of RADIANZA
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                        Relive the electric energy, intense hacking sprints, robotics warfare, and grand valedictory celebrations from our symposium legacy.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Camera className="w-4 h-4 text-[#0077c8]" />
                      <span>Click any image to view details</span>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GALLERY_DATA.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGalleryModal(item)}
                        className="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl border border-[#d4e8f5] transition-all duration-300 cursor-pointer aspect-[4/3]"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001f4d]/90 via-[#001f4d]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                        <span className="absolute top-4 left-4 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#002b66] shadow-xs">
                          {item.category}
                        </span>

                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-4 h-4" />
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 transform group-hover:-translate-y-1 transition-transform">
                          <h3 className="text-base font-bold leading-tight">{item.title}</h3>
                          <p className="text-xs text-slate-200 line-clamp-2">{item.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 6. QUICK BOTTOM GATEWAY TO COMPETITION MATRIX ── */}
              <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#001f4d] via-[#002b66] to-[#0077c8] text-white">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7af1fc]">
                      READY TO COMPETE?
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      Explore the Competition Matrix &amp; Register
                    </h3>
                    <p className="text-xs text-slate-200">
                      Pick your track, build your squad, and secure your verifiable entry pass.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateToPage('events')}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#002b66] text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
                    >
                      Open Events Matrix →
                    </button>
                    <button
                      type="button"
                      onClick={onStartNewRegistration}
                      className="px-6 py-3 rounded-xl bg-[#00a887] hover:bg-[#009275] text-white text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </section>

              {/* ── 7. EDITORIAL FOOTER ON HOME PAGE ── */}
              <footer id="footer" className="w-full bg-[#030914] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-2.5 text-white">
                      <CollegeEmblem size={32} />
                      <span className="font-serif text-xl font-bold tracking-tight">RADIANZA '26</span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Igniting Ideas, Innovating Tomorrow. National-Level Technical &amp; Non-Technical Symposium hosted by St. Peter's Institute of Higher Education &amp; Research.
                    </p>
                    <div className="pt-2 text-xs text-slate-500 space-y-1">
                      <p>📍 SPIHER Campus, Avadi, Chennai - 600054, Tamil Nadu</p>
                      <p>📞 +91 422 259 0123 • ignite2026@spiher.edu.in</p>
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-3 text-left">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Directory</h4>
                    <div className="flex flex-col space-y-2 text-xs">
                      {PAGES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => navigateToPage(p.id)}
                          className={`text-left transition-colors cursor-pointer ${
                            activePage === p.id ? 'text-[#7af1fc] font-bold' : 'hover:text-white'
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-3 text-left">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Staff &amp; Administration</h4>
                    <p className="text-xs text-slate-400">
                      Coordinators, evaluators, and jury can access the mobile scanner and evaluator portal below.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onOpenConsole}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#7af1fc] transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Staff &amp; Evaluator Console →</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/10 text-center text-xs text-slate-600">
                  <p>© 2026 RADIANZA • St. Peter's Institute of Higher Education &amp; Research. All Rights Reserved.</p>
                </div>
              </footer>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 2: EVENTS MATRIX (DEDICATED FULL VIEW)                         */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'events' && (
            <motion.div
              key="events"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0077c8]">
                    COMPETITION MATRIX
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#001f4d]">
                    Featured Events
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
                    Choose your battleground. Remember that each participant can register for{' '}
                    <strong>only one event</strong> across the symposium.
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#d4e8f5] shadow-xs">
                  {(['All', 'Technical', 'Non-Technical'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-[#002b66] text-white shadow-sm'
                          : 'text-slate-600 hover:text-[#002b66] hover:bg-slate-50'
                      }`}
                    >
                      {cat} Events
                    </button>
                  ))}
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-3xl border border-[#d4e8f5] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0077c8]/60 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      <span
                        className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs ${
                          event.category === 'Technical' ? 'bg-[#0077c8]' : 'bg-[#00a887]'
                        }`}
                      >
                        {event.category}
                      </span>

                      <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#002b66] shadow-xs">
                        {event.isTeamEvent
                          ? `${event.minTeamSize}-${event.maxTeamSize} Members`
                          : 'Solo Event'}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-base sm:text-lg font-bold leading-tight">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-[#0077c8] font-semibold line-clamp-1">
                          {event.tagline}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#0077c8]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#00a887]" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventModal(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer text-center"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectEvent(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#002b66] hover:bg-[#0077c8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                        >
                          <span>Register</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 3: ABOUT SPIHER & INSTITUTION                                  */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'about' && (
            <motion.div
              key="about"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0077c8] bg-white px-3 py-1 rounded-full border border-[#d4e8f5]">
                    ABOUT RADIANZA '26 &amp; SPIHER
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#001f4d]">
                    More Than Just a Symposium
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    RADIANZA '26 is an institution-wide celebration of curiosity, engineering excellence, and interdisciplinary innovation. Bringing together over 500 delegates from engineering universities across India, faculty mentors, and technical visionaries.
                  </p>

                  <div className="space-y-2 pt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a887] shrink-0" />
                      <span>NAAC 'A' Grade Accredited Deemed to be University</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a887] shrink-0" />
                      <span>UGC &amp; AICTE Approved Premier Technical Institution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00a887] shrink-0" />
                      <span>Cryptographically secured digital entry pass &amp; QR verification engine</span>
                    </div>
                  </div>

                  <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                      <span className="text-2xl font-serif font-bold text-[#0077c8]">500+</span>
                      <p className="text-xs text-slate-500 font-medium">Delegates Competing</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs">
                      <span className="text-2xl font-serif font-bold text-[#00a887]">12+</span>
                      <p className="text-xs text-slate-500 font-medium">Technical Tracks</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-[#d4e8f5] shadow-xs col-span-2 sm:col-span-1">
                      <span className="text-2xl font-serif font-bold text-amber-600">₹50K+</span>
                      <p className="text-xs text-slate-500 font-medium">Prize Pool</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white aspect-[4/3]">
                    <img
                      src="/spiher-hero-building.png"
                      alt="St. Peter's Institute Main Campus Building"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/spiher-hero-hd.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001f4d]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-mono font-bold uppercase text-[#7af1fc]">Host Institution</p>
                      <h4 className="text-base font-bold">St. Peter's Institute of Higher Education and Research</h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 4: REGISTRATION, CONTACT & PORTAL GATEWAY                      */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'contact' && (
            <motion.div
              key="contact"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-between"
            >
              <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001838] via-[#002b66] to-[#030914] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f2fe]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#00a887]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7af1fc]">
                      REGISTRATIONS ARE LIVE
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
                    Be a Part of RADIANZA '26
                  </h2>

                  <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Secure your registration today. Pick your competition track, build your team, and download your cryptographically verified entry pass.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#7af1fc]">
                        {totalRegisteredCount}+
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono">Delegates</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#00f2fe]">
                        {totalSlotsLeft}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono">Slots Left</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                        45+
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono">Institutions</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                        ₹50,000+
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono">Cash Awards</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <div className="relative group w-full sm:w-auto">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00f2fe] via-[#0077c8] to-[#00a887] opacity-80 blur-md animate-halo-pulse" />
                      <button
                        type="button"
                        onClick={onStartNewRegistration}
                        className="relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#0077c8] via-[#00a887] to-[#00f2fe] text-[#001f4d] font-bold text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPassModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <QrCode className="w-4 h-4 text-[#7af1fc]" />
                      <span>Already Registered? View Pass</span>
                    </button>
                  </div>
                </div>
              </section>

              <footer className="w-full bg-[#030914] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center gap-2.5 text-white">
                      <CollegeEmblem size={32} />
                      <span className="font-serif text-xl font-bold tracking-tight">RADIANZA '26</span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Igniting Ideas, Innovating Tomorrow. National-Level Technical &amp; Non-Technical Symposium hosted by St. Peter's Institute of Higher Education &amp; Research.
                    </p>
                    <div className="pt-2 text-xs text-slate-500 space-y-1">
                      <p>📍 SPIHER Campus, Avadi, Chennai - 600054, Tamil Nadu</p>
                      <p>📞 +91 422 259 0123 • ignite2026@spiher.edu.in</p>
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Directory</h4>
                    <div className="flex flex-col space-y-2 text-xs">
                      {PAGES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => navigateToPage(p.id)}
                          className={`text-left transition-colors cursor-pointer ${
                            activePage === p.id ? 'text-[#7af1fc] font-bold' : 'hover:text-white'
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Staff &amp; Administration</h4>
                    <p className="text-xs text-slate-400">
                      Coordinators, evaluators, and jury can access the mobile scanner and evaluator portal below.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onOpenConsole}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#7af1fc] transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Staff &amp; Evaluator Console →</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/10 text-center text-xs text-slate-600">
                  <p>© 2026 RADIANZA • St. Peter's Institute of Higher Education &amp; Research. All Rights Reserved.</p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* 4. PERSISTENT BOTTOM PAGE CONTROLLER & STEPPER                            */}
      {/* ========================================================================= */}
      <nav className="w-full bg-white/95 backdrop-blur-lg border-t border-[#d4e8f5] px-4 sm:px-8 py-3 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Page Button */}
          {prevPage ? (
            <button
              type="button"
              onClick={() => navigateToPage(prevPage.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#eaf4fb] text-[#002b66] border border-[#d4e8f5] text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#0077c8]" />
              <span className="hidden sm:inline">Previous:</span>
              <span>{prevPage.navLabel}</span>
            </button>
          ) : (
            <div className="w-24" />
          )}

          {/* Stepper Dots (Center) */}
          <div className="flex items-center gap-2">
            {PAGES.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(page.id)}
                  aria-label={`Go to ${page.navLabel}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-8 h-2.5 bg-[#002b66]'
                      : 'w-2.5 h-2.5 bg-slate-200 hover:bg-[#0077c8]/50'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Page Button */}
          {nextPage ? (
            <button
              type="button"
              onClick={() => navigateToPage(nextPage.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span className="hidden sm:inline">Next:</span>
              <span>{nextPage.navLabel}</span>
              <ArrowRight className="w-4 h-4 text-[#7af1fc]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002b66] text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#7af1fc]" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 5. MODAL DIALOGS                                                          */}
      {/* ========================================================================= */}
      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#d4e8f5] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                <img
                  src={selectedEventModal.imageUrl}
                  alt={selectedEventModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0077c8] text-white mr-2">
                    {selectedEventModal.category}
                  </span>
                  <h3 className="text-xl font-bold mt-1">{selectedEventModal.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <h4 className="font-bold text-[#001f4d] uppercase tracking-wider text-[11px] mb-1">
                    About the Event
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{selectedEventModal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#f0f8fc] border border-[#d4e8f5]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue</span>
                    <span className="font-bold text-[#002b66]">{selectedEventModal.venue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
                    <span className="font-bold text-[#002b66]">{selectedEventModal.time}</span>
                  </div>
                </div>

                {selectedEventModal.rules && (
                  <div>
                    <h4 className="font-bold text-[#001f4d] uppercase tracking-wider text-[11px] mb-2">
                      Rules &amp; Guidelines
                    </h4>
                    <ul className="space-y-1.5 text-slate-600">
                      {selectedEventModal.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#0077c8] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {selectedEventModal.isTeamEvent ? 'Team Participation' : 'Solo Registration'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const evt = selectedEventModal;
                    setSelectedEventModal(null);
                    onSelectEvent(evt);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] text-white font-bold text-xs shadow cursor-pointer hover:scale-105 transition-all"
                >
                  Register for this Event →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {selectedGalleryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedGalleryModal.imageUrl}
                  alt={selectedGalleryModal.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedGalleryModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <span className="absolute top-4 left-4 text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#0077c8] text-white">
                  {selectedGalleryModal.category}
                </span>
              </div>
              <div className="p-6 text-white space-y-2">
                <h3 className="text-xl font-bold font-serif">{selectedGalleryModal.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedGalleryModal.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Pass Access Modal */}
      <AnimatePresence>
        {isPassModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#d4e8f5] overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#e8f5fb] text-[#0077c8]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#001f4d]">Access Event Pass</h3>
                    <p className="text-[11px] text-slate-500">Enter your credentials to view your QR pass.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPassModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {accessError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{accessError}</span>
                </div>
              )}

              <form onSubmit={handlePassLookupSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#002b66] uppercase">
                    Roll Number / Register Number
                  </label>
                  <input
                    type="text"
                    required
                    value={accessRollNumber}
                    onChange={(e) => setAccessRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 2021CS042"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#d4e8f5] text-xs font-mono font-bold text-[#002b66] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077c8]"
                  />
                </div>

                <div className="space-y-1">
                  <CustomDatePicker
                    value={accessDob}
                    onChange={setAccessDob}
                    label="Date of Birth"
                    placeholder="Select Date of Birth"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingPass}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white font-bold text-xs shadow-md shadow-[#0077c8]/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isVerifyingPass ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Open My Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-500">
                <span>Demo user (Alex):</span>
                <button
                  type="button"
                  onClick={() => handleDemoFill('2021CS042', '2003-05-14')}
                  className="text-[#0077c8] font-bold underline cursor-pointer"
                >
                  Autofill 2021CS042
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadianzaLandingPage;
