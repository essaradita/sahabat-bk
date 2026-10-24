import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, 'database.sqlite'))

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT NOT NULL,
    school TEXT,
    kelas TEXT,
    avatar TEXT DEFAULT 'boy1',
    gender TEXT CHECK(gender IN ('male', 'female')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_username ON profiles(username);
  CREATE INDEX IF NOT EXISTS idx_email ON profiles(email);
  CREATE INDEX IF NOT EXISTS idx_role ON profiles(role);

  CREATE TABLE IF NOT EXISTS student_progress (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    pribadi_pct INTEGER DEFAULT 0,
    sosial_pct INTEGER DEFAULT 0,
    belajar_pct INTEGER DEFAULT 0,
    karier_pct INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS mission_progress (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    mission_id TEXT NOT NULL,
    status TEXT DEFAULT 'locked' CHECK(status IN ('locked', 'available', 'in_progress', 'completed')),
    score INTEGER DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE(student_id, mission_id)
  );

  CREATE INDEX IF NOT EXISTS idx_mission_student ON mission_progress(student_id);
  CREATE INDEX IF NOT EXISTS idx_mission_status ON mission_progress(status);

  CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty TEXT,
    world_id TEXT,
    xp_reward INTEGER DEFAULT 20,
    coin_reward INTEGER DEFAULT 50,
    estimated_minutes INTEGER DEFAULT 10,
    thumbnail TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS case_studies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    story TEXT,
    missions_count INTEGER DEFAULT 4,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    mission_id TEXT,
    case_study_id TEXT,
    question_text TEXT NOT NULL,
    question_type TEXT,
    options TEXT,
    correct_answer TEXT,
    order_num INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
    FOREIGN KEY (case_study_id) REFERENCES case_studies(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS attendance_students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    kelas TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS attendance_records (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('hadir', 'sakit', 'izin', 'alpa')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES attendance_students(id) ON DELETE CASCADE,
    UNIQUE(student_id, date)
  );

  CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
  CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);

  CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade INTEGER NOT NULL CHECK(grade BETWEEN 7 AND 9),
    teacher_name TEXT DEFAULT 'Ibu Rina',
    teacher_id TEXT,
    student_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade);
  CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
`)

console.log('✅ SQLite Database initialized')

export default db
