-- ============================================================
-- SAHABAT BK — Supabase Schema
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  name         TEXT NOT NULL,
  username     TEXT UNIQUE,            -- for student login
  email        TEXT,
  school       TEXT,
  kelas        TEXT,                   -- e.g. '8A', for students
  avatar       TEXT DEFAULT 'boy1',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for username lookup
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles (role);

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  grade       INT NOT NULL CHECK (grade BETWEEN 7 AND 9),
  teacher_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  class_code  TEXT UNIQUE DEFAULT upper(substring(md5(random()::text) from 1 for 6)),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLASS MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS class_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (class_id, student_id)
);

-- ============================================================
-- MISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS missions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               TEXT NOT NULL,
  description         TEXT,
  objective           TEXT,
  category            TEXT NOT NULL CHECK (category IN ('pribadi', 'sosial', 'belajar', 'karier')),
  world_id            TEXT NOT NULL,   -- 'world-1' to 'world-4'
  difficulty          TEXT DEFAULT 'mudah' CHECK (difficulty IN ('mudah', 'sedang', 'sulit')),
  estimated_minutes   INT DEFAULT 10,
  xp_reward           INT DEFAULT 20,
  coin_reward         INT DEFAULT 50,
  badge_reward        TEXT,
  story_text          TEXT,
  mission_order       INT DEFAULT 1,
  published           BOOLEAN DEFAULT FALSE,
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id  UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('multiple_choice', 'true_false', 'situational', 'reflection')),
  question    TEXT NOT NULL,
  explanation TEXT,
  q_order     INT DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTION OPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS question_options (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_key   TEXT NOT NULL,   -- 'A', 'B', 'C', 'D'
  option_text  TEXT NOT NULL,
  is_correct   BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- MISSION ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS mission_attempts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id   UUID NOT NULL REFERENCES missions(id),
  student_id   UUID NOT NULL REFERENCES profiles(id),
  score        INT DEFAULT 0,
  total_q      INT DEFAULT 0,
  completed    BOOLEAN DEFAULT FALSE,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- STUDENT ANSWERS
-- ============================================================
CREATE TABLE IF NOT EXISTS student_answers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id   UUID NOT NULL REFERENCES mission_attempts(id) ON DELETE CASCADE,
  question_id  UUID NOT NULL REFERENCES questions(id),
  answer       TEXT,            -- option key or free text
  is_correct   BOOLEAN,
  answered_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS student_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id   UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  xp           INT DEFAULT 0,
  level        INT DEFAULT 1,
  coins        INT DEFAULT 0,
  pribadi_pct  INT DEFAULT 0,
  sosial_pct   INT DEFAULT 0,
  belajar_pct  INT DEFAULT 0,
  karier_pct   INT DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT
);

CREATE TABLE IF NOT EXISTS student_badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id    UUID NOT NULL REFERENCES badges(id),
  earned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, badge_id)
);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id    UUID NOT NULL REFERENCES classes(id),
  teacher_id  UUID NOT NULL REFERENCES profiles(id),
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (class_id, date)
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES profiles(id),
  status      TEXT NOT NULL CHECK (status IN ('hadir', 'izin', 'sakit', 'alpa')),
  note        TEXT,
  UNIQUE (session_id, student_id)
);

-- ============================================================
-- REFLECTIONS / JOURNAL
-- ============================================================
CREATE TABLE IF NOT EXISTS reflections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  mood        TEXT,
  is_private  BOOLEAN DEFAULT TRUE,
  mission_id  UUID REFERENCES missions(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COUNSELING REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS counseling_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES profiles(id),
  teacher_id  UUID REFERENCES profiles(id),
  topic       TEXT NOT NULL,
  message     TEXT NOT NULL,
  preferred_time TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'done', 'cancelled')),
  teacher_note TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges               ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections          ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_requests  ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Teachers can read profiles in their classes"
  ON profiles FOR SELECT
  USING (
    role = 'teacher' OR
    EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = profiles.id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ---- CLASSES ----
CREATE POLICY "Teachers can manage own classes"
  ON classes FOR ALL
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can read their classes"
  ON classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_members WHERE class_id = classes.id AND student_id = auth.uid()
    )
  );

-- ---- MISSIONS ----
CREATE POLICY "Teachers can manage missions they created"
  ON missions FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Students can read published missions"
  ON missions FOR SELECT
  USING (published = TRUE);

-- ---- QUESTIONS ----
CREATE POLICY "Teachers can manage questions of their missions"
  ON questions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM missions WHERE id = questions.mission_id AND created_by = auth.uid())
  );

CREATE POLICY "Students can read questions"
  ON questions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM missions WHERE id = questions.mission_id AND published = TRUE)
  );

-- NOTE: question_options — do NOT expose correct answers to students until scoring
-- Teachers can manage; students get options without is_correct
CREATE POLICY "Teachers can manage question options"
  ON question_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM questions q
      JOIN missions m ON m.id = q.mission_id
      WHERE q.id = question_options.question_id AND m.created_by = auth.uid()
    )
  );

CREATE POLICY "Students can read option text only"
  ON question_options FOR SELECT
  USING (TRUE);
-- Frontend must NOT send is_correct to client before submission

-- ---- MISSION ATTEMPTS ----
CREATE POLICY "Students can manage own attempts"
  ON mission_attempts FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can read attempts in their classes"
  ON mission_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = mission_attempts.student_id AND c.teacher_id = auth.uid()
    )
  );

-- ---- STUDENT ANSWERS ----
CREATE POLICY "Students can manage own answers"
  ON student_answers FOR ALL
  USING (
    EXISTS (SELECT 1 FROM mission_attempts WHERE id = student_answers.attempt_id AND student_id = auth.uid())
  );

-- ---- STUDENT PROGRESS ----
CREATE POLICY "Students can read own progress"
  ON student_progress FOR SELECT
  USING (student_id = auth.uid());

-- Students cannot directly update XP/level — use database functions
CREATE POLICY "Only service role can update progress"
  ON student_progress FOR UPDATE
  USING (FALSE); -- Block direct updates; use server-side function

-- ---- REFLECTIONS ----
CREATE POLICY "Students can manage own reflections"
  ON reflections FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can read non-private reflections"
  ON reflections FOR SELECT
  USING (
    student_id = auth.uid() OR
    (is_private = FALSE AND EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = reflections.student_id AND c.teacher_id = auth.uid()
    ))
  );

-- ---- COUNSELING ----
CREATE POLICY "Students can manage own counseling requests"
  ON counseling_requests FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can read requests from their students"
  ON counseling_requests FOR SELECT
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = counseling_requests.student_id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update counseling status"
  ON counseling_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = counseling_requests.student_id AND c.teacher_id = auth.uid()
    )
  );

-- ---- ATTENDANCE ----
CREATE POLICY "Teachers can manage attendance for their classes"
  ON attendance_sessions FOR ALL
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can read own attendance"
  ON attendance_records FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage attendance records"
  ON attendance_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM attendance_sessions s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = attendance_records.session_id AND c.teacher_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTION: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Pengguna Baru'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: award XP safely (prevents client-side manipulation)
-- ============================================================
CREATE OR REPLACE FUNCTION award_xp(p_student_id UUID, p_xp INT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO student_progress (student_id, xp)
  VALUES (p_student_id, p_xp)
  ON CONFLICT (student_id) DO UPDATE
    SET xp = student_progress.xp + p_xp,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
