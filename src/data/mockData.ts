import { CollegeEvent, Coordinator, ParticipantInfo, QuickResource } from '../types';

export const mockCoordinators: Coordinator[] = [
  {
    id: 'coord-1',
    name: 'Dhanush',
    role: 'Student Organizer (4th Year)',
    phone: '+91 98401 23456',
    email: 'dhanush.4th@spiher.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    department: 'Dept. of Information Technology',
  },
  {
    id: 'coord-2',
    name: 'Luxchana',
    role: 'Event Coordinator (3rd Year)',
    phone: '+91 98402 34567',
    email: 'luxchana.3rd@spiher.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    department: 'Dept. of Information Technology',
  },
];

export const mockParticipant: ParticipantInfo = {
  name: 'Alex Mercer',
  id: 'SP-2026-892',
  rollNumber: '2021CS042',
  department: 'Dept. of Information Technology',
  team: 'Team Alpha',
  college: "St. Peter's Institute of Higher Education & Research",
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  email: 'alex.mercer@stpeters.edu.in',
  phone: '+91 98765 43210',
  activeEvent: {
    title: 'AI Prompt',
    date: 'Oct 24, 2026',
    month: 'Oct',
    day: '24',
    time: '10:00 AM - 12:00 PM',
    venue: 'Room 251',
    status: 'Confirmed Registration',
    qrData: 'RAD-2026-88421',
  },
};

export const mockEvents: CollegeEvent[] = [
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
    ],
    coordinators: [
      {
        id: 'coord-ai-1',
        name: 'Dhanush',
        role: 'Organizer (4th Year)',
        phone: '+91 98401 23456',
        email: 'dhanush.4th@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
      {
        id: 'coord-ai-2',
        name: 'Luxchana',
        role: 'Coordinator (3rd Year)',
        phone: '+91 98402 34567',
        email: 'luxchana.3rd@spiher.edu.in',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        department: 'Dept. of Information Technology',
      },
    ],
    status: 'OPEN',
  },
];

export const mockQuickResources: QuickResource[] = [
  {
    id: 'res-1',
    title: 'Campus Map & Venues',
    subtitle: 'Room 251, Room 248, Room 247 & Main Hall',
    icon: 'map',
    type: 'map',
    actionIcon: 'chevron_right',
  },
  {
    id: 'res-2',
    title: 'Event Schedule & Guidelines',
    subtitle: 'Official symposium timetable & rules',
    icon: 'picture_as_pdf',
    type: 'pdf',
    actionIcon: 'download',
  },
];
