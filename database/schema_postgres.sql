-- ============================================================
-- SAHABAT BK - PostgreSQL Database Schema
-- Migration from SQLite to Postgres for Vercel deployment
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (Users: Students & Teachers)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher')),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  school VARCHAR(255),
  kelas VARCHAR(50),
  avatar VARCHAR(50),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- STUDENT PROGRESS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS student_progress (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id)
);

CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);

-- ============================================================
-- MISSIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS missions (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20) CHECK (difficulty IN ('mudah', 'sedang', 'sulit')),
  world_id VARCHAR(50),
  xp_reward INTEGER DEFAULT 20,
  coin_reward INTEGER DEFAULT 50,
  estimated_minutes INTEGER DEFAULT 10,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_world_id ON missions(world_id);

-- ============================================================
-- MISSION PROGRESS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS mission_progress (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, mission_id)
);

CREATE INDEX idx_mission_progress_student_id ON mission_progress(student_id);
CREATE INDEX idx_mission_progress_mission_id ON mission_progress(mission_id);

-- ============================================================
-- CASE STUDIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS case_studies (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  story TEXT,
  missions_count INTEGER DEFAULT 4,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_studies_status ON case_studies(status);

-- ============================================================
-- CLASSES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  grade INTEGER NOT NULL,
  teacher_name VARCHAR(255),
  teacher_id VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_grade ON classes(grade);

-- ============================================================
-- ATTENDANCE STUDENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance_students (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_students_kelas ON attendance_students(kelas);

-- ============================================================
-- ATTENDANCE RECORDS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance_records (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(100) NOT NULL REFERENCES attendance_students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('hadir', 'izin', 'sakit', 'alpa')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_records_date ON attendance_records(date);

-- ============================================================
-- TRIGGERS FOR updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mission_progress_updated_at BEFORE UPDATE ON mission_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_students_updated_at BEFORE UPDATE ON attendance_students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONE! Database schema ready for Vercel deployment
-- ============================================================
