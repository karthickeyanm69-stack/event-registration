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
} from 'lucide-react';
import { CollegeEvent, EventCategory, Participant, Registration } from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEmblem, SpiherStarburstLogo } from '../common/CollegeLogo';
import { ThreeDCyberHeadCanvas } from './ThreeDCyberHeadCanvas';
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
    title: 'Grand Inaugural Ceremony',
    category: 'Keynote & Launch',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    caption: 'Dignitaries and keynote delegates igniting the ceremonial lamp at the RADIANZA inaugural stage.',
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
    caption: 'Custom-built heavyweight combat bots colliding in the reinforced polycarbonate arena.',
  },
  {
    id: 'gal-4',
    title: 'Project Expo & Innovation Showcase',
    category: 'Research Expo',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    caption: 'Student engineers presenting deeptech hardware and patent-pending IoT solutions to venture evaluators.',
  },
  {
    id: 'gal-5',
    title: 'UI/UX Design Blitz',
    category: 'Design Challenge',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    caption: 'Creative sprint crafting futuristic spatial user interfaces under strict real-time design constraints.',
  },
  {
    id: 'gal-6',
    title: 'Valedictory & Prize Distribution',
    category: 'Grand Finale',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    caption: 'Celebrating national champions with ₹75,000+ cash prizes, rolling championship trophies, and certificates.',
  },
];

// ── FAQs Data ──
interface FAQItem {
  q: string;
  a: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    q: 'Who is eligible to participate in RADIANZA ’26?',
    a: 'Any enrolled undergraduate or postgraduate engineering, polytechnic, and arts/science college student with a valid institution identity card is eligible.',
  },
  {
    q: 'Can I participate in multiple events across different tracks?',
    a: 'Yes! The symposium schedule is meticulously structured with parallel technical and non-technical slots, enabling participants to compete in up to 3 non-overlapping tracks.',
  },
  {
    q: 'How do I receive and verify my digital event pass?',
    a: 'Upon completing your registration, you receive a cryptographically signed QR Event Pass. You can download it as a PNG/PDF or look it up anytime via your Roll Number & DOB on this portal.',
  },
  {
    q: 'Is food and accommodation provided for outstation participants?',
    a: 'Complimentary lunch, high-tea refreshments, and event kits are provided for all registered delegates. Hostel accommodation can be availed upon prior intimation for outstation participants.',
  },
  {
    q: 'Are certificates provided for all participants?',
    a: 'Yes, every participant receives an official, institution-verified certificate of participation. Winners receive cash prizes, trophies, and merit certificates.',
  },
];

