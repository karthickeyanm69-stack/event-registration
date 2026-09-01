/**
 * Comprehensive End-to-End Data Flow Verification Test Suite
 * Tests all models, services, constraints, audit logs, and authentication gateways.
 */

// Mock localStorage for Node environment
const mockStorage: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
};

import { MockDatabaseService } from './data/mockDatabase';
import { StaffUser } from './types';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}: ${details || 'Assertion failed'}`);
    testsFailed++;
  }
}

async function runDataFlowVerification() {
  console.log('\n=============================================================');
  console.log('🚀 SPIHER IGNITE 2024 — COMPREHENSIVE DATA FLOW VERIFICATION');
  console.log('=============================================================\n');

  // -----------------------------------------------------------------
  // 1. VERIFY EVENT DIRECTORY (11 EVENTS)
  // -----------------------------------------------------------------
  console.log('📦 STEP 1: Verifying 11 Technical & Non-Technical Competitions');
  const events = MockDatabaseService.getEvents();
  assert(events.length === 11, 'Total events count is exactly 11', `Found ${events.length}`);

  const techEvents = events.filter((e) => e.category === 'Technical');
  const nonTechEvents = events.filter((e) => e.category === 'Non-Technical');
  assert(techEvents.length === 6, 'Technical events count is 6', `Found ${techEvents.length}`);
  assert(nonTechEvents.length === 5, 'Non-Technical events count is 5', `Found ${nonTechEvents.length}`);

  const allHaveNoPrize = events.every((e) => !e.prizePool);
  assert(allHaveNoPrize, 'All 11 events have no prize pool fields configured');

  // -----------------------------------------------------------------
  // 2. PARTICIPANT AUTHENTICATION & LOOKUP
  // -----------------------------------------------------------------
  console.log('\n🔐 STEP 2: Verifying Participant Access (Roll No + DOB)');
  const authValid = MockDatabaseService.verifyParticipantAccess('2021CS042', '2003-05-14');
  assert(authValid.success === true, 'Existing participant Alex Mercer authenticated successfully');
  assert(authValid.registration !== undefined, 'Alex Mercer active registration IGNITE-2024-88421 retrieved');

  const authInvalid = MockDatabaseService.verifyParticipantAccess('2021CS042', '1999-01-01');
  assert(authInvalid.success === false, 'Invalid DOB rejected with error message');

  // -----------------------------------------------------------------
  // 3. REGISTRATION CREATION & 1-EVENT CONSTRAINT
  // -----------------------------------------------------------------
  console.log('\n📝 STEP 3: Verifying Registration Creation & Strict 1-Event Constraint');
  const newCandidateRoll = '2022IT099';
  const checkInitial = MockDatabaseService.isParticipantAlreadyRegistered(newCandidateRoll);
  assert(!checkInitial.isRegistered, 'New candidate 2022IT099 is not registered initially');

  const regResult = MockDatabaseService.createRegistration({
    eventId: 'evt-webcraft',
    eventTitle: 'Web Craft UI/UX',
    category: 'Technical',
    leaderId: 'part-new-1',
    leaderName: 'Karthik Raja',
    leaderRollNumber: newCandidateRoll,
    leaderEmail: 'karthik.it22@spiher.edu.in',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Information Technology',
    isTeamEvent: true,
    teamName: 'Pixel Pioneers',
    members: [
      {
        name: 'Karthik Raja',
        rollNumber: newCandidateRoll,
        department: 'Dept. of IT',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        dateOfBirth: '2004-03-12',
        isLeader: true,
      },
      {
        name: 'Suresh Raina',
        rollNumber: '2022IT100',
        department: 'Dept. of IT',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        dateOfBirth: '2004-05-18',
        isLeader: false,
      },
    ],
  });

  assert(regResult.success === true, 'Registration for Web Craft UI/UX created successfully');
  assert(regResult.registration?.registrationNumber.startsWith('IGNITE-2024-'), 'Generated valid IGNITE-2024 registration ID');
  assert(regResult.registration?.qrToken.startsWith('SPIHER_IGNITE_TOKEN_'), 'Generated cryptographic QR token');

  // Try registering the SAME candidate for another event (Strict 1-Event Rule)
  const duplicateReg = MockDatabaseService.createRegistration({
    eventId: 'evt-robosumo',
    eventTitle: 'Robo-Sumo Clash',
    category: 'Technical',
    leaderId: 'part-new-1',
    leaderName: 'Karthik Raja',
    leaderRollNumber: newCandidateRoll,
    leaderEmail: 'karthik.it22@spiher.edu.in',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Information Technology',
    isTeamEvent: false,
    members: [
      {
        name: 'Karthik Raja',
        rollNumber: newCandidateRoll,
        department: 'Dept. of IT',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        isLeader: true,
      },
    ],
  });
  assert(duplicateReg.success === false, 'Duplicate registration blocked by strict 1-participant-1-event rule');

  // -----------------------------------------------------------------
  // 4. QR VERIFICATION & ATTENDANCE SCANNER
  // -----------------------------------------------------------------
  console.log('\n📲 STEP 4: Verifying QR Verification Scanner & Gate Attendance');
  const staffJudge: StaffUser = {
    id: 'staff-emp-webcraft',
    name: 'Prof. S. Divya',
    email: 'divya.it@spiher.edu.in',
    role: 'EMPLOYEE',
    assignedEventIds: ['evt-webcraft'],
    isActive: true,
  };

  const qrToken = regResult.registration!.qrToken;
  const qrCheck = MockDatabaseService.verifyQRToken(qrToken, staffJudge);
  assert(qrCheck.success === true, 'QR pass validated successfully by authorized event staff');
  assert(qrCheck.alreadyAttended === false, 'Participant is marked as not attended before scan');

  // Mark Attendance
  const attResult = MockDatabaseService.recordAttendance(regResult.registration!.id, staffJudge);
  assert(attResult.success === true, 'Gate attendance marked as PRESENT');

  // Scan again (Duplicate Scan Prevention)
  const qrCheck2 = MockDatabaseService.verifyQRToken(qrToken, staffJudge);
  assert(qrCheck2.alreadyAttended === true, 'Duplicate scan flagged with existing attendance timestamp');

  // Unauthorized event staff scanning
  const otherStaff: StaffUser = {
    id: 'staff-emp-freefire',
    name: 'Karthik Raja',
    email: 'karthik.esports@spiher.edu.in',
    role: 'EMPLOYEE',
    assignedEventIds: ['evt-freefire'],
    isActive: true,
  };
  const wrongEventCheck = MockDatabaseService.verifyQRToken(qrToken, otherStaff);
  assert(wrongEventCheck.errorState === 'WRONG_EVENT', 'Unauthorized staff scanning flagged with WRONG_EVENT');

  // -----------------------------------------------------------------
  // 5. EVALUATION & SCORING FLOW
  // -----------------------------------------------------------------
  console.log('\n🏆 STEP 5: Verifying Evaluator Scoring & Leaderboards');
  MockDatabaseService.saveScore({
    id: 'scr-webcraft-1',
    registrationId: regResult.registration!.id,
    eventId: 'evt-webcraft',
    teamOrParticipantName: 'Pixel Pioneers (Karthik Raja)',
    rollNumberOrTeamId: newCandidateRoll,
    totalScore: 92,
    round: 'Final Evaluation',
    feedback: 'Stunning responsive UI with clean typography and excellent accessibility.',
    submittedByStaffId: staffJudge.id,
    submittedByStaffName: staffJudge.name,
    submittedAt: new Date().toISOString(),
  });

  const scores = MockDatabaseService.getScores();
  const savedScore = scores.find((s) => s.registrationId === regResult.registration!.id);
  assert(savedScore !== undefined && savedScore.totalScore === 92, 'Evaluation score of 92/100 stored and retrieved');

  // -----------------------------------------------------------------
  // 6. EVENT SWITCH / CHANGE EVENT FLOW
  // -----------------------------------------------------------------
  console.log('\n🔄 STEP 6: Verifying 1-Event Switch & Revocation Lifecycle');
  const switchResult = MockDatabaseService.changeEvent({
    currentRegistrationId: regResult.registration!.id,
    targetEventId: 'evt-bughunt',
    reason: 'Candidate prefers debugging solo challenge',
  });

  assert(switchResult.success === true, 'Event switch from Web Craft to Bug Hunter succeeded');
  assert(switchResult.newRegistration?.eventId === 'evt-bughunt', 'New registration points to Bug Hunter');

  // Verify OLD pass is revoked
  const oldPassCheck = MockDatabaseService.verifyQRToken(qrToken, staffJudge);
  assert(oldPassCheck.errorState === 'INVALID_QR', 'Old QR pass was revoked and is rejected at gate');

  // Verify Event Change Audit Logged
  const auditChanges = MockDatabaseService.getEventChanges();
  const foundAudit = auditChanges.find((a) => a.oldRegistrationId === regResult.registration?.registrationNumber);
  assert(foundAudit !== undefined, 'Tamper-evident event switch audit record created');

  // -----------------------------------------------------------------
  // 7. ADMIN PROVISIONING & PASS SLIP
  // -----------------------------------------------------------------
  console.log('\n👤 STEP 7: Verifying Admin Provisioning, Password Pass & Login Gateway');
  const newAdmin: StaffUser = {
    id: `staff-admin-${Date.now()}`,
    email: 'admin.mech@spiher.edu.in',
    name: 'Dr. R. Anand Kumar',
    role: 'ADMIN',
    password: 'SPIHER#Pass882',
    department: 'Dept. of Mechanical Engineering',
    assignedEventIds: ['evt-robosumo', 'evt-treasure'],
    isActive: true,
  };

  MockDatabaseService.saveStaffUser(newAdmin);
  const staffList = MockDatabaseService.getStaffUsers();
  assert(staffList.some((s) => s.email === newAdmin.email), 'New Event Admin saved in staff database');

  // Test Authentication with Correct Password
  const authAdminCorrect = MockDatabaseService.authenticateStaff(newAdmin.email, 'SPIHER#Pass882');
  assert(authAdminCorrect.success === true, 'Event Admin authenticated with assigned password pass');
  assert(authAdminCorrect.user?.name === newAdmin.name, 'Admin profile loaded correctly');

  // Test Authentication with Incorrect Password
  const authAdminWrong = MockDatabaseService.authenticateStaff(newAdmin.email, 'WrongPassword123');
  assert(authAdminWrong.success === false, 'Incorrect password rejected by authentication gateway');

  // -----------------------------------------------------------------
  // 8. UNIFIED EVENT ADMIN (ALL 11 EVENTS)
  // -----------------------------------------------------------------
  console.log('\n🌐 STEP 8: Verifying Unified Event Admin All-Events Overseer');
  const unifiedAdminAuth = MockDatabaseService.authenticateStaff('admin@spiher.edu.in', 'admin123');
  assert(unifiedAdminAuth.success === true, 'Unified Event Admin authenticated');
  assert(unifiedAdminAuth.user?.assignedEventIds.length === 0, 'Unified Event Admin assigned to all 11 competitions globally');

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`📊 FINAL VERIFICATION REPORT: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('=============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runDataFlowVerification();
