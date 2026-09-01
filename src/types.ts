export type NavigationTab = 'home' | 'events' | 'my-qr' | 'profile';

export type EventCategory = 'All' | 'Technical' | 'Non-Technical';

export interface CollegeEvent {
  id: string;
  title: string;
  category: 'Technical' | 'Non-Technical';
  price: number;
  date: string;
  time: string;
  venue: string;
  slotsLeft: number;
  totalSlots: number;
  imageUrl: string;
  description?: string;
  coordinators?: string;
  prizePool?: string;
  rules?: string[];
  registered?: boolean;
}

export interface ParticipantInfo {
  name: string;
  id: string;
  rollNumber: string;
  department: string;
  team: string;
  college: string;
  avatarUrl: string;
  email: string;
  phone: string;
  activeEvent: {
    title: string;
    date: string;
    month: string;
    day: string;
    time: string;
    venue: string;
    status: string;
    qrData: string;
  };
}

export interface QuickResource {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'map' | 'pdf' | 'token';
  actionIcon: 'chevron_right' | 'download';
}
