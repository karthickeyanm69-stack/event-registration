import { CollegeEvent, Coordinator, ParticipantInfo, QuickResource } from '../types';

export const mockCoordinators: Coordinator[] = [
  {
    id: 'coord-1',
    name: 'Dr. K. Senthil Nathan',
    role: 'Faculty Coordinator',
    phone: '+91 98401 23456',
    email: 'senthilnathan.cse@spiher.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    department: 'Dept. of Computer Science & Engineering',
  },
];

export const mockParticipant: ParticipantInfo = {
  name: 'Alex Mercer',
  id: 'SP-2024-892',
  rollNumber: '2021-CS-042',
  department: 'Dept. of Computer Science',
  team: 'Team Alpha',
  college: "St. Peter's Institute of Higher Education & Research",
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  email: 'alex.mercer@stpeters.edu.in',
  phone: '+91 98765 43210',
  activeEvent: {
    title: 'National Level Technical Symposium',
    date: 'Oct 24, 2024',
    month: 'Oct',
    day: '24',
    time: '09:00 AM - 05:00 PM',
    venue: 'Main Auditorium, Block C',
    status: 'Confirmed Registration',
    qrData: 'SPE-2024-88421',
  },
};

export const mockEvents: CollegeEvent[] = [
  {
    id: 'evt-1',
    title: 'Code-A-Thon Sprint',
    category: 'Technical',
    tagline: '6-Hour Coding Sprint',
    description: 'An intense sprint where teams solve real-world algorithmic problems.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 3,
    price: 0,
    date: 'Oct 24, 2024',
    time: '09:30 AM',
    startTime: '09:30 AM',
    endTime: '03:30 PM',
    venue: 'Main Lab 1',
    totalSlots: 60,
    slotsLeft: 18,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    prizePool: '₹25,000',
    firstPrize: '₹15,000',
    secondPrize: '₹10,000',
    rules: ['Teams of 2-3 participants.', 'Bring your own laptops.'],
    coordinators: mockCoordinators,
    status: 'OPEN',
  },
];

export const mockQuickResources: QuickResource[] = [
  {
    id: 'res-1',
    title: 'Campus Map & Venues',
    subtitle: 'Navigate to your events',
    icon: 'map',
    type: 'map',
    actionIcon: 'chevron_right',
  },
  {
    id: 'res-2',
    title: 'Technical Guidelines',
    subtitle: 'Rules and presentation formats',
    icon: 'picture_as_pdf',
    type: 'pdf',
    actionIcon: 'download',
  },
];
