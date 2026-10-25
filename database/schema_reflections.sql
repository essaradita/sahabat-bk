-- ============================================================
-- REFLECTIONS / JOURNAL TABLE
-- Student journal entries with mood tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS reflections (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  is_private BOOLEAN DEFAULT TRUE,
  mission_id VARCHAR(100) REFERENCES missions(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reflections_student_id ON reflections(student_id);
CREATE INDEX idx_reflections_created_at ON reflections(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_reflections_updated_at 
BEFORE UPDATE ON reflections 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Run this in Neon.tech SQL Editor
-- ============================================================
