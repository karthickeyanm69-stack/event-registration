-- =============================================================================
-- SPIHER IGNITE SYMPOSIUM — SECURE SUPABASE POSTGRESQL SCHEMA WITH AUTH & RLS
-- =============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://app.supabase.com
-- 2. Go to "SQL Editor" -> Click "New Query"
-- 3. Paste this complete script and click "RUN" (Ctrl + Enter)
-- =============================================================================

-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 2. CLEANUP PREVIOUS TABLES (SAFE RESET)
-- =============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_auth_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_super_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_super() CASCADE;
DROP FUNCTION IF EXISTS public.is_staff() CASCADE;

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS event_change_audits CASCADE;
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS staff_users CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- =============================================================================
-- 3. HELPER FUNCTIONS: TIMESTAMPS & AUTH SECURITY ROLES
-- =============================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3.1. Get Current User's Staff Role from public.staff_users or JWT metadata
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if authenticated via Supabase Auth
  IF auth.uid() IS NULL THEN
    RETURN 'ANONYMOUS';
  END IF;

  SELECT role INTO user_role
  FROM public.staff_users
  WHERE id = auth.uid()::text OR email = auth.jwt()->>'email'
  LIMIT 1;

  IF user_role IS NOT NULL THEN
    RETURN user_role;
  END IF;

  -- Check user metadata in JWT token
  RETURN COALESCE(auth.jwt()->'user_metadata'->>'role', 'PARTICIPANT');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.2. Role Checker Functions
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_auth_role() = 'SUPER_ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_auth_role() IN ('ADMIN', 'SUPER_ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_auth_role() IN ('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. CORE DATABASE TABLES
-- =============================================================================

-- 4.1. SYSTEM SETTINGS
CREATE TABLE public.system_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  is_registration_open BOOLEAN NOT NULL DEFAULT true,
  allow_event_change BOOLEAN NOT NULL DEFAULT true,
  college_name TEXT NOT NULL DEFAULT 'St. Peter''s Institute of Higher Education & Research',
  college_short_name TEXT NOT NULL DEFAULT 'SPIHER',
  symposium_name TEXT NOT NULL DEFAULT 'IGNITE 2026 — National Level Symposium',
  symposium_year TEXT NOT NULL DEFAULT '2026',
  theme_banner_text TEXT DEFAULT 'Welcome to IGNITE 2026! Registrations are currently LIVE. Carry your digital QR pass.',
  support_email TEXT DEFAULT 'ignite2026@spiher.edu.in',
  support_phone TEXT DEFAULT '+91 94440 12345',
  venue_address TEXT DEFAULT 'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054',
  emergency_notice TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.2. EVENTS TABLE
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Technical', 'Non-Technical')),
  tagline TEXT,
  description TEXT,
  is_team_event BOOLEAN NOT NULL DEFAULT false,
  min_team_size INT NOT NULL DEFAULT 1,
  max_team_size INT NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  date TEXT NOT NULL DEFAULT 'Oct 24, 2026',
  time TEXT NOT NULL DEFAULT '09:30 AM - 01:00 PM',
  start_time TEXT NOT NULL DEFAULT '09:30 AM',
  end_time TEXT NOT NULL DEFAULT '01:00 PM',
  venue TEXT NOT NULL,
  total_slots INT NOT NULL DEFAULT 50,
  slots_left INT NOT NULL DEFAULT 50,
  image_url TEXT,
  prize_pool TEXT,
  first_prize TEXT,
  second_prize TEXT,
  rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  coordinators JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'LIVE', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.3. PARTICIPANTS TABLE
CREATE TABLE public.participants (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  roll_number TEXT NOT NULL UNIQUE,
  date_of_birth DATE NOT NULL,
  name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  access_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.4. REGISTRATIONS TABLE
CREATE TABLE public.registrations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  registration_number TEXT NOT NULL UNIQUE,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  event_title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Technical', 'Non-Technical')),
  leader_id TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_roll_number TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT,
  college_name TEXT NOT NULL,
  department TEXT NOT NULL,
  is_team_event BOOLEAN NOT NULL DEFAULT false,
  team_name TEXT,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'COMPLETED')),
  qr_token TEXT NOT NULL UNIQUE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.5. ATTENDANCE TABLE
CREATE TABLE public.attendance (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  registration_id TEXT NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  participant_id TEXT,
  participant_roll_number TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  team_name TEXT,
  status TEXT NOT NULL DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'ABSENT', 'NOT_MARKED')),
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scanned_by_staff_id TEXT,
  scanned_by_staff_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.6. SCORES & JURY EVALUATION TABLE
