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
  TeamMember,
} from '../types';
import { SupabaseService } from '../services/supabaseService';

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  isRegistrationOpen: true,
  allowEventChange: true,
  collegeName: "St. Peter's Institute of Higher Education & Research",
  collegeShortName: "SPIHER",
  symposiumName: "RADIANZA '26 — National Level Symposium",
  symposiumYear: '2026',
  themeBannerText: "Welcome to RADIANZA '26! Registrations are currently LIVE. Please ensure you carry your digital QR Pass.",
  supportEmail: 'radianza2026@spiher.edu.in',
  supportPhone: '+91 94440 12345',
  venueAddress: 'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054',
  emergencyNotice: undefined,
};

export const INITIAL_EVENTS: CollegeEvent[] = [
  // -------------------------------------------------------------
  // TECHNICAL EVENTS (5)
  // -------------------------------------------------------------
  {
    id: 'evt-ai-prompt',
    title: 'AI Prompt',
    category: 'Technical',
    tagline: 'Creative Prompt Engineering & Generative AI Challenge',
    description: 'Test your mastery of generative AI models, rapid prompt craft, and problem-solving to generate precise solutions under time constraints.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Room 251',
    totalSlots: 40,
    slotsLeft: 22,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹10,000',
    firstPrize: '₹6,000',
    secondPrize: '₹4,000',
    rules: [
      'Individual or team of 2.',
      'Allowed to use provided AI model interfaces.',
      'Prompts evaluated on accuracy, efficiency, and output quality.',
      'Decision of the technical jury is final.',
    ],
    coordinators: [
      {
        id: 'coord-dhanush',
        name: 'Dhanush',
        role: 'Organizer (4th Year)',
        phone: '+91 98401 23456',
        email: 'dhanush.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-luxchana',
        name: 'Luxchana',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98402 34567',
        email: 'luxchana.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-devipriya',
        name: 'Devi Priya',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98403 45678',
        email: 'devipriya.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-ui-ux',
    title: 'UI/UX Design',
    category: 'Technical',
    tagline: 'Digital Experience, Prototyping & Interface Design',
    description: 'Craft intuitive, visually captivating user interfaces and frictionless user experiences from a real-world design prompt.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Room 251',
    totalSlots: 40,
    slotsLeft: 18,
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹10,000',
    firstPrize: '₹6,000',
    secondPrize: '₹4,000',
    rules: [
      'Teams of 1-2 participants.',
      'Figma, Adobe XD, or web technologies permitted.',
      'Deliverables must include user flow and responsive mockups.',
      'Original work only; assets must be properly attributed.',
    ],
    coordinators: [
      {
        id: 'coord-ragavan',
        name: 'Ragavan',
        role: 'Organizer (4th Year)',
        phone: '+91 98404 56789',
        email: 'ragavan.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-priyadharshini',
        name: 'Priya Dharshini',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98405 67890',
        email: 'priyadharshini.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-harishini-santhiya',
        name: 'Harishini & Santhiya',
        role: 'Asst-Coordinators (2nd Year)',
        phone: '+91 98406 78901',
        email: 'design.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-logo-creation',
    title: 'Logo Creation',
    category: 'Technical',
    tagline: 'Brand Identity, Vector Graphics & Visual Storytelling',
    description: 'Create distinctive, modern, and memorable brand logos and visual identities using digital design tools based on surprise prompts.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Room 251',
    totalSlots: 35,
    slotsLeft: 14,
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹8,000',
    firstPrize: '₹5,000',
    secondPrize: '₹3,000',
    rules: [
      'Solo participation.',
      'Vector design tools allowed (Illustrator, Figma, Photoshop).',
      'No pre-made templates or clipart permitted.',
      'Submit export in PNG/SVG along with source file.',
    ],
    coordinators: [
      {
        id: 'coord-kesav-logo',
        name: 'Kesav',
        role: 'Organizer (4th Year)',
        phone: '+91 98407 88990',
        email: 'kesav.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-logo-coord',
        name: 'Logo Creation Coordinator',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98408 99001',
        email: 'logocreat.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-tech-quiz',
    title: 'Tech Quiz',
    category: 'Technical',
    tagline: 'Battle of Tech Minds, CS Fundamentals & Emerging Innovations',
    description: 'Fast-paced competitive quiz rounds testing depth of knowledge across computing fundamentals, algorithms, emerging tech, cybersecurity, and trivia.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '12:00 PM - 01:00 PM',
    startTime: '12:00 PM',
    endTime: '01:00 PM',
    venue: 'Room 251',
    totalSlots: 50,
    slotsLeft: 20,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹10,000',
    firstPrize: '₹6,000',
    secondPrize: '₹4,000',
    rules: [
      'Teams of 2 participants.',
      'Written prelims round followed by stage finals with buzzer rounds.',
      'No electronic devices allowed during testing.',
    ],
    coordinators: [
      {
        id: 'coord-thirumalai',
        name: 'Thirumalai',
        role: 'Organizer (4th Year)',
        phone: '+91 98409 11223',
        email: 'thirumalai.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-partiv',
        name: 'Parthiv',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98410 22334',
        email: 'parthiv.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-website-creation',
    title: 'Website Creation',
    category: 'Technical',
    tagline: 'Full-Stack Web Engineering & Responsive Showcase',
    description: 'Develop and deploy interactive, responsive, and innovative web applications within a set timeframe. Judged on creativity, code architecture, and UI.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Room 251 / Tech Lab',
    totalSlots: 40,
    slotsLeft: 16,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹12,000',
    firstPrize: '₹7,000',
    secondPrize: '₹5,000',
    rules: [
      'Teams of 1-2 participants.',
      'HTML5, CSS3, JavaScript, React, Vue or Tailwind CSS permitted.',
      'Must be fully responsive across mobile and desktop viewports.',
    ],
    coordinators: [
      {
        id: 'coord-gopinath',
        name: 'Gopinath',
        role: 'Organizer (4th Year)',
        phone: '+91 98411 33445',
        email: 'gopinath.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-devadharshni',
        name: 'Deva Dharshni',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98412 44556',
        email: 'devadharshni.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-edwin',
        name: 'Edwin E',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98413 55667',
        email: 'edwin.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },

  // -------------------------------------------------------------
  // NON-TECHNICAL EVENTS (10)
  // -------------------------------------------------------------
  {
    id: 'evt-poster-making',
    title: 'Poster Making',
    category: 'Non-Technical',
    tagline: 'Visual Art, Creative Expression & Thematic Illustrations',
    description: 'Bring ideas to life on canvas with vibrant creative illustrations, thematic depth, and compelling visual design.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 11:00 AM',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    venue: 'Room 248, 247',
    totalSlots: 40,
    slotsLeft: 15,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹6,000',
    firstPrize: '₹4,000',
    secondPrize: '₹2,000',
    rules: [
      'Teams of 1-2 members.',
      'Drawing sheets will be provided.',
      'Theme announced 10 mins prior to event start.',
    ],
    coordinators: [
      {
        id: 'coord-kesav-n',
        name: 'Kesav N',
        role: 'Organizer (4th Year)',
        phone: '+91 98414 66778',
        email: 'kesavn.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Mechanical',
      },
      {
        id: 'coord-blessy',
        name: 'Blessy',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98415 77889',
        email: 'blessy.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-balaji',
        name: 'Balaji',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98416 88990',
        email: 'balaji.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of ECE',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-pushup',
    title: 'Push-up Challenge',
    category: 'Non-Technical',
    tagline: 'Physical Endurance, Stamina & Pure Strength',
    description: 'Test your physical endurance, core strength, and grit in a regulated push-up endurance challenge judged on clean form and repetition.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 11:00 AM',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    venue: 'Main Hall',
    totalSlots: 50,
    slotsLeft: 25,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹5,000',
    firstPrize: '₹3,000',
    secondPrize: '₹2,000',
    rules: [
      'Individual participation.',
      'Strict 90-degree elbow bend required for each valid rep.',
      'Continuous repetition without touching knees or resting on floor.',
    ],
    coordinators: [
      {
        id: 'coord-aakash',
        name: 'Aakash',
        role: 'Organizer (4th Year)',
        phone: '+91 98417 99001',
        email: 'aakash.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Physical Education / Mech',
      },
      {
        id: 'coord-kumarvel-3rd',
        name: 'Kumaravel',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98418 00112',
        email: 'kumarvel.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Civil',
      },
      {
        id: 'coord-barathi',
        name: 'Barathi',
        role: 'Asst-Coordinator (3rd Year)',
        phone: '+91 98419 11223',
        email: 'barathi.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-memory-game',
    title: 'Memory Game',
    category: 'Non-Technical',
    tagline: 'Cognitive Recall, Focus & Rapid Mental Agility',
    description: 'Exercise sharp visual memory and mental recall in rapid-fire observation tests with increasing complexity.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 11:00 AM',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    venue: 'Room 248',
    totalSlots: 35,
    slotsLeft: 12,
    imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹5,000',
    firstPrize: '₹3,000',
    secondPrize: '₹2,000',
    rules: [
      'Solo participation.',
      '30 seconds observation followed by recall challenge.',
      'No writing materials allowed during observation stage.',
    ],
    coordinators: [
      {
        id: 'coord-yuvaraj',
        name: 'Yuvaraj',
        role: 'Organizer (4th Year)',
        phone: '+91 98420 22334',
        email: 'yuvaraj.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-baraths',
        name: 'Barath S',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98421 33445',
        email: 'baraths.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-face-painting',
    title: 'Face Painting',
    category: 'Non-Technical',
    tagline: 'Living Canvas, Thematic Body Art & Aesthetics',
    description: 'Express imagination and intricate artistic mastery using faces as dynamic storytelling canvases.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
    price: 0,
    date: 'Oct 24, 2026',
    time: '10:00 AM - 11:00 AM',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    venue: 'Main Hall / Room 247',
    totalSlots: 30,
    slotsLeft: 10,
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹6,000',
    firstPrize: '₹4,000',
    secondPrize: '₹2,000',
    rules: [
      'Team of 2 (1 painter + 1 model).',
      'Participants must bring skin-safe paints and brushes.',
      'Theme will be provided on the spot. Time limit: 45 mins.',
    ],
    coordinators: [
      {
        id: 'coord-aswin',
        name: 'Aswin',
        role: 'Organizer (4th Year)',
        phone: '+91 98422 44556',
        email: 'aswin.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of ECE',
      },
      {
        id: 'coord-kamalesh',
        name: 'Kamalesh',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98423 55667',
        email: 'kamalesh.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-mukesh',
        name: 'Mukesh',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98424 66778',
        email: 'mukesh.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-connections',
    title: 'Connections',
    category: 'Non-Technical',
    tagline: 'Image Decryption, Lateral Thinking & Word Link Trivia',
    description: 'Connect clues, images, cryptic associations, and pop culture references to crack the hidden word links fastest.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 3,
    price: 0,
    date: 'Oct 24, 2026',
    time: '11:00 AM - 12:00 PM',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    venue: 'Main Hall',
    totalSlots: 50,
    slotsLeft: 20,
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹7,000',
    firstPrize: '₹4,500',
    secondPrize: '₹2,500',
    rules: [
      'Teams of 2-3 participants.',
      'Image clue puzzles across Cinema, Tech, and General Knowledge.',
      'Buzzer round for ties.',
    ],
    coordinators: [
      {
        id: 'coord-jayasri',
        name: 'Jaya Sri',
        role: 'Organizer (4th Year)',
        phone: '+91 98425 77889',
        email: 'jayasri.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-naveens',
        name: 'Naveen S',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98426 88990',
        email: 'naveens.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-sivamkumar',
        name: 'Sivam Kumar',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98427 99001',
        email: 'sivamkumar.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Mech',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-treasure-hunt',
    title: 'Treasure Hunt',
    category: 'Non-Technical',
    tagline: 'Campus Riddles, Secret Clues & Thrilling Exploration',
    description: 'Decipher cryptic riddles across the campus grounds, locate checkpoints, and race against other squads to unearth the final bounty.',
    isTeamEvent: true,
    minTeamSize: 3,
    maxTeamSize: 4,
    price: 0,
    date: 'Oct 24, 2026',
    time: '11:00 AM - 12:30 PM',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    venue: 'Outdoor / Campus Grounds',
    totalSlots: 40,
    slotsLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹10,000',
    firstPrize: '₹6,000',
    secondPrize: '₹4,000',
    rules: [
      'Teams of 3-4 participants.',
      'Clues must be solved sequentially.',
      'Stay within designated campus zone boundaries.',
    ],
    coordinators: [
      {
        id: 'coord-lilly',
        name: 'Lilly Vinoth',
        role: 'Organizer (4th Year)',
        phone: '+91 98428 00112',
        email: 'lillyvinoth.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-mohankumar',
        name: 'Mohan Kumar',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98429 11223',
        email: 'mohankumar.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-kishore',
        name: 'Kishore',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98430 22334',
        email: 'kishore.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Civil',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-rampwalk',
    title: 'Rampwalk',
    category: 'Non-Technical',
    tagline: 'Elegance, Poise, Runway Charisma & Couture Style',
    description: 'Own the runway with confidence, signature walk, thematic attire, and stage presence.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2026',
    time: '12:00 PM - 12:30 PM',
    startTime: '12:00 PM',
    endTime: '12:30 PM',
    venue: 'Main Hall',
    totalSlots: 30,
    slotsLeft: 10,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹8,000',
    firstPrize: '₹5,000',
    secondPrize: '₹3,000',
    rules: [
      'Solo participation.',
      'Attire must be decent and adhering to theme/college code.',
      'Judged on posture, confidence, attire, and stage walk.',
    ],
    coordinators: [
      {
        id: 'coord-jeevadharshni',
        name: 'Jeeva Dharshni',
        role: 'Organizer (4th Year)',
        phone: '+91 98431 33445',
        email: 'jeevadharshni.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Viscom',
      },
      {
        id: 'coord-tanya',
        name: 'Tanya',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98432 44556',
        email: 'tanya.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-sharmi',
        name: 'Sharmi',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98433 55667',
        email: 'sharmi.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-singing',
    title: 'Singing Competition',
    category: 'Non-Technical',
    tagline: 'Vocal Melody, Pitch Precision & Musical Soul',
    description: 'Showcase vocal talent across classical, contemporary, cinematic, and western genres.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    price: 0,
    date: 'Oct 24, 2026',
    time: '12:30 PM - 01:00 PM',
    startTime: '12:30 PM',
    endTime: '01:00 PM',
    venue: 'Main Hall',
    totalSlots: 30,
    slotsLeft: 11,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹8,000',
    firstPrize: '₹5,000',
    secondPrize: '₹3,000',
    rules: [
      'Solo singing.',
      'Time limit: 3-4 minutes per participant.',
      'Karaoke track must be submitted in advance on USB drive.',
    ],
    coordinators: [
      {
        id: 'coord-kaviya',
        name: 'Kaviya',
        role: 'Organizer (4th Year)',
        phone: '+91 98434 66778',
        email: 'kaviya.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-sathivel',
        name: 'Sathivel',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98435 77889',
        email: 'sathivel.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of ECE',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-freefire',
    title: 'Free Fire Battle Royale',
    category: 'Non-Technical',
    tagline: 'Squad Tactics, Fast Reflexes & Tactical Battle Royale',
    description: 'Drop into the battlefield with your squad. Strategy, team coordination, and sharp marksmanship determine who secures the Booyah!',
    isTeamEvent: true,
    minTeamSize: 4,
    maxTeamSize: 4,
    price: 0,
    date: 'Oct 24, 2026',
    time: '01:30 PM - 03:00 PM',
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    venue: 'Room 251',
    totalSlots: 48,
    slotsLeft: 12,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹12,000',
    firstPrize: '₹7,000',
    secondPrize: '₹5,000',
    rules: [
      'Squad mode (4 players per team).',
      'Mobile devices only (no emulators / triggers / hacks allowed).',
      'Points based on placement and kill counts across 2 custom rooms.',
    ],
    coordinators: [
      {
        id: 'coord-kumaravel-ff',
        name: 'Kumaravel',
        role: 'Organizer (4th Year)',
        phone: '+91 98436 88990',
        email: 'kumaravel.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-monesh-karthik',
        name: 'Monesh Tej & Karthikeyan',
        role: 'Coordinators (3rd Year)',
        phone: '+91 98437 99001',
        email: 'ff.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-ganesh',
        name: 'Ganesh',
        role: 'Asst-Coordinator (2nd Year)',
        phone: '+91 98438 00112',
        email: 'ganesh.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Mech',
      },
    ],
    status: 'OPEN',
  },
  {
    id: 'evt-dance',
    title: 'Dance Competition',
    category: 'Non-Technical',
    tagline: 'Rhythm, Choreography, Dynamic Energy & Stage Impact',
    description: 'Electrify the stage with breathtaking moves, synchronization, creative choreography, and unmatched stage passion.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 6,
    price: 0,
    date: 'Oct 24, 2026',
    time: '02:00 PM - 03:00 PM',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    venue: 'Main Hall',
    totalSlots: 25,
    slotsLeft: 8,
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹10,000',
    firstPrize: '₹6,000',
    secondPrize: '₹4,000',
    rules: [
      'Solo, Duo or Group (up to 6 members).',
      'Time limit: 3-5 minutes.',
      'Audio track to be submitted 30 mins before stage time.',
    ],
    coordinators: [
      {
        id: 'coord-jayalakshmi',
        name: 'Jaya Lakshmi',
        role: 'Organizer (4th Year)',
        phone: '+91 98439 11223',
        email: 'jayalakshmi.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-ezhumalai',
        name: 'Ezhumalai',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98440 22334',
        email: 'ezhumalai.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of ECE',
      },
      {
        id: 'coord-logesh-navitha',
        name: 'Logesh & Navitha',
        role: 'Asst-Coordinators (2nd Year)',
        phone: '+91 98441 33445',
        email: 'dance.2nd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
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
    department: 'Dept. of Information Technology',
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
    department: 'Dept. of Information Technology',
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
  {
    id: 'part-karthickeyan',
    rollNumber: 'SP24ITU008',
    dateOfBirth: '2002-08-02',
    name: 'karthickeyan M',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Information Technology',
    email: 'karthickeyan.m@spiher.edu.in',
    phone: '+91 98765 12345',
    createdAt: '2024-10-03T12:00:00Z',
  },
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-88421',
    registrationNumber: 'IGNITE-2024-88421',
    eventId: 'evt-ai-prompt',
    eventTitle: 'AI Prompt',
    category: 'Technical',
    leaderId: 'part-1',
    leaderName: 'Alex Mercer',
    leaderRollNumber: '2021CS042',
    leaderEmail: 'alex.mercer@spiher.edu.in',
    leaderPhone: '+91 98765 43210',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Information Technology',
    isTeamEvent: true,
    teamName: 'Binary Mavericks',
    members: [
      {
        participantId: 'part-1',
        name: 'Alex Mercer',
        rollNumber: '2021CS042',
        department: 'Dept. of Information Technology',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        dateOfBirth: '2003-05-14',
        isLeader: true,
      },
      {
        participantId: 'part-2',
        name: 'Rohit Sharma',
        rollNumber: '2021CS043',
        department: 'Dept. of Information Technology',
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
    eventId: 'evt-ui-ux',
    eventTitle: 'UI/UX Design',
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
  {
    id: 'reg-88957',
    registrationNumber: 'IGNITE-2024-88957',
    eventId: 'evt-freefire',
    eventTitle: 'Free Fire Battle Royale',
    category: 'Technical',
    leaderId: 'part-karthickeyan',
    leaderName: 'karthickeyan M',
    leaderRollNumber: 'SP24ITU008',
    leaderEmail: 'karthickeyan.m@spiher.edu.in',
    leaderPhone: '+91 98765 12345',
    collegeName: "St. Peter's Institute of Higher Education & Research",
    department: 'Dept. of Information Technology',
    isTeamEvent: true,
    teamName: 'Team karthickeyan',
    members: [
      {
        participantId: 'part-karthickeyan',
        name: 'karthickeyan M',
        rollNumber: 'SP24ITU008',
        department: 'Dept. of Information Technology',
        collegeName: "St. Peter's Institute of Higher Education & Research",
        dateOfBirth: '2002-08-02',
        isLeader: true,
      },
    ],
    status: 'ACTIVE',
    qrToken: 'SPIHER_IGNITE_TOKEN_V1_88957_SEC',
    registeredAt: '2024-10-03T12:00:00Z',
  },
];

export const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-super',
    email: 'superadmin@spiher.edu.in',
    name: 'Dr. M. Sivasankaran (Convenor)',
    role: 'SUPER_ADMIN',
    password: 'superadmin123',
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
    password: 'admin123',
    department: 'Dept. of Information Technology',
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
    password: 'judge123',
    department: 'Dept. of Information Technology',
    assignedEventIds: ['evt-ai-prompt'],
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
    eventId: 'evt-ai-prompt',
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
    eventId: 'evt-ai-prompt',
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
    details: 'Registered for AI Prompt (Team: Binary Mavericks). Generated QR Token.',
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
  SETTINGS: 'spiher_settings_v5',
  EVENTS: 'spiher_events_v5',
  PARTICIPANTS: 'spiher_participants_v5',
  REGISTRATIONS: 'spiher_registrations_v5',
  ATTENDANCE: 'spiher_attendance_v5',
  SCORES: 'spiher_scores_v5',
  STAFF: 'spiher_staff_v5',
  EVENT_CHANGES: 'spiher_event_changes_v5',
  AUDIT_LOGS: 'spiher_audit_logs_v5',
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

  /**
   * Synchronize all local storage tables with live Supabase Database
   */
  static async syncWithSupabase(): Promise<void> {
    try {
      const [events, participants, registrations, attendance, scores, staff, settings] = await Promise.all([
        SupabaseService.getEvents(),
        SupabaseService.getParticipants(),
        SupabaseService.getRegistrations(),
        SupabaseService.getAttendance(),
        SupabaseService.getScores(),
        SupabaseService.getStaffUsers(),
        SupabaseService.getSettings(),
      ]);

      if (events) {
        this.setItem(STORAGE_KEYS.EVENTS, events.length > 0 ? events : INITIAL_EVENTS);
      }
      if (participants && participants.length > 0) {
        this.setItem(STORAGE_KEYS.PARTICIPANTS, participants);
      }
      if (registrations && registrations.length > 0) {
        this.setItem(STORAGE_KEYS.REGISTRATIONS, registrations);
      } else {
        // Auto-seed/push existing local registrations to Supabase on first live connection
        const localRegs = this.getItem<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []);
        for (const reg of localRegs) {
          SupabaseService.createRegistration({
            participantData: {
              dateOfBirth: reg.members?.find((m) => m.isLeader)?.dateOfBirth || '2003-01-01',
            },
            registration: reg,
          }).catch((err) => console.warn('Auto sync local registration to Supabase notice:', err));
        }
      }
      if (attendance !== null && attendance !== undefined) {
        this.setItem(STORAGE_KEYS.ATTENDANCE, attendance);
      }
      if (scores !== null && scores !== undefined) {
        this.setItem(STORAGE_KEYS.SCORES, scores);
      }
      if (staff) {
        this.setItem(STORAGE_KEYS.STAFF, staff.length > 0 ? staff : INITIAL_STAFF);
      }
      if (settings) {
        this.setItem(STORAGE_KEYS.SETTINGS, settings);
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }
  }

  static getSettings(): SystemSettings {
    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
  }

  static updateSettings(settings: SystemSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    this.logAction('SETTINGS_UPDATED', 'SUPER_ADMIN', 'Super Admin', 'Platform global settings updated');
    // Sync to Supabase in background
    SupabaseService.updateSettings(settings).catch((err) => {
      console.warn('Background Supabase updateSettings warning:', err);
    });
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
    // Sync to Supabase in background
    SupabaseService.saveEvent(event).catch((err) => {
      console.warn('Background Supabase saveEvent warning:', err);
    });
  }

  static deleteEvent(eventId: string): void {
    const events = this.getEvents().filter((e) => e.id !== eventId);
    this.setItem(STORAGE_KEYS.EVENTS, events);
    this.logAction('EVENT_DELETED', 'SUPER_ADMIN', 'Super Admin', `Event ID ${eventId} archived/deleted`);
    // Sync to Supabase in background
    SupabaseService.deleteEvent(eventId).catch((err) => {
      console.warn('Background Supabase deleteEvent warning:', err);
    });
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

    // Live Supabase Backend Synchronization
    SupabaseService.createRegistration({
      participantData: {
        dateOfBirth: params.members.find((m) => m.isLeader)?.dateOfBirth,
      },
      registration: newReg,
    }).catch((err) => console.warn('Supabase createRegistration background sync error:', err));

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

    // Live Supabase Backend Synchronization
    SupabaseService.changeEvent(auditChange, oldReg.id, newReg)
      .catch((err) => console.warn('Supabase changeEvent background sync error:', err));

    return { success: true, newRegistration: newReg };
  }

  static getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }

  static verifyQRToken(
    token: string,
    scanningStaffUser: StaffUser | string[]
  ): {
    success: boolean;
    valid?: boolean;
    registration?: Registration;
    event?: CollegeEvent;
    alreadyAttended?: boolean;
    errorState?:
      | 'INVALID_QR'
      | 'ALREADY_ATTENDED'
      | 'WRONG_EVENT'
      | 'PARTICIPANT_NOT_FOUND'
      | 'NOT_AUTHORIZED';
    errorType?: string;
    error?: string;
    errorMessage?: string;
  } {
    if (!token || !token.trim()) {
      return {
        success: false,
        valid: false,
        errorState: 'INVALID_QR',
        errorType: 'INVALID_QR',
        error: 'No QR token data found.',
        errorMessage: 'No QR token data found.',
      };
    }

    let cleanToken = token.trim();

    // 1. Check if token is a JSON payload
    try {
      if (cleanToken.startsWith('{') && cleanToken.endsWith('}')) {
        const parsed = JSON.parse(cleanToken);
        cleanToken = parsed.qrToken || parsed.token || parsed.registrationNumber || parsed.rollNumber || cleanToken;
      }
    } catch {
      // not json, continue
    }

    // 2. Check if token is a URL
    if (cleanToken.includes('token=')) {
      try {
        const url = new URL(cleanToken);
        cleanToken = url.searchParams.get('token') || cleanToken;
      } catch {
        const match = cleanToken.match(/token=([^&]+)/);
        if (match) cleanToken = match[1];
      }
    }

    if (cleanToken.startsWith('REVOKED_')) {
      return {
        success: false,
        valid: false,
        errorState: 'INVALID_QR',
        errorType: 'INVALID_QR',
        error: 'This QR pass has been REVOKED due to an authorized event change. Please use the newly issued pass.',
        errorMessage: 'This QR pass has been REVOKED due to an authorized event change. Please use the newly issued pass.',
      };
    }

    const regs = this.getRegistrations();
    const events = this.getEvents();
    const normInput = this.normalizeRollNumber(cleanToken);

    // Check revoked list
    const revokedReg = regs.find(
      (r) =>
        r.status === 'CANCELLED' &&
        (r.qrToken.includes(cleanToken) || r.registrationNumber === cleanToken)
    );
    if (revokedReg) {
      return {
        success: false,
        valid: false,
        errorState: 'INVALID_QR',
        errorType: 'INVALID_QR',
        error: 'This QR pass has been REVOKED due to an authorized event change. Please use the newly issued pass.',
        errorMessage: 'This QR pass has been REVOKED due to an authorized event change. Please use the newly issued pass.',
      };
    }

    // Match by qrToken, registrationNumber, leaderRollNumber, or member rollNumber
    const reg = regs.find(
      (r) =>
        r.qrToken === cleanToken ||
        r.registrationNumber.toUpperCase() === cleanToken.toUpperCase() ||
        this.normalizeRollNumber(r.leaderRollNumber) === normInput ||
        r.members?.some((m) => this.normalizeRollNumber(m.rollNumber) === normInput)
    );

    if (!reg) {
      return {
        success: false,
        valid: false,
        errorState: 'PARTICIPANT_NOT_FOUND',
        errorType: 'PARTICIPANT_NOT_FOUND',
        error: 'Pass token not found in the official registry.',
        errorMessage: 'Pass token not found in the official registry.',
      };
    }

    const matchedEvent = events.find((e) => e.id === reg.eventId);

    if (reg.status === 'CANCELLED') {
      return {
        success: false,
        valid: false,
        registration: reg,
        event: matchedEvent,
        errorState: 'INVALID_QR',
        errorType: 'INVALID_QR',
        error: 'This registration pass has been CANCELLED and is no longer valid.',
        errorMessage: 'This registration pass has been CANCELLED and is no longer valid.',
      };
    }

    const assignedIds: string[] = Array.isArray(scanningStaffUser)
      ? scanningStaffUser
      : scanningStaffUser.assignedEventIds || [];

    if (assignedIds.length > 0 && !assignedIds.includes(reg.eventId)) {
      return {
        success: false,
        valid: false,
        registration: reg,
        event: matchedEvent,
        errorState: 'WRONG_EVENT',
        errorType: 'WRONG_EVENT',
        error: `Scanned pass is for "${reg.eventTitle}". You are authorized to evaluate only your assigned events.`,
        errorMessage: `Scanned pass is for "${reg.eventTitle}". You are authorized to evaluate only your assigned events.`,
      };
    }

    const attendance = this.getAttendance();
    const existingAtt = attendance.find(
      (a) => a.registrationId === reg.id && a.status === 'PRESENT'
    );

    if (existingAtt) {
      return {
        success: true,
        valid: true,
        registration: reg,
        event: matchedEvent,
        alreadyAttended: true,
        errorState: 'ALREADY_ATTENDED',
        errorType: 'ALREADY_ATTENDED',
        error: `Participant attendance was already recorded at ${new Date(
          existingAtt.scannedAt || ''
        ).toLocaleTimeString()} by ${existingAtt.scannedByStaffName}.`,
        errorMessage: `Participant attendance was already recorded at ${new Date(
          existingAtt.scannedAt || ''
        ).toLocaleTimeString()} by ${existingAtt.scannedByStaffName}.`,
      };
    }

    return {
      success: true,
      valid: true,
      registration: reg,
      event: matchedEvent,
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

    // Live Supabase Backend Synchronization
    SupabaseService.recordAttendance(record)
      .catch((err) => console.warn('Supabase recordAttendance background sync error:', err));

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

    // Live Supabase Backend Synchronization
    SupabaseService.saveScore(score)
      .catch((err) => console.warn('Supabase saveScore background sync error:', err));
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

  static authenticateStaff(email: string, password?: string): { success: boolean; user?: StaffUser; error?: string } {
    const staff = this.getStaffUsers();
    const user = staff.find((s) => s.email.toLowerCase() === email.trim().toLowerCase() && s.isActive);
    if (!user) {
      return { success: false, error: 'No authorized staff account found matching this email.' };
    }

    if (password && password.trim() && user.password && !password.includes('••••')) {
      if (user.password !== password.trim()) {
        return { success: false, error: 'Incorrect password provided for this staff account.' };
      }
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
