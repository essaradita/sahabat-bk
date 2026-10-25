-- Seed Default Missions untuk Bank Soal Individu
-- Run this SQL in your Neon.tech PostgreSQL dashboard

-- Insert 6 default missions if they don't exist
INSERT INTO missions (id, title, description, category, difficulty, world_id, xp_reward, coin_reward, estimated_minutes, status)
VALUES 
  (
    'mission-1',
    'Detektif Emosi',
    'Kenali berbagai emosi dan cara menghadapinya dengan bijak.',
    'pribadi',
    'mudah',
    'world-1',
    20,
    50,
    10,
    'active'
  ),
  (
    'mission-2',
    'Minat dan Bakatku',
    'Temukan apa yang kamu sukai dan apa yang kamu kuasai.',
    'pribadi',
    'mudah',
    'world-1',
    20,
    50,
    12,
    'active'
  ),
  (
    'mission-3',
    'Manajemen Waktu',
    'Belajar mengatur waktu agar bisa produktif dan tetap happy.',
    'pribadi',
    'sedang',
    'world-1',
    25,
    60,
    15,
    'active'
  ),
  (
    'mission-4',
    'Konflik Teman Sebaya',
    'Cara menyelesaikan pertengkaran dengan teman secara damai.',
    'sosial',
    'mudah',
    'world-2',
    20,
    50,
    10,
    'active'
  ),
  (
    'mission-5',
    'Kekuatan Empati',
    'Memahami perasaan orang lain dan merespons dengan empati.',
    'sosial',
    'sedang',
    'world-2',
    25,
    55,
    12,
    'active'
  ),
  (
    'mission-6',
    'Anti Bullying',
    'Memahami bahaya bullying dan bagaimana menghentikannya.',
    'sosial',
    'sedang',
    'world-2',
    30,
    70,
    15,
    'active'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  world_id = EXCLUDED.world_id,
  xp_reward = EXCLUDED.xp_reward,
  coin_reward = EXCLUDED.coin_reward,
  estimated_minutes = EXCLUDED.estimated_minutes,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

-- Verify the data
SELECT * FROM missions ORDER BY id;
