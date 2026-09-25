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
  Move3d,
} from 'lucide-react';
import { CollegeEvent, EventCategory, Participant, Registration } from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEmblem, SpiherStarburstLogo } from '../common/CollegeLogo';
import { CustomDatePicker } from '../common/CustomDatePicker';
import { ThreeDCyberHeadCanvas } from './ThreeDCyberHeadCanvas';
import { CyberWebBackground } from '../common/CyberWebBackground';

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
  isRevealed?: boolean;
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
  {
    id: 'spk-5',
    name: 'Dr. Vikramaditya Sengupta',
    role: 'Director of Cloud Infra',
    organization: 'Hyperscale Networks • CNCF Ambassador',
    topic: 'Distributed Low-Latency Edge Mesh Architectures',
    bio: 'Pioneering ultra-reliable global distributed mesh systems powering million-RPS microsecond fintech and telecom cores.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    tag: 'Cloud Architect',
    socials: { linkedin: '#', web: '#' },
  },
  {
    id: 'spk-6',
    name: 'Dr. Shalini Kulkarni',
    role: 'Quantum Computing Lead',
    organization: 'DeepTech Ventures • IIT Madras Alum',
    topic: 'Post-Quantum Cryptography & Quantum Supremacy',
    bio: 'Leading research on quantum key distribution protocols and lattice-based post-quantum cryptography standards.',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    tag: 'Quantum Pioneer',
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
  {
    id: 'gal-7',
    title: 'Precision Drone Racing Championship',
    category: 'Aerial Tech',
    caption: 'FPV drone pilots navigating high-speed neon obstacle gates in the campus indoor arena.',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-8',
    title: 'Gaming & LAN Arena Showdown',
    category: 'Esports',
    caption: 'Electrifying esports showdowns with live casting, tactical gameplay, and cheering audiences.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
];

// ── Motion Variants for Directional Page Redirection ──
const pageTransitionVariants: any = {
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
  isRevealed = true,
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

  // Lock body scroll when mobile navigation drawer is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // ── Quick Pass Access Modal State ──
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [accessRollNumber, setAccessRollNumber] = useState('');
  const [accessDob, setAccessDob] = useState('');
  const [isVerifyingPass, setIsVerifyingPass] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  // ── Horizontal Speakers Scrolling State ──
  const speakersScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollSpeakersLeft, setCanScrollSpeakersLeft] = useState(false);
  const [canScrollSpeakersRight, setCanScrollSpeakersRight] = useState(true);
  const isMouseDownSpeakersRef = React.useRef(false);
  const startXSpeakersRef = React.useRef(0);
  const scrollLeftSpeakersRef = React.useRef(0);

  const checkSpeakersScroll = () => {
    if (speakersScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = speakersScrollRef.current;
      setCanScrollSpeakersLeft(scrollLeft > 15);
      setCanScrollSpeakersRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  const handleSpeakersScroll = (direction: 'left' | 'right') => {
    if (speakersScrollRef.current) {
      const scrollAmount = 384;
      speakersScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleSpeakersMouseDown = (e: React.MouseEvent) => {
    if (!speakersScrollRef.current) return;
    isMouseDownSpeakersRef.current = true;
    startXSpeakersRef.current = e.pageX - speakersScrollRef.current.offsetLeft;
    scrollLeftSpeakersRef.current = speakersScrollRef.current.scrollLeft;
  };

  const handleSpeakersMouseLeave = () => {
    isMouseDownSpeakersRef.current = false;
  };

  const handleSpeakersMouseUp = () => {
    isMouseDownSpeakersRef.current = false;
  };

  const handleSpeakersMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownSpeakersRef.current || !speakersScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - speakersScrollRef.current.offsetLeft;
    const walk = (x - startXSpeakersRef.current) * 1.5;
    speakersScrollRef.current.scrollLeft = scrollLeftSpeakersRef.current - walk;
    checkSpeakersScroll();
  };

  // ── Horizontal Moments of RADIANZA Gallery State ──
  const galleryScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollGalleryLeft, setCanScrollGalleryLeft] = useState(false);
  const [canScrollGalleryRight, setCanScrollGalleryRight] = useState(true);
  const isMouseDownGalleryRef = React.useRef(false);
  const startXGalleryRef = React.useRef(0);
  const scrollLeftGalleryRef = React.useRef(0);

  const checkGalleryScroll = () => {
    if (galleryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
      setCanScrollGalleryLeft(scrollLeft > 15);
      setCanScrollGalleryRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  const handleGalleryScroll = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = 404;
      galleryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToGalleryIndex = (idx: number) => {
    if (galleryScrollRef.current) {
      const cardStep = 380 + 24;
      galleryScrollRef.current.scrollTo({
        left: idx * cardStep,
        behavior: 'smooth',
      });
    }
  };

  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (!galleryScrollRef.current) return;
    isMouseDownGalleryRef.current = true;
    startXGalleryRef.current = e.pageX - galleryScrollRef.current.offsetLeft;
    scrollLeftGalleryRef.current = galleryScrollRef.current.scrollLeft;
  };

  const handleGalleryMouseLeave = () => {
    isMouseDownGalleryRef.current = false;
  };

  const handleGalleryMouseUp = () => {
    isMouseDownGalleryRef.current = false;
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownGalleryRef.current || !galleryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryScrollRef.current.offsetLeft;
    const walk = (x - startXGalleryRef.current) * 1.5;
    galleryScrollRef.current.scrollLeft = scrollLeftGalleryRef.current - walk;
    checkGalleryScroll();
  };

  // Track viewport to guarantee ONLY ONE 3D WebGL canvas is mounted in the DOM at any time
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleViewportChange = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleViewportChange);
    return () => window.removeEventListener('resize', handleViewportChange);
  }, []);

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
    <div className="min-h-screen w-full bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#C1121F] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. STICKY GLASSMORPHIC HEADER & NAVIGATION BAR                            */}
      {/* ========================================================================= */}
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
        transition={{ duration: 0.55 }}
        className="sticky top-0 z-40 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-[#C1121F]/20 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo Lockup */}
          <div
            onClick={() => navigateToPage('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <CollegeEmblem size={34} className="group-hover:scale-105 transition-transform duration-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#FFFFFF]">
                RADIANZA <span className="text-[#FF1738]">'26</span>
              </span>
            </div>
          </div>

          {/* Desktop Multi-Page Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#0D0D12] rounded-2xl border border-[#C1121F]/20 shadow-inner">
            {PAGES.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(page.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePagePill"
                      className="absolute inset-0 bg-gradient-to-r from-[#C1121F] to-[#9e0d19] rounded-xl shadow-md shadow-[#C1121F]/35"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{page.navLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Access Pass Button (Desktop only) */}
            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D0D12] hover:bg-[#15151c] text-[#FFFFFF] border border-[#C1121F]/40 hover:border-[#FF1738] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF1738]" />
              <span>Access Pass</span>
            </button>

            {/* Primary Register CTA Button (Desktop only) */}
            <button
              type="button"
              onClick={onStartNewRegistration}
              className="hidden lg:flex relative px-5 py-2 rounded-xl bg-gradient-to-r from-[#C1121F] to-[#a80f1b] hover:from-[#d91423] hover:to-[#C1121F] text-white text-xs font-bold shadow-md shadow-[#C1121F]/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] items-center gap-1.5"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Mobile Clean Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg border-2 border-[#C1121F] hover:border-[#FF1738] flex flex-col items-center justify-center gap-[5px] p-2 bg-[#0D0D12] transition-all cursor-pointer active:scale-95 shadow-xs"
              aria-label="Open Navigation Menu"
            >
              <span className="w-5 h-[2px] bg-[#FFFFFF] rounded-full block"></span>
              <span className="w-5 h-[2px] bg-[#FF1738] rounded-full block"></span>
              <span className="w-5 h-[2px] bg-[#FFFFFF] rounded-full block"></span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full Viewport Right-Side Slide-Over Drawer for Mobile Navigation (Rendered outside header to avoid backdrop-filter clipping) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
            {/* Dimmed Blurred Backdrop spanning entire viewport */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Dark Right Slide-Over Panel spanning full viewport height */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative z-10 w-[85%] max-w-[340px] h-[100dvh] h-screen bg-[#0a0a0e] border-l border-[#C1121F]/30 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto text-[#FFFFFF]"
            >
              <div>
                {/* Top Header Row with Logo & Close Button */}
                <div className="flex items-center justify-between pb-5 border-b border-[#C1121F]/20">
                  <div className="flex items-center gap-2.5">
                    <CollegeEmblem size={28} />
                    <span className="font-serif font-black text-lg tracking-tight text-[#FFFFFF]">
                      RADIANZA <span className="text-[#FF1738]">'26</span>
                    </span>
                  </div>

                  {/* Red Bordered Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-lg border-2 border-[#C1121F] hover:border-[#FF1738] flex items-center justify-center text-[#FFFFFF] bg-[#050505] transition-all active:scale-95 cursor-pointer shadow-xs"
                    aria-label="Close Navigation Menu"
                  >
                    <X className="w-5 h-5 text-[#FFFFFF] stroke-[2.2]" />
                  </button>
                </div>

                {/* Clean Nav Links List with Divider Lines */}
                <nav className="flex flex-col mt-4 divide-y divide-[#C1121F]/15">
                  {PAGES.map((page) => {
                    const isActive = activePage === page.id;
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigateToPage(page.id);
                        }}
                        className={`py-4 text-left text-base transition-colors flex items-center justify-between cursor-pointer ${
                          isActive ? 'text-[#FF1738] font-bold' : 'text-[#9CA3AF] font-medium hover:text-white'
                        }`}
                      >
                        <span>{page.navLabel}</span>
                        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#FF1738] shadow-[0_0_8px_#FF1738]" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Big CTA Button */}
              <div className="pt-6 pb-2 space-y-3 border-t border-[#C1121F]/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartNewRegistration();
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C1121F] to-[#a80f1b] hover:from-[#d91423] hover:to-[#C1121F] active:scale-95 text-white font-black text-xs tracking-widest uppercase shadow-lg shadow-[#C1121F]/40 flex items-center justify-center gap-2 cursor-pointer transition-transform"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPassModalOpen(true);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-[#9CA3AF] hover:text-[#FF1738] transition-colors cursor-pointer"
                >
                  Access Existing Pass →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ========================================================================= */}
      {/* 3. MULTI-PAGE ANIMATED ROUTER                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full relative overflow-hidden">
        <AnimatePresence mode="wait" custom={pageDirection}>
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 1: HOME (HERO 3D + HIGHLIGHTS + SPEAKERS + GALLERY) */}
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
              {/* ── 1. HERO SECTION (SPIDER-MAN DARK RED CYBER AESTHETIC) ── */}
              <section id="hero" className="relative w-full overflow-hidden bg-[#050505] text-[#FFFFFF]">
                {/* Cyber Web and Geometric Laser Grid Background */}
                <CyberWebBackground />
                
                {/* ─── MOBILE VIEW: EXACT REFERENCE MATCH (< lg) ─── */}
                <div className="lg:hidden relative w-full min-h-[calc(100dvh-4.25rem)] min-h-[720px] flex flex-col justify-start p-5 sm:p-6 pb-8 select-none overflow-hidden">
                  {/* Background 3D Cyber Scene */}
                  {!isDesktop && (
                    <div className="absolute inset-0 z-0 pointer-events-auto">
                      <ThreeDCyberHeadCanvas isRevealed={isRevealed} onRegisterClick={onStartNewRegistration} />
                    </div>
                  )}

                  {/* Foreground Content: Starting directly from chin level */}
                  <div className="relative z-10 pt-[50vh] sm:pt-[48vh] pb-2 space-y-3 sm:space-y-3.5 max-w-[92%] sm:max-w-[78%] pointer-events-none">
                    {/* Line 1: Department of IT Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D12]/90 backdrop-blur-md shadow-md border border-[#C1121F]/40 text-[#FFFFFF] shadow-[0_0_15px_rgba(193,18,31,0.2)] pointer-events-auto"
                    >
                      <CollegeEmblem size={24} />
                      <span className="tracking-wider uppercase font-mono text-[10px] sm:text-[11px] font-bold text-[#FFFFFF]">
                        DEPARTMENT OF INFORMATION TECHNOLOGY
                      </span>
                    </motion.div>
                    
                    {/* Line 2: RADIANZA '26 Title */}
                    <motion.h1
                      initial={{ opacity: 0, x: -25 }}
                      animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
                      transition={{ duration: 0.65, delay: 0.15 }}
                      className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#FFFFFF] leading-[1.02] pointer-events-none"
                    >
                      RADIANZA <span className="text-[#FF1738]">'26</span>
                    </motion.h1>

                    {/* Line 3: National-Level Technical Symposium with Red Gradient Accent */}
                    <motion.div
                      initial={{ opacity: 0, x: -18 }}
                      animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      className="flex items-center gap-2 pointer-events-none"
                    >
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-[#FFFFFF]/90 uppercase">
                        NATIONAL-LEVEL TECHNICAL SYMPOSIUM
                      </span>
                      <span className="w-8 h-[2px] bg-gradient-to-r from-[#FF1738] to-[#C1121F] block shrink-0" />
                    </motion.div>

                    {/* Line 4: Tagline */}
                    <motion.p
                      initial={{ opacity: 0, x: -14 }}
                      animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      className="text-xs sm:text-sm text-[#9CA3AF] font-medium italic pointer-events-none"
                    >
                      "Igniting Ideas, Innovating Tomorrow"
                    </motion.p>

                    {/* Line 5: Date & Location Badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.6, delay: 0.45 }}
                      className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1 pointer-events-auto"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D12]/90 backdrop-blur-md border border-[#C1121F]/50 shadow-xs text-xs font-bold text-[#FFFFFF] w-fit">
                        <Calendar className="w-3.5 h-3.5 text-[#FF1738]" />
                        <span>15 - 16 OCT 2026</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D12]/90 backdrop-blur-md border border-[#C1121F]/35 shadow-xs text-xs font-medium text-[#FFFFFF] w-fit">
                        <MapPin className="w-3.5 h-3.5 text-[#FF1738]" />
                        <span>SPIHER Campus, Coimbatore</span>
                      </div>
                    </motion.div>

                    {/* Line 6: Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.55, delay: 0.55 }}
                      className="pt-2 sm:pt-3 flex flex-wrap gap-2.5 pointer-events-auto"
                    >
                      <button
                        type="button"
                        onClick={onStartNewRegistration}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C1121F] to-[#a80f1b] hover:from-[#d91423] hover:to-[#C1121F] text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(255,23,56,0.45)] active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToPage('events')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D0D12] hover:bg-[#15151c] border border-[#C1121F]/60 text-white font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(193,18,31,0.25)] active:scale-95 transition-all cursor-pointer"
                      >
                        <span>View Matrix</span>
                        <ChevronRight className="w-4 h-4 text-[#FF1738]" />
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* ─── DESKTOP VIEW: EXACT REFERENCE IMAGE LAYOUT (>= lg) ─── */}
                <div className="hidden lg:flex min-h-[calc(100vh-6rem)] items-center justify-center py-16 relative z-10">
                  <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-12 gap-8 items-center overflow-visible">
                    {/* Wording: Left Column */}
                    <div className="col-span-6 space-y-7 text-left flex flex-col items-start z-20">
                      {/* Top Institution Pill Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D0D12]/90 border border-[#C1121F]/40 text-[#FFFFFF] text-xs font-mono tracking-wider uppercase shadow-md shadow-[#C1121F]/15 backdrop-blur-md"
                      >
                        <CollegeEmblem size={24} />
                        <span className="font-bold text-[#FFFFFF]">
                          DEPARTMENT OF INFORMATION TECHNOLOGY
                        </span>
                      </motion.div>

                      {/* Headline Typography & Taglines */}
                      <div className="space-y-4">
                        <motion.h1
                          initial={{ opacity: 0, x: -35 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -35 }}
                          transition={{ duration: 0.65, delay: 0.15 }}
                          className="text-6xl sm:text-7xl xl:text-8xl font-serif font-black tracking-tight text-[#FFFFFF] leading-[0.95]"
                        >
                          RADIANZA
                          <span className="block text-[#FF1738] mt-2 font-serif font-black">'26</span>
                        </motion.h1>

                        {/* Subtitle with Red Horizontal Bar */}
                        <motion.div
                          initial={{ opacity: 0, x: -25 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
                          transition={{ duration: 0.6, delay: 0.25 }}
                          className="flex items-center gap-3 pt-1"
                        >
                          <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.22em] text-[#FFFFFF]/90 uppercase">
                            NATIONAL-LEVEL TECHNICAL SYMPOSIUM
                          </span>
                          <span className="w-12 h-[2px] bg-gradient-to-r from-[#FF1738] to-[#C1121F] block" />
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, x: -18 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                          transition={{ duration: 0.6, delay: 0.35 }}
                          className="text-base sm:text-lg text-[#9CA3AF] font-medium italic"
                        >
                          "Igniting Ideas, Innovating Tomorrow"
                        </motion.p>
                      </div>

                      {/* Date & Location Chips */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex flex-wrap justify-start items-center gap-3 pt-1 text-xs font-semibold text-[#FFFFFF]"
                      >
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0D0D12]/90 backdrop-blur-md border border-[#C1121F]/50 shadow-md shadow-[#C1121F]/15">
                          <Calendar className="w-4 h-4 text-[#FF1738]" />
                          <span className="font-bold text-[#FFFFFF]">15 - 16 OCT 2026</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0D0D12]/90 backdrop-blur-md border border-[#C1121F]/35 shadow-md">
                          <MapPin className="w-4 h-4 text-[#FF1738]" />
                          <span className="text-[#FFFFFF]">SPIHER Campus, Coimbatore</span>
                        </div>
                      </motion.div>

                      {/* Action CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex flex-row items-center gap-4 pt-3 w-auto"
                      >
                        {/* Primary Crimson Glowing CTA */}
                        <button
                          type="button"
                          onClick={onStartNewRegistration}
                          className="relative w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C1121F] to-[#a80f1b] hover:from-[#d91423] hover:to-[#C1121F] text-white font-black text-sm tracking-wide shadow-[0_0_24px_rgba(255,23,56,0.45)] hover:shadow-[0_0_36px_rgba(255,23,56,0.7)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                          <span className="font-bold">Register Now</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>

                        {/* Secondary Dark/Red CTA */}
                        <button
                          type="button"
                          onClick={() => navigateToPage('events')}
                          className="w-auto px-7 py-3.5 rounded-full bg-[#0D0D12] hover:bg-[#15151c] border border-[#C1121F]/60 hover:border-[#FF1738] text-white font-bold text-sm tracking-wide shadow-[0_0_16px_rgba(193,18,31,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <span>View Competition Matrix</span>
                          <ChevronRight className="w-4 h-4 text-[#FF1738]" />
                        </button>
                      </motion.div>

                      {/* Digital Pass Quick Access */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.65 }}
                        className="pt-1 text-xs text-[#9CA3AF] flex items-center justify-start gap-2"
                      >
                        <span>Already registered?</span>
                        <button
                          type="button"
                          onClick={() => setIsPassModalOpen(true)}
                          className="text-[#FF1738] font-bold underline hover:text-[#ff455e] cursor-pointer"
                        >
                          Access your digital pass →
                        </button>
                      </motion.div>
                    </div>

                    {/* 3D Cyber Head in Right Column */}
                    <div className="col-span-6 flex items-center justify-center relative w-full min-h-[560px] overflow-visible">
                      {isDesktop && <ThreeDCyberHeadCanvas isRevealed={isRevealed} onRegisterClick={onStartNewRegistration} />}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 2. HIGHLIGHTS SECTION ── */}
              <section id="highlights" className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-[#C1121F]/20">
                <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl text-left space-y-2 sm:space-y-3"
                  >
                    <span className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1738] bg-[#0D0D12] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#C1121F]/30 shadow-[0_0_10px_rgba(255,23,56,0.15)]">
                      WHY
                    </span>
                    <h2 className="text-2xl sm:text-5xl font-serif font-extrabold text-[#FFFFFF] tracking-tight">
                      RADIANZA <span className="text-[#FF1738]">'26?</span>
                    </h2>
                    <p className="text-xs sm:text-base text-[#9CA3AF] leading-relaxed font-medium">
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
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
                  >
                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                      className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0D0D12] border border-[#C1121F]/30 hover:border-[#FF1738] hover:shadow-[0_0_24px_rgba(255,23,56,0.3)] hover:-translate-y-1.5 transition-all duration-300 space-y-2.5 sm:space-y-4 flex flex-col justify-between group cursor-pointer"
                      onClick={() => {
                        setActiveCategory('Technical');
                        navigateToPage('events');
                      }}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#C1121F]/20 text-[#FF1738] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Code2 className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-[#FF1738]" />
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-[#FFFFFF] leading-tight">Technical Events</h3>
                        <p className="text-[11px] sm:text-xs text-[#9CA3AF] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                          Code. Build. Solve. Intense algorithmic sprints, robotics combat, and full-stack challenges.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#FF1738] pt-1 sm:pt-2">
                        <span>View Tracks</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                      className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0D0D12] border border-[#C1121F]/30 hover:border-[#FF1738] hover:shadow-[0_0_24px_rgba(255,23,56,0.3)] hover:-translate-y-1.5 transition-all duration-300 space-y-2.5 sm:space-y-4 flex flex-col justify-between group cursor-pointer"
                      onClick={() => {
                        setActiveCategory('Non-Technical');
                        navigateToPage('events');
                      }}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#C1121F]/20 text-[#FF1738] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Gamepad2 className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-[#FF1738]" />
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-[#FFFFFF] leading-tight">Non-Technical Events</h3>
                        <p className="text-[11px] sm:text-xs text-[#9CA3AF] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                          Showcase. Express. Create. e-Sports, technical quizzes, design marathons, and creative arenas.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#FF1738] pt-1 sm:pt-2">
                        <span>View Tracks</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                      className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0D0D12] border border-[#C1121F]/30 hover:border-[#FF1738] hover:shadow-[0_0_24px_rgba(255,23,56,0.25)] hover:-translate-y-1.5 transition-all duration-300 space-y-2.5 sm:space-y-4 flex flex-col justify-between group"
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#C1121F]/20 text-[#FF1738] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-[#FF1738]" />
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-[#FFFFFF] leading-tight">Networking</h3>
                        <p className="text-[11px] sm:text-xs text-[#9CA3AF] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                          Meet industry experts, professors, and over 500+ ambitious delegates from all across India.
                        </p>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#FF1738] font-mono pt-1 sm:pt-2">500+ DELEGATES</span>
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                      className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0D0D12] border border-[#C1121F]/30 hover:border-[#FF1738] hover:shadow-[0_0_24px_rgba(255,23,56,0.35)] hover:-translate-y-1.5 transition-all duration-300 space-y-2.5 sm:space-y-4 flex flex-col justify-between group"
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#C1121F]/20 text-[#FF1738] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Trophy className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-[#FF1738]" />
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-[#FFFFFF] leading-tight">Exciting Prizes</h3>
                        <p className="text-[11px] sm:text-xs text-[#9CA3AF] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                          Recognize talent & celebrate innovation with cash prizes, official trophies, and certificates.
                        </p>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#FF1738] font-mono pt-1 sm:pt-2">₹50,000+ POOL</span>
                    </motion.div>
                  </motion.div>

                  {/* Campus Showcase Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="group relative rounded-3xl overflow-hidden shadow-xl border border-[#C1121F]/30 min-h-[220px] sm:min-h-[280px] flex items-end"
                  >
                    <img
                      src="/spiher-hero-building.png"
                      alt="St. Peter's Institute Campus"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/60 to-transparent" />
                    <div className="relative z-10 p-6 sm:p-8 text-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#C1121F] text-white">
                          HOST CAMPUS
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FFFFFF] mt-2">
                          St. Peter's Institute of Higher Education &amp; Research
                        </h3>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          Deemed to be University • NAAC 'A' Grade Accredited Campus
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onStartNewRegistration}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C1121F] to-[#a80f1b] hover:from-[#d91423] hover:to-[#C1121F] text-white text-xs font-bold shadow-md shadow-[#C1121F]/40 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Join RADIANZA '26
                      </button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* ── 3. SPEAKERS SECTION (HORIZONTAL SCROLLING) ── */}
              <section id="speakers" className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-[#C1121F]/20 overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6 }}
                      className="max-w-2xl text-left space-y-3"
                    >
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1738] bg-[#0D0D12] px-3 py-1 rounded-full border border-[#C1121F]/30 shadow-[0_0_10px_rgba(255,23,56,0.15)]">
                        THOUGHT LEADERS &amp; JURY
                      </span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#FFFFFF] tracking-tight">
                        Eminent Speakers
                      </h2>
                      <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-medium">
                        Learn directly from researchers, tech executives, and venture founders shaping the forefront of modern engineering and digital transformation.
                      </p>
                    </motion.div>

                    {/* Navigation Controls & Helper */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#9CA3AF] bg-[#0D0D12] px-3 py-2 rounded-full border border-[#C1121F]/20 select-none">
                        <span>← Swipe / Scroll →</span>
                      </span>

                      <div className="flex items-center gap-2 bg-[#0D0D12] p-1.5 rounded-full border border-[#C1121F]/20">
                        <button
                          type="button"
                          onClick={() => handleSpeakersScroll('left')}
                          disabled={!canScrollSpeakersLeft}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollSpeakersLeft
                              ? 'bg-[#050505] text-white hover:bg-[#C1121F] shadow-xs active:scale-95 border border-[#C1121F]/30'
                              : 'bg-transparent text-[#9CA3AF]/30 cursor-not-allowed border border-transparent'
                          }`}
                          aria-label="Scroll speakers left"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpeakersScroll('right')}
                          disabled={!canScrollSpeakersRight}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollSpeakersRight
                              ? 'bg-[#050505] text-white hover:bg-[#C1121F] shadow-xs active:scale-95 border border-[#C1121F]/30'
                              : 'bg-transparent text-[#9CA3AF]/30 cursor-not-allowed border border-transparent'
                          }`}
                          aria-label="Scroll speakers right"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Track */}
                  <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div
                      ref={speakersScrollRef}
                      onScroll={checkSpeakersScroll}
                      onMouseDown={handleSpeakersMouseDown}
                      onMouseLeave={handleSpeakersMouseLeave}
                      onMouseUp={handleSpeakersMouseUp}
                      onMouseMove={handleSpeakersMouseMove}
                      className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none focus:outline-hidden no-scrollbar overscroll-x-contain"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                    >
                      {SPEAKERS_DATA.map((speaker, idx) => (
                        <div
                          key={speaker.id}
                          className="w-[300px] sm:w-[340px] md:w-[360px] shrink-0 snap-start bg-[#0D0D12] rounded-3xl border border-[#C1121F]/30 overflow-hidden shadow-xs hover:shadow-[0_0_24px_rgba(255,23,56,0.25)] hover:border-[#FF1738] transition-all duration-300 flex flex-col justify-between group select-none"
                        >
                          <div className="relative h-60 w-full overflow-hidden bg-[#050505]">
                            <img
                              src={speaker.imageUrl}
                              alt={speaker.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/30 to-transparent pointer-events-none" />

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#050505]/90 text-[#FF1738] border border-[#C1121F]/40 shadow-xs backdrop-blur-xs">
                                {speaker.tag}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#C1121F]/30">
                                0{idx + 1}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                              <h3 className="text-lg font-bold leading-tight text-[#FFFFFF] drop-shadow-xs">{speaker.name}</h3>
                              <p className="text-xs text-[#FF1738] font-medium mt-0.5">{speaker.role}</p>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1738] block">
                                {speaker.organization}
                              </span>
                              <h4 className="text-sm font-bold text-[#FFFFFF] leading-snug">
                                "{speaker.topic}"
                              </h4>
                              <p className="text-xs text-[#9CA3AF] line-clamp-3 leading-relaxed">
                                {speaker.bio}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-[#C1121F]/15 flex items-center justify-between text-xs text-[#9CA3AF]/60">
                              <span className="flex items-center gap-1.5 text-[11px] text-[#FF1738] font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#FF1738] animate-pulse" />
                                <span>Live Keynote &amp; Q&amp;A</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (speaker.socials?.linkedin && speaker.socials.linkedin !== '#') {
                                      window.open(speaker.socials.linkedin, '_blank');
                                    }
                                  }}
                                  className="hover:text-[#FF1738] transition-colors p-1 cursor-pointer text-[#9CA3AF]"
                                  aria-label={`${speaker.name} LinkedIn`}
                                >
                                  <Linkedin className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (speaker.socials?.web && speaker.socials.web !== '#') {
                                      window.open(speaker.socials.web, '_blank');
                                    }
                                  }}
                                  className="hover:text-[#FF1738] transition-colors p-1 cursor-pointer text-[#9CA3AF]"
                                  aria-label={`${speaker.name} Website`}
                                >
                                  <Globe className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 4. GALLERY SECTION (HORIZONTAL SCROLLING) ── */}
              <section id="gallery" className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-[#C1121F]/30 overflow-hidden relative">
                {/* Subtle web lattice accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF1738]/50 to-transparent" />

                <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6 }}
                      className="space-y-3 text-left max-w-2xl"
                    >
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1738] bg-[#0D0D12] px-3 py-1 rounded-full border border-[#C1121F]/40 shadow-[0_0_12px_rgba(255,23,56,0.15)]">
                        CAMPUS PULSE
                      </span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
                        Moments of RADIANZA
                      </h2>
                      <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-medium">
                        Relive the electric energy, intense hacking sprints, robotics warfare, and grand valedictory celebrations from our symposium legacy.
                      </p>
                    </motion.div>

                    {/* Navigation Controls & Helper */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] bg-[#0D0D12] px-3 py-2 rounded-full border border-[#C1121F]/30 select-none">
                        <Camera className="w-3.5 h-3.5 text-[#FF1738]" />
                        <span>Click card to enlarge</span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#0D0D12] p-1.5 rounded-full border border-[#C1121F]/30 shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleGalleryScroll('left')}
                          disabled={!canScrollGalleryLeft}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollGalleryLeft
                              ? 'bg-[#050505] text-white hover:bg-[#C1121F] hover:text-white border border-[#C1121F]/40 shadow-xs active:scale-95'
                              : 'bg-transparent text-[#9CA3AF]/20 cursor-not-allowed border border-transparent'
                          }`}
                          aria-label="Scroll gallery left"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGalleryScroll('right')}
                          disabled={!canScrollGalleryRight}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollGalleryRight
                              ? 'bg-[#050505] text-white hover:bg-[#C1121F] hover:text-white border border-[#C1121F]/40 shadow-xs active:scale-95'
                              : 'bg-transparent text-[#9CA3AF]/20 cursor-not-allowed border border-transparent'
                          }`}
                          aria-label="Scroll gallery right"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Track */}
                  <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div
                      ref={galleryScrollRef}
                      onScroll={checkGalleryScroll}
                      onMouseDown={handleGalleryMouseDown}
                      onMouseLeave={handleGalleryMouseLeave}
                      onMouseUp={handleGalleryMouseUp}
                      onMouseMove={handleGalleryMouseMove}
                      className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none focus:outline-hidden no-scrollbar overscroll-x-contain"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                    >
                      {GALLERY_DATA.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedGalleryModal(item)}
                          className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start aspect-[4/3] group relative rounded-3xl overflow-hidden bg-[#0D0D12] shadow-md hover:shadow-[0_0_30px_rgba(255,23,56,0.25)] border border-[#C1121F]/30 hover:border-[#FF1738]/70 transition-all duration-300 cursor-pointer select-none"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 pointer-events-none"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />

                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#050505]/90 border border-[#C1121F]/50 backdrop-blur-md text-[#FF1738] shadow-xs">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#C1121F]/30">
                                0{idx + 1}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-[#FF1738]/20 border border-[#FF1738]/40 backdrop-blur-md flex items-center justify-center text-[#FF1738] opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize2 className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 transform group-hover:-translate-y-1 transition-transform pointer-events-none">
                            <h3 className="text-base font-bold leading-tight drop-shadow-xs">{item.title}</h3>
                            <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">{item.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 5. QUICK BOTTOM GATEWAY TO COMPETITION MATRIX ── */}
              <section className="w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#0D0D12] border-t border-b border-[#C1121F]/30 text-white relative">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF1738]">
                      READY TO COMPETE?
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      Explore the Competition Matrix &amp; Register
                    </h3>
                    <p className="text-xs text-[#9CA3AF]">
                      Pick your track, build your squad, and secure your verifiable entry pass.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateToPage('events')}
                      className="px-6 py-3 rounded-xl bg-[#050505] hover:bg-[#15151D] text-white border border-[#C1121F]/50 text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      Open Events Matrix →
                    </button>
                    <button
                      type="button"
                      onClick={onStartNewRegistration}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C1121F] to-[#FF1738] hover:brightness-110 text-white text-xs font-black shadow-lg shadow-[#FF1738]/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </section>

              {/* ── 7. EDITORIAL FOOTER ON HOME PAGE ── */}
              <footer id="footer" className="w-full bg-[#050505] text-[#9CA3AF] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C1121F]/25 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-2.5 text-white">
                      <CollegeEmblem size={32} />
                      <span className="font-serif text-xl font-bold tracking-tight">
                        RADIANZA <span className="text-[#FF1738]">'26</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
                      Igniting Ideas, Innovating Tomorrow. National-Level Technical &amp; Non-Technical Symposium hosted by St. Peter's Institute of Higher Education &amp; Research.
                    </p>
                    <div className="pt-2 text-xs text-[#9CA3AF]/80 space-y-1">
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
                            activePage === p.id ? 'text-[#FF1738] font-bold' : 'hover:text-white'
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-3 text-left">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Staff &amp; Administration</h4>
                    <p className="text-xs text-[#9CA3AF]">
                      Coordinators, evaluators, and jury can access the mobile scanner and evaluator portal below.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onOpenConsole}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D0D12] hover:bg-[#15151D] border border-[#C1121F]/40 text-xs text-[#FF1738] transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Staff &amp; Evaluator Console →</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-[#C1121F]/15 text-center text-xs text-[#9CA3AF]/50">
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
              {/* Header Lockup */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#C1121F]/30">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0D12] border border-[#C1121F]/40 text-[#FF1738] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,23,56,0.15)]">
                    <Trophy className="w-3.5 h-3.5 text-[#FF1738]" />
                    <span>ARENA // COMPETITION MATRIX</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
                    Featured <span className="text-[#FF1738]">Events</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl leading-relaxed">
                    Choose your battleground. Select your preferred event to compete, innovate, and showcase your expertise at RADIANZA ’26.
                  </p>
                </div>

                {/* Category Filter Switcher */}
                <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center gap-1.5 p-1.5 bg-[#0D0D12] rounded-2xl border border-[#C1121F]/30 shadow-xs shrink-0 self-start md:self-auto">
                  {(['All', 'Technical', 'Non-Technical'] as const).map((cat) => {
                    const count = cat === 'All' ? events.length : events.filter(e => e.category === cat).length;
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-[#C1121F] text-white shadow-md shadow-[#C1121F]/40'
                            : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="whitespace-nowrap">
                          {cat === 'All' ? 'All Events' : (
                            <>
                              <span>{cat}</span>
                              <span className="hidden md:inline">&nbsp;Events</span>
                            </>
                          )}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold leading-none shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#050505] text-[#FF1738]'
                              : 'bg-[#050505]/80 text-[#9CA3AF] border border-[#C1121F]/30'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Events Grid with Premium Dark Red Superhero Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0D0D12] rounded-3xl border border-[#C1121F]/25 hover:border-[#FF1738]/60 overflow-hidden shadow-xs hover:shadow-[0_0_30px_rgba(255,23,56,0.25)] transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    {/* Top Image Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-[#050505]">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/30 to-transparent" />

                      {/* Top Floating Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                        <span
                          className={`text-[10.5px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-md backdrop-blur-md border ${
                            event.category === 'Technical'
                              ? 'bg-[#C1121F]/90 border-[#FF1738]/40'
                              : 'bg-[#0A0A0E]/90 text-[#FF1738] border-[#C1121F]/60'
                          }`}
                        >
                          {event.category}
                        </span>

                        <span className="text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#050505]/90 backdrop-blur-md text-white border border-[#C1121F]/40 shadow-md">
                          {event.isTeamEvent
                            ? `${event.minTeamSize}-${event.maxTeamSize} Members`
                            : 'Solo Event'}
                        </span>
                      </div>

                      {/* Title on Banner Overlay */}
                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <h3 className="text-lg sm:text-xl font-serif font-bold leading-tight group-hover:text-[#FF1738] transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[#FF1738] line-clamp-1">
                          {event.tagline || 'National Level Symposium Arena'}
                        </p>
                        <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed font-normal">
                          {event.description}
                        </p>
                      </div>

                      {/* Meta Details: Time & Venue */}
                      <div className="space-y-2 pt-3 border-t border-[#C1121F]/20 text-xs text-[#9CA3AF]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#FF1738] shrink-0" />
                          <span className="font-medium text-white/90">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C1121F] shrink-0" />
                          <span className="truncate font-medium text-white/90">{event.venue}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventModal(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#050505] hover:bg-[#15151D] text-white text-xs font-bold border border-[#C1121F]/40 transition-colors cursor-pointer text-center"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectEvent(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C1121F] to-[#FF1738] hover:brightness-110 text-white text-xs font-black shadow-md shadow-[#FF1738]/25 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>Register</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
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
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1738] bg-[#0D0D12] px-3 py-1 rounded-full border border-[#C1121F]/30 shadow-[0_0_12px_rgba(255,23,56,0.15)]">
                    ABOUT RADIANZA '26 &amp; SPIHER
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
                    More Than Just a Symposium
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-medium">
                    RADIANZA '26 is an institution-wide celebration of curiosity, engineering excellence, and interdisciplinary innovation. Bringing together over 500 delegates from engineering universities across India, faculty mentors, and technical visionaries.
                  </p>

                  <div className="space-y-2 pt-1 text-xs text-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF1738] shrink-0" />
                      <span>NAAC 'A' Grade Accredited Deemed to be University</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF1738] shrink-0" />
                      <span>UGC &amp; AICTE Approved Premier Technical Institution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF1738] shrink-0" />
                      <span>Cryptographically secured digital entry pass &amp; QR verification engine</span>
                    </div>
                  </div>

                  <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#0D0D12] border border-[#C1121F]/25 shadow-xs">
                      <span className="text-2xl font-serif font-bold text-[#FF1738]">500+</span>
                      <p className="text-xs text-[#9CA3AF] font-medium">Delegates Competing</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0D0D12] border border-[#C1121F]/25 shadow-xs">
                      <span className="text-2xl font-serif font-bold text-white">12+</span>
                      <p className="text-xs text-[#9CA3AF] font-medium">Technical Tracks</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0D0D12] border border-[#C1121F]/25 shadow-xs col-span-2 sm:col-span-1">
                      <span className="text-2xl font-serif font-bold text-[#FF1738]">₹50K+</span>
                      <p className="text-xs text-[#9CA3AF] font-medium">Prize Pool</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C1121F]/40 aspect-[4/3]">
                    <img
                      src="/spiher-hero-building.png"
                      alt="St. Peter's Institute Main Campus Building"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-mono font-bold uppercase text-[#FF1738]">Host Institution</p>
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
              <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#050505] via-[#100508] to-[#050505] text-white relative overflow-hidden">
                {/* Red ambient glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C1121F]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#FF1738]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D0D12] border border-[#C1121F]/40 backdrop-blur-md shadow-[0_0_15px_rgba(255,23,56,0.15)]">
                    <Flame className="w-4 h-4 text-[#FF1738]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF1738]">
                      REGISTRATIONS ARE LIVE
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
                    Be a Part of RADIANZA <span className="text-[#FF1738]">'26</span>
                  </h2>

                  <p className="text-xs sm:text-base text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
                    Secure your registration today. Pick your competition track, build your team, and download your cryptographically verified entry pass.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                    <div className="p-4 rounded-2xl bg-[#0D0D12]/80 border border-[#C1121F]/30 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FF1738]">
                        {totalRegisteredCount}+
                      </span>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 uppercase font-mono">Delegates</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0D0D12]/80 border border-[#C1121F]/30 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                        {totalSlotsLeft}
                      </span>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 uppercase font-mono">Slots Left</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0D0D12]/80 border border-[#C1121F]/30 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                        45+
                      </span>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 uppercase font-mono">Institutions</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0D0D12]/80 border border-[#C1121F]/30 backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FF1738]">
                        ₹50,000+
                      </span>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 uppercase font-mono">Cash Awards</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <div className="relative group w-full sm:w-auto">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#C1121F] to-[#FF1738] opacity-75 blur-md animate-halo-pulse" />
                      <button
                        type="button"
                        onClick={onStartNewRegistration}
                        className="relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#C1121F] via-[#E61430] to-[#FF1738] hover:brightness-110 text-white font-black text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPassModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0D0D12] hover:bg-[#15151D] border border-[#C1121F]/50 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <QrCode className="w-4 h-4 text-[#FF1738]" />
                      <span>Already Registered? View Pass</span>
                    </button>
                  </div>
                </div>
              </section>

              <footer className="w-full bg-[#050505] text-[#9CA3AF] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C1121F]/25">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center gap-2.5 text-white">
                      <CollegeEmblem size={32} />
                      <span className="font-serif text-xl font-bold tracking-tight">
                        RADIANZA <span className="text-[#FF1738]">'26</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
                      Igniting Ideas, Innovating Tomorrow. National-Level Technical &amp; Non-Technical Symposium hosted by St. Peter's Institute of Higher Education &amp; Research.
                    </p>
                    <div className="pt-2 text-xs text-[#9CA3AF]/80 space-y-1">
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
                            activePage === p.id ? 'text-[#FF1738] font-bold' : 'hover:text-white'
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Staff &amp; Administration</h4>
                    <p className="text-xs text-[#9CA3AF]">
                      Coordinators, evaluators, and jury can access the mobile scanner and evaluator portal below.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onOpenConsole}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D0D12] hover:bg-[#15151D] border border-[#C1121F]/40 text-xs text-[#FF1738] transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Staff &amp; Evaluator Console →</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-[#C1121F]/15 text-center text-xs text-[#9CA3AF]/50">
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
      <nav className="w-full bg-[#050505]/95 backdrop-blur-lg border-t border-[#C1121F]/30 px-4 sm:px-8 py-3 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Page Button */}
          {prevPage ? (
            <button
              type="button"
              onClick={() => navigateToPage(prevPage.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D0D12] hover:bg-[#15151D] text-white border border-[#C1121F]/30 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF1738]" />
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
                      ? 'w-7 sm:w-8 h-2.5 bg-[#FF1738] shadow-[0_0_12px_rgba(255,23,56,0.6)]'
                      : 'w-2.5 h-2.5 bg-[#0D0D12] border border-[#C1121F]/40 hover:bg-[#C1121F]/50'
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C1121F] to-[#FF1738] hover:brightness-110 text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span className="hidden sm:inline">Next:</span>
              <span>{nextPage.navLabel}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-[#C1121F]/40 text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#FF1738]" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#0D0D12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(5,5,5,0.95),0_0_30px_rgba(255,23,56,0.2)] border border-[#C1121F]/40 overflow-hidden flex flex-col max-h-[90vh] text-white"
            >
              <div className="relative h-40 w-full overflow-hidden bg-[#050505]">
                <img
                  src={selectedEventModal.imageUrl}
                  alt={selectedEventModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#050505]/80 text-white flex items-center justify-center hover:text-[#FF1738] transition-colors cursor-pointer border border-[#C1121F]/40"
                >
                  ✕
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C1121F] text-white mr-2 border border-[#FF1738]/40">
                    {selectedEventModal.category}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">{selectedEventModal.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <h4 className="font-bold text-[#FF1738] uppercase tracking-wider text-[11px] mb-1 font-mono">
                    About the Event
                  </h4>
                  <p className="text-[#9CA3AF] leading-relaxed">{selectedEventModal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#050505] border border-[#C1121F]/30">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9CA3AF]/60 block font-mono">Venue</span>
                    <span className="font-bold text-white">{selectedEventModal.venue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9CA3AF]/60 block font-mono">Time</span>
                    <span className="font-bold text-[#FF1738]">{selectedEventModal.time}</span>
                  </div>
                </div>

                {selectedEventModal.rules && (
                  <div>
                    <h4 className="font-bold text-[#FF1738] uppercase tracking-wider text-[11px] mb-2 font-mono">
                      Rules &amp; Guidelines
                    </h4>
                    <ul className="space-y-1.5 text-[#9CA3AF]">
                      {selectedEventModal.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#FF1738] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#050505] border-t border-[#C1121F]/30 flex items-center justify-between">
                <span className="text-xs font-bold text-[#9CA3AF]">
                  {selectedEventModal.isTeamEvent ? 'Team Participation' : 'Solo Registration'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const evt = selectedEventModal;
                    setSelectedEventModal(null);
                    onSelectEvent(evt);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C1121F] to-[#FF1738] hover:brightness-110 text-white font-black text-xs shadow-md shadow-[#FF1738]/30 cursor-pointer hover:scale-105 transition-all"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-3xl bg-[#0D0D12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(5,5,5,0.95),0_0_30px_rgba(255,23,56,0.25)] border border-[#C1121F]/40 overflow-hidden flex flex-col"
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
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#050505]/80 border border-[#C1121F]/40 text-white hover:text-[#FF1738] flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <span className="absolute top-4 left-4 text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#050505]/90 text-[#FF1738] border border-[#C1121F]/50">
                  {selectedGalleryModal.category}
                </span>
              </div>
              <div className="p-6 text-white space-y-2">
                <h3 className="text-xl font-bold font-serif">{selectedGalleryModal.title}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{selectedGalleryModal.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Pass Access Modal (Spider-Man Dark Theme) */}
      <AnimatePresence>
        {isPassModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Dimmed Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsPassModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Radiant Dark Superhero Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="relative z-10 w-full max-w-md bg-[#0D0D12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(5,5,5,0.95),0_0_30px_rgba(255,23,56,0.25)] border border-[#C1121F]/40 overflow-hidden text-white"
            >
              {/* Top Laser Crimson Gradient Accent Line */}
              <div className="h-1 w-full bg-gradient-to-r from-[#050505] via-[#FF1738] to-[#C1121F]" />

              <div className="p-6 sm:p-7 space-y-5">
                {/* Header Lockup */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#050505] border border-[#C1121F]/50 text-[#FF1738] flex items-center justify-center shadow-[0_0_15px_rgba(255,23,56,0.3)] shrink-0">
                      <QrCode className="w-5 h-5 text-[#FF1738]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-lg sm:text-xl text-white tracking-tight">
                        Access Event Pass
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        Enter your credentials to view your QR pass.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPassModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-[#050505] border border-[#C1121F]/40 text-[#9CA3AF] hover:text-[#FF1738] hover:border-[#FF1738] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Error Banner */}
                {accessError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 shadow-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span className="leading-snug">{accessError}</span>
                  </motion.div>
                )}

                {/* Input Form */}
                <form onSubmit={handlePassLookupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="access-roll-number"
                      className="block text-[11px] font-bold text-[#E5E7EB] uppercase font-mono tracking-wider flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#FF1738]" />
                      <span>Roll Number / Register Number</span>
                      <span className="text-[#FF1738]">*</span>
                    </label>
                    <input
                      id="access-roll-number"
                      name="accessRollNumber"
                      type="text"
                      autoComplete="off"
                      required
                      value={accessRollNumber}
                      onChange={(e) => setAccessRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 2021CS042"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#C1121F]/40 text-xs sm:text-sm font-mono font-bold text-white placeholder:text-[#9CA3AF]/40 focus:outline-none focus:border-[#FF1738] focus:ring-2 focus:ring-[#FF1738]/20 transition-all shadow-inner uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <CustomDatePicker
                      id="access-dob"
                      name="accessDob"
                      value={accessDob}
                      onChange={setAccessDob}
                      label="Date of Birth"
                      placeholder="Select Date of Birth"
                      required
                      variant="dark"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingPass}
                    className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#C1121F] via-[#E61430] to-[#FF1738] hover:brightness-110 active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#FF1738]/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isVerifyingPass ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Open My Pass</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Autofill Helper Chip */}
                <div className="pt-3 border-t border-[#C1121F]/20 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-[#9CA3AF] font-medium">Demo user:</span>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('2021CS042', '2003-05-14')}
                    className="px-3 py-1.5 rounded-xl bg-[#050505] border border-[#C1121F]/40 hover:border-[#FF1738] hover:bg-[#FF1738]/10 text-[#FF1738] font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <span>⚡ Autofill 2021CS042</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadianzaLandingPage;
