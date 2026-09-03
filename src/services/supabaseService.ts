import { supabase } from '../lib/supabaseClient';
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

/**
 * Data mapping helpers between Supabase Snake_Case and Frontend CamelCase
 */
export const mapEventFromSupabase = (row: any): CollegeEvent => ({
  id: row.id,
  title: row.title,
  category: row.category,
  tagline: row.tagline || '',
  description: row.description || '',
  isTeamEvent: row.is_team_event ?? false,
  minTeamSize: row.min_team_size || 1,
  maxTeamSize: row.max_team_size || 1,
  price: row.price || 0,
  date: row.date || 'Oct 24, 2026',
  time: row.time || '09:30 AM',
  startTime: row.start_time || '09:30 AM',
  endTime: row.end_time || '01:00 PM',
  venue: row.venue || 'Main Auditorium',
  totalSlots: row.total_slots || row.slots_total || 60,
  slotsLeft: row.slots_left || 50,
  imageUrl: row.image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  rules: row.rules || [],
  coordinators: row.coordinators || [],
  status: row.status || 'OPEN',
});

export const mapParticipantFromSupabase = (row: any): Participant => ({
  id: row.id,
  rollNumber: row.roll_number,
  dateOfBirth: row.date_of_birth,
  name: row.name,
  collegeName: row.college_name,
  department: row.department,
  email: row.email,
  phone: row.phone,
  avatarUrl: row.avatar_url,
  accessSecret: row.access_secret,
  createdAt: row.created_at,
});

export const mapRegistrationFromSupabase = (row: any): Registration => ({
  id: row.id,
  registrationNumber: row.registration_number,
  eventId: row.event_id,
  eventTitle: row.event_title,
  category: row.category,
  leaderId: row.leader_id,
  leaderName: row.leader_name,
  leaderRollNumber: row.leader_roll_number,
  leaderEmail: row.leader_email,
  leaderPhone: row.leader_phone,
  collegeName: row.college_name,
  department: row.department,
  isTeamEvent: row.is_team_event ?? false,
  teamName: row.team_name,
  members: row.members || [],
  status: row.status || 'ACTIVE',
  qrToken: row.qr_token,
  registeredAt: row.registered_at,
});

export const mapAttendanceFromSupabase = (row: any): AttendanceRecord => ({
  id: row.id,
  registrationId: row.registration_id,
  eventId: row.event_id,
  participantId: row.participant_id,
  participantName: row.participant_name,
  participantRollNumber: row.participant_roll_number,
  teamName: row.team_name,
  status: row.status,
  scannedAt: row.scanned_at,
  scannedByStaffId: row.scanned_by_staff_id,
  scannedByStaffName: row.scanned_by_staff_name,
  notes: row.notes,
});

export const mapScoreFromSupabase = (row: any): ScoreRecord => ({
  id: row.id,
  registrationId: row.registration_id,
  eventId: row.event_id,
  teamOrParticipantName: row.team_or_participant_name || row.participant_name || 'Participant',
  rollNumberOrTeamId: row.roll_number_or_team_id || row.participant_roll_number || '',
  criteriaScores: row.criteria_scores || {},
  totalScore: Number(row.total_score) || 0,
  round: row.round || 'Evaluation',
  feedback: row.feedback,
  submittedByStaffId: row.submitted_by_staff_id || row.evaluated_by_staff_id || 'staff',
  submittedByStaffName: row.submitted_by_staff_name || row.evaluated_by_staff_name || 'Evaluator',
  submittedAt: row.submitted_at || row.evaluated_at || new Date().toISOString(),
});

export const mapStaffUserFromSupabase = (row: any): StaffUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
  role: row.role,
  password: row.password_hash || 'admin123',
  department: row.department,
  assignedEventIds: row.assigned_event_ids || [],
  createdByAdminId: row.created_by_admin_id,
  isActive: row.is_active ?? true,
  mustChangePassword: row.must_change_password ?? false,
  avatarUrl: row.avatar_url,
  lastLoginAt: row.last_login_at,
});

export const mapSettingsFromSupabase = (row: any): SystemSettings => ({
  isRegistrationOpen: row.is_registration_open ?? true,
  allowEventChange: row.allow_event_change ?? true,
  collegeName: row.college_name || "St. Peter's Institute of Higher Education & Research",
  collegeShortName: row.college_short_name || 'SPIHER',
  symposiumName: row.symposium_name || 'IGNITE 2026 — National Level Symposium',
  symposiumYear: row.symposium_year || '2026',
  themeBannerText: row.theme_banner_text || 'Welcome to IGNITE 2026! Carry your digital QR pass.',
  supportEmail: row.support_email || 'ignite2026@spiher.edu.in',
  supportPhone: row.support_phone || '+91 94440 12345',
  venueAddress: row.venue_address || 'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054',
  emergencyNotice: row.emergency_notice,
});