export const RadianzaLandingPage: React.FC<RadianzaLandingPageProps> = ({
  isRevealed = true,
  events,
  activeLandingPage: controlledPage,
  onNavigateLandingPage,
  onStartNewRegistration,
  onSelectEvent,
  onSuccessfulAccess,
  onOpenConsole,
}) => {
  // Local active page state with external synchronization
  const [internalPage, setInternalPage] = useState<LandingPageId>('home');
  const activePage = controlledPage || internalPage;

  // Track page transition direction
  const [pageDirection, setPageDirection] = useState<number>(0);

  // Category filter state for Events Matrix
  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'Non-Technical'>('All');

  // Modal states
  const [selectedEventModal, setSelectedEventModal] = useState<CollegeEvent | null>(null);
  const [selectedGalleryModal, setSelectedGalleryModal] = useState<GalleryItem | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Digital Pass Verification Modal State
  const [accessRollNumber, setAccessRollNumber] = useState('');
  const [accessDob, setAccessDob] = useState('');
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isVerifyingPass, setIsVerifyingPass] = useState(false);

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

  // Speakers Horizontal Scroll Ref (from 2nd-tag)
  const speakersScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollSpeakersLeft, setCanScrollSpeakersLeft] = useState(false);
  const [canScrollSpeakersRight, setCanScrollSpeakersRight] = useState(true);

  // Gallery Horizontal Scroll Ref
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollGalleryLeft, setCanScrollGalleryLeft] = useState(false);
  const [canScrollGalleryRight, setCanScrollGalleryRight] = useState(true);

  // Drag-to-scroll state for gallery
  const isGalleryDown = useRef(false);
  const galleryStartX = useRef(0);
  const galleryScrollLeft = useRef(0);

  // Live Countdown State (Target: March 8, 2026)
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    const targetDate = new Date('2026-03-08T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Total registrations & slots metrics (from 2nd-tag)
  const totalRegisteredCount = 500 + events.reduce((sum, e) => sum + ((e.totalSlots || 0) - (e.slotsLeft || 0)), 0);
  const totalSlotsLeft = events.reduce((sum, e) => sum + (e.slotsLeft || 0), 0);


  // Check speakers scroll bounds
  const checkSpeakersScroll = () => {
    if (!speakersScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = speakersScrollRef.current;
    setCanScrollSpeakersLeft(scrollLeft > 20);
    setCanScrollSpeakersRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const handleSpeakersScroll = (direction: 'left' | 'right') => {
    if (!speakersScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    speakersScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Check gallery scroll bounds
  const checkGalleryScroll = () => {
    if (!galleryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
    setCanScrollGalleryLeft(scrollLeft > 20);
    setCanScrollGalleryRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const handleGalleryScroll = (direction: 'left' | 'right') => {
    if (!galleryScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    galleryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (!galleryScrollRef.current) return;
    isGalleryDown.current = true;
    galleryStartX.current = e.pageX - galleryScrollRef.current.offsetLeft;
    galleryScrollLeft.current = galleryScrollRef.current.scrollLeft;
  };

  const handleGalleryMouseLeave = () => {
    isGalleryDown.current = false;
  };

  const handleGalleryMouseUp = () => {
    isGalleryDown.current = false;
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isGalleryDown.current || !galleryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryScrollRef.current.offsetLeft;
    const walk = (x - galleryStartX.current) * 1.5;
    galleryScrollRef.current.scrollLeft = galleryScrollLeft.current - walk;
    checkGalleryScroll();
  };

  // Page switcher function
  const navigateToPage = (newPageId: LandingPageId) => {
    const pageOrder: LandingPageId[] = ['home', 'events', 'about', 'contact'];
    const oldIdx = pageOrder.indexOf(activePage);
    const newIdx = pageOrder.indexOf(newPageId);
    setPageDirection(newIdx > oldIdx ? 1 : -1);

    if (onNavigateLandingPage) {
      onNavigateLandingPage(newPageId);
    } else {
      setInternalPage(newPageId);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Pass Verification Form Submit
  const handlePassLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessError(null);

    const roll = accessRollNumber.trim().toUpperCase();
    const dob = accessDob.trim();

    if (!roll || !dob) {
      setAccessError('Please provide both your Roll Number and Date of Birth.');
      return;
    }

    setIsVerifyingPass(true);

    setTimeout(() => {
      const result = MockDatabaseService.verifyParticipantAccess(roll, dob);
      if (result.success && result.participant) {
        setIsPassModalOpen(false);
        setIsVerifyingPass(false);
        onSuccessfulAccess(result.participant, result.registration);
      } else {
        setIsVerifyingPass(false);
        setAccessError(result.error || 'No matching registered participant found with these credentials.');
      }
    }, 550);
  };

  const handleDemoFill = (roll: string, dob: string) => {
    setAccessRollNumber(roll);
    setAccessDob(dob);
  };

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    if (activeCategory === 'All') return true;
    return e.category === activeCategory;
  });

  // Animation variants
  const pageTransitionVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      transition: { duration: 0.25, ease: 'easeIn' as const },
    }),
  };

  const currentPageIndex = PAGES.findIndex((p) => p.id === activePage);
  const prevPage = currentPageIndex > 0 ? PAGES[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < PAGES.length - 1 ? PAGES[currentPageIndex + 1] : null;

  return (
    <div className="min-h-screen w-full bg-[#faf6f8] text-[#111827] flex flex-col font-['Inter',sans-serif] selection:bg-[#c1121f] selection:text-white relative overflow-x-hidden">
      {/* ── 1. GLOBAL STICKY FROSTED HEADER ── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-rose-200/80 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo Lockup */}
          <div
            onClick={() => navigateToPage('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <CollegeEmblem size={34} className="group-hover:scale-105 transition-transform duration-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-extrabold text-2xl sm:text-3xl tracking-tight text-[#860a16] uppercase">
                RADIANZA <span className="text-[#c1121f]">'26</span>
              </span>
            </div>
          </div>

          {/* Desktop Multi-Page Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#f5ecf0] rounded-2xl border border-rose-200/80 shadow-inner">
            {PAGES.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(page.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-[#4b5563] hover:text-[#860a16]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePagePill"
                      className="absolute inset-0 bg-gradient-to-r from-[#860a16] to-[#c1121f] rounded-xl shadow-md shadow-[#c1121f]/30"
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
            {/* Quick Access Pass Button */}
            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f5ecf0] hover:bg-rose-100 text-[#860a16] border border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#c1121f]" />
              <span>Access Pass</span>
            </button>

            {/* Primary Register CTA Button */}
            <button
              type="button"
              onClick={onStartNewRegistration}
              className="hidden sm:flex relative px-5 py-2 rounded-xl bg-gradient-to-r from-[#860a16] via-[#c1121f] to-[#e62645] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#c1121f]/35 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] items-center gap-1.5"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg border border-rose-300 flex flex-col items-center justify-center gap-[5px] p-2 bg-[#f5ecf0] transition-all cursor-pointer active:scale-95 shadow-xs"
              aria-label="Open Navigation Menu"
            >
              <span className="w-5 h-[2px] bg-[#860a16] rounded-full block" />
              <span className="w-5 h-[2px] bg-[#c1121f] rounded-full block" />
              <span className="w-5 h-[2px] bg-[#860a16] rounded-full block" />
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative z-10 w-[85%] max-w-[320px] h-full bg-[#faf6f8] border-l border-rose-200 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto text-[#111827]"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-rose-200">
                  <div className="flex items-center gap-2">
                    <CollegeEmblem size={28} />
                    <span className="font-serif font-extrabold text-xl text-[#860a16]">
                      RADIANZA <span className="text-[#c1121f]">'26</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-[#860a16] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 py-6">
                  {PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => navigateToPage(page.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                        activePage === page.id
                          ? 'bg-[#c1121f] text-white shadow-md shadow-[#c1121f]/30'
                          : 'text-[#4b5563] hover:bg-rose-100/60'
                      }`}
                    >
                      <span>{page.navLabel}</span>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-rose-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartNewRegistration();
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#860a16] to-[#c1121f] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#c1121f]/30 flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 text-center text-xs font-bold text-[#860a16] hover:underline"
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
          {/* PAGE 1: HOME (HERO 3D + HIGHLIGHTS + SPEAKERS + GALLERY)            */}
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
              {/* ── 1. HERO SECTION (2ND-TAG STRUCTURE WITH ELEGANT LIGHT PEARL CYBER BACKGROUND) ── */}
              <section id="hero" className="relative w-full overflow-hidden bg-cyber-grid crimson-ambient-glow text-[#111827] select-none border-b border-rose-200/50">
                {/* Ambient Scanline Overlay Layer */}
                <div aria-hidden="true" className="absolute inset-0 scanlines-overlay z-10 pointer-events-none" />

                {/* Animated Flying Little Spiders in Light Black / Charcoal */}
                <FlyingSpidersCanvas count={22} />

                {/* Neo-Classical Architectural Column Clusters Backdrop */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 flex justify-between px-6 sm:px-16 pointer-events-none opacity-50"
                >
                  {/* Left Column Cluster */}
                  <div className="flex space-x-3 h-full items-end pb-8">
                    <div className="w-10 sm:w-16 h-[78%] rounded-t-lg pillar-column border-x border-[#c81d25]/20" />
                    <div className="w-12 sm:w-20 h-[88%] rounded-t-lg pillar-column border-x border-[#c81d25]/20" />
                    <div className="w-8 sm:w-14 h-[65%] rounded-t-lg pillar-column border-x border-[#c81d25]/20 hidden md:block" />
                  </div>

                  {/* Right Column Cluster */}
                  <div className="flex space-x-3 h-full items-end pb-8">
                    <div className="w-8 sm:w-14 h-[65%] rounded-t-lg pillar-column border-x border-[#c81d25]/20 hidden md:block" />
                    <div className="w-12 sm:w-20 h-[88%] rounded-t-lg pillar-column border-x border-[#c81d25]/20" />
                    <div className="w-10 sm:w-16 h-[78%] rounded-t-lg pillar-column border-x border-[#c81d25]/20" />
                  </div>
                </div>

                {/* Atmospheric Center Glow behind Character */}
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#c81d25]/10 rounded-full blur-3xl pointer-events-none z-0"
                />

                {/* Giant Backdrop Poster Title: "RADIANZA'26" */}
                <div
                  aria-hidden="true"
                  className="absolute top-[8%] sm:top-[6%] left-1/2 -translate-x-1/2 z-0 pointer-events-none text-center w-full"
                >
                  <h2 className="font-serif font-extrabold font-black text-5xl sm:text-7xl md:text-[10rem] lg:text-[13rem] leading-none uppercase tracking-tighter spiderman-title-stroke select-none whitespace-nowrap opacity-40">
                    RADIANZA'26
                  </h2>
                </div>
                
                {/* ─── MOBILE VIEW: EXACT REFERENCE MATCH (< lg) ─── */}
                <div className="lg:hidden relative w-full min-h-[calc(100dvh-4.25rem)] min-h-[720px] flex flex-col justify-start p-5 sm:p-6 pb-8 select-none overflow-hidden z-20">
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
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-rose-200 text-[#860a16] pointer-events-auto"
                    >
                      <CollegeEmblem size={24} />
                      <span className="tracking-wider uppercase font-mono text-[10px] sm:text-[11px] font-bold text-[#860a16]">
                        DEPARTMENT OF INFORMATION TECHNOLOGY
                      </span>
                    </motion.div>
                    
                    {/* Line 2: RADIANZA '26 Title (High-contrast shadow & luminous radiance) */}
                    <motion.h1
                      initial={{ opacity: 0, x: -25 }}
                      animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
                      transition={{ duration: 0.65, delay: 0.15 }}
                      className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-white leading-[1.02] pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_14px_rgba(0,0,0,0.9),_0_0_3px_rgba(0,0,0,1)]"
                    >
                      RADIANZA <span className="text-[#FF1738] drop-shadow-[0_0_12px_rgba(255,23,56,0.85)]">'26</span>
                    </motion.h1>

                    {/* Line 3: National-Level Technical Symposium with Red Gradient Accent */}
                    <motion.div
                      initial={{ opacity: 0, x: -18 }}
                      animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      className="flex items-center gap-2 pointer-events-none"
                    >
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)] [text-shadow:_0_1px_6px_rgba(0,0,0,0.95),_0_0_2px_rgba(0,0,0,1)]">
                        NATIONAL-LEVEL TECHNICAL SYMPOSIUM
                      </span>
                      <span className="w-8 h-[2px] bg-gradient-to-r from-[#FF1738] to-[#C1121F] shadow-[0_0_8px_rgba(255,23,56,0.8)] block shrink-0" />
                    </motion.div>

                    {/* Line 4: Tagline */}
                    <motion.p
                      initial={{ opacity: 0, x: -14 }}
                      animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      className="text-xs sm:text-sm text-white/95 font-medium italic pointer-events-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] [text-shadow:_0_1px_6px_rgba(0,0,0,0.95),_0_0_2px_rgba(0,0,0,1)]"
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
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 shadow-md text-xs font-bold text-[#111827] w-fit">
                        <Calendar className="w-3.5 h-3.5 text-[#c1121f]" />
                        <span>15 - 16 OCT 2026</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 shadow-md text-xs font-medium text-stone-800 w-fit">
                        <MapPin className="w-3.5 h-3.5 text-[#c1121f]" />
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
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8b151b] to-[#c1121f] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/30 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToPage('events')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-rose-50 border border-rose-200 text-[#860a16] font-bold text-xs sm:text-sm shadow-md shadow-black/10 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>View Matrix</span>
                        <ChevronRight className="w-4 h-4 text-[#c1121f]" />
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* ─── DESKTOP VIEW: EXACT REFERENCE IMAGE LAYOUT (>= lg) ─── */}
                <div className="hidden lg:flex min-h-[calc(100vh-6rem)] items-center justify-center py-16 relative z-20">
                  <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-12 gap-8 items-center overflow-visible">
                    {/* Wording: Left Column */}
                    <div className="col-span-6 space-y-7 text-left flex flex-col items-start z-20">
                      {/* Top Institution Pill Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-rose-200 text-[#860a16] text-xs font-mono tracking-wider uppercase shadow-xs backdrop-blur-md"
                      >
                        <CollegeEmblem size={24} />
                        <span className="font-bold text-[#860a16]">
                          DEPARTMENT OF INFORMATION TECHNOLOGY
                        </span>
                      </motion.div>

                      {/* Headline Typography & Taglines */}
                      <div className="space-y-4">
                        <motion.h1
                          initial={{ opacity: 0, x: -35 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -35 }}
                          transition={{ duration: 0.65, delay: 0.15 }}
                          className="text-6xl sm:text-7xl xl:text-8xl font-serif font-black tracking-tight text-[#111827] leading-[0.95]"
                        >
                          RADIANZA
                          <span className="block text-[#c1121f] mt-2 font-serif font-black">'26</span>
                        </motion.h1>

                        {/* Subtitle with Red Horizontal Bar */}
                        <motion.div
                          initial={{ opacity: 0, x: -25 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
                          transition={{ duration: 0.6, delay: 0.25 }}
                          className="flex items-center gap-3 pt-1"
                        >
                          <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.22em] text-[#860a16] uppercase">
                            NATIONAL-LEVEL TECHNICAL SYMPOSIUM
                          </span>
                          <span className="w-12 h-[2px] bg-gradient-to-r from-[#c1121f] to-[#860a16] block" />
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, x: -18 }}
                          animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                          transition={{ duration: 0.6, delay: 0.35 }}
                          className="text-base sm:text-lg text-[#4b5563] font-medium italic"
                        >
                          "Igniting Ideas, Innovating Tomorrow"
                        </motion.p>
                      </div>

                      {/* Date & Location Chips */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex flex-wrap justify-start items-center gap-3 pt-1 text-xs font-semibold text-[#111827]"
                      >
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200 shadow-xs">
                          <Calendar className="w-4 h-4 text-[#c1121f]" />
                          <span className="font-bold text-[#111827]">15 - 16 OCT 2026</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200 shadow-xs">
                          <MapPin className="w-4 h-4 text-[#c1121f]" />
                          <span className="text-stone-700">SPIHER Campus, Coimbatore</span>
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
                          className="relative w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8b151b] to-[#c1121f] hover:brightness-110 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                          <span className="font-bold">Register Now</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>

                        {/* Secondary Light/Red CTA */}
                        <button
                          type="button"
                          onClick={() => navigateToPage('events')}
                          className="w-auto px-7 py-3.5 rounded-full bg-white/90 hover:bg-rose-50 border border-rose-200 text-[#860a16] font-bold text-sm tracking-wide shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <span>View Competition Matrix</span>
                          <ChevronRight className="w-4 h-4 text-[#c1121f]" />
                        </button>
                      </motion.div>

                      {/* Digital Pass Quick Access */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.65 }}
                        className="pt-1 text-xs text-[#6b7280] flex items-center justify-start gap-2"
                      >
                        <span>Already registered?</span>
                        <button
                          type="button"
                          onClick={() => setIsPassModalOpen(true)}
                          className="text-[#c1121f] font-bold underline hover:text-[#8b151b] cursor-pointer"
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

              {/* ── 2. HIGHLIGHTS & WHY RADIANZA SECTION (2ND-TAG ARRANGEMENT + LUXURY ROSE THEME) ── */}
              <section id="highlights" className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf6f8] border-t border-rose-200/60 relative">
                <div className="absolute inset-0 grid-mesh-pattern-light pointer-events-none opacity-40" />

                <div className="relative max-w-7xl mx-auto space-y-8 sm:space-y-12">
                  {/* Section Title (2nd-Tag Layout) */}
                  <div className="max-w-2xl text-left space-y-2 sm:space-y-3">
                    <span className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-[#c1121f] bg-rose-100/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-rose-300 shadow-2xs">
                      WHY
                    </span>
                    <h2 className="text-2xl sm:text-5xl font-serif font-extrabold text-[#111827] tracking-tight">
                      RADIANZA <span className="text-[#c1121f]">'26?</span>
                    </h2>
                    <p className="text-xs sm:text-base text-[#4b5563] leading-relaxed font-medium">
                      A platform to learn, build, compete and connect. Join the next generation of innovators, creators and problem solvers at SPIHER's flagship technical symposium.
                    </p>
                  </div>

                  {/* Feature Cards Grid (2nd-Tag 2x2 on Mobile, 4-Col on Desktop) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[
                      {
                        icon: Code2,
                        title: 'Technical Events',
                        desc: 'Code. Build. Solve. Intense algorithmic sprints, robotics combat, and full-stack challenges.',
                        action: 'Technical',
                        tag: '6+ EVENTS',
                      },
                      {
                        icon: Gamepad2,
                        title: 'Non-Technical Events',
                        desc: 'Showcase. Express. Create. e-Sports, technical quizzes, design marathons, and creative arenas.',
                        action: 'Non-Technical',
                        tag: '6+ ARENAS',
                      },
                      {
                        icon: Trophy,
                        title: '₹75,000+ Prize Pool',
                        desc: 'Substantial cash prizes, rolling institution trophies, winner medals, and verified credentials.',
                        action: 'All',
                        tag: 'CASH REWARDS',
                      },
                      {
                        icon: Users,
                        title: 'Industry Networking',
                        desc: 'Connect directly with principal architects, hiring managers, professors, and 1,500+ student delegates.',
                        action: 'All',
                        tag: '1500+ PEERS',
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                          if (item.action === 'Technical' || item.action === 'Non-Technical') {
                            setActiveCategory(item.action);
                          }
                          navigateToPage('events');
                        }}
                        className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-rose-200/80 hover:border-rose-300 hover:shadow-md transition-all duration-300 space-y-2.5 sm:space-y-4 flex flex-col justify-between group cursor-pointer shadow-xs"
                      >
                        <div className="space-y-2 sm:space-y-3">
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 border border-rose-200 text-[#c1121f] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <item.icon className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-[#c1121f]" />
                          </div>
                          <h3 className="text-sm sm:text-lg font-bold text-[#111827] leading-tight">{item.title}</h3>
                          <p className="text-[11px] sm:text-xs text-[#4b5563] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                            {item.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#c1121f] pt-1 sm:pt-2">
                          <span>View Tracks</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Campus Showcase Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-reference-luxury rounded-3xl overflow-hidden p-0 border border-rose-200/80 shadow-lg"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                      <div className="lg:col-span-7 h-64 sm:h-80 relative overflow-hidden">
                        <img
                          src="/spiher-hero-building.png"
                          alt="SPIHER Campus"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#c1121f] text-white">
                            HOST INSTITUTION
                          </span>
                          <h4 className="text-xl sm:text-2xl font-bold font-serif font-extrabold mt-1">
                            ST. PETER'S INSTITUTE OF HIGHER EDUCATION &amp; RESEARCH
                          </h4>
                          <p className="text-xs text-white/80">Deemed to be University • NAAC 'A' Grade Accredited</p>
                        </div>
                      </div>

                      <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-[#860a16] uppercase">
                            DEPARTMENT OF IT LEGACY
                          </span>
                          <h3 className="text-2xl font-bold text-[#111827]">
                            Fostering World-Class Engineering Talent
                          </h3>
                        </div>
                        <p className="text-xs text-[#4b5563] leading-relaxed">
                          Equipped with state-of-the-art supercomputing labs, dedicated robotics arenas, high-speed fiber connectivity, and distinguished faculty leadership.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200">
                            <span className="text-xl font-bold text-[#860a16]">NAAC A</span>
                            <p className="text-[11px] text-[#4b5563]">Accredited Campus</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200">
                            <span className="text-xl font-bold text-[#c1121f]">100%</span>
                            <p className="text-[11px] text-[#4b5563]">Verified Certificates</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* ── 3. DISTINGUISHED SPEAKERS SECTION (2ND-TAG CAROUSEL + CURRENT LUXURY PALETTE) ── */}
              <section id="speakers" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-rose-200/60 relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#860a16] bg-rose-100/80 px-3.5 py-1 rounded-full border border-rose-300">
                        THOUGHT LEADERS &amp; JURY
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-[#860a16] uppercase">
                        EMINENT KEYNOTE SPEAKERS
                      </h2>
                      <p className="text-sm text-[#4b5563]">
                        Learn directly from researchers, tech executives, and startup founders shaping engineering frontiers.
                      </p>
                    </div>

                    {/* Navigation Controls & Helper */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#860a16] bg-rose-50 px-3 py-2 rounded-full border border-rose-200 select-none">
                        <span>← Swipe / Scroll →</span>
                      </span>

                      <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-full border border-rose-200">
                        <button
                          type="button"
                          onClick={() => handleSpeakersScroll('left')}
                          disabled={!canScrollSpeakersLeft}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollSpeakersLeft
                              ? 'bg-white text-[#860a16] hover:bg-[#c1121f] hover:text-white shadow-xs active:scale-95 border border-rose-300'
                              : 'bg-transparent text-[#6b7280]/30 cursor-not-allowed border border-transparent'
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
                              ? 'bg-white text-[#860a16] hover:bg-[#c1121f] hover:text-white shadow-xs active:scale-95 border border-rose-300'
                              : 'bg-transparent text-[#6b7280]/30 cursor-not-allowed border border-transparent'
                          }`}
                          aria-label="Scroll speakers right"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Snapping Track */}
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
                          className="w-[300px] sm:w-[340px] md:w-[360px] shrink-0 snap-start card-reference-luxury p-6 rounded-3xl border border-rose-200/80 shadow-md hover:shadow-xl hover:border-rose-400 transition-all duration-300 flex flex-col justify-between group select-none"
                        >
                          <div className="space-y-4">
                            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-rose-50 border border-rose-200">
                              <img
                                src={speaker.imageUrl}
                                alt={speaker.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#860a16] border border-rose-200 shadow-xs backdrop-blur-xs">
                                  {speaker.tag}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                                  0{idx + 1}
                                </span>
                              </div>

                              <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                                <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">{speaker.name}</h3>
                                <p className="text-xs text-rose-200 font-medium mt-0.5">{speaker.role}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#860a16] block">
                                {speaker.organization}
                              </span>
                              <h4 className="text-sm font-bold text-[#111827] leading-snug line-clamp-1">
                                "{speaker.topic}"
                              </h4>
                              <p className="text-xs text-[#4b5563] line-clamp-2 leading-relaxed">
                                {speaker.bio}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-[#6b7280]">
                            <span className="text-[11px] font-mono">RADIANZA '26 GUEST</span>
                            <div className="flex items-center gap-2">
                              <Linkedin className="w-4 h-4 text-[#860a16] hover:scale-110 transition-transform cursor-pointer" />
                              <Globe className="w-4 h-4 text-[#860a16] hover:scale-110 transition-transform cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 4. CAMPUS MOMENTS & GALLERY (2ND-TAG DRAG/SCROLL + CURRENT LUXURY PALETTE) ── */}
              <section id="gallery" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#faf6f8] border-t border-rose-200/60 overflow-hidden relative">
                <div className="max-w-7xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#860a16] bg-rose-100/80 px-3.5 py-1 rounded-full border border-rose-300">
                        CAMPUS PULSE
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-[#860a16] uppercase">
                        MOMENTS OF RADIANZA
                      </h2>
                      <p className="text-sm text-[#4b5563]">
                        Relive the electric energy, intense hacking sprints, robotics warfare, and grand valedictory celebrations.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#860a16] bg-rose-50 px-3 py-2 rounded-full border border-rose-200 select-none">
                        <Camera className="w-3.5 h-3.5 text-[#c1121f]" />
                        <span>Click card to enlarge</span>
                      </div>

                      <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-full border border-rose-200 shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleGalleryScroll('left')}
                          disabled={!canScrollGalleryLeft}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            canScrollGalleryLeft
                              ? 'bg-white text-[#860a16] hover:bg-[#c1121f] hover:text-white border border-rose-300 shadow-xs active:scale-95'
                              : 'bg-transparent text-[#6b7280]/20 cursor-not-allowed border border-transparent'
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
                              ? 'bg-white text-[#860a16] hover:bg-[#c1121f] hover:text-white border border-rose-300 shadow-xs active:scale-95'
                              : 'bg-transparent text-[#6b7280]/20 cursor-not-allowed border border-transparent'
                          }`}
                          aria-label="Scroll gallery right"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Track with Drag-to-Scroll */}
                  <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div
                      ref={galleryScrollRef}
                      onScroll={checkGalleryScroll}
                      onMouseDown={handleGalleryMouseDown}
                      onMouseLeave={handleGalleryMouseLeave}
                      onMouseUp={handleGalleryMouseUp}
                      onMouseMove={handleGalleryMouseMove}
                      className="flex gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {GALLERY_DATA.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedGalleryModal(item)}
                          className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start card-reference-luxury rounded-3xl overflow-hidden border border-rose-200/80 shadow-md group cursor-pointer aspect-[4/3] relative select-none hover:shadow-xl hover:border-rose-400 transition-all duration-300"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 pointer-events-none"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
                              {item.category}
                            </span>
                            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-3.5 left-4 right-4 text-white space-y-0.5 pointer-events-none">
                            <h4 className="text-sm font-bold">{item.title}</h4>
                            <p className="text-[11px] text-white/80 line-clamp-1">{item.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 5. BOTTOM REGISTRATION CALLOUT (FAITHFUL TO 2ND-TAG WITH LUXURY PALETTE) ── */}
              <section className="w-full pt-16 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#fdf8fa] via-[#faedf2] to-[#fbf5f7] text-[#111827] relative overflow-hidden border-t border-rose-200/80">
                {/* Ambient Red Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c1121f]/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto text-center relative z-10 space-y-7"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-rose-300 shadow-xs">
                    <Flame className="w-4 h-4 text-[#c1121f]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#860a16]">
                      REGISTRATIONS ARE LIVE
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#860a16] tracking-tight uppercase leading-tight">
                    BE A PART OF RADIANZA <span className="text-[#c1121f]">'26</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4b5563] max-w-xl mx-auto leading-relaxed">
                    Secure your registration today. Pick your competition track, build your team, and download your cryptographically verified entry pass.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-3xl mx-auto pt-2">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#860a16]">
                        {totalRegisteredCount}+
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">DELEGATES</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#111827]">
                        {totalSlotsLeft}
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">SLOTS LEFT</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#111827]">
                        45+
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">INSTITUTIONS</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#860a16]">
                        ₹75,000+
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">CASH AWARDS</p>
                    </motion.div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <div className="relative group w-full sm:w-auto">
                      <div className="absolute -inset-2 rounded-3xl bg-[#c1121f]/35 blur-xl animate-halo-pulse pointer-events-none" />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={onStartNewRegistration}
                        className="relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#860a16] via-[#9e0d19] to-[#860a16] hover:brightness-110 text-white font-extrabold text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsPassModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-[#860a16] font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-xs"
                    >
                      <QrCode className="w-4 h-4 text-[#c1121f]" />
                      <span>Already Registered? View Pass</span>
                    </motion.button>
                  </div>
                </motion.div>
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
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10"
            >
              {/* Header Lockup */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-rose-200">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-[#860a16] font-mono text-xs font-bold uppercase tracking-wider border border-rose-300 shadow-xs">
                    <Trophy className="w-3.5 h-3.5 text-[#c1121f]" />
                    <span>ARENA // COMPETITION MATRIX</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-[#860a16] uppercase">
                    Featured <span className="text-[#c1121f]">Events</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4b5563] max-w-xl leading-relaxed">
                    Choose your battleground. Select your preferred event to compete, innovate, and showcase your expertise at RADIANZA ’26.
                  </p>
                </div>

                {/* Filter Switcher */}
                <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center gap-1.5 p-1.5 bg-rose-50 rounded-2xl border border-rose-200 shrink-0 self-start md:self-auto shadow-xs">
                  {(['All', 'Technical', 'Non-Technical'] as const).map((cat) => {
                    const count = cat === 'All' ? events.length : events.filter((e) => e.category === cat).length;
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-[#c1121f] text-white shadow-md shadow-[#c1121f]/30'
                            : 'text-[#4b5563] hover:text-[#860a16] hover:bg-white/60'
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
                            isActive ? 'bg-white text-[#c1121f]' : 'bg-rose-200 text-[#860a16]'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -6 }}
                    className="card-reference-luxury rounded-3xl overflow-hidden border border-rose-200/80 shadow-md hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-rose-50">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                        <span
                          className={`text-[10.5px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-md backdrop-blur-md ${
                            event.category === 'Technical' ? 'bg-[#860a16]/95 border border-rose-400/40' : 'bg-[#c1121f]/95 border border-rose-300/40'
                          }`}
                        >
                          {event.category}
                        </span>
                        <span className="text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
                          {event.isTeamEvent ? `${event.minTeamSize}-${event.maxTeamSize} Members` : 'Solo Event'}
                        </span>
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <h3 className="text-lg sm:text-xl font-serif font-bold leading-tight group-hover:text-rose-200 transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[#c1121f]">{event.tagline || 'Technical Arena'}</p>
                        <p className="text-xs text-[#4b5563] line-clamp-2 leading-relaxed font-normal">{event.description}</p>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-rose-100 text-xs text-[#6b7280]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#c1121f]" />
                          <span className="font-medium text-[#111827]">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#860a16]" />
                          <span className="truncate font-medium text-[#111827]">{event.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-mono font-bold text-[#860a16] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          Entry Fee: ₹{event.price || 100}
                        </span>
                        <span className="text-[11px] text-[#6b7280] font-mono">
                          {event.slotsLeft} slots left
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventModal(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#860a16] text-xs font-bold border border-rose-200 transition-colors cursor-pointer text-center"
                        >
                          Rules &amp; Details
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => onSelectEvent(event)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#860a16] to-[#c1121f] hover:brightness-110 text-white text-xs font-black shadow-md shadow-[#c1121f]/30 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <span>Register</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </motion.button>
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
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12"
            >
              <div className="card-reference-luxury p-8 sm:p-12 rounded-3xl border border-rose-200/80 shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-6 space-y-5 text-left">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#860a16] bg-rose-100 px-3.5 py-1 rounded-full border border-rose-300 shadow-xs">
                      ABOUT RADIANZA '26 &amp; SPIHER
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#860a16] uppercase">
                      More Than Just a Symposium
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed font-medium">
                      RADIANZA '26 is an institution-wide celebration of curiosity, engineering excellence, and interdisciplinary innovation. Bringing together over 500 delegates from engineering universities across India, faculty mentors, and technical visionaries.
                    </p>

                    <div className="space-y-2 pt-1 text-xs text-[#111827]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c1121f] shrink-0" />
                        <span>NAAC 'A' Grade Accredited Deemed to be University</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c1121f] shrink-0" />
                        <span>UGC &amp; AICTE Approved Premier Technical Institution</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c1121f] shrink-0" />
                        <span>Cryptographically secured digital entry pass &amp; QR verification engine</span>
                      </div>
                    </div>

                    <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-center shadow-xs">
                        <span className="text-2xl font-serif font-extrabold text-[#860a16]">500+</span>
                        <p className="text-[11px] text-[#4b5563] font-medium">Delegates Competing</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-center shadow-xs">
                        <span className="text-2xl font-serif font-extrabold text-[#111827]">12+</span>
                        <p className="text-[11px] text-[#4b5563] font-medium">Technical Tracks</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-center shadow-xs col-span-2 sm:col-span-1">
                        <span className="text-2xl font-serif font-extrabold text-[#c1121f]">₹75K+</span>
                        <p className="text-[11px] text-[#4b5563] font-medium">Prize Pool</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200 aspect-[4/3]">
                      <img
                        src="/spiher-hero-building.png"
                        alt="St. Peter's Institute Main Campus Building"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-xs font-mono font-bold uppercase text-rose-300">Host Institution</p>
                        <h4 className="text-base font-bold">St. Peter's Institute of Higher Education and Research</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-xs font-mono font-bold text-[#860a16] uppercase">HELP &amp; GUIDELINES</span>
                  <h3 className="text-2xl font-serif font-extrabold text-[#860a16] uppercase">FREQUENTLY ASKED QUESTIONS</h3>
                </div>

                <div className="space-y-3 max-w-3xl mx-auto">
                  {FAQS_DATA.map((faq, idx) => (
                    <div
                      key={idx}
                      className="card-reference-luxury rounded-2xl border border-rose-200/80 p-5 cursor-pointer hover:border-rose-300 transition-colors"
                      onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-bold text-[#111827]">{faq.q}</h4>
                        <ChevronRight
                          className={`w-4 h-4 text-[#860a16] transition-transform duration-200 ${
                            openFaqIdx === idx ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      {openFaqIdx === idx && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-[#4b5563] mt-3 pt-3 border-t border-rose-100 leading-relaxed"
                        >
                          {faq.a}
                        </motion.p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* PAGE 4: REGISTRATION & PORTAL GATEWAY (FULL HERO + CONTACT INFO)   */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {activePage === 'contact' && (
            <motion.div
              key="contact"
              custom={pageDirection}
              variants={pageTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-between space-y-12"
            >
              {/* Full Be a Part of Radianza '26 Callout with Live Stats */}
              <section className="w-full pt-16 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#fdf8fa] via-[#faedf2] to-[#fbf5f7] text-[#111827] relative overflow-hidden border-b border-rose-200/80">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c1121f]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-7">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-rose-300 shadow-xs">
                    <Flame className="w-4 h-4 text-[#c1121f]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#860a16]">
                      REGISTRATIONS ARE LIVE
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#860a16] tracking-tight leading-tight uppercase">
                    Be a Part of RADIANZA <span className="text-[#c1121f]">'26</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4b5563] max-w-xl mx-auto leading-relaxed">
                    Secure your registration today. Pick your competition track, build your team, and download your cryptographically verified entry pass.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-3xl mx-auto pt-2">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#860a16]">
                        {totalRegisteredCount}+
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">DELEGATES</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#111827]">
                        {totalSlotsLeft}
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">SLOTS LEFT</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#111827]">
                        45+
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">INSTITUTIONS</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-7 rounded-[26px] bg-white border border-rose-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-center"
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#860a16]">
                        ₹75,000+
                      </span>
                      <p className="text-[11px] text-[#6b7280] mt-1.5 uppercase font-mono font-bold tracking-widest">CASH AWARDS</p>
                    </motion.div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <div className="relative group w-full sm:w-auto">
                      <div className="absolute -inset-2 rounded-3xl bg-[#c1121f]/35 blur-xl animate-halo-pulse pointer-events-none" />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={onStartNewRegistration}
                        className="relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#860a16] via-[#9e0d19] to-[#860a16] hover:brightness-110 text-white font-extrabold text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsPassModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-[#860a16] font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-xs"
                    >
                      <QrCode className="w-4 h-4 text-[#c1121f]" />
                      <span>Already Registered? View Pass</span>
                    </motion.button>
                  </div>
                </div>
              </section>

              {/* Contact Information & Gateway Cards */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#860a16] bg-rose-100 px-3.5 py-1 rounded-full border border-rose-300">
                    GET IN TOUCH
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-[#860a16] uppercase">
                    CAMPUS DIRECTORY &amp; CONVENORS
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card-reference-luxury p-6 rounded-3xl border border-rose-200/80 space-y-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#860a16] flex items-center justify-center mx-auto">
                      <MapPin className="w-6 h-6 text-[#c1121f]" />
                    </div>
                    <h4 className="text-base font-bold text-[#111827]">Symposium Venue</h4>
                    <p className="text-xs text-[#4b5563] leading-relaxed">
                      Department of Information Technology, St. Peter's Institute of Higher Education &amp; Research, Avadi, Chennai - 600054
                    </p>
                  </div>

                  <div className="card-reference-luxury p-6 rounded-3xl border border-rose-200/80 space-y-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#860a16] flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-[#c1121f]" />
                    </div>
                    <h4 className="text-base font-bold text-[#111827]">Convenors &amp; Staff</h4>
                    <p className="text-xs text-[#4b5563] leading-relaxed">
                      Dr. S. K. Ramesh (HOD / IT)<br />
                      Prof. M. Priya (Staff Coordinator)<br />
                      radianza@spiher.ac.in
                    </p>
                  </div>

                  <div className="card-reference-luxury p-6 rounded-3xl border border-rose-200/80 space-y-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#860a16] flex items-center justify-center mx-auto">
                      <Lock className="w-6 h-6 text-[#c1121f]" />
                    </div>
                    <h4 className="text-base font-bold text-[#111827]">Staff &amp; Evaluator Portal</h4>
                    <p className="text-xs text-[#4b5563] leading-relaxed">
                      Coordinators, evaluators, and jury can access the mobile scanner and evaluator portal below.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenConsole}
                      className="mt-2 px-4 py-2 rounded-xl bg-rose-100 text-[#860a16] text-xs font-bold hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer"
                    >
                      Open Staff Console →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── PERSISTENT BOTTOM PAGE CONTROLLER & STEPPER ── */}
      <nav className="w-full bg-white/95 backdrop-blur-lg border-t border-rose-200 px-4 sm:px-8 py-3.5 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Page Button */}
          {prevPage ? (
            <button
              type="button"
              onClick={() => navigateToPage(prevPage.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#860a16] border border-rose-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#c1121f]" />
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
                      ? 'w-8 h-2.5 bg-[#860a16] shadow-[0_0_8px_rgba(134,10,22,0.4)]'
                      : 'w-2.5 h-2.5 bg-rose-200 hover:bg-rose-300'
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#860a16] hover:bg-[#a30d1c] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>{nextPage.navLabel}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#860a16] text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#c1121f]" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </nav>

      {/* ── 3. GLOBAL FOOTER ── */}
      <footer className="w-full bg-[#f4eff1] border-t border-rose-200 py-10 px-4 sm:px-6 lg:px-8 text-xs text-[#4b5563]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CollegeEmblem size={24} />
            <span className="font-serif font-extrabold text-base text-[#860a16]">
              RADIANZA '26
            </span>
            <span>• Department of Information Technology, SPIHER</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateToPage('home')}
              className={`transition-colors cursor-pointer ${
                activePage === 'home' ? 'text-[#860a16] font-bold' : 'hover:text-[#860a16]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateToPage('events')}
              className={`transition-colors cursor-pointer ${
                activePage === 'events' ? 'text-[#860a16] font-bold' : 'hover:text-[#860a16]'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => navigateToPage('about')}
              className={`transition-colors cursor-pointer ${
                activePage === 'about' ? 'text-[#860a16] font-bold' : 'hover:text-[#860a16]'
              }`}
            >
              About
            </button>
            <button
              onClick={() => navigateToPage('contact')}
              className={`transition-colors cursor-pointer ${
                activePage === 'contact' ? 'text-[#860a16] font-bold' : 'hover:text-[#860a16]'
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* ── 4. EVENT DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col"
            >
              <div className="relative h-44 w-full bg-rose-50">
                <img
                  src={selectedEventModal.imageUrl}
                  alt={selectedEventModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#c1121f] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-[#c1121f] text-white">
                    {selectedEventModal.category}
                  </span>
                  <h3 className="text-xl font-bold font-serif font-extrabold mt-1">{selectedEventModal.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs text-[#4b5563]">
                <p className="text-sm font-medium text-[#111827]">{selectedEventModal.description}</p>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-rose-50/80 border border-rose-200">
                  <div>
                    <span className="text-[10px] font-mono text-[#860a16] font-bold block uppercase">TIME</span>
                    <span className="font-bold text-[#111827]">{selectedEventModal.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#860a16] font-bold block uppercase">VENUE</span>
                    <span className="font-bold text-[#111827]">{selectedEventModal.venue}</span>
                  </div>
                </div>

                {selectedEventModal.rules && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-[#111827] uppercase">Event Rules &amp; Guidelines:</span>
                    <ul className="space-y-1 pl-1">
                      {selectedEventModal.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#c1121f] font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 bg-rose-50 border-t border-rose-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#860a16]">
                  {selectedEventModal.isTeamEvent ? 'Team Participation' : 'Solo Registration'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const evt = selectedEventModal;
                    setSelectedEventModal(null);
                    onSelectEvent(evt);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#860a16] to-[#c1121f] hover:brightness-110 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Register for this Event →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. GALLERY LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {selectedGalleryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col"
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
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#c1121f] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#860a16]">
                  {selectedGalleryModal.category}
                </span>
                <h3 className="text-lg font-bold text-[#111827]">{selectedGalleryModal.title}</h3>
                <p className="text-xs text-[#4b5563]">{selectedGalleryModal.caption}</p>
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
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden text-[#111827]"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#860a16] via-[#c1121f] to-[#e62645]" />

              <div className="p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-[#860a16] flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 text-[#c1121f]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-extrabold text-xl text-[#860a16] uppercase">
                        ACCESS EVENT PASS
                      </h3>
                      <p className="text-xs text-[#6b7280]">Enter credentials to view your QR pass.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPassModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-rose-50 text-[#860a16] hover:bg-rose-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {accessError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-[#860a16] text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#c1121f] mt-0.5" />
                    <span>{accessError}</span>
                  </div>
                )}

                <form onSubmit={handlePassLookupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#374151] uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#c1121f]" />
                      <span>Roll Number / Register Number</span>
                      <span className="text-[#c1121f]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={accessRollNumber}
                      onChange={(e) => setAccessRollNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 2021CS042"
                      className="w-full px-4 py-2.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs sm:text-sm font-mono font-bold text-[#111827] focus:outline-none focus:border-[#c1121f] focus:ring-2 focus:ring-[#c1121f]/20 uppercase"
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
                    className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#860a16] via-[#c1121f] to-[#e62645] hover:brightness-110 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#c1121f]/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isVerifyingPass ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Open My Pass</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-[#6b7280]">Demo user:</span>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('2021CS042', '2003-05-14')}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[#860a16] font-mono text-[11px] font-bold hover:bg-rose-100 cursor-pointer"
                  >
                    ⚡ Autofill 2021CS042
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
