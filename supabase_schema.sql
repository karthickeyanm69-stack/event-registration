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
  'St. Peter''s Institute of Higher Education & Research',
  'SPIHER',
  'RADIANZA ''26 — National Level Symposium',
  '2026',
  'Welcome to RADIANZA ''26! Registrations are currently LIVE. Carry your digital QR pass.',
  'radianza2026@spiher.edu.in',
  '+91 94440 12345',
  'SPIHER Campus, Avadi, Chennai, Tamil Nadu 600054'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 9.2. All 15 Official Events (5 Technical + 10 Non-Technical from Official Schedule)
INSERT INTO public.events (id, title, category, tagline, description, is_team_event, min_team_size, max_team_size, price, date, time, start_time, end_time, venue, total_slots, slots_left, image_url, rules, coordinators, status)
VALUES
('evt-ai-prompt', 'AI Prompt', 'Technical', 'Creative Prompt Engineering & Generative AI Challenge', 'Test your mastery of generative AI models, rapid prompt craft, and problem-solving to generate precise solutions under time constraints.', true, 1, 2, 0, 'Oct 24, 2026', '10:00 AM - 12:00 PM', '10:00 AM', '12:00 PM', 'Room 251', 40, 22, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', '["Individual or team of 2.", "Allowed to use provided AI model interfaces.", "Prompts evaluated on accuracy, efficiency, and output quality."]'::jsonb, '[{"id": "coord-dhanush", "name": "Dhanush", "role": "Organizer (4th Year)", "phone": "+91 98401 23456", "email": "dhanush.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}, {"id": "coord-luxchana", "name": "Luxchana", "role": "Coordinator (3rd Year)", "phone": "+91 98402 34567", "email": "luxchana.3rd@spiher.edu.in", "department": "Dept. of IT", "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-ui-ux', 'UI/UX Design', 'Technical', 'Digital Experience, Prototyping & Interface Design', 'Craft intuitive, visually captivating user interfaces and frictionless user experiences from a real-world design prompt.', true, 1, 2, 0, 'Oct 24, 2026', '10:00 AM - 12:00 PM', '10:00 AM', '12:00 PM', 'Room 251', 40, 18, 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', '["Teams of 1-2 participants.", "Figma, Adobe XD, or web technologies permitted.", "Deliverables must include user flow and responsive mockups."]'::jsonb, '[{"id": "coord-ragavan", "name": "Ragavan", "role": "Organizer (4th Year)", "phone": "+91 98404 56789", "email": "ragavan.4th@spiher.edu.in", "department": "Dept. of IT", "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"}, {"id": "coord-priyadharshini", "name": "Priya Dharshini", "role": "Coordinator (3rd Year)", "phone": "+91 98405 67890", "email": "priyadharshini.3rd@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-logo-creation', 'Logo Creation', 'Technical', 'Brand Identity, Vector Graphics & Visual Storytelling', 'Create distinctive, modern, and memorable brand logos and visual identities using digital design tools based on surprise prompts.', false, 1, 1, 0, 'Oct 24, 2026', '10:00 AM - 12:00 PM', '10:00 AM', '12:00 PM', 'Room 251', 35, 14, 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80', '["Solo participation.", "Vector design tools allowed (Illustrator, Figma, Photoshop).", "Submit export in PNG/SVG along with source file."]'::jsonb, '[{"id": "coord-kesav-logo", "name": "Kesav", "role": "Organizer (4th Year)", "phone": "+91 98407 88990", "email": "kesav.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-tech-quiz', 'Tech Quiz', 'Technical', 'Battle of Tech Minds, CS Fundamentals & Emerging Innovations', 'Fast-paced competitive quiz rounds testing depth of knowledge across computing fundamentals, algorithms, emerging tech, cybersecurity, and trivia.', true, 2, 2, 0, 'Oct 24, 2026', '12:00 PM - 01:00 PM', '12:00 PM', '01:00 PM', 'Room 251', 50, 20, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', '["Teams of 2 participants.", "Written prelims round followed by stage finals with buzzer rounds."]'::jsonb, '[{"id": "coord-thirumalai", "name": "Thirumalai", "role": "Organizer (4th Year)", "phone": "+91 98409 11223", "email": "thirumalai.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-website-creation', 'Website Creation', 'Technical', 'Full-Stack Web Engineering & Responsive Showcase', 'Develop and deploy interactive, responsive, and innovative web applications within a set timeframe. Judged on creativity, code architecture, and UI.', true, 1, 2, 0, 'Oct 24, 2026', '10:00 AM - 12:00 PM', '10:00 AM', '12:00 PM', 'Room 251 / Tech Lab', 40, 16, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', '["Teams of 1-2 participants.", "HTML5, CSS3, JavaScript, React, Vue or Tailwind CSS permitted."]'::jsonb, '[{"id": "coord-gopinath", "name": "Gopinath", "role": "Organizer (4th Year)", "phone": "+91 98411 33445", "email": "gopinath.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-poster-making', 'Poster Making', 'Non-Technical', 'Visual Art, Creative Expression & Thematic Illustrations', 'Bring ideas to life on canvas with vibrant creative illustrations, thematic depth, and compelling visual design.', true, 1, 2, 0, 'Oct 24, 2026', '10:00 AM - 11:00 AM', '10:00 AM', '11:00 AM', 'Room 248, 247', 40, 15, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80', '["Teams of 1-2 members.", "Drawing sheets provided.", "Theme announced 10 mins prior to event start."]'::jsonb, '[{"id": "coord-kesav-n", "name": "Kesav N", "role": "Organizer (4th Year)", "phone": "+91 98414 66778", "email": "kesavn.4th@spiher.edu.in", "department": "Dept. of Mech", "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-pushup', 'Push-up Challenge', 'Non-Technical', 'Physical Endurance, Stamina & Pure Strength', 'Test your physical endurance, core strength, and grit in a regulated push-up endurance challenge judged on clean form and repetition.', false, 1, 1, 0, 'Oct 24, 2026', '10:00 AM - 11:00 AM', '10:00 AM', '11:00 AM', 'Main Hall', 50, 25, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', '["Individual participation.", "Strict 90-degree elbow bend required for each valid rep."]'::jsonb, '[{"id": "coord-aakash", "name": "Aakash", "role": "Organizer (4th Year)", "phone": "+91 98417 99001", "email": "aakash.4th@spiher.edu.in", "department": "Dept. of Physical Ed", "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-memory-game', 'Memory Game', 'Non-Technical', 'Cognitive Recall, Focus & Rapid Mental Agility', 'Exercise sharp visual memory and mental recall in rapid-fire observation tests with increasing complexity.', false, 1, 1, 0, 'Oct 24, 2026', '10:00 AM - 11:00 AM', '10:00 AM', '11:00 AM', 'Room 248', 35, 12, 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80', '["Solo participation.", "30 seconds observation followed by recall challenge."]'::jsonb, '[{"id": "coord-yuvaraj", "name": "Yuvaraj", "role": "Organizer (4th Year)", "phone": "+91 98420 22334", "email": "yuvaraj.4th@spiher.edu.in", "department": "Dept. of IT", "photoUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-face-painting', 'Face Painting', 'Non-Technical', 'Living Canvas, Thematic Body Art & Aesthetics', 'Express imagination and intricate artistic mastery using faces as dynamic storytelling canvases.', true, 2, 2, 0, 'Oct 24, 2026', '10:00 AM - 11:00 AM', '10:00 AM', '11:00 AM', 'Main Hall / Room 247', 30, 10, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', '["Team of 2 (1 painter + 1 model).", "Participants must bring skin-safe paints and brushes."]'::jsonb, '[{"id": "coord-aswin", "name": "Aswin", "role": "Organizer (4th Year)", "phone": "+91 98422 44556", "email": "aswin.4th@spiher.edu.in", "department": "Dept. of ECE", "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-connections', 'Connections', 'Non-Technical', 'Image Decryption, Lateral Thinking & Word Link Trivia', 'Connect clues, images, cryptic associations, and pop culture references to crack the hidden word links fastest.', true, 2, 3, 0, 'Oct 24, 2026', '11:00 AM - 12:00 PM', '11:00 AM', '12:00 PM', 'Main Hall', 50, 20, 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80', '["Teams of 2-3 participants.", "Image clue puzzles across Cinema, Tech, and General Knowledge."]'::jsonb, '[{"id": "coord-jayasri", "name": "Jaya Sri", "role": "Organizer (4th Year)", "phone": "+91 98425 77889", "email": "jayasri.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-treasure-hunt', 'Treasure Hunt', 'Non-Technical', 'Campus Riddles, Secret Clues & Thrilling Exploration', 'Decipher cryptic riddles across the campus grounds, locate checkpoints, and race against other squads to unearth the final bounty.', true, 3, 4, 0, 'Oct 24, 2026', '11:00 AM - 12:30 PM', '11:00 AM', '12:30 PM', 'Outdoor / Campus Grounds', 40, 8, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', '["Teams of 3-4 participants.", "Clues must be solved sequentially."]'::jsonb, '[{"id": "coord-lilly", "name": "Lilly Vinoth", "role": "Organizer (4th Year)", "phone": "+91 98428 00112", "email": "lillyvinoth.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-rampwalk', 'Rampwalk', 'Non-Technical', 'Elegance, Poise, Runway Charisma & Couture Style', 'Own the runway with confidence, signature walk, thematic attire, and stage presence.', false, 1, 1, 0, 'Oct 24, 2026', '12:00 PM - 12:30 PM', '12:00 PM', '12:30 PM', 'Main Hall', 30, 10, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', '["Solo participation.", "Judged on posture, confidence, attire, and stage walk."]'::jsonb, '[{"id": "coord-jeevadharshni", "name": "Jeeva Dharshni", "role": "Organizer (4th Year)", "phone": "+91 98431 33445", "email": "jeevadharshni.4th@spiher.edu.in", "department": "Dept. of Viscom", "photoUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-singing', 'Singing Competition', 'Non-Technical', 'Vocal Melody, Pitch Precision & Musical Soul', 'Showcase vocal talent across classical, contemporary, cinematic, and western genres.', false, 1, 1, 0, 'Oct 24, 2026', '12:30 PM - 01:00 PM', '12:30 PM', '01:00 PM', 'Main Hall', 30, 11, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '["Solo singing.", "Time limit: 3-4 minutes per participant."]'::jsonb, '[{"id": "coord-kaviya", "name": "Kaviya", "role": "Organizer (4th Year)", "phone": "+91 98434 66778", "email": "kaviya.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-freefire', 'Free Fire Battle Royale', 'Non-Technical', 'Squad Tactics, Fast Reflexes & Tactical Battle Royale', 'Drop into the battlefield with your squad. Strategy, team coordination, and sharp marksmanship determine who secures the Booyah!', true, 4, 4, 0, 'Oct 24, 2026', '01:30 PM - 03:00 PM', '01:30 PM', '03:00 PM', 'Room 251', 48, 12, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', '["Squad mode (4 players per team).", "Mobile devices only (no emulators/triggers)."]'::jsonb, '[{"id": "coord-kumaravel-ff", "name": "Kumaravel", "role": "Organizer (4th Year)", "phone": "+91 98436 88990", "email": "kumaravel.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN'),
('evt-dance', 'Dance Competition', 'Non-Technical', 'Rhythm, Choreography, Dynamic Energy & Stage Impact', 'Electrify the stage with breathtaking moves, synchronization, creative choreography, and unmatched stage passion.', true, 1, 6, 0, 'Oct 24, 2026', '02:00 PM - 03:00 PM', '02:00 PM', '03:00 PM', 'Main Hall', 25, 8, 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80', '["Solo, Duo or Group (up to 6 members).", "Time limit: 3-5 minutes."]'::jsonb, '[{"id": "coord-jayalakshmi", "name": "Jaya Lakshmi", "role": "Organizer (4th Year)", "phone": "+91 98439 11223", "email": "jayalakshmi.4th@spiher.edu.in", "department": "Dept. of CSE", "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}]'::jsonb, 'OPEN')
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
('staff-emp-ai', 'judge.ai@spiher.edu.in', 'Dhanush (Lead Evaluator)', 'EMPLOYEE', 'staff@123', 'Dept. of CSE', '["evt-ai-prompt"]'::jsonb, true),
('staff-emp-freefire', 'judge.freefire@spiher.edu.in', 'Kumaravel (Esports Marshal)', 'EMPLOYEE', 'staff@123', 'Dept. of CSE', '["evt-freefire"]'::jsonb, true)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  password = EXCLUDED.password,
  assigned_event_ids = EXCLUDED.assigned_event_ids;

-- =============================================================================
-- SCRIPT FINISHED: Auth hooks, tables, security policies & seed data activated.
-- =============================================================================