export const mapEventChangeFromSupabase = (row: any): EventChangeAudit => ({
  id: row.id,
  participantId: row.participant_id,
  participantName: row.participant_name,
  rollNumber: row.roll_number,
  oldRegistrationId: row.old_registration_id,
  oldEventId: row.old_event_id,
  oldEventTitle: row.old_event_title,
  newRegistrationId: row.new_registration_id,
  newEventId: row.new_event_id,
  newEventTitle: row.new_event_title,
  changedAt: row.changed_at,
  reason: row.reason,
  ipAddress: row.ip_address,
});

export const mapAuditLogFromSupabase = (row: any): AuditLog => ({
  id: row.id,
  actorId: row.actor_id,
  actorName: row.actor_name,
  actorRole: row.actor_role,
  action: row.action,
  targetEntity: row.target_entity,
  targetId: row.target_id,
  details: row.details,
  timestamp: row.timestamp,
  status: row.status,
});

/**
 * Live Supabase Database Service
 */
export class SupabaseService {
  /**
   * Fetch All Live Events from Supabase
   */
  static async getEvents(): Promise<CollegeEvent[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('events').select('*').order('title');
      if (error) {
        console.error('Supabase fetch events error:', error);
        return [];
      }
      return (data || []).map(mapEventFromSupabase);
    } catch (e) {
      console.error('Supabase getEvents exception:', e);
      return [];
    }
  }

  /**
   * Fetch All Live Participants from Supabase
   */
  static async getParticipants(): Promise<Participant[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('participants').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch participants error:', error);
        return [];
      }
      return (data || []).map(mapParticipantFromSupabase);
    } catch (e) {
      console.error('Supabase getParticipants exception:', e);
      return [];
    }
  }

  /**
   * Fetch All Live Registrations from Supabase
   */
  static async getRegistrations(): Promise<Registration[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('registrations').select('*').order('registered_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch registrations error:', error);
        return [];
      }
      return (data || []).map(mapRegistrationFromSupabase);
    } catch (e) {
      console.error('Supabase getRegistrations exception:', e);
      return [];
    }
  }

  /**
   * Fetch All Live Attendance from Supabase
   */
  static async getAttendance(): Promise<AttendanceRecord[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('attendance').select('*').order('scanned_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch attendance error:', error);
        return [];
      }
      return (data || []).map(mapAttendanceFromSupabase);
    } catch (e) {
      console.error('Supabase getAttendance exception:', e);
      return [];
    }
  }

  /**
   * Fetch All Live Scores from Supabase
   */
  static async getScores(): Promise<ScoreRecord[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('scores').select('*');
      if (error) {
        console.error('Supabase fetch scores error:', error);
        return [];
      }
      return (data || []).map(mapScoreFromSupabase);
    } catch (e) {
      console.error('Supabase getScores exception:', e);
      return [];
    }
  }

  /**
   * Fetch All Live Staff Users from Supabase
   */
  static async getStaffUsers(): Promise<StaffUser[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('staff_users').select('*');
      if (error) {
        console.error('Supabase fetch staff error:', error);
        return [];
      }
      return (data || []).map(mapStaffUserFromSupabase);
    } catch (e) {
      console.error('Supabase getStaffUsers exception:', e);
      return [];
    }
  }

  /**
   * Fetch System Settings from Supabase
   */
  static async getSettings(): Promise<SystemSettings | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('system_settings').select('*').limit(1).single();
      if (error || !data) return null;
      return mapSettingsFromSupabase(data);
    } catch (e) {
      return null;
    }
  }

  /**
   * Fetch Event Changes from Supabase
   */
  static async getEventChanges(): Promise<EventChangeAudit[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('event_change_audits').select('*').order('changed_at', { ascending: false });
      if (error) return [];
      return (data || []).map(mapEventChangeFromSupabase);
    } catch (e) {
      return [];
    }
  }

  /**
   * Fetch Audit Logs from Supabase
   */
  static async getAuditLogs(): Promise<AuditLog[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
      if (error) return [];
      return (data || []).map(mapAuditLogFromSupabase);
    } catch (e) {
      return [];
    }
  }

  /**
   * Insert New Registration & Participants directly to Supabase
   */
  static async createRegistration(params: {
    participantData: Partial<Participant>;
    registration: Registration;
  }): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Supabase client not configured.' };

    try {
      const { participantData, registration } = params;

      // 1. Insert/Upsert Leader Participant
      const leaderRow = {
        id: registration.leaderId,
        roll_number: registration.leaderRollNumber.toUpperCase().trim(),
        name: registration.leaderName,
        date_of_birth: participantData.dateOfBirth || '2003-01-01',
        college_name: registration.collegeName,
        department: registration.department,
        email: registration.leaderEmail,
        phone: registration.leaderPhone,
        created_at: new Date().toISOString(),
      };

      const { error: partErr } = await supabase.from('participants').upsert(leaderRow, { onConflict: 'roll_number' });
      if (partErr) console.warn('Supabase leader insert warning:', partErr);

      // 2. Insert any teammates
      if (registration.members && registration.members.length > 1) {
        for (const m of registration.members) {
          if (!m.isLeader) {
            const memberRow = {
              id: m.participantId || `part-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              roll_number: m.rollNumber.toUpperCase().trim(),
              name: m.name,
              date_of_birth: m.dateOfBirth || '2003-01-01',
              college_name: m.collegeName,
              department: m.department,
              created_at: new Date().toISOString(),
            };
            await supabase.from('participants').upsert(memberRow, { onConflict: 'roll_number' });
          }
        }
      }

      // 3. Insert Registration Pass
      const regRow = {
        id: registration.id,
        registration_number: registration.registrationNumber,
        event_id: registration.eventId,
        event_title: registration.eventTitle,
        category: registration.category,
        leader_id: registration.leaderId,
        leader_name: registration.leaderName,
        leader_roll_number: registration.leaderRollNumber,
        leader_email: registration.leaderEmail,
        leader_phone: registration.leaderPhone,
        college_name: registration.collegeName,
        department: registration.department,
        is_team_event: registration.isTeamEvent,
        team_name: registration.teamName,
        members: registration.members,
        status: 'ACTIVE',
        qr_token: registration.qrToken,
        registered_at: registration.registeredAt || new Date().toISOString(),
      };

      const { error: regErr } = await supabase.from('registrations').insert(regRow);
      if (regErr) {
        console.error('Supabase registration insert error:', regErr);
        return { success: false, error: regErr.message };
      }

      // 4. Log Action
      await supabase.from('audit_logs').insert({
        actor_name: registration.leaderName,
        actor_role: 'PARTICIPANT',
        action: 'REGISTRATION_CREATED',
        target_entity: 'REGISTRATION',
        target_id: registration.registrationNumber,
        details: `Registered for "${registration.eventTitle}" with Pass ID ${registration.registrationNumber}`,
      });

      return { success: true };
    } catch (e: any) {
      console.error('Supabase createRegistration exception:', e);
      return { success: false, error: e.message || 'Database registration failure.' };
    }
  }

  /**
   * Record Live Attendance in Supabase
   */
  static async recordAttendance(record: AttendanceRecord): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
      const row = {
        id: record.id,
        registration_id: record.registrationId,
        event_id: record.eventId,
        participant_id: record.participantId,
        participant_name: record.participantName,
        participant_roll_number: record.participantRollNumber,
        team_name: record.teamName,
        status: record.status,
        scanned_at: record.scannedAt,
        scanned_by_staff_id: record.scannedByStaffId,
        scanned_by_staff_name: record.scannedByStaffName,
        notes: record.notes,
      };

      const { error } = await supabase.from('attendance').upsert(row, { onConflict: 'id' });
      if (error) return { success: false, error: error.message };

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Record Live Score Evaluation in Supabase
   */
  static async saveScore(score: ScoreRecord): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
      const row = {
        id: score.id,
        registration_id: score.registrationId,
        event_id: score.eventId,
        team_or_participant_name: score.teamOrParticipantName,
        roll_number_or_team_id: score.rollNumberOrTeamId,
        criteria_scores: score.criteriaScores || {},
        total_score: score.totalScore,
        round: score.round,
        feedback: score.feedback,
        submitted_by_staff_id: score.submittedByStaffId,
        submitted_by_staff_name: score.submittedByStaffName,
        submitted_at: score.submittedAt,
      };

      const { error } = await supabase.from('scores').upsert(row, { onConflict: 'id' });
      if (error) return { success: false, error: error.message };

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Switch Event in Supabase
   */
  static async changeEvent(audit: EventChangeAudit, oldRegId: string, newReg: Registration): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
      // 1. Mark old registration CANCELLED
      await supabase
        .from('registrations')
        .update({ status: 'CANCELLED', qr_token: `REVOKED_${audit.oldRegistrationId}_${Date.now()}` })
        .eq('id', oldRegId);

      // 2. Insert new registration
      const newRegRow = {
        id: newReg.id,
        registration_number: newReg.registrationNumber,
        event_id: newReg.eventId,
        event_title: newReg.eventTitle,
        category: newReg.category,
        leader_id: newReg.leaderId,
        leader_name: newReg.leaderName,
        leader_roll_number: newReg.leaderRollNumber,
        leader_email: newReg.leaderEmail,
        leader_phone: newReg.leaderPhone,
        college_name: newReg.collegeName,
        department: newReg.department,
        is_team_event: newReg.isTeamEvent,
        team_name: newReg.teamName,
        members: newReg.members,
        status: 'ACTIVE',
        qr_token: newReg.qrToken,
        registered_at: newReg.registeredAt,
      };
      await supabase.from('registrations').insert(newRegRow);

      // 3. Log event change audit
      const auditRow = {
        id: audit.id,
        participant_id: audit.participantId,
        participant_name: audit.participantName,
        roll_number: audit.rollNumber,
        old_registration_id: audit.oldRegistrationId,
        old_event_id: audit.oldEventId,
        old_event_title: audit.oldEventTitle,
        new_registration_id: audit.newRegistrationId,
        new_event_id: audit.newEventId,
        new_event_title: audit.newEventTitle,
        reason: audit.reason,
        changed_at: audit.changedAt,
        ip_address: audit.ipAddress,
      };
      await supabase.from('event_change_audits').insert(auditRow);

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}
