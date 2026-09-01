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
import { MockDatabaseService } from './data/mockDatabase';
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

export default function App() {
  // 1. URL Route Detection (Separate routes for /participant, /console, /employee, /admin, /superadmin)
  const [currentRole, setCurrentRole] = useState<PortalRole>('participant');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

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

  // 4. Staff Auth State
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(null);

  // Reload data from storage
  const loadDatabaseData = () => {
    setEvents(MockDatabaseService.getEvents());
    setParticipants(MockDatabaseService.getParticipants());
    setRegistrations(MockDatabaseService.getRegistrations());
    setAttendanceList(MockDatabaseService.getAttendance());
    setScores(MockDatabaseService.getScores());
    setStaffList(MockDatabaseService.getStaffUsers());
    setEventChanges(MockDatabaseService.getEventChanges());
    setAuditLogs(MockDatabaseService.getAuditLogs());
    setSettings(MockDatabaseService.getSettings());
  };

  // Determine current portal strictly by URL path / hash
  const syncRouteFromLocation = () => {
    loadDatabaseData();
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (pathname.includes('/superadmin') || hash.includes('superadmin')) {
      setCurrentRole('superadmin');
    } else if (pathname.includes('/admin') || hash.includes('admin')) {
      setCurrentRole('admin');
    } else if (pathname.includes('/employee') || hash.includes('employee')) {
      setCurrentRole('employee');
    } else if (pathname.includes('/console') || hash.includes('console')) {
      setCurrentRole('console');
    } else {
      // Default: Pure Participant
      setCurrentRole('participant');
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
    setCurrentStaffUser(user);
    navigateTo(`/${redirectRole}`, redirectRole);
  };

  const handleStaffLogout = () => {
    setCurrentStaffUser(null);
    navigateTo('/console', 'console');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000a1e] text-slate-900 dark:text-white flex flex-col font-sans selection:bg-secondary selection:text-white">
      {/* ========================================================================= */}
      {/* 1. PARTICIPANT PORTAL (PUBLIC FACING ONLY - NO STAFF SWITCHER)            */}
      {/* ========================================================================= */}
      {currentRole === 'participant' && (
        <div className="flex-1 flex flex-col items-center justify-start">
          {/* Branded Animated Loading Splash Screen */}
          {isInitialLoading && (
            <BrandedLoadingScreen
              collegeName={settings.collegeName}
              symposiumName={settings.symposiumName}
              onFinish={() => setIsInitialLoading(false)}
              durationMs={1300}
            />
          )}

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

          {/* Participant Dashboard (Home, Rules, Event Countdown, Contact Us, My QR Pass, Change Event) */}
          {participantStep === 'dashboard' && currentParticipant && currentRegistration && (
            <ParticipantDashboard
              participant={currentParticipant}
              registration={currentRegistration}
              events={events}
              onSignOut={() => setParticipantStep('access')}
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
          <StaffConsoleLogin onLoginSuccess={handleStaffLoginSuccess} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EMPLOYEE PORTAL (URL: /employee)                                       */}
      {/* ========================================================================= */}
      {currentRole === 'employee' && (
        <div className="flex-1 flex flex-col">
          <EmployeeDashboard
            staffUser={
              currentStaffUser?.role === 'EMPLOYEE'
                ? currentStaffUser
                : staffList.find((s) => s.role === 'EMPLOYEE') || staffList[3] || {
                    id: 'staff-emp-codeathon',
                    email: 'judge.codeathon@spiher.edu.in',
                    name: 'Praveen Chandran (Lead Evaluator)',
                    role: 'EMPLOYEE',
                    assignedEventIds: ['evt-codeathon'],
                    isActive: true,
                  }
            }
            events={events}
            registrations={registrations}
            attendanceList={attendanceList}
            scores={scores}
            onStaffLogout={handleStaffLogout}
            onRefreshData={loadDatabaseData}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADMIN PORTAL (URL: /admin)                                             */}
      {/* ========================================================================= */}
      {currentRole === 'admin' && (
        <div className="flex-1 flex flex-col">
          <AdminPortal
            adminUser={
              currentStaffUser?.role === 'ADMIN'
                ? currentStaffUser
                : staffList.find((s) => s.role === 'ADMIN') || staffList[1] || {
                    id: 'staff-admin',
                    email: 'admin@spiher.edu.in',
                    name: 'Dr. K. Senthil Nathan (Event Admin)',
                    role: 'ADMIN',
                    assignedEventIds: [], // All 11 events
                    isActive: true,
                  }
            }
            events={events}
            registrations={registrations}
            attendanceList={attendanceList}
            scores={scores}
            staffList={staffList}
            onStaffLogout={handleStaffLogout}
            onRefreshData={loadDatabaseData}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUPER ADMIN PORTAL (URL: /superadmin)                                   */}
      {/* ========================================================================= */}
      {currentRole === 'superadmin' && (
        <div className="flex-1 flex flex-col">
          <SuperAdminPortal
            superAdminUser={
              currentStaffUser?.role === 'SUPER_ADMIN'
                ? currentStaffUser
                : staffList.find((s) => s.role === 'SUPER_ADMIN') || staffList[0] || {
                    id: 'staff-super',
                    email: 'superadmin@spiher.edu.in',
                    name: 'Dr. M. Sivasankaran (Convenor)',
                    role: 'SUPER_ADMIN',
                    assignedEventIds: [],
                    isActive: true,
                  }
            }
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
        </div>
      )}
    </div>
  );
}
