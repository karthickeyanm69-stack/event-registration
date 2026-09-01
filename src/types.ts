export type PortalRole = 'participant' | 'employee' | 'admin' | 'superadmin' | 'console';

export type EventCategory = 'Technical' | 'Non-Technical';

export interface Participant {
  id: string;
  rollNumber: string; // Normalized (uppercase, trimmed)
  dateOfBirth: string; // YYYY-MM-DD
  name: string;
  collegeName: string;
  department: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  accessSecret?: string;
  createdAt: string;
}

export interface Coordinator {
  id: string;
  name: string;
  role: 'Faculty Coordinator' | 'Student Coordinator' | 'Lead Organizer' | 'HOD' | 'Convenor';
  phone: string;
  email: string;
  photoUrl: string;
  department?: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  category: EventCategory;
  tagline: string;
  description: string;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  price: number; // 0 for free or fee
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  venue: string;
  totalSlots: number;
  slotsLeft: number;
  imageUrl: string;
  prizePool: string;
  firstPrize?: string;
  secondPrize?: string;
  rules: string[];
  coordinators: Coordinator[];
  status: 'OPEN' | 'CLOSED' | 'LIVE' | 'COMPLETED';
}

export type RegistrationStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';

export interface TeamMember {
  participantId?: string;
  name: string;
  rollNumber: string;
  department: string;
  collegeName: string;
  dateOfBirth?: string;
  isLeader: boolean;
}

export interface Registration {
  id: string;
  registrationNumber: string; // e.g. REG-2024-88421
  eventId: string;
  eventTitle: string;
  category: EventCategory;
  leaderId: string;
  leaderName: string;
  leaderRollNumber: string;
  leaderEmail: string;
  leaderPhone?: string;
  collegeName: string;
  department: string;
  isTeamEvent: boolean;
  teamName?: string;
  members: TeamMember[];
  status: RegistrationStatus;
  qrToken: string; // Secure opaque cryptographic reference
  registeredAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'NOT_MARKED';

export interface AttendanceRecord {
  id: string;
  registrationId: string;
  eventId: string;
  participantRollNumber: string;
  participantName: string;
  teamName?: string;
  status: AttendanceStatus;
  scannedAt?: string;
  scannedByStaffId?: string;
  scannedByStaffName?: string;
  notes?: string;
}

export interface ScoreCriteria {
  name: string;
  maxMarks: number;
  awardedMarks: number;
}

export interface ScoreRecord {
  id: string;
  registrationId: string;
  eventId: string;
  teamOrParticipantName: string;
  rollNumberOrTeamId: string;
  criteria: ScoreCriteria[];
  totalScore: number;
  round: string; // e.g. "Round 1 - Prelims", "Finals"
  rank?: number;
  feedback?: string;
  submittedByStaffId: string;
  submittedByStaffName: string;
  submittedAt: string;
  updatedAt?: string;
  isLocked: boolean;
}

export type StaffRole = 'EMPLOYEE' | 'ADMIN' | 'SUPER_ADMIN';

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  department?: string;
  assignedEventIds: string[]; // empty means all if SUPER_ADMIN
  createdByAdminId?: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface EventChangeAudit {
  id: string;
  participantId: string;
  participantName: string;
  rollNumber: string;
  oldEventId: string;
  oldEventTitle: string;
  oldRegistrationId: string;
  oldQrToken: string;
  newEventId: string;
  newEventTitle: string;
  newRegistrationId: string;
  newQrToken: string;
  reason: string;
  changedAt: string;
  status: 'SUCCESS' | 'REJECTED';
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  details: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface SystemSettings {
  isRegistrationOpen: boolean;
  allowEventChange: boolean;
  collegeName: string;
  collegeShortName: string;
  symposiumName: string;
  symposiumYear: string;
  themeBannerText: string;
  supportEmail: string;
  supportPhone: string;
  venueAddress: string;
  emergencyNotice?: string;
}

export type ParticipantEdgeState =
  | 'DEFAULT'
  | 'LOADING'
  | 'EMPTY_EVENTS'
  | 'SUCCESS'
  | 'ERROR_LOOKUP'
  | 'INVALID_QR'
  | 'REGISTRATION_CLOSED'
  | 'ALREADY_REGISTERED'
  | 'EVENT_FULL'
  | 'REGISTRATION_CANCELLED'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR';

export type EmployeeEdgeState =
  | 'DEFAULT'
  | 'INVALID_QR'
  | 'ALREADY_ATTENDED'
  | 'WRONG_EVENT'
  | 'PARTICIPANT_NOT_FOUND'
  | 'ATTENDANCE_SUCCESS'
  | 'SCORE_SUBMITTED'
  | 'LOADING'
  | 'EMPTY_ASSIGNMENTS';

// Legacy Aliases for backwards compatibility
export type NavigationTab = 'home' | 'events' | 'my-qr' | 'profile';

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

