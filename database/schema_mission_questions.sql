-- ============================================================
-- MISSION QUESTIONS TABLE
-- Stores individual questions for each mission
-- ============================================================

CREATE TABLE IF NOT EXISTS mission_questions (
  id VARCHAR(100) PRIMARY KEY,
  mission_id VARCHAR(100) NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('multiple_choice', 'true_false', 'situational', 'reflection')),
  question TEXT NOT NULL,
  options JSONB,
  correct_answer VARCHAR(10),
  explanation TEXT,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mission_questions_mission_id ON mission_questions(mission_id);
CREATE INDEX idx_mission_questions_order ON mission_questions(mission_id, order_num);

-- Trigger for updated_at
CREATE TRIGGER update_mission_questions_updated_at 
BEFORE UPDATE ON mission_questions 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONE! Run this in Neon.tech SQL Editor
-- ============================================================