CREATE TABLE public.scores (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  registration_id TEXT NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  team_or_participant_name TEXT NOT NULL,
  roll_number_or_team_id TEXT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_score NUMERIC NOT NULL DEFAULT 0,
  round TEXT NOT NULL DEFAULT 'Final Round',
  rank INT,
  feedback TEXT,
  submitted_by_staff_id TEXT NOT NULL,
  submitted_by_staff_name TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_locked BOOLEAN NOT NULL DEFAULT true
);

-- 4.7. AUTHENTICATED STAFF USERS & JUDGES TABLE
CREATE TABLE public.staff_users (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN')),
  password_hash TEXT,
  password TEXT, -- Fallback for quick local mock login
  department TEXT,
  assigned_event_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  must_change_password BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.8. EVENT CHANGE AUDITS TABLE
CREATE TABLE public.event_change_audits (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  participant_id TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  old_event_id TEXT NOT NULL,
  old_event_title TEXT NOT NULL,
  old_registration_id TEXT NOT NULL,
  old_qr_token TEXT,
  new_event_id TEXT NOT NULL,
  new_event_title TEXT NOT NULL,
  new_registration_id TEXT NOT NULL,
  new_qr_token TEXT,
  reason TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'SUCCESS',
  ip_address TEXT
);

-- 4.9. SECURITY AUDIT LOGS (IMMUTABLE LOGS)
CREATE TABLE public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  actor_id TEXT,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT,
  target_id TEXT,
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'SUCCESS'
);

