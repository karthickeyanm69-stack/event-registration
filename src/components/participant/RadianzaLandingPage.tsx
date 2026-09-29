import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Award,
  Zap,
  Radio,
  Layers,
} from 'lucide-react';
import { CollegeEvent, EventCategory, Participant, Registration } from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEmblem, SpiherStarburstLogo } from '../common/CollegeLogo';
import { SpiderMilesMultiverseHero } from './SpiderMilesMultiverseHero';
import { CyberWebBackground } from '../common/CyberWebBackground';
import { FlyingSpidersCanvas } from '../common/FlyingSpidersCanvas';
import { CustomDatePicker } from '../common/CustomDatePicker';

export type LandingPageId = 'home' | 'events' | 'about' | 'contact';

interface PageMeta {
  id: LandingPageId;
  title: string;
  navLabel: string;
  badge: string;
}

const PAGES: PageMeta[] = [
  { id: 'home', title: 'RADIANZA ’26 — Multiverse Portal', navLabel: 'Portal', badge: 'EARTH-1610' },
  { id: 'events', title: 'Arena Competition Matrix', navLabel: 'Event Matrix', badge: 'ARENA' },
  { id: 'about', title: 'About SPIHER & Legacy', navLabel: 'About SPIHER', badge: 'MAINFRAME' },
  { id: 'contact', title: 'Multiverse Pass & Gateway', navLabel: 'Contact & Portals', badge: 'CONNECT' },
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
  onReplayCinematic?: () => void;
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
    topic: 'Autonomous Multi-Agent Swarm Architectures',
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
    tag: 'Quantum Researcher',
    socials: { linkedin: '#', web: '#' },
  },
];

// ── Gallery Data ──
interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Multiverse Grand Launch',
    category: 'Keynote & Launch',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    caption: 'Dignitaries and keynote delegates igniting the ceremonial laser lamp at the RADIANZA inaugural stage.',
  },
  {
    id: 'gal-2',
    title: '24-Hour CodeSprint Hackathon',
    category: 'Technical Arena',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    caption: 'Over 80 elite teams racing against the clock building production-grade autonomous agent systems.',
  },
  {
    id: 'gal-3',
    title: 'RoboWars Battleground',
    category: 'Hardware Arena',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    caption: 'Combat bots colliding in a high-torque enclosed titanium battle arena.',
  },
  {
    id: 'gal-4',
    title: 'AI Arena & Neural Benchmarks',
    category: 'AI & Data Science',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    caption: 'Data scientists deploying deep neural classifiers with microsecond latency constraints.',
  },
  {
    id: 'gal-5',
    title: 'eSports Championship Finals',
    category: 'Gaming Arena',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    caption: 'Electrifying crowd cheering during the Valorant & BGMI championship finals.',
  },
  {
    id: 'gal-6',
    title: 'Valedictory & Prize Distribution',
    category: 'Grand Ceremony',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    caption: 'Champions crowned with overall rolling institutional trophies and cash rewards.',
  },
];

// ── FAQs Data ──
const FAQS_DATA = [
  {
    q: 'Who is eligible to participate in RADIANZA ’26?',
    a: 'Any bonafide undergraduate or postgraduate student currently enrolled in an engineering, arts, science, or technology institution with a valid college ID card is eligible.',
  },
  {
    q: 'Can I register for multiple events across different tracks?',
    a: 'Yes! You can register for up to 3 events per day, as long as their scheduled arena timings do not directly overlap.',
  },
  {
    q: 'How do I access and verify my Digital QR Entry Pass?',
    a: 'Once your registration is complete, your cryptographically signed QR Pass will be generated instantly. You can access it anytime using the "Access Pass" portal with your Roll Number and Date of Birth.',
  },
  {
    q: 'Are spot registrations allowed at the campus venue?',
    a: 'Spot registrations are strictly subject to remaining slot availability. We strongly recommend registering online to guarantee your participation and secure early-bird delegate kits.',
  },
  {
    q: 'Is accommodation provided for outstation participants?',
    a: 'Yes, hostel accommodation is available on campus on a first-come, first-served basis for delegates travelling from outside Coimbatore.',
  },
];

