-- ============================================================
-- SAHABAT BK — MySQL Schema
-- Jalankan di phpMyAdmin (http://localhost/phpmyadmin)
-- ============================================================

-- Buat database baru
CREATE DATABASE IF NOT EXISTS sahabat_bk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sahabat_bk;

-- ============================================================
-- PROFILES (user accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           VARCHAR(36) PRIMARY KEY,
  role         ENUM('student', 'teacher', 'admin') NOT NULL,
  name         VARCHAR(255) NOT NULL,
  username     VARCHAR(100) UNIQUE,
  email        VARCHAR(255),
  password     VARCHAR(255) NOT NULL,
  school       VARCHAR(255),
  kelas        VARCHAR(10),
  avatar       VARCHAR(50) DEFAULT 'boy1',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  grade       INT NOT NULL CHECK (grade BETWEEN 7 AND 9),
  teacher_id  VARCHAR(36),
  class_code  VARCHAR(10) UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLASS MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS class_members (
  id          VARCHAR(36) PRIMARY KEY,
  class_id    VARCHAR(36) NOT NULL,
  student_id  VARCHAR(36) NOT NULL,
  joined_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_member (class_id, student_id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS missions (
  id                  VARCHAR(36) PRIMARY KEY,
  title               VARCHAR(255) NOT NULL,
  description         TEXT,
  objective           TEXT,
  category            ENUM('pribadi', 'sosial', 'belajar', 'karier') NOT NULL,
  world_id            VARCHAR(20) NOT NULL,
  difficulty          ENUM('mudah', 'sedang', 'sulit') DEFAULT 'mudah',
  estimated_minutes   INT DEFAULT 10,
  xp_reward           INT DEFAULT 20,
  coin_reward         INT DEFAULT 50,
  badge_reward        VARCHAR(50),
  story_text          TEXT,
  mission_order       INT DEFAULT 1,
  published           BOOLEAN DEFAULT FALSE,
  created_by          VARCHAR(36),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id          VARCHAR(36) PRIMARY KEY,
  mission_id  VARCHAR(36) NOT NULL,
  type        ENUM('multiple_choice', 'true_false', 'situational', 'reflection') NOT NULL,
  question    TEXT NOT NULL,
  explanation TEXT,
  q_order     INT DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- QUESTION OPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS question_options (
  id           VARCHAR(36) PRIMARY KEY,
  question_id  VARCHAR(36) NOT NULL,
  option_key   VARCHAR(5) NOT NULL,
  option_text  TEXT NOT NULL,
  is_correct   BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MISSION ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS mission_attempts (
  id           VARCHAR(36) PRIMARY KEY,
  mission_id   VARCHAR(36) NOT NULL,
  student_id   VARCHAR(36) NOT NULL,
  score        INT DEFAULT 0,
  total_q      INT DEFAULT 0,
  completed    BOOLEAN DEFAULT FALSE,
  started_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (mission_id) REFERENCES missions(id),
  FOREIGN KEY (student_id) REFERENCES profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- STUDENT ANSWERS
-- ============================================================
CREATE TABLE IF NOT EXISTS student_answers (
  id           VARCHAR(36) PRIMARY KEY,
  attempt_id   VARCHAR(36) NOT NULL,
  question_id  VARCHAR(36) NOT NULL,
  answer       TEXT,
  is_correct   BOOLEAN,
  answered_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES mission_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- STUDENT PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS student_progress (
  id           VARCHAR(36) PRIMARY KEY,
  student_id   VARCHAR(36) UNIQUE NOT NULL,
  xp           INT DEFAULT 0,
  level        INT DEFAULT 1,
  coins        INT DEFAULT 0,
  pribadi_pct  INT DEFAULT 0,
  sosial_pct   INT DEFAULT 0,
  belajar_pct  INT DEFAULT 0,
  karier_pct   INT DEFAULT 0,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  color       VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS student_badges (
  id          VARCHAR(36) PRIMARY KEY,
  student_id  VARCHAR(36) NOT NULL,
  badge_id    VARCHAR(36) NOT NULL,
  earned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_badge (student_id, badge_id),
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id          VARCHAR(36) PRIMARY KEY,
  class_id    VARCHAR(36) NOT NULL,
  teacher_id  VARCHAR(36) NOT NULL,
  date        DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_session (class_id, date),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (teacher_id) REFERENCES profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS attendance_records (
  id          VARCHAR(36) PRIMARY KEY,
  session_id  VARCHAR(36) NOT NULL,
  student_id  VARCHAR(36) NOT NULL,
  status      ENUM('hadir', 'izin', 'sakit', 'alpa') NOT NULL,
  note        TEXT,
  UNIQUE KEY unique_record (session_id, student_id),
  FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- REFLECTIONS / JOURNAL
-- ============================================================
CREATE TABLE IF NOT EXISTS reflections (
  id          VARCHAR(36) PRIMARY KEY,
  student_id  VARCHAR(36) NOT NULL,
  title       VARCHAR(255),
  content     TEXT NOT NULL,
  mood        VARCHAR(50),
  is_private  BOOLEAN DEFAULT TRUE,
  mission_id  VARCHAR(36),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (mission_id) REFERENCES missions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- COUNSELING REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS counseling_requests (
  id             VARCHAR(36) PRIMARY KEY,
  student_id     VARCHAR(36) NOT NULL,
  teacher_id     VARCHAR(36),
  topic          VARCHAR(255) NOT NULL,
  message        TEXT NOT NULL,
  preferred_time VARCHAR(100),
  status         ENUM('pending', 'scheduled', 'done', 'cancelled') DEFAULT 'pending',
  teacher_note   TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES profiles(id),
  FOREIGN KEY (teacher_id) REFERENCES profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
