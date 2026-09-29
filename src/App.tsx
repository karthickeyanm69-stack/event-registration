import React, { useState, useEffect, useCallback } from 'react';
import { DimensionalCinematicExperience, ParticipantGateData } from './components/participant/DimensionalCinematicExperience';
import { ParticipantAccess } from './components/participant/ParticipantAccess';
import { RadianzaLandingPage } from './components/participant/RadianzaLandingPage';
import { OnboardingDetailsForm } from './components/participant/OnboardingDetailsForm';
import { EventSelectionView } from './components/participant/EventSelectionView';
import { TeamBuilderFlow } from './components/participant/TeamBuilderFlow';
import { PaymentGateway } from './components/participant/PaymentGateway';
import { RegistrationSuccessPass } from './components/participant/RegistrationSuccessPass';
import { ParticipantDashboard } from './components/participant/ParticipantDashboard';
import { StaffConsoleLogin } from './components/console/StaffConsoleLogin';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { SuperAdminPortal } from './components/superadmin/SuperAdminPortal';
import { PublicPassVerificationModal } from './components/participant/PublicPassVerificationModal';
import { MockDatabaseService } from './data/mockDatabase';
import { supabase } from './lib/supabaseClient';
import {
  AttendanceRecord,
  AuditLog,
  CollegeEvent,
  EventChangeAudit,
  Participant,
  PortalRole,
  Registration,
  ScoreRecord,
  StaffUser,
  SystemSettings,
  TeamMember,
} from './types';

const STAFF_AUTH_SESSION_KEY = 'SPIHER_STAFF_AUTH_SESSION';
const WEB_REVEALED_SESSION_KEY = 'SPIHER_WEB_REVEALED';
const PARTICIPANT_SESSION_KEY = 'SPIHER_PARTICIPANT_SESSION';

interface StoredParticipantSession {
  participant?: Participant | null;
  registration?: Registration | null;
  onboardingDraft?: Partial<Participant>;
  selectedEventId?: string | null;
}

