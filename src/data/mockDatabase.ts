import {
  AttendanceRecord,
  AuditLog,
  CollegeEvent,
  EventChangeAudit,
  Participant,
  Registration,
  ScoreRecord,
  StaffUser,
  SystemSettings,
} from '../types';

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  isRegistrationOpen: true,
  allowEventChange: true,
  collegeName: "St. Peter's Institute of Higher Education & Research",
  collegeShortName: "SPIHER",
  symposiumName: 'IGNITE 2024 — National Level Technical Symposium',
  symposiumYear: '2024',
  themeBannerText: 'Welcome to IGNITE 2024! Registrations are currently LIVE. Please ensure you carry your digital QR Pass.',
  supportEmail: 'ignite2024@spiher.edu.in',
  supportPhone: '+91 94440 12345',
  venueAddress: 'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054',
  emergencyNotice: undefined,
};

export const INITIAL_EVENTS: CollegeEvent[] = [
  {
    id: 'evt-codeathon',
    title: 'Code-A-Thon Sprint',
    category: 'Technical',
    tagline: '6-Hour Algorithmic & Full-Stack Coding Hackathon',
    description: 'An intense sprint where teams solve real-world algorithmic problems, optimize time complexity, and construct scalable prototypes under time pressure.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 3,
    price: 0,
    date: 'Oct 24, 2024',
    time: '09:30 AM - 03:30 PM',
    startTime: '09:30 AM',
    endTime: '03:30 PM',
    venue: 'Computing Centre Lab 3, Block B',
    totalSlots: 50,
    slotsLeft: 18,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹25,000',
    firstPrize: '₹15,000 + Trophy',
    secondPrize: '₹10,000 + Certificate',
    rules: [
      'Teams must strictly consist of 2 or 3 participants.',
      'Only approved IDEs and pre-installed compilers may be used.',
      'Plagiarism or use of unapproved generative AI will result in immediate disqualification.',
      'Decision of the technical jury panel is final and binding.',
    ],
    coordinators: [
      {
        id: 'coord-1',
        name: 'Dr. K. Senthil Nathan',
        role: 'Faculty Coordinator',
        phone: '+91 98401 23456',
        email: 'senthilnathan.cse@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Computer Science & Engineering',
      },
      {
        id: 'coord-2',
        name: 'Vignesh Kumar R',
        role: 'Student Coordinator',
        phone: '+91 97890 12345',
        email: 'vignesh.k21@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of CSE (Final Year)',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-robosumo',
    title: 'Robo-Sumo Clash',
    category: 'Technical',
    tagline: 'High-Torque Autonomous & RC Combat Battle',
    description: 'Heavyweight autonomous and RC bot arena battles. Push your opponent out of the ring within 3 rounds of pure mechanical adrenaline.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    price: 0,
    date: 'Oct 24, 2024',
    time: '10:00 AM - 02:00 PM',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    venue: 'Indoor Sports Arena & Robotics Quad',
    totalSlots: 40,
    slotsLeft: 12,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹35,000',
    firstPrize: '₹20,000 + Champion Shield',
    secondPrize: '₹15,000 + Shield',
    rules: [
      'Maximum robot weight limit is strictly 3.0 kg.',
      'Dimensions must not exceed 25cm x 25cm x 25cm before start.',
      'No intentional fire, chemical liquids, or radio-jamming devices.',
      'Arena ring diameter is 150cm made of polished plywood.',
    ],
    coordinators: [
      {
        id: 'coord-3',
        name: 'Prof. Anitha Rajan',
        role: 'Faculty Coordinator',
        phone: '+91 99402 34567',
        email: 'anitha.ece@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Robotics & ECE',
      },
      {
        id: 'coord-4',
        name: 'Deepak Selvam',
        role: 'Student Coordinator',
        phone: '+91 98841 98765',
        email: 'deepak.rob21@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Mechanical & Robotics',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-promptai',
    title: 'Prompt-Craft AI Showdown',
    category: 'Technical',
    tagline: 'Next-Gen LLM & Multi-Modal Prompt Engineering',
    description: 'Solve complex business briefs, generate clean code, and render precision UI layouts using state-of-the-art GenAI prompt engineering strategies.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2024',
    time: '11:30 AM - 01:30 PM',
    startTime: '11:30 AM',
    endTime: '01:30 PM',
    venue: 'Seminar Hall 2, Innovation Wing',
    totalSlots: 60,
    slotsLeft: 22,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹20,000',
    firstPrize: '₹12,000 + Certificate',
    secondPrize: '₹8,000 + Certificate',
    rules: [
      'Individual event only.',
      '3 Progressive rounds: Text Reasoning, Multi-Modal Synthesis, and Bug Squash.',
      'Efficiency in token count and output precision are key judging criteria.',
    ],
    coordinators: [
      {
        id: 'coord-5',
        name: 'Dr. Suresh Balaji',
        role: 'Faculty Coordinator',
        phone: '+91 94441 55667',
        email: 'suresh.ai@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Artificial Intelligence & Data Science',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-adzap',
    title: 'Ad-Zap Creative Commercials',
    category: 'Non-Technical',
    tagline: 'On-The-Spot Product Brand Pitch & Parody Acting',
    description: 'Unleash your spontaneous comedic creativity and persuasive marketing flair in this fast-paced live stage ad enactment competition.',
    isTeamEvent: true,
    minTeamSize: 3,
    maxTeamSize: 5,
    price: 0,
    date: 'Oct 24, 2024',
    time: '01:30 PM - 04:30 PM',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    venue: 'Main Auditorium Stage, Block A',
    totalSlots: 35,
    slotsLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹20,000',
    firstPrize: '₹12,000 + Trophy',
    secondPrize: '₹8,000 + Trophy',
    rules: [
      'Teams of 3 to 5 participants.',
      'Product theme will be given on the spot with 5 minutes prep time.',
      'Stage performance must not exceed 4 minutes.',
      'Vulgarity, derogatory language, or political remarks will lead to immediate disqualification.',
    ],
    coordinators: [
      {
        id: 'coord-6',
        name: 'Prof. Malini Sundaram',
        role: 'Faculty Coordinator',
        phone: '+91 98410 77889',
        email: 'malini.mgmt@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Management Studies',
      },
      {
        id: 'coord-7',
        name: 'Harish Raghavan',
        role: 'Student Coordinator',
        phone: '+91 97910 33445',
        email: 'harish.mba23@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of MBA',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-freefire',
    title: 'Free Fire Max Clash Squad',
    category: 'Non-Technical',
    tagline: 'Custom Room Esports Tournament',
    description: 'High-stakes battle royale and clash squad matchups. Bring your squad to compete in structured custom rooms with live audience commentary.',
    isTeamEvent: true,
    minTeamSize: 4,
    maxTeamSize: 4,
    price: 0,
    date: 'Oct 24, 2024',
    time: '11:00 AM - 03:00 PM',
    startTime: '11:00 AM',
    endTime: '03:00 PM',
    venue: 'E-Gaming Arena, Media Block Lab 1',
    totalSlots: 32,
    slotsLeft: 6,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹22,000',
    firstPrize: '₹14,000 + Winner Shield',
    secondPrize: '₹8,000 + Certificate',
    rules: [
      'Strictly 4 players per squad.',
      'Mobile devices only (No Emulators or iPads).',
      'Hack detection and custom room logs will be verified prior to awarding results.',
      'All players must be present in the gaming arena 15 minutes before the match start.',
    ],
    coordinators: [
      {
        id: 'coord-8',
        name: 'Karthik Raja',
        role: 'Lead Organizer',
        phone: '+91 98845 66778',
        email: 'karthik.esports@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'SPIHER Esports Club',
      },
    ],
    status: 'OPEN',
  },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'part-1',
    rollNumber: '2021CS042',
    dateOfBirth: '2003-05-14',
    name: 'Alex Mercer',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Computer Science & Engineering',
    email: 'alex.mercer@spiher.edu.in',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    accessSecret: 'SPIHER_SEC_88421',
    createdAt: '2024-10-01T10:00:00Z',
  },
  {
    id: 'part-2',
    rollNumber: '2021CS043',
    dateOfBirth: '2003-08-20',
    name: 'Rohit Sharma',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Computer Science & Engineering',
    email: 'rohit.s21@spiher.edu.in',
    phone: '+91 98765 43211',
    createdAt: '2024-10-01T10:15:00Z',
  },
  {
    id: 'part-3',
    rollNumber: '2021EC108',
    dateOfBirth: '2002-11-03',
    name: 'Sneha Ramachandran',
    collegeName: 'Anna University, CEG Campus',
    department: 'Dept. of Electronics & Communication',
    email: 'sneha.r@ceg.edu.in',
    phone: '+91 94440 98765',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    accessSecret: 'SPIHER_SEC_99120',
    createdAt: '2024-10-02T11:30:00Z',
  },
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-88421',
    registrationNumber: 'IGNITE-2024-88421',
    eventId: 'evt-codeathon',
    eventTitle: 'Code-A-Thon Sprint',
    category: 'Technical',
    leaderId: 'part-1',
    leaderName: 'Alex Mercer',
    leaderRollNumber: '2021CS042',
    leaderEmail: 'alex.mercer@spiher.edu.in',
    leaderPhone: '+91 98765 43210',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Computer Science & Engineering',
    isTeamEvent: true,
    teamName: 'Binary Mavericks',
    members: [
      {
        participantId: 'part-1',
        name: 'Alex Mercer',
        rollNumber: '2021CS042',
        department: 'Dept. of Computer Science & Engineering',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        dateOfBirth: '2003-05-14',
        isLeader: true,
      },
      {
        participantId: 'part-2',
        name: 'Rohit Sharma',
        rollNumber: '2021CS043',
        department: 'Dept. of Computer Science & Engineering',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        dateOfBirth: '2003-08-20',
        isLeader: false,
      },
    ],
    status: 'ACTIVE',
    qrToken: 'SPIHER_IGNITE_TOKEN_V1_88421_SEC',
    registeredAt: '2024-10-01T10:15:00Z',
  },
  {
    id: 'reg-99120',
    registrationNumber: 'IGNITE-2024-99120',
    eventId: 'evt-promptai',
    eventTitle: 'Prompt-Craft AI Showdown',
    category: 'Technical',
    leaderId: 'part-3',
    leaderName: 'Sneha Ramachandran',
    leaderRollNumber: '2021EC108',
    leaderEmail: 'sneha.r@ceg.edu.in',
    leaderPhone: '+91 94440 98765',
    collegeName: 'Anna University, CEG Campus',
    department: 'Dept. of Electronics & Communication',
    isTeamEvent: false,
    members: [
      {
        participantId: 'part-3',
        name: 'Sneha Ramachandran',
        rollNumber: '2021EC108',
        department: 'Dept. of Electronics & Communication',
        collegeName: 'Anna University, CEG Campus',
        dateOfBirth: '2002-11-03',
        isLeader: true,
      },
    ],
    status: 'ACTIVE',
    qrToken: 'SPIHER_IGNITE_TOKEN_V1_99120_SEC',
    registeredAt: '2024-10-02T11:30:00Z',
  },
];

export const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-super',
    email: 'superadmin@spiher.edu.in',
    name: 'Dr. M. Sivasankaran (Convenor)',
    role: 'SUPER_ADMIN',
    department: 'Dean - Academic Affairs',
    assignedEventIds: [], // All events
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T08:30:00Z',
  },
  {
    id: 'staff-admin-tech',
    email: 'admin.tech@spiher.edu.in',
    name: 'Dr. K. Senthil Nathan (Tech Chair)',
    role: 'ADMIN',
    department: 'Dept. of CSE',
    assignedEventIds: ['evt-codeathon', 'evt-robosumo', 'evt-promptai'],
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T08:45:00Z',
  },
  {
    id: 'staff-admin-nontech',
    email: 'admin.nontech@spiher.edu.in',
    name: 'Prof. Malini Sundaram (Non-Tech Chair)',
    role: 'ADMIN',
    department: 'Dept. of MBA',
    assignedEventIds: ['evt-adzap', 'evt-freefire'],
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T08:50:00Z',
  },
  {
    id: 'staff-emp-codeathon',
    email: 'judge.codeathon@spiher.edu.in',
    name: 'Praveen Chandran (Lead Evaluator)',
    role: 'EMPLOYEE',
    department: 'Dept. of CSE',
    assignedEventIds: ['evt-codeathon'],
    createdByAdminId: 'staff-admin-tech',
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T09:00:00Z',
  },
  {
    id: 'staff-emp-adzap',
    email: 'judge.adzap@spiher.edu.in',
    name: 'Ananya Deshmukh (Judge)',
    role: 'EMPLOYEE',
    department: 'Dept. of MBA',
    assignedEventIds: ['evt-adzap'],
    createdByAdminId: 'staff-admin-nontech',
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T09:05:00Z',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    registrationId: 'reg-88421',
    eventId: 'evt-codeathon',
    participantRollNumber: '2021CS042',
    participantName: 'Alex Mercer',
    teamName: 'Binary Mavericks',
    status: 'PRESENT',
    scannedAt: '2024-10-24T09:15:00Z',
    scannedByStaffId: 'staff-emp-codeathon',
    scannedByStaffName: 'Praveen Chandran (Lead Evaluator)',
    notes: 'Verified College ID and QR Token. Team present in full.',
  },
];

export const INITIAL_SCORES: ScoreRecord[] = [
  {
    id: 'scr-1',
    registrationId: 'reg-88421',
    eventId: 'evt-codeathon',
    teamOrParticipantName: 'Binary Mavericks',
    rollNumberOrTeamId: '2021CS042 (Leader)',
    criteria: [
      { name: 'Algorithmic Correctness', maxMarks: 40, awardedMarks: 38 },
      { name: 'Time & Space Complexity', maxMarks: 30, awardedMarks: 28 },
      { name: 'Code Quality & Modularity', maxMarks: 20, awardedMarks: 19 },
      { name: 'Live Defense / Q&A', maxMarks: 10, awardedMarks: 9 },
    ],
    totalScore: 94,
    round: 'Final Round',
    rank: 1,
    feedback: 'Outstanding algorithmic approach with sub-linear space optimization.',
    submittedByStaffId: 'staff-emp-codeathon',
    submittedByStaffName: 'Praveen Chandran (Lead Evaluator)',
    submittedAt: '2024-10-24T14:30:00Z',
    isLocked: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'system',
    actorName: 'System Engine',
    actorRole: 'SYSTEM',
    action: 'PORTAL_INITIALIZATION',
    targetEntity: 'SYSTEM',
    details: 'IGNITE 2024 Portal initialized with 5 events and security enforcement.',
    timestamp: '2024-10-01T00:00:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-2',
    actorId: 'part-1',
    actorName: 'Alex Mercer (2021CS042)',
    actorRole: 'PARTICIPANT',
    action: 'EVENT_REGISTRATION',
    targetEntity: 'REGISTRATION',
    targetId: 'reg-88421',
    details: 'Successfully registered for Code-A-Thon Sprint (Team: Binary Mavericks).',
    timestamp: '2024-10-01T10:15:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-3',
    actorId: 'staff-emp-codeathon',
    actorName: 'Praveen Chandran',
    actorRole: 'EMPLOYEE',
    action: 'QR_ATTENDANCE_VERIFIED',
    targetEntity: 'ATTENDANCE',
    targetId: 'att-1',
    details: 'Scanned & recorded attendance for Binary Mavericks (reg-88421).',
    timestamp: '2024-10-24T09:15:00Z',
    status: 'SUCCESS',
  },
];

const STORAGE_KEYS = {
  SETTINGS: 'spiher_settings_v2',
  EVENTS: 'spiher_events_v2',
  PARTICIPANTS: 'spiher_participants_v2',
  REGISTRATIONS: 'spiher_registrations_v2',
  STAFF: 'spiher_staff_v2',
  ATTENDANCE: 'spiher_attendance_v2',
  SCORES: 'spiher_scores_v2',
  EVENT_CHANGES: 'spiher_event_changes_v2',
  AUDIT_LOGS: 'spiher_audit_logs_v2',
};

// LocalStorage Helper with fallback
export class MockDatabaseService {
  private static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // System Settings
  static getSettings(): SystemSettings {
    return this.load(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
  }

  static updateSettings(settings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.save(STORAGE_KEYS.SETTINGS, updated);
    this.logAction('staff-super', 'Super Admin', 'SUPER_ADMIN', 'UPDATE_SETTINGS', 'SETTINGS', undefined, 'Updated global system settings.');
    return updated;
  }

  // Events
  static getEvents(): CollegeEvent[] {
    return this.load(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  static getEventById(id: string): CollegeEvent | undefined {
    return this.getEvents().find((e) => e.id === id);
  }

  static saveEvent(event: CollegeEvent): void {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      events[idx] = event;
    } else {
      events.push(event);
    }
    this.save(STORAGE_KEYS.EVENTS, events);
  }

  static deleteEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    this.save(STORAGE_KEYS.EVENTS, events);
  }

  // Participants & Strict Lookup
  static getParticipants(): Participant[] {
    return this.load(STORAGE_KEYS.PARTICIPANTS, INITIAL_PARTICIPANTS);
  }

  static normalizeRollNumber(roll: string): string {
    return roll.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  static normalizeDOB(dob: string): string {
    return dob.trim();
  }

  static verifyParticipantAccess(
    rollNumber: string,
    dateOfBirth: string
  ): { success: boolean; participant?: Participant; registration?: Registration; error?: string } {
    const normRoll = this.normalizeRollNumber(rollNumber);
    const normDOB = this.normalizeDOB(dateOfBirth);

    const participants = this.getParticipants();
    const participant = participants.find(
      (p) => this.normalizeRollNumber(p.rollNumber) === normRoll && p.dateOfBirth === normDOB
    );

    if (!participant) {
      return { success: false, error: 'Invalid Roll Number or Date of Birth. If you are new, please register.' };
    }

    const registrations = this.getRegistrations();
    const activeReg = registrations.find(
      (r) =>
        r.status === 'ACTIVE' &&
        (r.leaderId === participant.id ||
          this.normalizeRollNumber(r.leaderRollNumber) === normRoll ||
          r.members.some((m) => this.normalizeRollNumber(m.rollNumber) === normRoll))
    );

    return {
      success: true,
      participant,
      registration: activeReg,
    };
  }

  // Registrations & Strict 1-Participant-to-1-Event Rule
  static getRegistrations(): Registration[] {
    return this.load(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
  }

  static checkIsParticipantRegistered(rollNumber: string): { isRegistered: boolean; activeRegistration?: Registration } {
    const norm = this.normalizeRollNumber(rollNumber);
    const registrations = this.getRegistrations();
    const active = registrations.find(
      (r) =>
        r.status === 'ACTIVE' &&
        (this.normalizeRollNumber(r.leaderRollNumber) === norm ||
          r.members.some((m) => this.normalizeRollNumber(m.rollNumber) === norm))
    );
    return { isRegistered: !!active, activeRegistration: active };
  }

  static createRegistration(regData: Omit<Registration, 'id' | 'registrationNumber' | 'qrToken' | 'registeredAt' | 'status'>): {
    success: boolean;
    registration?: Registration;
    error?: string;
  } {
    // 1. Check Leader duplicate
    const leaderCheck = this.checkIsParticipantRegistered(regData.leaderRollNumber);
    if (leaderCheck.isRegistered) {
      return {
        success: false,
        error: `Participant ${regData.leaderName} (${regData.leaderRollNumber}) is already registered for "${leaderCheck.activeRegistration?.eventTitle}". A participant can register for only ONE event.`,
      };
    }

    // 2. Check each Teammate duplicate
    for (const member of regData.members) {
      if (!member.isLeader) {
        const memberCheck = this.checkIsParticipantRegistered(member.rollNumber);
        if (memberCheck.isRegistered) {
          return {
            success: false,
            error: `Teammate ${member.name} (${member.rollNumber}) is already registered for "${memberCheck.activeRegistration?.eventTitle}". A participant can register for only ONE event.`,
          };
        }
      }
    }

    // 3. Create or update participant records
    const participants = this.getParticipants();
    let leader = participants.find((p) => this.normalizeRollNumber(p.rollNumber) === this.normalizeRollNumber(regData.leaderRollNumber));
    if (!leader) {
      leader = {
        id: `part-${Date.now()}`,
        rollNumber: this.normalizeRollNumber(regData.leaderRollNumber),
        dateOfBirth: regData.members.find((m) => m.isLeader)?.dateOfBirth || '2003-01-01',
        name: regData.leaderName,
        collegeName: regData.collegeName,
        department: regData.department,
        email: regData.leaderEmail,
        phone: regData.leaderPhone,
        accessSecret: `SPIHER_SEC_${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
      };
      participants.push(leader);
      this.save(STORAGE_KEYS.PARTICIPANTS, participants);
    }

    // 4. Generate Registration with opaque secure QR Token
    const randId = Math.floor(10000 + Math.random() * 90000);
    const newReg: Registration = {
      ...regData,
      id: `reg-${randId}`,
      registrationNumber: `IGNITE-2024-${randId}`,
      leaderId: leader.id,
      status: 'ACTIVE',
      qrToken: `SPIHER_IGNITE_TOKEN_V1_${randId}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      registeredAt: new Date().toISOString(),
    };

    const registrations = this.getRegistrations();
    registrations.push(newReg);
    this.save(STORAGE_KEYS.REGISTRATIONS, registrations);

    // 5. Decrement event slot
    const events = this.getEvents();
    const eventIdx = events.findIndex((e) => e.id === regData.eventId);
    if (eventIdx >= 0 && events[eventIdx].slotsLeft > 0) {
      events[eventIdx].slotsLeft -= 1;
      this.save(STORAGE_KEYS.EVENTS, events);
    }

    this.logAction(
      leader.id,
      `${leader.name} (${leader.rollNumber})`,
      'PARTICIPANT',
      'EVENT_REGISTRATION',
      'REGISTRATION',
      newReg.id,
      `Registered for ${newReg.eventTitle} (Pass: ${newReg.registrationNumber})`
    );

    return { success: true, registration: newReg };
  }

  // Change Event Workflow (Strict Invalidation & Re-issuance)
  static changeEvent(
    oldRegistrationId: string,
    newEventId: string,
    reason: string = 'Participant requested event switch'
  ): { success: boolean; newRegistration?: Registration; error?: string } {
    const registrations = this.getRegistrations();
    const oldRegIndex = registrations.findIndex((r) => r.id === oldRegistrationId);
    if (oldRegIndex < 0) {
      return { success: false, error: 'Original registration not found.' };
    }

    const oldReg = registrations[oldRegIndex];
    if (oldReg.status !== 'ACTIVE') {
      return { success: false, error: 'Cannot change an inactive or cancelled registration.' };
    }

    const newEvent = this.getEventById(newEventId);
    if (!newEvent) {
      return { success: false, error: 'Target event not found.' };
    }

    // 1. Invalidate old registration & QR code
    oldReg.status = 'CANCELLED';
    oldReg.cancelledAt = new Date().toISOString();
    oldReg.cancellationReason = `Switched to ${newEvent.title}`;
    registrations[oldRegIndex] = oldReg;

    // Restore slot to old event
    const events = this.getEvents();
    const oldEventIdx = events.findIndex((e) => e.id === oldReg.eventId);
    if (oldEventIdx >= 0) {
      events[oldEventIdx].slotsLeft += 1;
    }

    // 2. Generate new registration for new event
    const randId = Math.floor(10000 + Math.random() * 90000);
    const newReg: Registration = {
      ...oldReg,
      id: `reg-${randId}`,
      registrationNumber: `IGNITE-2024-${randId}`,
      eventId: newEvent.id,
      eventTitle: newEvent.title,
      category: newEvent.category,
      isTeamEvent: newEvent.isTeamEvent,
      status: 'ACTIVE',
      qrToken: `SPIHER_IGNITE_TOKEN_V1_${randId}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      registeredAt: new Date().toISOString(),
      cancelledAt: undefined,
      cancellationReason: undefined,
    };

    // Decrement new event slot
    const newEventIdx = events.findIndex((e) => e.id === newEvent.id);
    if (newEventIdx >= 0 && events[newEventIdx].slotsLeft > 0) {
      events[newEventIdx].slotsLeft -= 1;
    }
    this.save(STORAGE_KEYS.EVENTS, events);

    registrations.push(newReg);
    this.save(STORAGE_KEYS.REGISTRATIONS, registrations);

    // 3. Log Audit
    const auditRecord: EventChangeAudit = {
      id: `chg-${Date.now()}`,
      participantId: oldReg.leaderId,
      participantName: oldReg.leaderName,
      rollNumber: oldReg.leaderRollNumber,
      oldEventId: oldReg.eventId,
      oldEventTitle: oldReg.eventTitle,
      oldRegistrationId: oldReg.id,
      oldQrToken: oldReg.qrToken,
      newEventId: newEvent.id,
      newEventTitle: newEvent.title,
      newRegistrationId: newReg.id,
      newQrToken: newReg.qrToken,
      reason,
      changedAt: new Date().toISOString(),
      status: 'SUCCESS',
    };

    const changes = this.getEventChanges();
    changes.unshift(auditRecord);
    this.save(STORAGE_KEYS.EVENT_CHANGES, changes);

    this.logAction(
      oldReg.leaderId,
      oldReg.leaderName,
      'PARTICIPANT',
      'EVENT_CHANGED',
      'EVENT_CHANGE_AUDIT',
      auditRecord.id,
      `Switched event from "${oldReg.eventTitle}" to "${newEvent.title}". Old QR invalidated.`
    );

    return { success: true, newRegistration: newReg };
  }

  static getEventChanges(): EventChangeAudit[] {
    return this.load(STORAGE_KEYS.EVENT_CHANGES, []);
  }

  // Staff & Verification
  static getStaffUsers(): StaffUser[] {
    return this.load(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  static authenticateStaff(email: string): { success: boolean; user?: StaffUser; error?: string } {
    const users = this.getStaffUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.isActive);
    if (!user) {
      return { success: false, error: 'Invalid staff credentials or account deactivated.' };
    }
    user.lastLoginAt = new Date().toISOString();
    this.saveStaffUser(user);
    this.logAction(user.id, user.name, user.role, 'STAFF_LOGIN', 'AUTH', undefined, `Staff logged in via console.`);
    return { success: true, user };
  }

  static saveStaffUser(user: StaffUser): void {
    const users = this.getStaffUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.save(STORAGE_KEYS.STAFF, users);
  }

  static deleteStaffUser(id: string): void {
    const users = this.getStaffUsers().filter((u) => u.id !== id);
    this.save(STORAGE_KEYS.STAFF, users);
  }

  // QR Token Verification for Employee Scanner
  static verifyQRToken(qrToken: string, currentStaffAssignedEventIds: string[]): {
    valid: boolean;
    registration?: Registration;
    event?: CollegeEvent;
    errorType?: 'INVALID_TOKEN' | 'CANCELLED_REGISTRATION' | 'UNASSIGNED_EVENT' | 'ALREADY_ATTENDED';
    errorMessage?: string;
  } {
    const registrations = this.getRegistrations();
    const reg = registrations.find((r) => r.qrToken === qrToken.trim());

    if (!reg) {
      return {
        valid: false,
        errorType: 'INVALID_TOKEN',
        errorMessage: 'Invalid QR Token. Pass not found in system.',
      };
    }

    if (reg.status === 'CANCELLED') {
      return {
        valid: false,
        registration: reg,
        errorType: 'CANCELLED_REGISTRATION',
        errorMessage: 'This QR Code was cancelled due to an event change and is no longer valid.',
      };
    }

    // Check staff event permission (if staff has specific events)
    if (currentStaffAssignedEventIds.length > 0 && !currentStaffAssignedEventIds.includes(reg.eventId)) {
      return {
        valid: false,
        registration: reg,
        errorType: 'UNASSIGNED_EVENT',
        errorMessage: `Scanned participant belongs to "${reg.eventTitle}", which is not assigned to your staff profile.`,
      };
    }

    // Check attendance status
    const attendanceList = this.getAttendance();
    const existing = attendanceList.find((a) => a.registrationId === reg.id && a.status === 'PRESENT');
    if (existing) {
      return {
        valid: true,
        registration: reg,
        event: this.getEventById(reg.eventId),
        errorType: 'ALREADY_ATTENDED',
        errorMessage: `Attendance was already recorded on ${new Date(existing.scannedAt || '').toLocaleTimeString()}.`,
      };
    }

    return {
      valid: true,
      registration: reg,
      event: this.getEventById(reg.eventId),
    };
  }

  // Attendance
  static getAttendance(): AttendanceRecord[] {
    return this.load(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }

  static recordAttendance(
    registrationId: string,
    staffUser: StaffUser,
    status: 'PRESENT' | 'ABSENT' = 'PRESENT',
    notes?: string
  ): { success: boolean; record?: AttendanceRecord; error?: string } {
    const registrations = this.getRegistrations();
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, error: 'Registration not found.' };

    const attendance = this.getAttendance();
    const existingIdx = attendance.findIndex((a) => a.registrationId === registrationId);

    const record: AttendanceRecord = {
      id: existingIdx >= 0 ? attendance[existingIdx].id : `att-${Date.now()}`,
      registrationId: reg.id,
      eventId: reg.eventId,
      participantRollNumber: reg.leaderRollNumber,
      participantName: reg.leaderName,
      teamName: reg.teamName,
      status,
      scannedAt: new Date().toISOString(),
      scannedByStaffId: staffUser.id,
      scannedByStaffName: staffUser.name,
      notes: notes || `Attendance recorded by ${staffUser.name}`,
    };

    if (existingIdx >= 0) {
      attendance[existingIdx] = record;
    } else {
      attendance.unshift(record);
    }
    this.save(STORAGE_KEYS.ATTENDANCE, attendance);

    this.logAction(
      staffUser.id,
      staffUser.name,
      staffUser.role,
      'MARK_ATTENDANCE',
      'ATTENDANCE',
      record.id,
      `Marked ${reg.teamName || reg.leaderName} as ${status} for ${reg.eventTitle}`
    );

    return { success: true, record };
  }

  // Scores
  static getScores(): ScoreRecord[] {
    return this.load(STORAGE_KEYS.SCORES, INITIAL_SCORES);
  }

  static saveScore(score: ScoreRecord, staffUser: StaffUser): void {
    const scores = this.getScores();
    const idx = scores.findIndex((s) => s.id === score.id);
    if (idx >= 0) {
      scores[idx] = { ...score, updatedAt: new Date().toISOString() };
    } else {
      scores.unshift(score);
    }
    this.save(STORAGE_KEYS.SCORES, scores);

    this.logAction(
      staffUser.id,
      staffUser.name,
      staffUser.role,
      'SUBMIT_SCORE',
      'SCORE',
      score.id,
      `Score ${score.totalScore}/100 awarded to ${score.teamOrParticipantName}`
    );
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return this.load(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  static logAction(
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    targetEntity: string,
    targetId?: string,
    details: string = '',
    status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS'
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actorId,
      actorName,
      actorRole,
      action,
      targetEntity,
      targetId,
      details,
      timestamp: new Date().toISOString(),
      status,
    };
    logs.unshift(newLog);
    this.save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 300)); // Cap at 300 logs
  }

  // Reset demo data to defaults
  static resetDatabase(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.EVENT_CHANGES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  }
}
