import {
  AttendanceRecord,
  AttendanceStatus,
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
  symposiumName: 'IGNITE 2024 — National Level Symposium',
  symposiumYear: '2024',
  themeBannerText: 'Welcome to IGNITE 2024! Registrations are currently LIVE. Please ensure you carry your digital QR Pass.',
  supportEmail: 'ignite2024@spiher.edu.in',
  supportPhone: '+91 94440 12345',
  venueAddress: 'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054',
  emergencyNotice: undefined,
};

export const INITIAL_EVENTS: CollegeEvent[] = [
  // -------------------------------------------------------------
  // TECHNICAL EVENTS (6)
  // -------------------------------------------------------------
  {
    id: 'evt-codeathon',
    title: 'Code-A-Thon Sprint',
    category: 'Technical',
    tagline: 'Algorithmic Problem Solving & Full-Stack Sprint',
    description: 'An intense sprint where teams solve real-world algorithmic problems, optimize time complexity, and build working solutions under time limits.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 3,
    price: 0,
    date: 'Oct 24, 2024',
    time: '09:30 AM - 01:00 PM',
    startTime: '09:30 AM',
    endTime: '01:00 PM',
    venue: 'Computing Centre Lab 3, Block B',
    totalSlots: 50,
    slotsLeft: 18,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Teams must strictly consist of 2 or 3 participants.',
      'Only approved IDEs and pre-installed compilers may be used.',
      'Plagiarism or unauthorized AI usage will lead to immediate disqualification.',
      'Decision of the technical jury panel is final.',
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
    rules: [
      'Maximum robot weight limit is strictly 3.0 kg.',
      'Dimensions must not exceed 25cm x 25cm x 25cm before start.',
      'No corrosive liquids, fire, or entangling mechanisms.',
    ],
    coordinators: [
      {
        id: 'coord-2',
        name: 'Dr. R. Anand Kumar',
        role: 'Faculty Coordinator',
        phone: '+91 98402 34567',
        email: 'anand.mech@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Mechanical & Mechatronics',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-webcraft',
    title: 'Web Craft UI/UX',
    category: 'Technical',
    tagline: 'Responsive Frontend Architecture & Interface Design',
    description: 'Design and build a responsive web interface from a given design brief within 3 hours. Judged on aesthetics, responsiveness, and clean code.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2024',
    time: '10:30 AM - 01:30 PM',
    startTime: '10:30 AM',
    endTime: '01:30 PM',
    venue: 'Multimedia Lab 2, Block C',
    totalSlots: 40,
    slotsLeft: 22,
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Individual or team of 2.',
      'HTML5, CSS3, JavaScript, React or Tailwind CSS are permitted.',
      'Must be fully responsive across mobile and desktop viewports.',
    ],
    coordinators: [
      {
        id: 'coord-3',
        name: 'Prof. S. Divya',
        role: 'Faculty Coordinator',
        phone: '+91 98403 45678',
        email: 'divya.it@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-bughunt',
    title: 'Bug Hunter & Debugging',
    category: 'Technical',
    tagline: 'Code Diagnosis, Syntax Rectification & Optimisation',
    description: 'Identify logic bugs, memory leaks, and runtime errors in deliberately obfuscated code snippets across C, C++, Java, and Python.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2024',
    time: '11:00 AM - 01:00 PM',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    venue: 'IT Lab 4, Block B',
    totalSlots: 60,
    slotsLeft: 34,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Solo event only.',
      'Two rounds: Round 1 (MCQs & Dry Run), Round 2 (Live IDE Debugging).',
      'Time-based scoring applies in case of a tie.',
    ],
    coordinators: [
      {
        id: 'coord-4',
        name: 'Dr. P. Rajesh',
        role: 'Faculty Coordinator',
        phone: '+91 98404 56789',
        email: 'rajesh.cse@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Computer Science & Engineering',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-paper',
    title: 'Tech Paper Presentation',
    category: 'Technical',
    tagline: 'Research Presentation on Emerging Innovations',
    description: 'Present original research or review papers on AI/ML, Quantum Computing, IoT, Cloud Security, or Green Technologies to a faculty jury panel.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 3,
    price: 0,
    date: 'Oct 24, 2024',
    time: '09:30 AM - 01:30 PM',
    startTime: '09:30 AM',
    endTime: '01:30 PM',
    venue: 'Seminar Hall 1, Main Block',
    totalSlots: 30,
    slotsLeft: 10,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Maximum 3 authors per paper.',
      'Presentation duration: 8 minutes + 2 minutes Q&A.',
      'IEEE 2-column format for submitted paper abstracts.',
    ],
    coordinators: [
      {
        id: 'coord-5',
        name: 'Dr. N. Gayathri',
        role: 'Faculty Coordinator',
        phone: '+91 98405 67890',
        email: 'gayathri.ece@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of ECE',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-promptai',
    title: 'Prompt & AI Innovation',
    category: 'Technical',
    tagline: 'Generative AI Engineering & Workflow Challenge',
    description: 'Harness LLMs, Diffusion models, and multimodal tools to solve complex prompt engineering challenges and build autonomous agent workflows.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2024',
    time: '02:00 PM - 04:30 PM',
    startTime: '02:00 PM',
    endTime: '04:30 PM',
    venue: 'AI Lab 1, Advanced Tech Block',
    totalSlots: 45,
    slotsLeft: 20,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Solo event.',
      'Prompts and output accuracy will be benchmarked by automated test suites.',
      'Judging based on clarity, minimal iterations, and constraint satisfaction.',
    ],
    coordinators: [
      {
        id: 'coord-6',
        name: 'Dr. Suresh Balaji',
        role: 'Faculty Coordinator',
        phone: '+91 94441 55667',
        email: 'suresh.ai@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of AI & DS',
      },
    ],
    status: 'OPEN',
  },

  // -------------------------------------------------------------
  // NON-TECHNICAL EVENTS (5)
  // -------------------------------------------------------------
  {
    id: 'evt-freefire',
    title: 'Free Fire Max Esports',
    category: 'Non-Technical',
    tagline: 'Custom Room Clash Squad & Battle Royale Tournament',
    description: 'High-stakes squad matchups in custom rooms with live stadium projection and esports commentary.',
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
    rules: [
      'Strictly 4 players per squad.',
      'Mobile devices only (No Emulators or iPads).',
      'All players must report to the arena 15 minutes before the match.',
    ],
    coordinators: [
      {
        id: 'coord-7',
        name: 'Karthik Raja',
        role: 'Student Coordinator',
        phone: '+91 98845 66778',
        email: 'karthik.esports@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'SPIHER Esports Club',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-brainiac',
    title: 'Mega Brainiac Quiz',
    category: 'Non-Technical',
    tagline: 'General Knowledge, Pop Culture & Tech Trivia',
    description: 'Fast-paced buzzer rounds covering science, technology, movies, history, sports, and business trivia.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2024',
    time: '01:30 PM - 03:30 PM',
    startTime: '01:30 PM',
    endTime: '03:30 PM',
    venue: 'Auditorium Hall B, Main Block',
    totalSlots: 40,
    slotsLeft: 15,
    imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Teams of 2 participants.',
      'Written prelims round followed by top 6 stage finals with buzzer rounds.',
      'No electronic devices allowed during testing.',
    ],
    coordinators: [
      {
        id: 'coord-8',
        name: 'Prof. Malini Sundaram',
        role: 'Faculty Coordinator',
        phone: '+91 98410 77889',
        email: 'malini.mgmt@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Management Studies',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-lensframe',
    title: 'Lens & Frame Photography',
    category: 'Non-Technical',
    tagline: 'Campus Photography & Visual Storytelling',
    description: 'Capture the essence of symposium life, architecture, and candids around the college campus under a specific theme given on the spot.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2024',
    time: '10:00 AM - 03:00 PM',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    venue: 'Media Studio & Campus Grounds',
    totalSlots: 50,
    slotsLeft: 28,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Solo participant.',
      'DSLR or Mobile Camera photos must be submitted with original EXIF data.',
      'Basic color grading allowed; photo manipulation/compositing strictly prohibited.',
    ],
    coordinators: [
      {
        id: 'coord-9',
        name: 'Pradeep Chandran',
        role: 'Student Coordinator',
        phone: '+91 98409 11223',
        email: 'pradeep.viscom@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Visual Communication',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-shortfilm',
    title: 'Cine-Craft Short Film',
    category: 'Non-Technical',
    tagline: 'Cinematic Storytelling & Short Film Screening',
    description: 'Screen your original short film to audience and jury. Judged on direction, screenplay, cinematography, and sound design.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 5,
    price: 0,
    date: 'Oct 24, 2024',
    time: '02:00 PM - 05:00 PM',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    venue: 'Preview Theater, Visual Comm Block',
    totalSlots: 20,
    slotsLeft: 9,
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Maximum duration: 10 minutes including credits.',
      'MP4/MOV 1080p format on USB drive or cloud link.',
      'Appropriate content only (No violence, hate speech, or offensive themes).',
    ],
    coordinators: [
      {
        id: 'coord-10',
        name: 'Dr. V. Kavitha',
        role: 'Faculty Coordinator',
        phone: '+91 98408 99001',
        email: 'kavitha.viscom@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Visual Communication',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-treasure',
    title: 'Campus Treasure Hunt',
    category: 'Non-Technical',
    tagline: 'Campus-Wide Cryptic Clue & Mystery Chase',
    description: 'Decode cryptic riddles, search landmark locations across the campus, and race against the clock to discover the final artifact.',
    isTeamEvent: true,
    minTeamSize: 3,
    maxTeamSize: 4,
    price: 0,
    date: 'Oct 24, 2024',
    time: '02:30 PM - 04:30 PM',
    startTime: '02:30 PM',
    endTime: '04:30 PM',
    venue: 'Central Quadrangle Flagpole Area',
    totalSlots: 35,
    slotsLeft: 14,
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    rules: [
      'Teams of 3 or 4 members.',
      'All team members must stay together during the hunt.',
      'Damaging college property or entering restricted labs results in disqualification.',
    ],
    coordinators: [
      {
        id: 'coord-11',
        name: 'Rohit Balaji',
        role: 'Student Coordinator',
        phone: '+91 98407 88990',
        email: 'rohit.mech21@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Mechanical Engineering',
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
    eventTitle: 'Prompt & AI Innovation',
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
    assignedEventIds: [], // All 11 events
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T08:30:00Z',
  },
  {
    id: 'staff-admin',
    email: 'admin@spiher.edu.in',
    name: 'Dr. K. Senthil Nathan (Event Admin)',
    role: 'ADMIN',
    department: 'Dept. of Computer Science & Engineering',
    assignedEventIds: [], // All 11 events
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T08:45:00Z',
  },
  {
    id: 'staff-emp-codeathon',
    email: 'judge.codeathon@spiher.edu.in',
    name: 'Praveen Chandran (Evaluator)',
    role: 'EMPLOYEE',
    department: 'Dept. of CSE',
    assignedEventIds: ['evt-codeathon'],
    createdByAdminId: 'staff-admin',
    isActive: true,
    mustChangePassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    lastLoginAt: '2024-10-24T09:00:00Z',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    registrationId: 'reg-88421',
    eventId: 'evt-codeathon',
    participantId: 'part-1',
    participantName: 'Alex Mercer',
    participantRollNumber: '2021CS042',
    teamName: 'Binary Mavericks',
    status: 'PRESENT',
    scannedAt: '2024-10-24T09:15:22Z',
    scannedByStaffId: 'staff-emp-codeathon',
    scannedByStaffName: 'Praveen Chandran',
  },
];

export const INITIAL_SCORES: ScoreRecord[] = [
  {
    id: 'scr-1',
    registrationId: 'reg-88421',
    eventId: 'evt-codeathon',
    teamOrParticipantName: 'Binary Mavericks (Alex Mercer)',
    rollNumberOrTeamId: '2021CS042',
    round: 'Final Evaluation',
    criteriaScores: {
      'Algorithmic Correctness': 38,
      'Time & Space Optimization': 28,
      'Code Modularity & Style': 19,
      'Viva & Demonstration': 9,
    },
    totalScore: 94,
    feedback: 'Exceptional graph algorithmic solution with O(N log N) time complexity. Clean modular implementation.',
    submittedByStaffId: 'staff-emp-codeathon',
    submittedByStaffName: 'Praveen Chandran',
    submittedAt: '2024-10-24T14:30:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'SYSTEM_BOOT',
    actorRole: 'SYSTEM',
    actorName: 'SPIHER Core System',
    timestamp: '2024-10-01T08:00:00Z',
    details: 'System initialized with 11 Technical and Non-Technical competitions and 1-participant-1-event validation constraints.',
  },
  {
    id: 'log-2',
    action: 'REGISTRATION_CREATED',
    actorRole: 'PARTICIPANT',
    actorName: 'Alex Mercer',
    timestamp: '2024-10-01T10:15:00Z',
    details: 'Registered for Code-A-Thon Sprint (Team: Binary Mavericks). Generated QR Token.',
  },
  {
    id: 'log-3',
    action: 'GATE_ATTENDANCE_VERIFIED',
    actorRole: 'EMPLOYEE',
    actorName: 'Praveen Chandran',
    timestamp: '2024-10-24T09:15:22Z',
    details: 'Verified QR Pass for Alex Mercer at Computing Centre Lab 3.',
  },
];

// Local Storage Keys
const STORAGE_KEYS = {
  SETTINGS: 'spiher_settings_v3',
  EVENTS: 'spiher_events_v3',
  PARTICIPANTS: 'spiher_participants_v3',
  REGISTRATIONS: 'spiher_registrations_v3',
  ATTENDANCE: 'spiher_attendance_v3',
  SCORES: 'spiher_scores_v3',
  STAFF: 'spiher_staff_v3',
  EVENT_CHANGES: 'spiher_event_changes_v3',
  AUDIT_LOGS: 'spiher_audit_logs_v3',
};

export class MockDatabaseService {
  private static getItem<T>(key: string, defaultVal: T): T {
    try {
      const val = localStorage.getItem(key);
      if (!val) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(val) as T;
    } catch {
      return defaultVal;
    }
  }

  private static setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(`Error saving to localStorage key: ${key}`, e);
    }
  }

  static getSettings(): SystemSettings {
    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
  }

  static updateSettings(settings: SystemSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    this.logAction('SETTINGS_UPDATED', 'SUPER_ADMIN', 'Super Admin', 'Platform global settings updated');
  }

  static getEvents(): CollegeEvent[] {
    return this.getItem<CollegeEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  static saveEvent(event: CollegeEvent): void {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      events[idx] = event;
    } else {
      events.push(event);
    }
    this.setItem(STORAGE_KEYS.EVENTS, events);
    this.logAction('EVENT_SAVED', 'ADMIN', 'Administrator', `Event "${event.title}" created/updated`);
  }

  static deleteEvent(eventId: string): void {
    const events = this.getEvents().filter((e) => e.id !== eventId);
    this.setItem(STORAGE_KEYS.EVENTS, events);
    this.logAction('EVENT_DELETED', 'SUPER_ADMIN', 'Super Admin', `Event ID ${eventId} archived/deleted`);
  }

  static getParticipants(): Participant[] {
    return this.getItem<Participant[]>(STORAGE_KEYS.PARTICIPANTS, INITIAL_PARTICIPANTS);
  }

  static normalizeRollNumber(roll: string): string {
    return roll.trim().toUpperCase().replace(/[\s-]/g, '');
  }

  static verifyParticipantAccess(
    rollNumber: string,
    dob: string
  ): { success: boolean; participant?: Participant; registration?: Registration; error?: string } {
    const normInputRoll = this.normalizeRollNumber(rollNumber);
    const participants = this.getParticipants();
    const registrations = this.getRegistrations();

    const participant = participants.find(
      (p) =>
        this.normalizeRollNumber(p.rollNumber) === normInputRoll &&
        p.dateOfBirth === dob.trim()
    );

    if (!participant) {
      return {
        success: false,
        error: 'No participant record matching this Roll Number and Date of Birth was found.',
      };
    }

    const reg = registrations.find(
      (r) =>
        r.status === 'ACTIVE' &&
        (this.normalizeRollNumber(r.leaderRollNumber) === normInputRoll ||
          r.members?.some((m) => this.normalizeRollNumber(m.rollNumber) === normInputRoll))
    );

    return {
      success: true,
      participant,
      registration: reg,
    };
  }

  static getRegistrations(): Registration[] {
    return this.getItem<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
  }

  static isParticipantAlreadyRegistered(rollNumber: string): {
    isRegistered: boolean;
    existingEventTitle?: string;
    existingRegNumber?: string;
    activeRegistration?: Registration;
  } {
    const normRoll = this.normalizeRollNumber(rollNumber);
    const registrations = this.getRegistrations();

    const existing = registrations.find(
      (r) =>
        r.status === 'ACTIVE' &&
        (this.normalizeRollNumber(r.leaderRollNumber) === normRoll ||
          r.members?.some((m) => this.normalizeRollNumber(m.rollNumber) === normRoll))
    );

    if (existing) {
      return {
        isRegistered: true,
        existingEventTitle: existing.eventTitle,
        existingRegNumber: existing.registrationNumber,
        activeRegistration: existing,
      };
    }

    return { isRegistered: false };
  }

  static createRegistration(params: {
    eventId: string;
    eventTitle: string;
    category: 'Technical' | 'Non-Technical';
    leaderId: string;
    leaderName: string;
    leaderRollNumber: string;
    leaderEmail: string;
    leaderPhone?: string;
    collegeName: string;
    department: string;
    isTeamEvent: boolean;
    teamName?: string;
    members: {
      participantId?: string;
      name: string;
      rollNumber: string;
      department: string;
      collegeName: string;
      dateOfBirth?: string;
      isLeader: boolean;
    }[];
  }): { success: boolean; registration?: Registration; error?: string } {
    const leaderCheck = this.isParticipantAlreadyRegistered(params.leaderRollNumber);
    if (leaderCheck.isRegistered) {
      return {
        success: false,
        error: `Participant ${params.leaderName} (${params.leaderRollNumber}) is already registered for "${leaderCheck.existingEventTitle}". Strict 1-event rule applies.`,
      };
    }

    for (const member of params.members) {
      if (!member.isLeader) {
        const memCheck = this.isParticipantAlreadyRegistered(member.rollNumber);
        if (memCheck.isRegistered) {
          return {
            success: false,
            error: `Teammate ${member.name} (${member.rollNumber}) is already registered for "${memCheck.existingEventTitle}". Each student may join only 1 event.`,
          };
        }
      }
    }

    const regId = `reg-${Date.now().toString().slice(-5)}`;
    const regNumber = `IGNITE-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    const qrToken = `SPIHER_IGNITE_TOKEN_V1_${regNumber}_${Date.now()}`;

    const newReg: Registration = {
      id: regId,
      registrationNumber: regNumber,
      eventId: params.eventId,
      eventTitle: params.eventTitle,
      category: params.category,
      leaderId: params.leaderId,
      leaderName: params.leaderName,
      leaderRollNumber: params.leaderRollNumber,
      leaderEmail: params.leaderEmail,
      leaderPhone: params.leaderPhone,
      collegeName: params.collegeName,
      department: params.department,
      isTeamEvent: params.isTeamEvent,
      teamName: params.teamName,
      members: params.members,
      status: 'ACTIVE',
      qrToken,
      registeredAt: new Date().toISOString(),
    };

    const regs = this.getRegistrations();
    regs.push(newReg);
    this.setItem(STORAGE_KEYS.REGISTRATIONS, regs);

    const parts = this.getParticipants();
    for (const m of params.members) {
      const normM = this.normalizeRollNumber(m.rollNumber);
      const exists = parts.find((p) => this.normalizeRollNumber(p.rollNumber) === normM);
      if (!exists) {
        parts.push({
          id: m.participantId || `part-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          rollNumber: m.rollNumber,
          dateOfBirth: m.dateOfBirth || '2003-01-01',
          name: m.name,
          collegeName: m.collegeName,
          department: m.department,
          email: m.isLeader ? params.leaderEmail : `${normM.toLowerCase()}@spiher.edu.in`,
          phone: m.isLeader ? params.leaderPhone : undefined,
          createdAt: new Date().toISOString(),
        });
      }
    }
    this.setItem(STORAGE_KEYS.PARTICIPANTS, parts);

    const events = this.getEvents();
    const eventIdx = events.findIndex((e) => e.id === params.eventId);
    if (eventIdx >= 0 && events[eventIdx].slotsLeft > 0) {
      events[eventIdx].slotsLeft -= 1;
      this.setItem(STORAGE_KEYS.EVENTS, events);
    }

    this.logAction(
      'REGISTRATION_CREATED',
      'PARTICIPANT',
      params.leaderName,
      `Registered for "${params.eventTitle}" with Pass ID ${regNumber}`
    );

    return { success: true, registration: newReg };
  }

  static checkIsParticipantRegistered(rollNumber: string): {
    isRegistered: boolean;
    existingEventTitle?: string;
    existingRegNumber?: string;
    activeRegistration?: Registration;
  } {
    return this.isParticipantAlreadyRegistered(rollNumber);
  }

  static changeEvent(
    param1:
      | string
      | {
          currentRegistrationId: string;
          targetEventId: string;
          reason: string;
          newTeamMembers?: {
            name: string;
            rollNumber: string;
            department: string;
            collegeName: string;
            isLeader: boolean;
          }[];
        },
    param2?: string,
    param3?: string
  ): { success: boolean; newRegistration?: Registration; error?: string } {
    let params: {
      currentRegistrationId: string;
      targetEventId: string;
      reason: string;
      newTeamMembers?: {
        name: string;
        rollNumber: string;
        department: string;
        collegeName: string;
        isLeader: boolean;
      }[];
    };

    if (typeof param1 === 'string') {
      params = {
        currentRegistrationId: param1,
        targetEventId: param2 || '',
        reason: param3 || 'User requested 1-event switch',
      };
    } else {
      params = param1;
    }

    const regs = this.getRegistrations();
    const oldRegIndex = regs.findIndex((r) => r.id === params.currentRegistrationId);

    if (oldRegIndex === -1) {
      return { success: false, error: 'Original registration record not found.' };
    }

    const oldReg = regs[oldRegIndex];
    if (oldReg.status === 'CANCELLED') {
      return { success: false, error: 'This registration has already been revoked or cancelled.' };
    }

    const events = this.getEvents();
    const targetEvent = events.find((e) => e.id === params.targetEventId);

    if (!targetEvent) {
      return { success: false, error: 'Target event not found.' };
    }

    if (targetEvent.slotsLeft <= 0) {
      return { success: false, error: `Event "${targetEvent.title}" is completely full.` };
    }

    oldReg.status = 'CANCELLED';
    oldReg.qrToken = `REVOKED_${oldReg.qrToken}_${Date.now()}`;
    regs[oldRegIndex] = oldReg;

    const oldEventIdx = events.findIndex((e) => e.id === oldReg.eventId);
    if (oldEventIdx >= 0) {
      events[oldEventIdx].slotsLeft += 1;
    }

    const newRegId = `reg-${Date.now().toString().slice(-5)}`;
    const newRegNumber = `IGNITE-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    const newQrToken = `SPIHER_IGNITE_TOKEN_V1_${newRegNumber}_${Date.now()}`;

    const newMembers =
      params.newTeamMembers && params.newTeamMembers.length > 0
        ? params.newTeamMembers
        : [
            {
              name: oldReg.leaderName,
              rollNumber: oldReg.leaderRollNumber,
              department: oldReg.department,
              collegeName: oldReg.collegeName,
              isLeader: true,
            },
          ];

    const newReg: Registration = {
      id: newRegId,
      registrationNumber: newRegNumber,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      category: targetEvent.category,
      leaderId: oldReg.leaderId,
      leaderName: oldReg.leaderName,
      leaderRollNumber: oldReg.leaderRollNumber,
      leaderEmail: oldReg.leaderEmail,
      leaderPhone: oldReg.leaderPhone,
      collegeName: oldReg.collegeName,
      department: oldReg.department,
      isTeamEvent: targetEvent.isTeamEvent,
      teamName: targetEvent.isTeamEvent ? oldReg.teamName : undefined,
      members: newMembers,
      status: 'ACTIVE',
      qrToken: newQrToken,
      registeredAt: new Date().toISOString(),
    };

    regs.push(newReg);
    this.setItem(STORAGE_KEYS.REGISTRATIONS, regs);

    const targetIdx = events.findIndex((e) => e.id === targetEvent.id);
    if (targetIdx >= 0) {
      events[targetIdx].slotsLeft -= 1;
    }
    this.setItem(STORAGE_KEYS.EVENTS, events);

    const changes = this.getEventChanges();
    const auditChange: EventChangeAudit = {
      id: `chg-${Date.now()}`,
      participantId: oldReg.leaderId,
      participantName: oldReg.leaderName,
      rollNumber: oldReg.leaderRollNumber,
      oldRegistrationId: oldReg.registrationNumber,
      oldEventId: oldReg.eventId,
      oldEventTitle: oldReg.eventTitle,
      newRegistrationId: newReg.registrationNumber,
      newEventId: targetEvent.id,
      newEventTitle: targetEvent.title,
      changedAt: new Date().toISOString(),
      reason: params.reason || 'User requested 1-event switch in Participant Dashboard',
      ipAddress: '127.0.0.1 (Local Client)',
    };
    changes.push(auditChange);
    this.setItem(STORAGE_KEYS.EVENT_CHANGES, changes);

    this.logAction(
      'EVENT_CHANGED',
      'PARTICIPANT',
      oldReg.leaderName,
      `Switched event from "${oldReg.eventTitle}" to "${targetEvent.title}". Old pass ${oldReg.registrationNumber} revoked, new pass ${newRegNumber} issued.`
    );

    return { success: true, newRegistration: newReg };
  }

  static getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }

  static verifyQRToken(
    token: string,
    scanningStaffUser: StaffUser
  ): {
    success: boolean;
    registration?: Registration;
    alreadyAttended?: boolean;
    errorState?:
      | 'INVALID_QR'
      | 'ALREADY_ATTENDED'
      | 'WRONG_EVENT'
      | 'PARTICIPANT_NOT_FOUND'
      | 'NOT_AUTHORIZED';
    error?: string;
  } {
    if (!token || !token.trim()) {
      return { success: false, errorState: 'INVALID_QR', error: 'No QR token data found.' };
    }

    const cleanToken = token.trim();
    if (cleanToken.startsWith('REVOKED_')) {
      return {
        success: false,
        errorState: 'INVALID_QR',
        error: 'This QR pass has been REVOKED due to an authorized event change. Please use the newly issued pass.',
      };
    }

    const regs = this.getRegistrations();
    const reg = regs.find(
      (r) => r.qrToken === cleanToken || r.registrationNumber === cleanToken
    );

    if (!reg) {
      return {
        success: false,
        errorState: 'PARTICIPANT_NOT_FOUND',
        error: 'Pass token not found in the official registry.',
      };
    }

    if (reg.status === 'CANCELLED') {
      return {
        success: false,
        errorState: 'INVALID_QR',
        error: 'This registration pass has been CANCELLED and is no longer valid.',
      };
    }

    if (
      scanningStaffUser.assignedEventIds.length > 0 &&
      !scanningStaffUser.assignedEventIds.includes(reg.eventId)
    ) {
      return {
        success: false,
        registration: reg,
        errorState: 'WRONG_EVENT',
        error: `Scanned pass is for "${reg.eventTitle}". You are authorized to evaluate only your assigned events.`,
      };
    }

    const attendance = this.getAttendance();
    const existingAtt = attendance.find(
      (a) => a.registrationId === reg.id && a.status === 'PRESENT'
    );

    if (existingAtt) {
      return {
        success: true,
        registration: reg,
        alreadyAttended: true,
        errorState: 'ALREADY_ATTENDED',
        error: `Participant attendance was already recorded at ${new Date(
          existingAtt.scannedAt || ''
        ).toLocaleTimeString()} by ${existingAtt.scannedByStaffName}.`,
      };
    }

    return {
      success: true,
      registration: reg,
      alreadyAttended: false,
    };
  }

  static markAttendance(params: {
    registrationId: string;
    staffUser: StaffUser;
  }): { success: boolean; record?: AttendanceRecord; error?: string } {
    const regs = this.getRegistrations();
    const reg = regs.find((r) => r.id === params.registrationId);

    if (!reg) {
      return { success: false, error: 'Registration record not found.' };
    }

    const attendance = this.getAttendance();
    const existing = attendance.find(
      (a) => a.registrationId === reg.id && a.status === 'PRESENT'
    );

    if (existing) {
      return { success: false, error: 'Attendance already recorded for this registration.' };
    }

    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      registrationId: reg.id,
      eventId: reg.eventId,
      participantId: reg.leaderId,
      participantName: reg.leaderName,
      participantRollNumber: reg.leaderRollNumber,
      teamName: reg.teamName,
      status: 'PRESENT',
      scannedAt: new Date().toISOString(),
      scannedByStaffId: params.staffUser.id,
      scannedByStaffName: params.staffUser.name,
    };

    attendance.push(record);
    this.setItem(STORAGE_KEYS.ATTENDANCE, attendance);

    this.logAction(
      'ATTENDANCE_MARKED',
      'EMPLOYEE',
      params.staffUser.name,
      `Checked in ${reg.leaderName} (${reg.registrationNumber}) for "${reg.eventTitle}"`
    );

    return { success: true, record };
  }

  static recordAttendance(
    registrationId: string,
    staffUser: StaffUser,
    status: AttendanceStatus = 'PRESENT',
    notes?: string
  ): { success: boolean; record?: AttendanceRecord; error?: string } {
    const regs = this.getRegistrations();
    const reg = regs.find((r) => r.id === registrationId);

    if (!reg) {
      return { success: false, error: 'Registration record not found.' };
    }

    const attendance = this.getAttendance();
    const existingIdx = attendance.findIndex((a) => a.registrationId === reg.id);

    const record: AttendanceRecord = {
      id: existingIdx >= 0 ? attendance[existingIdx].id : `att-${Date.now()}`,
      registrationId: reg.id,
      eventId: reg.eventId,
      participantId: reg.leaderId,
      participantName: reg.leaderName,
      participantRollNumber: reg.leaderRollNumber,
      teamName: reg.teamName,
      status: status,
      scannedAt: new Date().toISOString(),
      scannedByStaffId: staffUser.id,
      scannedByStaffName: staffUser.name,
      notes: notes,
    };

    if (existingIdx >= 0) {
      attendance[existingIdx] = record;
    } else {
      attendance.push(record);
    }
    this.setItem(STORAGE_KEYS.ATTENDANCE, attendance);

    this.logAction(
      'ATTENDANCE_MARKED',
      'EMPLOYEE',
      staffUser.name,
      `Marked ${status} for ${reg.leaderName} (${reg.registrationNumber}) in "${reg.eventTitle}"`
    );

    return { success: true, record };
  }

  static getScores(): ScoreRecord[] {
    return this.getItem<ScoreRecord[]>(STORAGE_KEYS.SCORES, INITIAL_SCORES);
  }

  static saveScore(
    scoreOrRegId: ScoreRecord | string,
    scoreRecordParam?: ScoreRecord | number,
    feedbackParam?: string
  ): void {
    let score: ScoreRecord;
    if (typeof scoreOrRegId === 'string' && typeof scoreRecordParam === 'object') {
      score = scoreRecordParam;
    } else if (typeof scoreOrRegId === 'object') {
      score = scoreOrRegId;
    } else {
      const regs = this.getRegistrations();
      const reg = regs.find((r) => r.id === scoreOrRegId);
      score = {
        id: `scr-${Date.now()}`,
        registrationId: scoreOrRegId as string,
        eventId: reg?.eventId || '',
        teamOrParticipantName: reg?.teamName ? `${reg.teamName} (${reg.leaderName})` : reg?.leaderName || 'Participant',
        rollNumberOrTeamId: reg?.leaderRollNumber || '',
        totalScore: typeof scoreRecordParam === 'number' ? scoreRecordParam : 0,
        round: 'Evaluation',
        feedback: feedbackParam || '',
        submittedByStaffId: 'staff-emp',
        submittedByStaffName: 'Evaluator',
        submittedAt: new Date().toISOString(),
      };
    }

    const scores = this.getScores();
    const idx = scores.findIndex((s) => s.id === score.id || (s.registrationId === score.registrationId && s.round === score.round));

    if (idx >= 0) {
      scores[idx] = score;
    } else {
      scores.push(score);
    }

    this.setItem(STORAGE_KEYS.SCORES, scores);
    this.logAction(
      'SCORE_SUBMITTED',
      'EMPLOYEE',
      score.submittedByStaffName,
      `Score of ${score.totalScore}/100 recorded for ${score.teamOrParticipantName}`
    );
  }

  static getStaffUsers(): StaffUser[] {
    return this.getItem<StaffUser[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  static saveStaffUser(user: StaffUser): void {
    const staff = this.getStaffUsers();
    const idx = staff.findIndex((s) => s.id === user.id || s.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      staff[idx] = user;
    } else {
      staff.push(user);
    }
    this.setItem(STORAGE_KEYS.STAFF, staff);
    this.logAction('STAFF_PROVISIONED', 'SUPER_ADMIN', 'Administrator', `Staff user ${user.name} (${user.email}) configured`);
  }

  static authenticateStaff(email: string): { success: boolean; user?: StaffUser; error?: string } {
    const staff = this.getStaffUsers();
    const user = staff.find((s) => s.email.toLowerCase() === email.trim().toLowerCase() && s.isActive);
    if (!user) {
      return { success: false, error: 'Invalid staff credentials or account is inactive.' };
    }
    return { success: true, user };
  }

  static getEventChanges(): EventChangeAudit[] {
    return this.getItem<EventChangeAudit[]>(STORAGE_KEYS.EVENT_CHANGES, []);
  }

  static getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  static logAction(
    action: string,
    actorRole: 'PARTICIPANT' | 'EMPLOYEE' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM',
    actorName: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      actorRole,
      actorName,
      timestamp: new Date().toISOString(),
      details,
    });
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 300));
  }
}
