import React, { useState, useEffect } from 'react';
import { BrandedLoadingScreen } from './components/participant/BrandedLoadingScreen';
import { ParticipantAccess } from './components/participant/ParticipantAccess';
import { OnboardingDetailsForm } from './components/participant/OnboardingDetailsForm';
import { EventSelectionView } from './components/participant/EventSelectionView';
import { TeamBuilderFlow } from './components/participant/TeamBuilderFlow';
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

export default function App() {
  // 1. URL Route Detection (Separate routes for /participant, /console, /employee, /admin, /superadmin)
  const [currentRole, setCurrentRole] = useState<PortalRole>('participant');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [authRedirectNotice, setAuthRedirectNotice] = useState<string | null>(null);

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
  type ParticipantFlowStep = 'access' | 'onboarding' | 'events' | 'team' | 'success' | 'dashboard';
  const [participantStep, setParticipantStep] = useState<ParticipantFlowStep>('access');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(null);
  const [onboardingDraft, setOnboardingDraft] = useState<Partial<Participant>>({});
  const [selectedEventForReg, setSelectedEventForReg] = useState<CollegeEvent | null>(null);

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

  // Determine current portal strictly by URL path / hash with Auth Guards
  const syncRouteFromLocation = () => {
    loadDatabaseData();
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const session = getStoredStaffSession();
    setCurrentStaffUser(session);

    if (pathname.includes('/superadmin') || hash.includes('superadmin')) {
      if (!session) {
        setAuthRedirectNotice('Super Admin authentication required. Please sign in to continue.');
        setCurrentRole('console');
        window.history.replaceState({}, '', '/console');
      } else if (session.role !== 'SUPER_ADMIN') {
        // Redirect unauthorized users to their permitted portal
        const targetPath = session.role === 'ADMIN' ? '/admin' : '/employee';
        const targetRole: PortalRole = session.role === 'ADMIN' ? 'admin' : 'employee';
        setAuthRedirectNotice(`Access restricted. You are signed in as ${session.name} (${session.role}).`);
        setCurrentRole(targetRole);
        window.history.replaceState({}, '', targetPath);
      } else {
        setAuthRedirectNotice(null);
        setCurrentRole('superadmin');
      }
    } else if (pathname.includes('/admin') || hash.includes('admin')) {
      if (!session) {
        setAuthRedirectNotice('Event Admin authentication required. Please sign in to continue.');
        setCurrentRole('console');
        window.history.replaceState({}, '', '/console');
      } else if (session.role === 'EMPLOYEE') {
        // Evaluators cannot access the admin panel
        setAuthRedirectNotice('Staff Evaluator profile is restricted to the Scanner & Scoring PWA.');
        setCurrentRole('employee');
        window.history.replaceState({}, '', '/employee');
      } else {
        setAuthRedirectNotice(null);
        setCurrentRole('admin');
      }
    } else if (pathname.includes('/employee') || hash.includes('employee')) {
      if (!session) {
        setAuthRedirectNotice('Staff Evaluator authentication required. Please sign in to continue.');
        setCurrentRole('console');
        window.history.replaceState({}, '', '/console');
      } else {
        setAuthRedirectNotice(null);
        setCurrentRole('employee');
      }
    } else if (pathname.includes('/console') || hash.includes('console')) {
      setCurrentRole('console');
    } else {
      // Default: Pure Participant Portal
      setAuthRedirectNotice(null);
      setCurrentRole('participant');
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

  const navigateTo = (path: string, role: PortalRole) => {
    setCurrentRole(role);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Participant Flow Transitions
  const handleParticipantAccessSuccess = (participant: Participant, registration?: Registration) => {
    setCurrentParticipant(participant);
    if (registration) {
      // Existing active registration found -> open participant dashboard directly
      setCurrentRegistration(registration);
      setParticipantStep('dashboard');
    } else {
      // Participant exists but no registration -> proceed to event selection
      setOnboardingDraft(participant);
      setParticipantStep('events');
    }
  };

  const handleStartNewRegistration = () => {
    setOnboardingDraft({});
    setSelectedEventForReg(null);
    setParticipantStep('onboarding');
  };

  const handleOnboardingContinue = (draft: Partial<Participant>) => {
    setOnboardingDraft(draft);
    setParticipantStep('events');
  };

  const handleSelectEvent = (event: CollegeEvent) => {
    setSelectedEventForReg(event);
    setParticipantStep('team');
  };

  const handleSubmitTeamAndRegister = (teamName: string, members: TeamMember[]) => {
    if (!selectedEventForReg) return;

    const leaderMember = members.find((m) => m.isLeader) || members[0];
    const res = MockDatabaseService.createRegistration({
      eventId: selectedEventForReg.id,
      eventTitle: selectedEventForReg.title,
      category: selectedEventForReg.category,
      leaderId: `part-${Date.now()}`,
      leaderName: leaderMember.name,
      leaderRollNumber: leaderMember.rollNumber,
      leaderEmail: onboardingDraft.email || `${leaderMember.rollNumber.toLowerCase()}@spiher.edu.in`,
      leaderPhone: onboardingDraft.phone,
      collegeName: leaderMember.collegeName,
      department: leaderMember.department,
      isTeamEvent: selectedEventForReg.isTeamEvent,
      teamName: selectedEventForReg.isTeamEvent ? teamName : undefined,
      members,
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
      setParticipantStep('success');
    } else {
      alert(res.error || 'Registration failed.');
    }
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
    navigateTo('/console', 'console');
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
    setParticipantStep('access');
    sessionStorage.removeItem('spiher_participant_session');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#0077c8] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. PARTICIPANT PORTAL (PUBLIC FACING ONLY - NO STAFF SWITCHER)            */}
      {/* ========================================================================= */}
      {currentRole === 'participant' && (
        <div className="flex-1 flex flex-col items-center justify-start w-full">
          {/* Branded Animated Video Loading Splash Screen */}
          {isInitialLoading ? (
            <BrandedLoadingScreen
              collegeName={settings.collegeName}
              symposiumName={settings.symposiumName}
              onFinish={() => setIsInitialLoading(false)}
            />
          ) : (
            <>
              {/* Participant Access Page (Existing Access with Roll No + DOB OR New Registration) */}
              {participantStep === 'access' && (
                <ParticipantAccess
                  onSuccessfulAccess={handleParticipantAccessSuccess}
                  onStartNewRegistration={handleStartNewRegistration}
                />
              )}

          {/* Onboarding Form (Personal, College, Roll No, DOB, Email) */}
          {participantStep === 'onboarding' && (
            <OnboardingDetailsForm
              onBackToAccess={() => setParticipantStep('access')}
              onContinueToEvents={handleOnboardingContinue}
              onRedirectToExistingDashboard={(part, reg) => {
                setCurrentParticipant(part);
                setCurrentRegistration(reg);
                setParticipantStep('dashboard');
              }}
            />
          )}

          {/* Event Selection (Technical vs Non-Technical) */}
          {participantStep === 'events' && (
            <EventSelectionView
              events={events}
              participantData={onboardingDraft}
              onBackToOnboarding={() => setParticipantStep('onboarding')}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {/* Team Builder (Team Leader default + Teammates + Same College/Dept + 1-Event Check) */}
          {participantStep === 'team' && selectedEventForReg && (
            <TeamBuilderFlow
              event={selectedEventForReg}
              participantData={onboardingDraft}
              onBackToEventSelection={() => setParticipantStep('events')}
              onSubmitTeamAndRegister={handleSubmitTeamAndRegister}
            />
          )}

          {/* Registration Success & Vector QR Pass Display with Download */}
          {participantStep === 'success' && currentRegistration && (
            <RegistrationSuccessPass
              registration={currentRegistration}
              event={events.find((e) => e.id === currentRegistration.eventId)}
              onProceedToDashboard={() => setParticipantStep('dashboard')}
            />
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
          </>
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