export const RadianzaLandingPage: React.FC<RadianzaLandingPageProps> = ({
  isRevealed = true,
  events,
  activeLandingPage = 'home',
  onNavigateLandingPage,
  onStartNewRegistration,
  onSelectEvent,
  onSuccessfulAccess,
  onOpenConsole,
  onReplayCinematic,
}) => {
  const [activePage, setActivePage] = useState<LandingPageId>(activeLandingPage);
  const [pageDirection, setPageDirection] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<CollegeEvent | null>(null);
  const [selectedGalleryModal, setSelectedGalleryModal] = useState<GalleryItem | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'Non-Technical'>('All');

  // Digital Pass Lookup State
  const [accessRollNumber, setAccessRollNumber] = useState('');
  const [accessDob, setAccessDob] = useState('');
  const [isVerifyingPass, setIsVerifyingPass] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Countdown timer state (Target: October 15, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 228, hours: 14, mins: 32, secs: 45 });

  useEffect(() => {
    const targetDate = new Date('2026-10-15T09:00:00+05:30').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Stats calculation
  const totalSlotsLeft = events.reduce((acc, curr) => acc + (curr.slotsLeft || 0), 0);
  const totalRegisteredCount = 1850;

  // Horizontal Scroll Carousel refs
  const speakersScrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollSpeakersLeft, setCanScrollSpeakersLeft] = useState(false);
  const [canScrollSpeakersRight, setCanScrollSpeakersRight] = useState(true);
  const [canScrollGalleryLeft, setCanScrollGalleryLeft] = useState(false);
  const [canScrollGalleryRight, setCanScrollGalleryRight] = useState(true);

  // Sync external page prop
  useEffect(() => {
    if (activeLandingPage && activeLandingPage !== activePage) {
      setActivePage(activeLandingPage);
    }
  }, [activeLandingPage]);

  const navigateToPage = (newPage: LandingPageId) => {
    const pagesOrder: LandingPageId[] = ['home', 'events', 'about', 'contact'];
    const currentIdx = pagesOrder.indexOf(activePage);
    const newIdx = pagesOrder.indexOf(newPage);
    setPageDirection(newIdx > currentIdx ? 1 : -1);
    setActivePage(newPage);
    setIsMobileMenuOpen(false);
    if (onNavigateLandingPage) {
      onNavigateLandingPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const checkSpeakersScroll = () => {
    if (!speakersScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = speakersScrollRef.current;
    setCanScrollSpeakersLeft(scrollLeft > 10);
    setCanScrollSpeakersRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleSpeakersScroll = (dir: 'left' | 'right') => {
    if (!speakersScrollRef.current) return;
    const amount = 340;
    speakersScrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const checkGalleryScroll = () => {
    if (!galleryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
    setCanScrollGalleryLeft(scrollLeft > 10);
    setCanScrollGalleryRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleGalleryScroll = (dir: 'left' | 'right') => {
    if (!galleryScrollRef.current) return;
    const amount = 380;
    galleryScrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Pass lookup handler
  const handlePassLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessError(null);
    if (!accessRollNumber.trim() || !accessDob.trim()) {
      setAccessError('Please enter both your Roll Number and Date of Birth.');
      return;
    }
    setIsVerifyingPass(true);
    try {
      const result = MockDatabaseService.verifyParticipantAccess(
        accessRollNumber.trim().toUpperCase(),
        accessDob.trim()
      );
      if (result.success && result.participant) {
        setIsPassModalOpen(false);
        onSuccessfulAccess(result.participant, result.registration);
      } else {
        setAccessError(result.error || 'No registered participant found with these credentials.');
      }
    } catch {
      setAccessError('Authentication service temporarily unavailable. Please try again.');
    } finally {
      setIsVerifyingPass(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (activeCategory === 'All') return true;
    return e.category === activeCategory;
  });

  const pageTransitionVariants: any = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      transition: { duration: 0.25, ease: 'easeIn' },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-[#080006] text-white flex flex-col font-sans selection:bg-[#C40030] selection:text-white relative overflow-x-hidden">
      {/* Dynamic Spider-Verse Ambient Particles & Background Mesh */}
      <CyberWebBackground />
      <FlyingSpidersCanvas count={24} />

      {/* ── 1. GLOBAL STICKY DIMENSIONAL WEB HUD HEADER ── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full bg-[#080006]/85 backdrop-blur-xl border-b border-[#C40030]/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo & Dimensional Emblem */}
          <div
            onClick={() => navigateToPage('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative">
              <CollegeEmblem size={34} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(196,0,48,0.6)]" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C40030] animate-ping" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-['Impact',sans-serif] text-2xl sm:text-3xl tracking-tight text-white uppercase group-hover:text-[#FF287D] transition-colors drop-shadow-[0_0_15px_rgba(196,0,48,0.5)]">
                  RADIANZA <span className="text-[#C40030] animate-spider-glitch">’26</span>
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#F07030] font-bold uppercase hidden sm:block">
                SPIHER • DEPT. OF INFORMATION TECHNOLOGY
              </span>
            </div>
          </div>

          {/* Web-Themed Dimensional Navigation Bar: ABOUT | EVENTS | REGISTER */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 web-nav-pill rounded-full border border-[#C40030]/40">
            <button
              onClick={() => navigateToPage('about')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePage === 'about'
                  ? 'bg-gradient-to-r from-[#C40030] to-[#E00070] text-white shadow-[0_0_12px_rgba(196,0,48,0.6)]'
                  : 'text-[#E2D5DE] hover:text-white hover:bg-white/5'
              }`}
            >
              ABOUT
            </button>
            <span className="text-[#C40030]/50 text-xs select-none">|</span>
            <button
              onClick={() => navigateToPage('events')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePage === 'events'
                  ? 'bg-gradient-to-r from-[#C40030] to-[#E00070] text-white shadow-[0_0_12px_rgba(196,0,48,0.6)]'
                  : 'text-[#E2D5DE] hover:text-white hover:bg-white/5'
              }`}
            >
              EVENTS
            </button>
            <span className="text-[#C40030]/50 text-xs select-none">|</span>
            <button
              onClick={onStartNewRegistration}
              className="px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#FF287D] hover:text-white hover:bg-[#C40030]/20 transition-all cursor-pointer"
            >
              REGISTER
            </button>
          </nav>

          {/* Right Header Actions: Cinematic Intro + Access Pass + Strong START JOURNEY Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cinematic Intro Button */}
            {onReplayCinematic && (
              <button
                type="button"
                onClick={onReplayCinematic}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a041c] hover:bg-[#2e0533] text-[#FF287D] border border-[#FF287D]/40 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md active:scale-95 hover:border-[#FF287D]"
                title="Watch Dimensional Cinematic Video Intro"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600] animate-pulse" />
                <span>CINEMATIC INTRO</span>
              </button>
            )}

            {/* Access Pass Button */}
            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a041c] hover:bg-[#260728] text-[#E2D5DE] border border-[#C40030]/40 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md active:scale-95 hover:border-[#E00070]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF287D]" />
              <span>ACCESS PASS</span>
            </button>

            {/* Strong START JOURNEY CTA Button */}
            <button
              type="button"
              onClick={onStartNewRegistration}
              className="relative px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C40030] via-[#E00070] to-[#F04A20] hover:brightness-110 text-white text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_20px_rgba(196,0,48,0.5)] transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5 sm:gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>START JOURNEY</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl border border-[#C40030]/40 flex flex-col items-center justify-center gap-[5px] p-2 bg-[#1a041c] transition-all cursor-pointer active:scale-95 shadow-md"
              aria-label="Open Navigation Menu"
            >
              <span className="w-5 h-[2px] bg-[#C40030] rounded-full block" />
              <span className="w-5 h-[2px] bg-[#E00070] rounded-full block" />
              <span className="w-5 h-[2px] bg-[#F07030] rounded-full block" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Slide-Over Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative z-10 w-[85%] max-w-[320px] h-full bg-[#090714] border-l border-[#FF1E42]/40 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto text-white"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <CollegeEmblem size={28} />
                    <span className="font-['Impact',sans-serif] text-xl text-white">
                      RADIANZA <span className="text-[#FF1E42]">'26</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-[#FF1E42]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 py-6">
                  {PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => navigateToPage(page.id)}
                      className={`text-left px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-between ${
                        activePage === page.id
                          ? 'bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white shadow-lg shadow-[#FF1E42]/30'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{page.navLabel}</span>
                      <span className="text-[10px] opacity-75 font-mono">{page.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartNewRegistration();
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] text-white font-mono font-black text-xs tracking-wider uppercase shadow-lg shadow-[#FF1E42]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPassModalOpen(true);
                  }}
                  className="w-full py-2.5 text-center text-xs font-mono font-bold text-[#FF6B00] hover:underline"
                >
                  Access Existing Pass →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 2. MULTI-PAGE ANIMATED ROUTER ── */}
      <main className="flex-1 w-full relative overflow-hidden">
        <AnimatePresence mode="wait" custom={pageDirection}>
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 1: HOME (SPIDER-VERSE MULTIVERSE PORTAL HERO & MATRIX)         */}
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
              {/* ── 1. HERO SECTION (SPIDER-MAN MILES MORALES MULTIVERSE PORTAL) ── */}
              <section id="hero" className="relative w-full overflow-hidden bg-spider-mesh text-white select-none border-b border-[#FF1E42]/20">
                <div aria-hidden="true" className="absolute inset-0 bg-spider-grid opacity-25 pointer-events-none" />

                {/* Center Atmospheric Dimension Glow */}
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#FF1E42]/20 via-[#FF6B00]/15 to-[#E000FF]/15 rounded-full blur-3xl pointer-events-none z-0"
                />

                {/* Giant Multiverse Backdrop Watermark: "RADIANZA'26" */}
                <div
                  aria-hidden="true"
                  className="absolute top-[6%] sm:top-[4%] left-1/2 -translate-x-1/2 z-0 pointer-events-none text-center w-full overflow-hidden"
                >
                  <h2 className="font-['Impact',sans-serif] font-black text-5xl sm:text-7xl md:text-[10rem] lg:text-[13rem] leading-none uppercase tracking-tighter spider-title-stroke select-none whitespace-nowrap opacity-25">
                    RADIANZA'26
                  </h2>
                </div>

                {/* ─── DESKTOP VIEW (>= lg): 12-Column Multiverse Matrix ─── */}
                <div className="hidden lg:flex min-h-[calc(100vh-5rem)] items-center justify-center py-12 relative z-20">
                  <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-12 gap-10 items-center">
                    {/* Left Column: Wording & Futuristic Dimension HUD */}
                    <div className="col-span-6 space-y-6 text-left flex flex-col items-start z-20">
                      {/* Dimension & Institution Pill */}
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1a041c]/90 border border-[#C40030]/40 text-white text-xs font-mono tracking-wider uppercase shadow-[0_0_15px_rgba(196,0,48,0.25)] backdrop-blur-md"
                      >
                        <CollegeEmblem size={22} />
                        <span className="font-bold text-[#E00070]">SPIHER</span>
                        <span className="text-[#A38FA0]">•</span>
                        <span className="font-semibold text-[#E2D5DE]">DEPARTMENT OF INFORMATION TECHNOLOGY</span>
                      </motion.div>

                      {/* Main Headline */}
                      <div className="space-y-3">
                        <motion.h1
                          initial={{ opacity: 0, x: -35 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -35 }}
                          transition={{ duration: 0.65, delay: 0.15 }}
                          className="text-6xl xl:text-7xl 2xl:text-8xl font-['Impact',sans-serif] font-black tracking-tight text-white leading-[0.95] drop-shadow-[0_0_30px_rgba(196,0,48,0.4)] uppercase"
                        >
                          RADIANZA
                          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C40030] via-[#E00070] to-[#F07030] mt-1">
                            ’26
                          </span>
                        </motion.h1>

                        <motion.div
                          initial={{ opacity: 0, x: -25 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
                          transition={{ duration: 0.6, delay: 0.25 }}
                          className="flex items-center gap-3 pt-1"
                        >
                          <span className="text-xs sm:text-sm font-mono font-black tracking-[0.28em] text-[#FF287D] uppercase">
                            TECHNICAL SYMPOSIUM
                          </span>
                          <span className="w-14 h-[2px] bg-gradient-to-r from-[#C40030] to-[#F07030] block shadow-[0_0_10px_#C40030]" />
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, x: -18 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                          transition={{ duration: 0.6, delay: 0.35 }}
                          className="text-lg sm:text-xl text-[#E2D5DE] font-bold tracking-wide uppercase font-mono"
                        >
                          "IGNITING IDEAS. INNOVATING TOMORROW."
                        </motion.p>
                      </div>

                      {/* Date & Location Chips */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono font-semibold"
                      >
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1a041c]/90 backdrop-blur-md border border-[#C40030]/30 shadow-md">
                          <Calendar className="w-4 h-4 text-[#C40030]" />
                          <span className="font-bold text-white">15 - 16 OCT 2026</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1a041c]/90 backdrop-blur-md border border-[#F07030]/30 shadow-md">
                          <MapPin className="w-4 h-4 text-[#F07030]" />
                          <span className="text-[#E2D5DE]">SPIHER Campus, Avadi, Chennai</span>
                        </div>
                      </motion.div>

                      {/* Multiverse Countdown Matrix */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex items-center gap-2.5 pt-1"
                      >
                        {[
                          { label: 'DAYS', val: timeLeft.days },
                          { label: 'HRS', val: timeLeft.hours },
                          { label: 'MIN', val: timeLeft.mins },
                          { label: 'SEC', val: timeLeft.secs },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="px-3.5 py-2 rounded-xl bg-[#1a041c]/90 border border-[#C40030]/20 text-center min-w-[62px]"
                          >
                            <span className="text-lg font-mono font-black text-white block leading-none">
                              {String(item.val).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] font-mono text-[#F07030] font-bold uppercase tracking-wider">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </motion.div>

                      {/* Action CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex flex-row items-center gap-4 pt-2"
                      >
                        <button
                          type="button"
                          onClick={onStartNewRegistration}
                          className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C40030] via-[#E00070] to-[#F04A20] hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(196,0,48,0.5)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          <span>START JOURNEY</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigateToPage('events')}
                          className="px-6 py-4 rounded-2xl bg-[#1a041c] hover:bg-[#260728] border border-[#C40030]/40 text-[#E2D5DE] font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 hover:border-[#E00070]"
                        >
                          <span>EXPLORE EVENTS</span>
                          <ChevronRight className="w-4 h-4 text-[#F07030]" />
                        </button>
                      </motion.div>
                    </div>

                    {/* Right Column: Spider Miles Multiverse 3D Portal Asset */}
                    <div className="col-span-6 flex items-center justify-center relative w-full overflow-visible">
                      <SpiderMilesMultiverseHero
                        isRevealed={isRevealed}
                        onRegisterClick={onStartNewRegistration}
                      />
                    </div>
                  </div>
                </div>

                {/* ─── MOBILE VIEW (< lg): Clean, Balanced Multiverse Portal ─── */}
                <div className="lg:hidden relative w-full min-h-[calc(100dvh-4.5rem)] flex flex-col justify-start p-4 sm:p-6 pb-10 select-none overflow-hidden z-20 space-y-5">
                  {/* Top Mobile Brand & Title Header */}
                  <div className="space-y-2 text-center pt-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a041c] border border-[#C40030]/40 text-xs font-mono font-bold text-[#F07030]">
                      <CollegeEmblem size={18} />
                      <span>SPIHER • DEPT. OF IT</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-['Impact',sans-serif] font-black tracking-tight text-white leading-none uppercase">
                      RADIANZA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C40030] to-[#E00070]">’26</span>
                    </h1>

                    <p className="text-xs text-[#E2D5DE]/90 font-bold uppercase font-mono tracking-wide">
                      TECHNICAL SYMPOSIUM • 15-16 OCT 2026
                    </p>
                  </div>

                  {/* Miles Morales 3D Portal Centerpiece */}
                  <div className="w-full max-w-sm mx-auto">
                    <SpiderMilesMultiverseHero
                      isRevealed={isRevealed}
                      onRegisterClick={onStartNewRegistration}
                    />
                  </div>

                  {/* Mobile Countdown & Action Controls */}
                  <div className="space-y-3.5 max-w-sm mx-auto w-full pt-1">
                    {/* Countdown Matrix */}
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { label: 'DAYS', val: timeLeft.days },
                        { label: 'HRS', val: timeLeft.hours },
                        { label: 'MIN', val: timeLeft.mins },
                        { label: 'SEC', val: timeLeft.secs },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 rounded-xl bg-[#1a041c]/90 border border-[#C40030]/30 text-center flex-1"
                        >
                          <span className="text-base font-mono font-black text-white block leading-none">
                            {String(item.val).padStart(2, '0')}
                          </span>
                          <span className="text-[8px] font-mono text-[#F07030] font-bold uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-stone-300 bg-[#1a041c]/60 py-1.5 px-3 rounded-xl border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-[#F07030]" />
                      <span>SPIHER Campus, Avadi, Chennai</span>
                    </div>

                    {/* Unified Mobile Action Buttons */}
                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        onClick={onStartNewRegistration}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C40030] via-[#E00070] to-[#F04A20] text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(196,0,48,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>START JOURNEY</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToPage('events')}
                        className="w-full py-2.5 rounded-2xl bg-[#1a041c] hover:bg-[#260728] border border-[#C40030]/40 text-[#E2D5DE] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>EXPLORE EVENTS MATRIX</span>
                        <ChevronRight className="w-4 h-4 text-[#F07030]" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 2. MULTIVERSE STATS & HIGHLIGHTS RIBBON ── */}
              <section id="highlights" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#090714] border-t border-[#FF1E42]/20 relative">
                <div className="relative max-w-7xl mx-auto space-y-12">
                  {/* Section Title */}
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1E42] bg-[#FF1E42]/10 px-3.5 py-1 rounded-full border border-[#FF1E42]/30">
                      MULTIVERSE ARENAS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-['Impact',sans-serif] tracking-tight text-white uppercase drop-shadow-[0_0_15px_rgba(255,30,66,0.3)]">
                      WHY ENTER RADIANZA '26?
                    </h2>
                    <p className="text-sm text-stone-400 leading-relaxed">
                      A high-octane battleground of algorithms, robotics, and creative problem solving crafted by the Department of Information Technology.
                    </p>
                  </div>

                  {/* Feature Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Code2,
                        title: 'Technical Arenas',
                        desc: 'Intense algorithmic coding, AI agent benchmarks, web engineering, and blind debugging tracks.',
                        action: 'Technical',
                        tag: '6+ EVENTS',
                        color: '#FF1E42',
                      },
                      {
                        icon: Gamepad2,
                        title: 'Non-Technical Tracks',
                        desc: 'Technical debate, e-Sports arenas, UI/UX prototyping sprints, and creative technical quizzes.',
                        action: 'Non-Technical',
                        tag: '6+ ARENAS',
                        color: '#FF6B00',
                      },
                      {
                        icon: Trophy,
                        title: '₹1,50,000+ Prize Pool',
                        desc: 'Substantial cash prizes, rolling institution trophies, winner medals, and verified credentials.',
                        action: 'All',
                        tag: 'CASH REWARDS',
                        color: '#FFE600',
                      },
                      {
                        icon: Users,
                        title: 'Multiverse Networking',
                        desc: 'Connect directly with principal architects, hiring managers, professors, and 2,000+ delegates.',
                        action: 'All',
                        tag: '2000+ PEERS',
                        color: '#E000FF',
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => {
                          if (item.action === 'Technical' || item.action === 'Non-Technical') {
                            setActiveCategory(item.action);
                          }
                          navigateToPage('events');
                        }}
                        className="card-spider-verse p-6 rounded-3xl flex flex-col justify-between space-y-5 cursor-pointer group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div
                              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md"
                              style={{ color: item.color }}
                            >
                              <item.icon className="w-6 h-6" />
                            </div>
                            <span
                              className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-white/10 bg-black/50"
                              style={{ color: item.color }}
                            >
                              {item.tag}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#FF1E42] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#FF6B00] pt-2">
                          <span>EXPLORE TRACKS</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Campus Showcase Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-spider-verse rounded-3xl overflow-hidden p-0 border border-[#FF1E42]/30 shadow-xl"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                      <div className="lg:col-span-7 h-64 sm:h-80 relative overflow-hidden">
                        <img
                          src="/spiher-hero-building.png"
                          alt="SPIHER Campus"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#FF1E42] text-white">
                            HOST MAINFRAME
                          </span>
                          <h4 className="text-xl sm:text-2xl font-bold font-['Impact',sans-serif] mt-1">
                            ST. PETER'S INSTITUTE OF HIGHER EDUCATION &amp; RESEARCH
                          </h4>
                          <p className="text-xs text-stone-300">Deemed to be University • NAAC 'A' Grade Accredited</p>
                        </div>
                      </div>

                      <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-[#FF6B00] uppercase">
                            DEPARTMENT OF IT MAINFRAME
                          </span>
                          <h3 className="text-2xl font-bold text-white">
                            Fostering World-Class Engineering Talent
                          </h3>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          Equipped with state-of-the-art computing labs, dedicated robotics battlegrounds, high-speed fiber backbone, and distinguished faculty leadership.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-xl font-black text-[#FF1E42]">NAAC A</span>
                            <p className="text-[11px] text-stone-400">Accredited Campus</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-xl font-black text-[#FF6B00]">100%</span>
                            <p className="text-[11px] text-stone-400">Verified Pass Engine</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* ── 3. DISTINGUISHED SPEAKERS SECTION ── */}
              <section id="speakers" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#05050a] border-t border-[#FF1E42]/20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1E42] bg-[#FF1E42]/10 px-3.5 py-1 rounded-full border border-[#FF1E42]/30">
                        MULTIVERSE VISIONARIES
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-['Impact',sans-serif] tracking-tight text-white uppercase">
                        EMINENT KEYNOTE SPEAKERS
                      </h2>
                      <p className="text-sm text-stone-400">
                        Learn directly from researchers, tech executives, and startup founders shaping engineering frontiers.
                      </p>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FF6B00] bg-white/5 px-3 py-2 rounded-full border border-white/10 select-none">
                        <span>← Swipe / Scroll →</span>
                      </span>

                      <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => handleSpeakersScroll('left')}
                          disabled={!canScrollSpeakersLeft}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollSpeakersLeft
                              ? 'bg-[#110c20] text-white hover:bg-[#FF1E42] shadow-md border border-[#FF1E42]/40'
                              : 'bg-transparent text-stone-600 cursor-not-allowed border border-transparent'
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
                              ? 'bg-[#110c20] text-white hover:bg-[#FF1E42] shadow-md border border-[#FF1E42]/40'
                              : 'bg-transparent text-stone-600 cursor-not-allowed border border-transparent'
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
                      className="flex gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {SPEAKERS_DATA.map((speaker, idx) => (
                        <div
                          key={speaker.id}
                          className="w-[300px] sm:w-[340px] md:w-[360px] shrink-0 snap-start card-spider-verse p-6 rounded-3xl border border-[#FF1E42]/25 shadow-lg hover:border-[#FF1E42] transition-all duration-300 flex flex-col justify-between group select-none"
                        >
                          <div className="space-y-4">
                            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                              <img
                                src={speaker.imageUrl}
                                alt={speaker.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#090714] via-[#090714]/30 to-transparent pointer-events-none" />

                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/80 text-[#FF1E42] border border-[#FF1E42]/40 backdrop-blur-md">
                                  {speaker.tag}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                                  0{idx + 1}
                                </span>
                              </div>

                              <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                                <h3 className="text-lg font-bold leading-tight text-white">{speaker.name}</h3>
                                <p className="text-xs text-[#FF6B00] font-medium mt-0.5">{speaker.role}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                                {speaker.organization}
                              </span>
                              <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-[#FF1E42] transition-colors">
                                "{speaker.topic}"
                              </h4>
                              <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                                {speaker.bio}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                            <span className="text-[10px] font-mono font-bold text-[#FF6B00]">RADIANZA '26 GUEST</span>
                            <div className="flex items-center gap-2">
                              <Linkedin className="w-4 h-4 text-white/70 hover:text-[#FF1E42] hover:scale-110 transition-transform cursor-pointer" />
                              <Globe className="w-4 h-4 text-white/70 hover:text-[#FF1E42] hover:scale-110 transition-transform cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 4. MULTIVERSE MOMENTS & GALLERY ── */}
              <section id="gallery" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#090714] border-t border-[#FF1E42]/20 overflow-hidden relative">
                <div className="max-w-7xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1E42] bg-[#FF1E42]/10 px-3.5 py-1 rounded-full border border-[#FF1E42]/30">
                        DIMENSION PULSE
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-['Impact',sans-serif] tracking-tight text-white uppercase">
                        MOMENTS OF RADIANZA
                      </h2>
                      <p className="text-sm text-stone-400">
                        Relive the electric energy, intense hacking sprints, robotics warfare, and grand valedictory celebrations.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF6B00] bg-white/5 px-3 py-2 rounded-full border border-white/10 select-none">
                        <Camera className="w-3.5 h-3.5 text-[#FF1E42]" />
                        <span>Click card to enlarge</span>
                      </div>

                      <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => handleGalleryScroll('left')}
                          disabled={!canScrollGalleryLeft}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollGalleryLeft
                              ? 'bg-[#110c20] text-white hover:bg-[#FF1E42] border border-[#FF1E42]/40 shadow-md'
                              : 'bg-transparent text-stone-600 cursor-not-allowed border border-transparent'
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
                              ? 'bg-[#110c20] text-white hover:bg-[#FF1E42] border border-[#FF1E42]/40 shadow-md'
                              : 'bg-transparent text-stone-600 cursor-not-allowed border border-transparent'
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
                      className="flex gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {GALLERY_DATA.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedGalleryModal(item)}
                          className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start card-spider-verse rounded-3xl overflow-hidden border border-[#FF1E42]/25 shadow-lg group cursor-pointer aspect-[4/3] relative select-none hover:border-[#FF1E42] transition-all duration-300"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 pointer-events-none"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/30 to-transparent pointer-events-none" />
                          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-black/80 text-white border border-white/20 backdrop-blur-md">
                              {item.category}
                            </span>
                            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-3.5 left-4 right-4 text-white space-y-0.5 pointer-events-none">
                            <h4 className="text-sm font-bold">{item.title}</h4>
                            <p className="text-[11px] text-stone-300 line-clamp-1">{item.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 5. BOTTOM REGISTRATION CALLOUT ── */}
              <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-radianza-cta text-white relative overflow-hidden border-t border-[#FF1E42]/25">
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#110c20] border border-[#FF1E42]/40 shadow-lg">
                    <Flame className="w-4 h-4 text-[#FF1E42] animate-bounce" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6B00]">
                      MULTIVERSE PORTAL OPEN
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-['Impact',sans-serif] text-white tracking-tight uppercase drop-shadow-[0_0_20px_rgba(255,30,66,0.3)]">
                    BE A PART OF RADIANZA <span className="text-[#FF1E42]">'26</span>
                  </h2>

                  <p className="text-xs sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
                    Secure your registration today. Pick your competition track, build your team, and download your cryptographically verified entry pass.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                    <div className="p-4 rounded-2xl bg-[#110c20]/90 border border-white/10 shadow-lg backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-[#FF1E42]">
                        {totalRegisteredCount}+
                      </span>
                      <p className="text-[11px] text-stone-400 mt-1 uppercase font-mono">Delegates</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#110c20]/90 border border-white/10 shadow-lg backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                        {totalSlotsLeft}
                      </span>
                      <p className="text-[11px] text-stone-400 mt-1 uppercase font-mono">Slots Left</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#110c20]/90 border border-white/10 shadow-lg backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-[#FF6B00]">
                        50+
                      </span>
                      <p className="text-[11px] text-stone-400 mt-1 uppercase font-mono">Institutions</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#110c20]/90 border border-white/10 shadow-lg backdrop-blur-md">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-[#FFE600]">
                        ₹1,50,000+
                      </span>
                      <p className="text-[11px] text-stone-400 mt-1 uppercase font-mono">Cash Awards</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onStartNewRegistration}
                      className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] hover:brightness-110 text-white font-mono font-black text-sm uppercase tracking-wider shadow-xl shadow-[#FF1E42]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                    >
                      <span>ENTER ARENA NOW</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPassModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#110c20] hover:bg-[#1a1230] border border-[#FF1E42]/40 text-stone-200 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md"
                    >
                      <QrCode className="w-4 h-4 text-[#FF1E42]" />
                      <span>ACCESS EXISTING PASS</span>
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 2: EVENTS MATRIX                                               */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'events' && (
            <motion.div
              key="events"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
            >
              {/* Header Lockup */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#110c20] text-[#FF1E42] font-mono text-xs font-bold uppercase tracking-wider border border-[#FF1E42]/30">
                    <Trophy className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>MULTIVERSE COMPETITION MATRIX</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-['Impact',sans-serif] tracking-tight text-white uppercase drop-shadow-[0_0_15px_rgba(255,30,66,0.3)]">
                    FEATURED EVENTS MATRIX
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                    Choose your battleground. Select your preferred event to compete, innovate, and showcase your expertise at RADIANZA ’26.
                  </p>
                </div>

                {/* Filter Switcher */}
                <div className="flex items-center gap-1.5 p-1.5 bg-[#110c20] rounded-2xl border border-[#FF1E42]/30 shrink-0">
                  {(['All', 'Technical', 'Non-Technical'] as const).map((cat) => {
                    const count = cat === 'All' ? events.length : events.filter((e) => e.category === cat).length;
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] text-white shadow-lg shadow-[#FF1E42]/30'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <span>{cat === 'All' ? 'All Events' : `${cat}`}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            isActive ? 'bg-black/50 text-white' : 'bg-white/10 text-stone-300'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="card-spider-verse rounded-3xl overflow-hidden border border-[#FF1E42]/25 shadow-lg flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-black/60">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090714] via-[#090714]/30 to-transparent" />

                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-md ${
                            event.category === 'Technical' ? 'bg-[#FF1E42]' : 'bg-[#FF6B00]'
                          }`}
                        >
                          {event.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/80 text-white border border-white/20 backdrop-blur-md">
                          {event.isTeamEvent ? `${event.minTeamSize}-${event.maxTeamSize} Members` : 'Solo Event'}
                        </span>
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <h3 className="text-lg font-bold leading-tight drop-shadow-sm group-hover:text-[#FF1E42] transition-colors">{event.title}</h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-mono font-bold text-[#FF6B00]">{event.tagline || 'Technical Arena'}</p>
                        <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">{event.description}</p>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-stone-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#FF1E42]" />
                          <span className="font-medium text-white">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span className="font-medium text-white">{event.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-mono font-bold text-[#FFE600] bg-[#FFE600]/10 px-2.5 py-1 rounded-lg border border-[#FFE600]/30">
                          Entry Fee: ₹{event.price || 100}
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">
                          {event.slotsLeft} slots left
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventModal(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-mono font-bold border border-white/10 transition-colors cursor-pointer text-center"
                        >
                          Rules &amp; Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectEvent(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] hover:brightness-110 text-white text-xs font-mono font-bold shadow-md shadow-[#FF1E42]/30 transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95"
                        >
                          <span>Register (₹{event.price || 100})</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
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
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12"
            >
              <div className="card-spider-verse p-8 sm:p-12 rounded-3xl border border-[#FF1E42]/30 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-6 space-y-5 text-left">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1E42] bg-[#FF1E42]/10 px-3.5 py-1 rounded-full border border-[#FF1E42]/30">
                      ABOUT RADIANZA '26 &amp; SPIHER
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-['Impact',sans-serif] text-white uppercase">
                      MORE THAN JUST A SYMPOSIUM
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      RADIANZA '26 is an institution-wide celebration of curiosity, engineering excellence, and interdisciplinary innovation. Bringing together over 2,000 delegates from top engineering universities across India, faculty mentors, and technical visionaries.
                    </p>

                    <div className="space-y-2 pt-1 text-xs text-stone-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF1E42] shrink-0" />
                        <span>NAAC 'A' Grade Accredited Deemed to be University</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                        <span>UGC &amp; AICTE Approved Premier Technical Institution</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FFE600] shrink-0" />
                        <span>Cryptographically secured digital entry pass &amp; QR verification engine</span>
                      </div>
                    </div>

                    <div className="pt-3 grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <span className="text-2xl font-black text-[#FF1E42]">2000+</span>
                        <p className="text-[11px] text-stone-400 font-medium">Delegates</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <span className="text-2xl font-black text-[#FF6B00]">12+</span>
                        <p className="text-[11px] text-stone-400 font-medium">Tracks</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <span className="text-2xl font-black text-[#FFE600]">₹1.5L+</span>
                        <p className="text-[11px] text-stone-400 font-medium">Prize Pool</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#FF1E42]/30 shadow-lg aspect-video relative">
                    <img
                      src="/spiher-hero-building.png"
                      alt="SPIHER Main Building"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-xs font-mono font-bold text-[#FF6B00] uppercase">HELP &amp; GUIDELINES</span>
                  <h3 className="text-2xl font-['Impact',sans-serif] text-white uppercase">FREQUENTLY ASKED QUESTIONS</h3>
                </div>

                <div className="space-y-3 max-w-3xl mx-auto">
                  {FAQS_DATA.map((faq, idx) => (
                    <div
                      key={idx}
                      className="card-spider-verse rounded-2xl border border-white/10 p-5 cursor-pointer"
                      onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                        <ChevronRight
                          className={`w-4 h-4 text-[#FF1E42] transition-transform ${
                            openFaqIdx === idx ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      {openFaqIdx === idx && (
                        <p className="text-xs text-stone-300 mt-3 pt-3 border-t border-white/10 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 4: CONTACT & PORTALS                                           */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'contact' && (
            <motion.div
              key="contact"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#FF1E42] bg-[#FF1E42]/10 px-3.5 py-1 rounded-full border border-[#FF1E42]/30">
                  MULTIVERSE COORDINATES
                </span>
                <h2 className="text-3xl sm:text-4xl font-['Impact',sans-serif] tracking-tight text-white uppercase">
                  CONTACT &amp; PORTAL GATEWAY
                </h2>
                <p className="text-xs sm:text-sm text-stone-400">
                  Have questions regarding registration, event rules, or campus access? Reach out directly to our student and faculty coordinators.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-spider-verse p-6 rounded-3xl border border-white/10 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF1E42]/10 border border-[#FF1E42]/30 text-[#FF1E42] flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Symposium Venue</h4>
                  <p className="text-xs text-stone-300">
                    Department of Information Technology, St. Peter's Institute of Higher Education &amp; Research, Avadi, Chennai - 600054
                  </p>
                </div>

                <div className="card-spider-verse p-6 rounded-3xl border border-white/10 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Convenors &amp; Staff</h4>
                  <p className="text-xs text-stone-300">
                    Dr. S. K. Ramesh (HOD / IT)<br />
                    Prof. M. Priya (Staff Coordinator)<br />
                    radianza@spiher.ac.in
                  </p>
                </div>

                <div className="card-spider-verse p-6 rounded-3xl border border-white/10 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#E000FF]/10 border border-[#E000FF]/30 text-[#E000FF] flex items-center justify-center mx-auto">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Pass Verification</h4>
                  <p className="text-xs text-stone-300">
                    Lost your digital QR badge? Enter your Roll Number &amp; Date of Birth to re-download.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPassModalOpen(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#FF1E42]/20 text-[#FF1E42] border border-[#FF1E42]/40 text-xs font-mono font-bold hover:bg-[#FF1E42] hover:text-white transition-colors cursor-pointer"
                  >
                    Open Pass Lookup
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── 3. GLOBAL SPIDER-VERSE FOOTER ── */}
      <footer className="w-full bg-[#05050a] border-t border-[#FF1E42]/20 py-10 px-4 sm:px-6 lg:px-8 text-xs text-stone-400 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CollegeEmblem size={24} />
            <span className="font-['Impact',sans-serif] text-base text-white">
              RADIANZA <span className="text-[#FF1E42]">'26</span>
            </span>
            <span className="text-stone-500">• Department of Information Technology, SPIHER</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <button
              onClick={() => navigateToPage('home')}
              className="hover:text-[#FF1E42] cursor-pointer"
            >
              Portal
            </button>
            <button
              onClick={() => navigateToPage('events')}
              className="hover:text-[#FF1E42] cursor-pointer"
            >
              Events
            </button>
            <button
              onClick={() => navigateToPage('about')}
              className="hover:text-[#FF1E42] cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => navigateToPage('contact')}
              className="hover:text-[#FF1E42] cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* ── 4. EVENT DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#090714] rounded-3xl shadow-2xl border border-[#FF1E42]/40 overflow-hidden flex flex-col text-white"
            >
              <div className="relative h-44 w-full bg-black">
                <img
                  src={selectedEventModal.imageUrl}
                  alt={selectedEventModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090714] via-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-[#FF1E42] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-[#FF1E42] text-white">
                    {selectedEventModal.category}
                  </span>
                  <h3 className="text-xl font-bold font-['Impact',sans-serif] mt-1">{selectedEventModal.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs text-stone-300">
                <p className="text-sm font-medium text-white">{selectedEventModal.description}</p>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-[#FF6B00] font-bold block uppercase">TIME</span>
                    <span className="font-bold text-white">{selectedEventModal.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#FF6B00] font-bold block uppercase">VENUE</span>
                    <span className="font-bold text-white">{selectedEventModal.venue}</span>
                  </div>
                </div>

                {selectedEventModal.rules && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-white uppercase font-mono">Event Rules &amp; Guidelines:</span>
                    <ul className="space-y-1 pl-1">
                      {selectedEventModal.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#FF1E42] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FF6B00]">
                  {selectedEventModal.isTeamEvent ? 'Team Participation' : 'Solo Registration'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const evt = selectedEventModal;
                    setSelectedEventModal(null);
                    onSelectEvent(evt);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E42] to-[#FF6B00] hover:brightness-110 text-white font-mono font-bold text-xs shadow-md cursor-pointer"
                >
                  Register (₹{selectedEventModal.price || 100}) →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. GALLERY LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {selectedGalleryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-[#090714] rounded-3xl shadow-2xl border border-[#FF1E42]/40 overflow-hidden flex flex-col text-white"
            >
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <img
                  src={selectedGalleryModal.imageUrl}
                  alt={selectedGalleryModal.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedGalleryModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-[#FF1E42] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#FF6B00]">
                  {selectedGalleryModal.category}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedGalleryModal.title}</h3>
                <p className="text-xs text-stone-300">{selectedGalleryModal.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 6. PASS LOOKUP MODAL ── */}
      <AnimatePresence>
        {isPassModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPassModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-[#090714] rounded-3xl shadow-2xl border border-[#FF1E42]/40 overflow-hidden text-white"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF]" />

              <div className="p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF1E42]/10 border border-[#FF1E42]/30 text-[#FF1E42] flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 text-[#FF1E42]" />
                    </div>
                    <div>
                      <h3 className="font-['Impact',sans-serif] text-xl text-white uppercase tracking-wider">
                        ACCESS MULTIVERSE PASS
                      </h3>
                      <p className="text-xs text-stone-400">Enter credentials to view your QR pass.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPassModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/5 text-stone-300 hover:bg-[#FF1E42] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {accessError && (
                  <div className="p-3 rounded-2xl bg-[#FF1E42]/10 border border-[#FF1E42]/40 text-[#FF1E42] text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{accessError}</span>
                  </div>
                )}

                <form onSubmit={handlePassLookupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-stone-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#FF1E42]" />
                      <span>Roll Number / Register Number</span>
                      <span className="text-[#FF1E42]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={accessRollNumber}
                      onChange={(e) => setAccessRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 2021CS042"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-xs sm:text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FF1E42] focus:ring-2 focus:ring-[#FF1E42]/30 uppercase"
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
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingPass}
                    className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] hover:brightness-110 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#FF1E42]/40 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isVerifyingPass ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>OPEN MY PASS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadianzaLandingPage;