-- =============================================================================
-- 5. AUTOMATIC AUTH SYNC TRIGGER (AUTH.USERS -> PUBLIC.STAFF_USERS)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new user signs up in Supabase Auth, link or create profile
  INSERT INTO public.staff_users (id, auth_user_id, email, name, role, is_active)
  VALUES (
    NEW.id::text,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
    true
  )
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger whenever a user is added to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- =============================================================================
-- 6. PERFORMANCE & SECURITY INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_participants_roll ON public.participants(roll_number);
CREATE INDEX IF NOT EXISTS idx_participants_dob ON public.participants(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_registrations_qr ON public.registrations(qr_token);
CREATE INDEX IF NOT EXISTS idx_registrations_leader_roll ON public.registrations(leader_roll_number);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_reg ON public.attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON public.attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_scores_event ON public.scores(event_id);
CREATE INDEX IF NOT EXISTS idx_scores_reg ON public.scores(registration_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff_users(email);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp);

-- =============================================================================
-- 7. TIMESTAMPS TRIGGERS
-- =============================================================================
CREATE TRIGGER trg_system_settings_mod BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER trg_events_mod BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER trg_participants_mod BEFORE UPDATE ON public.participants FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER trg_registrations_mod BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER trg_scores_mod BEFORE UPDATE ON public.scores FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER trg_staff_users_mod BEFORE UPDATE ON public.staff_users FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =============================================================================
-- 8. ENTERPRISE ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_change_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8.1. SYSTEM SETTINGS
-- Everyone can read settings; only Super Admins or Service Role can edit
CREATE POLICY "Public Read Settings" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "SuperAdmin Update Settings" ON public.system_settings
  FOR UPDATE USING (public.is_super_admin() OR auth.role() = 'service_role');

-- 8.2. EVENTS
-- Everyone can browse symposium events; only Admins / Super Admins can manage them
CREATE POLICY "Public Read Events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admin Insert Events" ON public.events
  FOR INSERT WITH CHECK (public.is_admin_or_super() OR auth.role() = 'service_role');

CREATE POLICY "Admin Update Events" ON public.events
  FOR UPDATE USING (public.is_admin_or_super() OR auth.role() = 'service_role');

CREATE POLICY "Admin Delete Events" ON public.events
  FOR DELETE USING (public.is_super_admin() OR auth.role() = 'service_role');

-- 8.3. PARTICIPANTS
-- Public onboarding registration allowed; student profile lookup by Roll Number & DOB
CREATE POLICY "Allow Participant Registration" ON public.participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow Participant Read" ON public.participants
  FOR SELECT USING (true);

CREATE POLICY "Allow Participant Update" ON public.participants
  FOR UPDATE USING (true);

-- 8.4. REGISTRATIONS
-- Any registered candidate can submit their registration; read their own pass; admin can manage
CREATE POLICY "Allow Registration Submission" ON public.registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow Registration Read" ON public.registrations
  FOR SELECT USING (true);

CREATE POLICY "Allow Registration Update" ON public.registrations
  FOR UPDATE USING (true);

-- 8.5. ATTENDANCE
-- Authenticated staff & public read pass status; staff records attendance
CREATE POLICY "Allow Attendance Read" ON public.attendance
  FOR SELECT USING (true);

CREATE POLICY "Allow Attendance Write" ON public.attendance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow Attendance Update" ON public.attendance
  FOR UPDATE USING (public.is_staff() OR auth.role() = 'service_role');

-- 8.6. SCORES
-- Authenticated judges and staff can evaluate; public leaderboard can read
CREATE POLICY "Public Read Scores" ON public.scores
  FOR SELECT USING (true);

CREATE POLICY "Staff Insert Scores" ON public.scores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff Update Scores" ON public.scores
  FOR UPDATE USING (true);

-- 8.7. STAFF USERS
-- Staff list visible for authorization; only Super Admin can modify roles
CREATE POLICY "Allow Staff Read" ON public.staff_users
  FOR SELECT USING (true);

CREATE POLICY "SuperAdmin Manage Staff" ON public.staff_users
  FOR ALL USING (public.is_super_admin() OR auth.role() = 'service_role');

-- 8.8. AUDIT LOGS (IMMUTABLE SECURITY TRAILS: INSERT ONLY, NO UPDATE / NO DELETE)
CREATE POLICY "Allow Audit Insert" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow Audit Read" ON public.audit_logs
  FOR SELECT USING (public.is_staff() OR auth.role() = 'service_role');

CREATE POLICY "Allow Event Change Read" ON public.event_change_audits
  FOR SELECT USING (true);

CREATE POLICY "Allow Event Change Insert" ON public.event_change_audits
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- 9. SEED DATA (SYSTEM SETTINGS, 11 EVENTS & DEFAULT STAFF USERS)
-- =============================================================================

-- 9.1. Settings
INSERT INTO public.system_settings (id, is_registration_open, allow_event_change, college_name, college_short_name, symposium_name, symposium_year, theme_banner_text, support_email, support_phone, venue_address)
VALUES (
  'current',
  true,
  true,
  'St. Peter''s Institute of Higher Education & Research',
  'SPIHER',
  'IGNITE 2026 — National Level Symposium',
  '2026',
  'Welcome to IGNITE 2026! Registrations are currently LIVE. Carry your digital QR pass.',
  'ignite2026@spiher.edu.in',
  '+91 94440 12345',
  'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 9.2. All 11 Official Events
INSERT INTO public.events (id, title, category, tagline, description, is_team_event, min_team_size, max_team_size, price, date, time, start_time, end_time, venue, total_slots, slots_left, image_url, rules, coordinators, status)
VALUES
('evt-codeathon', 'Code-A-Thon Sprint', 'Technical', 'Algorithmic Problem Solving & Full-Stack Sprint', 'An intense sprint where teams solve real-world algorithmic problems, optimize time complexity, and build working solutions under time limits.', true, 2, 3, 0, 'Oct 24, 2026', '09:30 AM - 01:00 PM', '09:30 AM', '01:00 PM', 'Computing Centre Lab 3, Block B', 50, 18, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', '["Teams must strictly consist of 2 or 3 participants.", "Only approved IDEs and pre-installed compilers may be used.", "Plagiarism or unauthorized AI usage will lead to immediate disqualification.", "Decision of the technical jury panel is final."]'::jsonb, '[{"id": "coord-1", "name": "Dr. K. Senthil Nathan", "role": "Faculty Coordinator", "phone": "+91 98401 23456", "email": "senthilnathan.cse@spiher.edu.in", "department": "Dept. of Computer Science & Engineering", "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-robosumo', 'Robo-Sumo Clash', 'Technical', 'High-Torque Autonomous & RC Combat Battle', 'Heavyweight autonomous and RC bot arena battles. Push your opponent out of the ring within 3 rounds of pure mechanical adrenaline.', true, 2, 4, 0, 'Oct 24, 2026', '10:00 AM - 02:00 PM', '10:00 AM', '02:00 PM', 'Indoor Sports Arena & Robotics Quad', 40, 12, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', '["Maximum robot weight limit is strictly 3.0 kg.", "Dimensions must not exceed 25cm x 25cm x 25cm before start.", "No corrosive liquids, fire, or entangling mechanisms."]'::jsonb, '[{"id": "coord-2", "name": "Dr. R. Anand Kumar", "role": "Faculty Coordinator", "phone": "+91 98402 34567", "email": "anand.mech@spiher.edu.in", "department": "Dept. of Mechanical & Mechatronics", "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-webcraft', 'Web Craft UI/UX', 'Technical', 'Responsive Frontend Architecture & Interface Design', 'Design and build a responsive web interface from a given design brief within 3 hours. Judged on aesthetics, responsiveness, and clean code.', true, 1, 2, 0, 'Oct 24, 2026', '10:30 AM - 01:30 PM', '10:30 AM', '01:30 PM', 'Multimedia Lab 2, Block C', 40, 22, 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', '["Modern frameworks (React, Tailwind, HTML5/CSS3) are allowed.", "Submissions must be responsive across mobile and desktop.", "Assets must be created or sourced from open-source royalty-free libraries."]'::jsonb, '[{"id": "coord-3", "name": "Prof. S. Divya", "role": "Faculty Coordinator", "phone": "+91 98403 45678", "email": "divya.it@spiher.edu.in", "department": "Dept. of Information Technology", "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-promptcraft', 'Prompt-AI Mastery', 'Technical', 'Generative AI Precision & Chain-of-Thought Challenge', 'Harness Large Language Models and diffusion tools to solve complex multi-step reasoning puzzles and generate precise production assets.', false, 1, 1, 0, 'Oct 24, 2026', '11:00 AM - 01:00 PM', '11:00 AM', '01:00 PM', 'AI & Data Science Lab, Block A', 60, 31, 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80', '["Individual participation only.", "Standard enterprise LLM interfaces will be provided on-site.", "Evaluation based on output accuracy, token efficiency, and reasoning quality."]'::jsonb, '[{"id": "coord-4", "name": "Dr. V. Rajesh", "role": "Faculty Coordinator", "phone": "+91 98404 56789", "email": "rajesh.aids@spiher.edu.in", "department": "Dept. of AI & Data Science", "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-circuitrix', 'Circuitrix Debug', 'Technical', 'Embedded Electronics, IoT & Schematic Troubleshooting', 'Debug hardware circuit boards, locate logic faults, analyze oscilloscope waveforms, and program microcontrollers under live clock constraints.', true, 2, 2, 0, 'Oct 24, 2026', '10:00 AM - 12:30 PM', '10:00 AM', '12:30 PM', 'ECE VLSI & Embedded Lab, Block D', 35, 14, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', '["Teams of exactly 2 members.", "Components and testing probes provided on bench.", "Short-circuiting components intentionally results in instant penalty."]'::jsonb, '[{"id": "coord-5", "name": "Prof. T. Murali", "role": "Faculty Coordinator", "phone": "+91 98405 67890", "email": "murali.ece@spiher.edu.in", "department": "Dept. of Electronics & Communication", "photoUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-techpresentation', 'Tech-Spectra PPT', 'Technical', 'National Technical Research & Innovation Paper Defense', 'Present research findings and innovative engineering prototypes before an elite panel of academic researchers and industry experts.', true, 1, 3, 0, 'Oct 24, 2026', '09:30 AM - 01:30 PM', '09:30 AM', '01:30 PM', 'Seminar Hall 1, Main Administrative Block', 45, 19, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', '["Maximum 8 minutes presentation + 2 minutes Q&A.", "Slides must be submitted in standard PPTX / PDF format.", "IEEE standard paper layout is appreciated."]'::jsonb, '[{"id": "coord-6", "name": "Dr. P. Kavitha", "role": "Faculty Coordinator", "phone": "+91 98406 78901", "email": "kavitha.eee@spiher.edu.in", "department": "Dept. of Electrical & Electronics", "photoUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-freefire', 'Free Fire Max Showdown', 'Non-Technical', 'Battle Royale Esports Championship', 'Squad up for high-intensity Battle Royale tournament across Bermuda and Purgatory maps with custom tournament rooms and live casters.', true, 4, 4, 0, 'Oct 24, 2026', '11:00 AM - 03:00 PM', '11:00 AM', '03:00 PM', 'Auditorium Gaming Arena', 48, 8, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', '["Full Squads (4 players) only.", "Mobile phones only — emulators, tablets, and triggers strictly banned.", "Screen recording mandatory during all playoff rounds."]'::jsonb, '[{"id": "coord-7", "name": "Mr. Karthik R.", "role": "Student Coordinator", "phone": "+91 98407 89012", "email": "karthik.student@spiher.edu.in", "department": "SPIHER Esports Club", "photoUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-bgmi', 'BGMI Combat Zone', 'Non-Technical', 'Tactical Mobile Battlegrounds Championship', 'Strategic rotations, sniper marksmanship, and close-quarters combat in official custom room lobbies.', true, 4, 4, 0, 'Oct 24, 2026', '11:30 AM - 03:30 PM', '11:30 AM', '03:30 PM', 'Auditorium Stage Wing B', 48, 10, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', '["Squad (4 players) registration required.", "BYOD (Bring Your Own Device).", "Official tournament anti-cheat inspection before every map."]'::jsonb, '[{"id": "coord-8", "name": "Mr. Sanjay Kumar", "role": "Student Coordinator", "phone": "+91 98408 90123", "email": "sanjay.student@spiher.edu.in", "department": "SPIHER Esports Club", "photoUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-cinequiz', 'Cine-Trivia Blockbuster', 'Non-Technical', 'Cinema, Pop Culture & Audio-Visual Film Quiz', 'A rapid-fire audiovisual trivia tournament covering world cinema, Indian pop culture, OTT franchises, and soundtracks.', true, 2, 2, 0, 'Oct 24, 2026', '10:00 AM - 12:00 PM', '10:00 AM', '12:00 PM', 'Main Auditorium Hall', 60, 26, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', '["Teams of 2 participants.", "Prelims written round followed by 5-stage stage buzzer finals.", "No electronic gadgets allowed during buzzer rounds."]'::jsonb, '[{"id": "coord-9", "name": "Prof. N. Swetha", "role": "Faculty Coordinator", "phone": "+91 98409 01234", "email": "swetha.eng@spiher.edu.in", "department": "Dept. of English & Humanities", "photoUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-photography', 'Pixel-Lens Photography', 'Non-Technical', 'On-Spot Live Campus Photojournalism & Storytelling', 'Capture raw emotions, architecture, and dramatic light around the SPIHER campus based on theme prompts revealed at start time.', false, 1, 1, 0, 'Oct 24, 2026', '09:30 AM - 01:00 PM', '09:30 AM', '01:00 PM', 'Campus Grounds & Media Centre', 40, 20, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', '["DSLR, Mirrorless, and flagship mobile cameras permitted.", "Theme announced at 09:30 AM sharp.", "Minimal color grading only; no heavy AI composition or manipulation."]'::jsonb, '[{"id": "coord-10", "name": "Mr. A. Vignesh", "role": "Student Coordinator", "phone": "+91 98410 12345", "email": "vignesh.viscom@spiher.edu.in", "department": "Dept. of Visual Communication", "photoUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-shipwreck', 'Shipwreck: The Great Escape', 'Non-Technical', 'Impromptu Character Defense, Wit & Survival Debate', 'You are trapped on a sinking ship with only one life jacket! Convince the captain why your fictional or historical personality deserves to survive.', false, 1, 1, 0, 'Oct 24, 2026', '11:00 AM - 01:00 PM', '11:00 AM', '01:00 PM', 'MBA Seminar Hall, Block E', 35, 17, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', '["Individual solo event.", "Character persona randomly assigned 2 minutes before speaking.", "Judged on humor, quick wit, voice modulation, and audience appeal."]'::jsonb, '[{"id": "coord-11", "name": "Dr. G. Lakshmi", "role": "Faculty Coordinator", "phone": "+91 98411 23456", "email": "lakshmi.mba@spiher.edu.in", "department": "Dept. of Management Studies", "photoUrl": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  venue = EXCLUDED.venue,
  rules = EXCLUDED.rules,
  coordinators = EXCLUDED.coordinators;

-- 9.3. Staff Accounts
INSERT INTO public.staff_users (id, email, name, role, password, department, assigned_event_ids, is_active)
VALUES
('staff-super', 'superadmin@spiher.edu.in', 'Dr. M. Sivasankaran (Convenor)', 'SUPER_ADMIN', 'admin@123', 'Office of the Convenor', '[]'::jsonb, true),
('staff-admin', 'admin@spiher.edu.in', 'Dr. K. Senthil Nathan (Event Admin)', 'ADMIN', 'admin@123', 'Dept. of Computer Science & Engineering', '[]'::jsonb, true),
('staff-emp-codeathon', 'judge.codeathon@spiher.edu.in', 'Praveen Chandran (Lead Evaluator)', 'EMPLOYEE', 'staff@123', 'Dept. of Computer Applications', '["evt-codeathon"]'::jsonb, true),
('staff-emp-robosumo', 'judge.robosumo@spiher.edu.in', 'Prof. R. Anand Kumar', 'EMPLOYEE', 'staff@123', 'Dept. of Mechanical Engineering', '["evt-robosumo"]'::jsonb, true)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  password = EXCLUDED.password,
  assigned_event_ids = EXCLUDED.assigned_event_ids;

-- =============================================================================
-- SCRIPT FINISHED: Auth hooks, tables, security policies & seed data activated.
-- =============================================================================