const getStoredParticipantSession = (): StoredParticipantSession => {
  try {
    const raw = sessionStorage.getItem(PARTICIPANT_SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveParticipantSession = (data: Partial<StoredParticipantSession>) => {
  try {
    const current = getStoredParticipantSession();
    const updated = { ...current, ...data };
    sessionStorage.setItem(PARTICIPANT_SESSION_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

export default function App() {
  // 1. URL Route Detection (Separate routes for /participant, /console, /employee, /admin, /superadmin)
  const [currentRole, setCurrentRole] = useState<PortalRole>('participant');
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      // If user is on any subpage (like /register, /dashboard, /console), immediately mark revealed
      if (path !== '/' && path !== '') {
        return true;
      }
      return sessionStorage.getItem(WEB_REVEALED_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [authRedirectNotice, setAuthRedirectNotice] = useState<string | null>(null);

  const handleRevealComplete = useCallback((gateData?: ParticipantGateData) => {
    setIsRevealed(true);
    try {
      sessionStorage.setItem(WEB_REVEALED_SESSION_KEY, 'true');
      if (gateData) {
        setOnboardingDraft((prev) => ({
          ...prev,
          name: gateData.name || prev?.name,
          collegeName: gateData.collegeName || prev?.collegeName,
          rollNumber: gateData.participantKey || prev?.rollNumber,
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  // 2. Database Reactive State
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [eventChanges, setEventChanges] = useState<EventChangeAudit[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(MockDatabaseService.getSettings());

  // 3. Strict Participant Flow Steps:
  // 'access' -> 'onboarding' -> 'events' -> 'team' -> 'success' -> 'dashboard'
  type ParticipantFlowStep = 'access' | 'onboarding' | 'events' | 'team' | 'payment' | 'success' | 'dashboard';
  type LandingPageId = 'home' | 'events' | 'about' | 'contact';

  const isPaymentValidOrPending = (reg: Registration | null | undefined): boolean => {
    if (!reg) return false;
    const pStatus = (reg.paymentStatus || '').toLowerCase();
    return pStatus === 'completed' || pStatus === 'pending';
  };

  const initialSession = getStoredParticipantSession();
  const initialEvents = MockDatabaseService.getEvents();
  const hasValidPaymentOrPending = isPaymentValidOrPending(initialSession.registration);

  const [participantStep, setParticipantStep] = useState<ParticipantFlowStep>('access');
  const [landingPageId, setLandingPageId] = useState<LandingPageId>('home');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(
    () => (hasValidPaymentOrPending ? initialSession.participant || null : null)
  );
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(
    () => (hasValidPaymentOrPending ? initialSession.registration || null : null)
  );
  const [onboardingDraft, setOnboardingDraft] = useState<Partial<Participant>>({});
  const [selectedEventForReg, setSelectedEventForReg] = useState<CollegeEvent | null>(() => {
    if (hasValidPaymentOrPending && initialSession.registration?.eventId) {
      return initialEvents.find((e) => e.id === initialSession.registration?.eventId) || null;
    }
    return null;
  });
  const [pendingTeamData, setPendingTeamData] = useState<{ teamName: string; members: TeamMember[] } | null>(null);

  // 3.1. Public QR Pass Scan Verification Modal (Opens when scanned with any smartphone camera)
  const [verifiedPassModal, setVerifiedPassModal] = useState<{
    isOpen: boolean;
    registration: Registration | null;
    event: CollegeEvent | null;
    attendance: AttendanceRecord | null;
    errorState?: string | null;
  }>({
    isOpen: false,
    registration: null,
    event: null,
    attendance: null,
    errorState: null,
  });

  // 4. Staff Auth State with Session Storage persistence
  const getStoredStaffSession = (): StaffUser | null => {
    try {
      const raw = sessionStorage.getItem(STAFF_AUTH_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(getStoredStaffSession);

  // Reload data from local cache and sync with live Supabase Database
  const loadDatabaseData = async () => {
    // 1. Instant local read for 0-latency UI
    setEvents(MockDatabaseService.getEvents());
    setParticipants(MockDatabaseService.getParticipants());
    setRegistrations(MockDatabaseService.getRegistrations());
    setAttendanceList(MockDatabaseService.getAttendance());
    setScores(MockDatabaseService.getScores());
    setStaffList(MockDatabaseService.getStaffUsers());
    setEventChanges(MockDatabaseService.getEventChanges());
    setAuditLogs(MockDatabaseService.getAuditLogs());
    setSettings(MockDatabaseService.getSettings());

    // 2. Pull live state directly from Supabase Database
    try {
      await MockDatabaseService.syncWithSupabase();
      setEvents(MockDatabaseService.getEvents());
      setParticipants(MockDatabaseService.getParticipants());
      setRegistrations(MockDatabaseService.getRegistrations());
      setAttendanceList(MockDatabaseService.getAttendance());
      setScores(MockDatabaseService.getScores());
      setStaffList(MockDatabaseService.getStaffUsers());
      setEventChanges(MockDatabaseService.getEventChanges());
      setAuditLogs(MockDatabaseService.getAuditLogs());
      setSettings(MockDatabaseService.getSettings());
    } catch (e) {
      console.warn('Live Supabase data sync exception:', e);
    }
  };

  // Determine current portal strictly by URL path with clean DNS/page-name routing & Auth Guards
  const syncRouteFromLocation = () => {
    loadDatabaseData();
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const session = getStoredStaffSession();
    setCurrentStaffUser(session);

    if (pathname.includes('/superadmin') || hash.includes('superadmin')) {
      if (!session) {
        setAuthRedirectNotice('Super Admin authentication required. Please sign in to continue.');
        setCurrentRole('console');
        window.history.replaceState({}, '', '/console');
      } else if (session.role !== 'SUPER_ADMIN') {
        const targetPath = session.role === 'ADMIN' ? '/admin' : '/employee';
        const targetRole: PortalRole = session.role === 'ADMIN' ? 'admin' : 'employee';
        setAuthRedirectNotice(`Access restricted. You are signed in as ${session.name} (${session.role}).`);
        setCurrentRole(targetRole);
        window.history.replaceState({}, '', targetPath);
      } else {
        setAuthRedirectNotice(null);
        setCurrentRole('superadmin');
        if (pathname !== '/superadmin' || window.location.hash) {
          window.history.replaceState({}, '', '/superadmin');
        }
      }
    } else if (pathname.includes('/admin') || hash.includes('admin')) {
      if (!session) {
        setAuthRedirectNotice('Event Admin authentication required. Please sign in to continue.');
        setCurrentRole('console');
        window.history.replaceState({}, '', '/console');
      } else if (session.role === 'EMPLOYEE') {
        setAuthRedirectNotice('Staff Evaluator profile is restricted to the Scanner & Scoring PWA.');
        setCurrentRole('employee');
        window.history.replaceState({}, '', '/employee');
      } else {
        setAuthRedirectNotice(null);
        setCurrentRole('admin');
        if (pathname !== '/admin' || window.location.hash) {
          window.history.replaceState({}, '', '/admin');
        }
      }
    } else if (
      pathname.includes('/employee') ||
      pathname.includes('/scanner') ||
      hash.includes('employee') ||
      hash.includes('scanner')
    ) {
      if (!session) {
        setAuthRedirectNotice('Staff Evaluator authentication required. Please sign in to continue.');
        setCurrentRole('console');
        window.history.replaceState({}, '', '/console');
      } else {
        setAuthRedirectNotice(null);
        setCurrentRole('employee');
        if (pathname !== '/employee' || window.location.hash) {
          window.history.replaceState({}, '', '/employee');
        }
      }
    } else if (
      pathname.includes('/console') ||
      pathname.includes('/login') ||
      hash.includes('console') ||
      hash.includes('login')
    ) {
      setCurrentRole('console');
      if (pathname !== '/console' || window.location.hash) {
        window.history.replaceState({}, '', '/console');
      }
    } else if (pathname.startsWith('/dashboard') || hash.includes('dashboard')) {
      setCurrentRole('participant');
      setParticipantStep('dashboard');
      if (window.location.hash) {
        window.history.replaceState({}, '', pathname.startsWith('/dashboard') ? pathname : '/dashboard');
      }
    } else if (
      pathname.startsWith('/pass') ||
      pathname.startsWith('/success') ||
      hash.includes('pass') ||
      hash.includes('success')
    ) {
      const stored = getStoredParticipantSession();
      if (stored.registration && isPaymentValidOrPending(stored.registration)) {
        setCurrentRegistration(stored.registration);
        setCurrentRole('participant');
        setParticipantStep('success');
        if (window.location.hash || pathname !== '/pass') {
          window.history.replaceState({}, '', '/pass');
        }
      } else {
        // No paid or pending registration -> do the flow from first
        setCurrentRole('participant');
        setParticipantStep('access');
        setLandingPageId('home');
        window.history.replaceState({}, '', '/');
      }
    } else if (
      pathname.startsWith('/register/payment') ||
      pathname.startsWith('/payment') ||
      hash.includes('payment')
    ) {
      const stored = getStoredParticipantSession();
      if (stored.registration && isPaymentValidOrPending(stored.registration)) {
        setCurrentRegistration(stored.registration);
        if (stored.selectedEventId) {
          const found = MockDatabaseService.getEvents().find((e) => e.id === stored.selectedEventId);
          if (found) setSelectedEventForReg(found);
        }
        setCurrentRole('participant');
        if ((stored.registration.paymentStatus || '').toLowerCase() === 'completed') {
          setParticipantStep('success');
          window.history.replaceState({}, '', '/pass');
        } else {
          setParticipantStep('payment');
          if (window.location.hash || pathname !== '/register/payment') {
            window.history.replaceState({}, '', '/register/payment');
          }
        }
      } else {
        // No paid or pending registration -> must do flow from first
        setCurrentRole('participant');
        setParticipantStep('access');
        setLandingPageId('home');
        setSelectedEventForReg(null);
        setOnboardingDraft({});
        window.history.replaceState({}, '', '/');
      }
    } else if (
      pathname.startsWith('/register/confirm') ||
      pathname.startsWith('/register/team') ||
      pathname.startsWith('/confirm') ||
      hash.includes('confirm') ||
      hash.includes('team')
    ) {
      const stored = getStoredParticipantSession();
      if (stored.registration && isPaymentValidOrPending(stored.registration)) {
        setCurrentRegistration(stored.registration);
        setCurrentRole('participant');
        if ((stored.registration.paymentStatus || '').toLowerCase() === 'completed') {
          setParticipantStep('success');
          window.history.replaceState({}, '', '/pass');
        } else {
          setParticipantStep('payment');
          window.history.replaceState({}, '', '/register/payment');
        }
      } else {
        // Unpaid / interrupted process: do the flow from first
        setCurrentRole('participant');
        setParticipantStep('access');
        setLandingPageId('home');
        setSelectedEventForReg(null);
        setOnboardingDraft({});
        try {
          sessionStorage.removeItem(PARTICIPANT_SESSION_KEY);
        } catch {
          // ignore
        }
        window.history.replaceState({}, '', '/');
      }
    } else if (
      pathname.startsWith('/register/events') ||
      pathname.startsWith('/select-event') ||
      hash.includes('select-event')
    ) {
      setCurrentRole('participant');
      setParticipantStep('events');
      if (window.location.hash || pathname !== '/register/events') {
        window.history.replaceState({}, '', '/register/events');
      }
    } else if (
      pathname.startsWith('/register') ||
      pathname.startsWith('/onboarding') ||
      hash.includes('register') ||
      hash.includes('onboarding')
    ) {
      setCurrentRole('participant');
      setParticipantStep('onboarding');
      if (window.location.hash || pathname !== '/register') {
        window.history.replaceState({}, '', '/register');
      }
    } else if (pathname.startsWith('/events') || hash === 'events') {
      setAuthRedirectNotice(null);
      setCurrentRole('participant');
      setParticipantStep('access');
      setLandingPageId('events');
      if (window.location.hash || pathname !== '/events') {
        window.history.replaceState({}, '', '/events');
      }
    } else if (pathname.startsWith('/about') || hash === 'about') {
      setAuthRedirectNotice(null);
      setCurrentRole('participant');
      setParticipantStep('access');
      setLandingPageId('about');
      if (window.location.hash || pathname !== '/about') {
        window.history.replaceState({}, '', '/about');
      }
    } else if (pathname.startsWith('/contact') || hash === 'contact') {
      setAuthRedirectNotice(null);
      setCurrentRole('participant');
      setParticipantStep('access');
      setLandingPageId('contact');
      if (window.location.hash || pathname !== '/contact') {
        window.history.replaceState({}, '', '/contact');
      }
    } else {
      // Default: Pure Participant Portal Root Home
      setAuthRedirectNotice(null);
      setCurrentRole('participant');
      setParticipantStep('access');
      setLandingPageId('home');
      if (window.location.hash) {
        window.history.replaceState({}, '', '/');
      }
    }

    // Check if URL contains scanned verification parameters (?verify= or ?token= or ?pass=)
    const searchParams = new URLSearchParams(window.location.search);
    const verifyPassId = searchParams.get('verify') || searchParams.get('pass');
    const verifyToken = searchParams.get('token');

    if (verifyPassId || verifyToken) {
      const allRegs = MockDatabaseService.getRegistrations();
      const allEvents = MockDatabaseService.getEvents();
      const allAttendance = MockDatabaseService.getAttendance();

      const matchedReg = allRegs.find(
        (r) =>
          (verifyPassId && r.registrationNumber.toUpperCase() === verifyPassId.toUpperCase()) ||
          (verifyToken && r.qrToken === verifyToken)
      );

      if (matchedReg) {
        const matchedEvent = allEvents.find((e) => e.id === matchedReg.eventId) || null;
        const matchedAtt = allAttendance.find((a) => a.registrationId === matchedReg.id) || null;
        setVerifiedPassModal({
          isOpen: true,
          registration: matchedReg,
          event: matchedEvent,
          attendance: matchedAtt,
          errorState: matchedReg.status === 'CANCELLED' ? 'Pass Cancelled / Revoked' : null,
        });
      } else {
        setVerifiedPassModal({
          isOpen: true,
          registration: null,
          event: null,
          attendance: null,
          errorState: 'Pass Record Not Found in Registry',
        });
      }
    }
  };

  useEffect(() => {
    syncRouteFromLocation();

    // Listen to browser forward/back buttons
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, []);

  // Guard against navigating out, tab-switching, or reloading into an incomplete flow
  useEffect(() => {
    const handleTabRevisit = () => {
      if (document.visibilityState === 'visible') {
        const stored = getStoredParticipantSession();
        const hasValid =
          stored.registration &&
          ['completed', 'pending'].includes((stored.registration.paymentStatus || '').toLowerCase());

        // If user is at team confirmation but missing event or onboarding data, reset to first
        if (participantStep === 'team') {
          if (!selectedEventForReg || !onboardingDraft?.name || !onboardingDraft?.rollNumber) {
            navigateTo('/', 'participant', 'access', 'home');
          }
        } else if (participantStep === 'payment' && !hasValid && !currentRegistration) {
          // If at payment step without a registered order, reset to first
          navigateTo('/', 'participant', 'access', 'home');
        }
      }
    };

    document.addEventListener('visibilitychange', handleTabRevisit);
    window.addEventListener('focus', handleTabRevisit);
    return () => {
      document.removeEventListener('visibilitychange', handleTabRevisit);
      window.removeEventListener('focus', handleTabRevisit);
    };
  }, [participantStep, selectedEventForReg, onboardingDraft, currentRegistration]);

  // 5. Scoped PWA Installation Manager (Exclusively for Employee, Admin, and Super Admin)
  useEffect(() => {
    const isStaffPortal = ['employee', 'admin', 'superadmin', 'console'].includes(currentRole);
    const existingManifestLink = document.getElementById('spiher-staff-pwa-manifest');

    const handleBeforeInstall = (e: Event) => {
      // Prevent browser install prompt popup/bar on participant pages
      if (!isStaffPortal) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isStaffPortal) {
      // 1. Inject PWA Manifest for Staff & Admin dashboards
      if (!existingManifestLink) {
        const manifestLink = document.createElement('link');
        manifestLink.id = 'spiher-staff-pwa-manifest';
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest.json';
        document.head.appendChild(manifestLink);
      }

      // 2. Register Service Worker in production only for Native Chrome Installation
      if ('serviceWorker' in navigator) {
        if (import.meta.env.PROD) {
          navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.warn('Staff PWA ServiceWorker registration warning:', err);
          });
        } else {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
              registration.unregister();
            }
          });
        }
      }
    } else {
      // Remove manifest when viewing participant pages
      if (existingManifestLink) {
        existingManifestLink.remove();
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [currentRole]);

  const navigateTo = (
    path: string,
    role: PortalRole = 'participant',
    step: ParticipantFlowStep = 'access',
    landingPage: LandingPageId = 'home'
  ) => {
    setCurrentRole(role);
    setParticipantStep(step);
    setLandingPageId(landingPage);
    if (window.location.pathname !== path || window.location.hash) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Participant Flow Transitions
  const handleParticipantAccessSuccess = (participant: Participant, registration?: Registration) => {
    setCurrentParticipant(participant);
    saveParticipantSession({ participant, registration });
    if (registration) {
      // Existing active registration found -> open participant dashboard directly
      setCurrentRegistration(registration);
      navigateTo('/dashboard', 'participant', 'dashboard');
    } else {
      // Participant exists but no registration -> proceed to event selection
      setOnboardingDraft(participant);
      navigateTo('/register/events', 'participant', 'events');
    }
  };

  const handleStartNewRegistration = () => {
    setOnboardingDraft({});
    setSelectedEventForReg(null);
    setCurrentRegistration(null);
    saveParticipantSession({ onboardingDraft: {}, selectedEventId: null, registration: null });
    navigateTo('/register', 'participant', 'onboarding');
  };

  const handleOnboardingContinue = (draft: Partial<Participant>) => {
    setOnboardingDraft(draft);
    saveParticipantSession({ onboardingDraft: draft });
    navigateTo('/register/events', 'participant', 'events');
  };

  const handleSelectEvent = (event: CollegeEvent) => {
    setSelectedEventForReg(event);
    saveParticipantSession({ selectedEventId: event.id });
    navigateTo('/register/confirm', 'participant', 'team');
  };

  const handleSubmitTeamAndRegister = (teamName: string, members: TeamMember[]) => {
    if (!selectedEventForReg) return;
    const currentEvent = events.find((e) => e.id === selectedEventForReg.id) || selectedEventForReg;
    const leaderMember = members.find((m) => m.isLeader) || members[0];

    const res = MockDatabaseService.createRegistration({
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      category: currentEvent.category,
      leaderId: `part-${Date.now()}`,
      leaderName: leaderMember.name,
      leaderRollNumber: leaderMember.rollNumber,
      leaderEmail: onboardingDraft.email || `${leaderMember.rollNumber.toLowerCase()}@spiher.edu.in`,
      leaderPhone: onboardingDraft.phone,
      collegeName: leaderMember.collegeName,
      department: leaderMember.department,
      isTeamEvent: currentEvent.isTeamEvent,
      teamName: currentEvent.isTeamEvent ? teamName : undefined,
      members,
      paymentStatus: 'PENDING',
      amountPaid: currentEvent.price,
    });

    if (res.success && res.registration) {
      loadDatabaseData();
      const updatedParts = MockDatabaseService.getParticipants();
      const leaderPart = updatedParts.find(
        (p) =>
          MockDatabaseService.normalizeRollNumber(p.rollNumber) ===
          MockDatabaseService.normalizeRollNumber(leaderMember.rollNumber)
      );
      if (leaderPart) setCurrentParticipant(leaderPart);
      setCurrentRegistration(res.registration);
      saveParticipantSession({
        registration: res.registration,
        participant: leaderPart,
        selectedEventId: currentEvent.id,
      });

      // All events require payment — route to payment step (PENDING until verified)
      setPendingTeamData({ teamName, members });
      navigateTo('/register/payment', 'participant', 'payment');
    } else {
      alert(res.error || 'Registration failed.');
    }
  };

  const handlePaymentVerified = (updatedRegistration: Registration) => {
    setCurrentRegistration(updatedRegistration);
    saveParticipantSession({ registration: updatedRegistration });
    loadDatabaseData();
    navigateTo('/pass', 'participant', 'success');
  };

  // Staff Console Transitions
  const handleStaffLoginSuccess = (user: StaffUser, redirectRole: PortalRole) => {
    sessionStorage.setItem(STAFF_AUTH_SESSION_KEY, JSON.stringify(user));
    setCurrentStaffUser(user);
    setAuthRedirectNotice(null);
    navigateTo(`/${redirectRole}`, redirectRole);
  };

  const handleStaffLogout = () => {
    sessionStorage.removeItem(STAFF_AUTH_SESSION_KEY);
    setCurrentStaffUser(null);
    setAuthRedirectNotice(null);
    navigateTo('/console', 'console', 'access', 'home');
  };

  const handleParticipantLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setCurrentParticipant(null);
    setCurrentRegistration(null);
    setOnboardingDraft({});
    setSelectedEventForReg(null);
    sessionStorage.removeItem(PARTICIPANT_SESSION_KEY);
    navigateTo('/', 'participant', 'access', 'home');
  };

  const isDarkLanding = currentRole === 'participant' && participantStep === 'access';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkLanding
          ? 'bg-[#faf6f8] text-[#111827] selection:bg-[#c1121f] selection:text-white'
          : 'bg-slate-50 text-slate-900 selection:bg-[#0077c8] selection:text-white'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. PARTICIPANT PORTAL (PUBLIC FACING ONLY - NO STAFF SWITCHER)            */}
      {/* ========================================================================= */}
      {currentRole === 'participant' && (
        <div className="flex-1 flex flex-col items-center justify-start w-full relative">
          {/* Dimensional Cinematic Experience - ONLY on initial landing page entrance */}
          {!isRevealed && participantStep === 'access' && landingPageId === 'home' && (
            <DimensionalCinematicExperience
              onComplete={handleRevealComplete}
              initialData={{
                name: onboardingDraft?.name,
                collegeName: onboardingDraft?.collegeName,
                participantKey: onboardingDraft?.rollNumber,
              }}
            />
          )}

          {/* RADIANZA '26 Flagship Landing Page & Entrance Experience */}
          {participantStep === 'access' && (
            <RadianzaLandingPage
              isRevealed={isRevealed}
              events={events}
              activeLandingPage={landingPageId}
              onNavigateLandingPage={(pageId) => {
                const cleanPath = pageId === 'home' ? '/' : `/${pageId}`;
                navigateTo(cleanPath, 'participant', 'access', pageId);
              }}
              onStartNewRegistration={handleStartNewRegistration}
              onSelectEvent={(event) => {
                setSelectedEventForReg(event);
                navigateTo('/register', 'participant', 'onboarding');
              }}
              onSuccessfulAccess={handleParticipantAccessSuccess}
              onOpenConsole={() => navigateTo('/console', 'console', 'access', 'home')}
            />
          )}

          {/* Onboarding Form (Personal, College, Roll No, DOB, Email) */}
          {participantStep === 'onboarding' && (
            <OnboardingDetailsForm
              onBackToAccess={() => navigateTo('/', 'participant', 'access', 'home')}
              onContinueToEvents={handleOnboardingContinue}
              onRedirectToExistingDashboard={(part, reg) => {
                setCurrentParticipant(part);
                setCurrentRegistration(reg);
                saveParticipantSession({ participant: part, registration: reg });
                navigateTo('/dashboard', 'participant', 'dashboard');
              }}
            />
          )}

          {/* Event Selection (Technical vs Non-Technical) */}
          {participantStep === 'events' && (
            <EventSelectionView
              events={events}
              participantData={onboardingDraft}
              onBackToOnboarding={() => navigateTo('/register', 'participant', 'onboarding')}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {/* Team Builder (Team Leader default + Teammates + Same College/Dept + 1-Event Check) */}
          {participantStep === 'team' && (
            (() => {
              const activeEvent =
                events.find((e) => e.id === selectedEventForReg?.id) || selectedEventForReg;

              // If event or participant onboarding details are missing, return null
              if (!activeEvent || !onboardingDraft?.name || !onboardingDraft?.rollNumber) {
                return null;
              }

              return (
                <TeamBuilderFlow
                  event={activeEvent}
                  participantData={onboardingDraft}
                  onBackToEventSelection={() => navigateTo('/register/events', 'participant', 'events')}
                  onSubmitTeamAndRegister={handleSubmitTeamAndRegister}
                />
              );
            })()
          )}

          {/* Payment Gateway Step for Paid Events */}
          {participantStep === 'payment' && (
            (() => {
              const activeReg =
                currentRegistration ||
                getStoredParticipantSession().registration ||
                null;

              if (!activeReg || !isPaymentValidOrPending(activeReg)) {
                return (
                  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <p className="text-slate-600 font-medium text-sm">No active registration found to pay for.</p>
                    <button
                      type="button"
                      onClick={() => navigateTo('/', 'participant', 'access', 'home')}
                      className="px-5 py-2.5 bg-[#002b66] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#001f4d] transition-colors cursor-pointer"
                    >
                      Return to Home
                    </button>
                  </div>
                );
              }

              const activeEvent =
                events.find((e) => e.id === selectedEventForReg?.id) ||
                selectedEventForReg ||
                events.find((e) => e.id === activeReg.eventId) ||
                null;

              if (!activeEvent) return null;

              return (
                <PaymentGateway
                  event={activeEvent}
                  registration={activeReg}
                  participantData={{
                    name: activeReg.leaderName,
                    rollNumber: activeReg.leaderRollNumber,
                    collegeName: activeReg.collegeName,
                    department: activeReg.department,
                    email: activeReg.leaderEmail,
                    phone: activeReg.leaderPhone,
                  }}
                  onPaymentVerified={handlePaymentVerified}
                  onBackToEvents={() => navigateTo('/', 'participant', 'access', 'home')}
                />
              );
            })()
          )}

          {/* Registration Success & Vector QR Pass Display with Download */}
          {participantStep === 'success' && (
            (() => {
              const activeReg = currentRegistration || MockDatabaseService.getRegistrations()[0];
              const activeEvent =
                events.find((e) => e.id === activeReg?.eventId) ||
                selectedEventForReg ||
                events[0];

              if (!activeReg) return null;

              return (
                <RegistrationSuccessPass
                  registration={activeReg}
                  event={activeEvent}
                  onProceedToDashboard={() => navigateTo('/dashboard', 'participant', 'dashboard')}
                />
              );
            })()
          )}

          {/* Participant Dashboard / Public Landing (Home, Rules, Campus, Support, Entry Pass) */}
          {participantStep === 'dashboard' && (
            <ParticipantDashboard
              participant={currentParticipant || MockDatabaseService.getParticipants()[0]}
              registration={currentRegistration || MockDatabaseService.getRegistrations()[0]}
              events={events}
              onSignOut={handleParticipantLogout}
              onStartNewRegistration={handleStartNewRegistration}
              onOpenAccessLogin={handleParticipantLogout}
              onEventChangedSuccess={(newReg) => {
                setCurrentRegistration(newReg);
                loadDatabaseData();
              }}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SHARED STAFF CONSOLE (URL: /console)                                   */}
      {/* ========================================================================= */}
      {currentRole === 'console' && (
        <div className="flex-1 flex flex-col">
          <StaffConsoleLogin
            onLoginSuccess={handleStaffLoginSuccess}
            redirectNotice={authRedirectNotice}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EMPLOYEE PORTAL (URL: /employee) - AUTH GUARDED                       */}
      {/* ========================================================================= */}
      {currentRole === 'employee' && (
        <div className="flex-1 flex flex-col">
          {currentStaffUser ? (
            <EmployeeDashboard
              staffUser={currentStaffUser}
              events={events}
              registrations={registrations}
              attendanceList={attendanceList}
              scores={scores}
              onStaffLogout={handleStaffLogout}
              onRefreshData={loadDatabaseData}
            />
          ) : (
            <StaffConsoleLogin
              onLoginSuccess={handleStaffLoginSuccess}
              redirectNotice="Please sign in with your staff credentials to access the Evaluator portal."
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADMIN PORTAL (URL: /admin) - AUTH & ROLE GUARDED                       */}
      {/* ========================================================================= */}
      {currentRole === 'admin' && (
        <div className="flex-1 flex flex-col">
          {currentStaffUser && (currentStaffUser.role === 'ADMIN' || currentStaffUser.role === 'SUPER_ADMIN') ? (
            <AdminPortal
              adminUser={currentStaffUser}
              events={events}
              registrations={registrations}
              attendanceList={attendanceList}
              scores={scores}
              staffList={staffList}
              onStaffLogout={handleStaffLogout}
              onRefreshData={loadDatabaseData}
            />
          ) : (
            <StaffConsoleLogin
              onLoginSuccess={handleStaffLoginSuccess}
              redirectNotice="Please sign in with an Event Admin account to access the Admin portal."
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUPER ADMIN PORTAL (URL: /superadmin) - STRICT CONVENOR GUARDED        */}
      {/* ========================================================================= */}
      {currentRole === 'superadmin' && (
        <div className="flex-1 flex flex-col">
          {currentStaffUser && currentStaffUser.role === 'SUPER_ADMIN' ? (
            <SuperAdminPortal
              superAdminUser={currentStaffUser}
              events={events}
              participants={participants}
              registrations={registrations}
              attendanceList={attendanceList}
              scores={scores}
              staffList={staffList}
              eventChanges={eventChanges}
              auditLogs={auditLogs}
              settings={settings}
              onStaffLogout={handleStaffLogout}
              onRefreshData={loadDatabaseData}
            />
          ) : (
            <StaffConsoleLogin
              onLoginSuccess={handleStaffLoginSuccess}
              redirectNotice="Super Admin credentials required to access the Convenor Control Plane."
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PUBLIC DIGITAL PASS VERIFICATION MODAL (Camera QR Scan)                */}
      {/* ========================================================================= */}
      <PublicPassVerificationModal
        isOpen={verifiedPassModal.isOpen}
        registration={verifiedPassModal.registration}
        event={verifiedPassModal.event}
        attendanceRecord={verifiedPassModal.attendance}
        errorState={verifiedPassModal.errorState}
        onClose={() => {
          setVerifiedPassModal((prev) => ({ ...prev, isOpen: false }));
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    </div>
  );
}
