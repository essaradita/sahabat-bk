-- ============================================================
-- SEED DATA — Sahabat BK
-- Jalankan SETELAH schema.sql
-- CATATAN: Profile guru harus dibuat dulu via Supabase Auth
-- ============================================================

-- Badges
INSERT INTO badges (name, description, icon, color) VALUES
  ('Penjelajah Diri',   'Menyelesaikan Misi Kenali Dirimu pertama',       '🔍', 'bg-blue-100 text-blue-700'),
  ('Teman Baik',        'Menyelesaikan Misi Hutan Sosial pertama',         '🤝', 'bg-green-100 text-green-700'),
  ('Semangat Belajar',  'Menyelesaikan 3 misi berturut-turut',             '📚', 'bg-purple-100 text-purple-700'),
  ('Sang Pemimpin',     'Menyelesaikan semua misi karier',                 '👑', 'bg-yellow-100 text-yellow-700'),
  ('Bintang Emas',      'Mendapat nilai sempurna di 5 misi',               '⭐', 'bg-amber-100 text-amber-700'),
  ('Sahabat Empati',    'Menyelesaikan semua misi sosial',                 '💛', 'bg-pink-100 text-pink-700')
ON CONFLICT DO NOTHING;

-- Demo Missions
INSERT INTO missions (title, description, objective, category, world_id, difficulty, estimated_minutes, xp_reward, coin_reward, badge_reward, story_text, mission_order, published) VALUES
  ('Detektif Emosi',          'Kenali berbagai emosi dan cara menghadapinya dengan bijak.',               'Siswa dapat mengidentifikasi emosi diri dan merespons dengan cara yang tepat.',            'pribadi',  'world-1', 'mudah',  10, 20, 50, 'Penjelajah Diri',  'Halo Penjelajah! Hari ini kamu akan menjadi Detektif Emosi. Yuk kenali dirimu!',       1, TRUE),
  ('Minat dan Bakatku',       'Temukan apa yang kamu sukai dan apa yang kamu kuasai.',                   'Siswa dapat membedakan minat dan bakat serta menghubungkannya dengan rencana belajar.', 'pribadi',  'world-1', 'mudah',  12, 20, 50, NULL,               'Setiap orang punya keunikannya! Mari temukan minat dan bakatmu.',                      2, TRUE),
  ('Manajemen Waktu',         'Belajar mengatur waktu agar produktif dan tetap happy.',                  'Siswa dapat membuat jadwal harian yang seimbang.',                                       'pribadi',  'world-1', 'sedang', 15, 25, 60, NULL,               'Waktu adalah harta yang tak ternilai. Yuk belajar menggunakannya dengan bijak!',       3, TRUE),
  ('Konflik Teman Sebaya',    'Cara menyelesaikan pertengkaran dengan teman secara damai.',              'Siswa dapat menggunakan strategi resolusi konflik yang konstruktif.',                    'sosial',   'world-2', 'mudah',  10, 20, 50, 'Teman Baik',        'Berteman itu indah, tapi kadang ada perselisihan. Mari belajar cara menyelesaikannya!', 1, TRUE),
  ('Kekuatan Empati',         'Memahami perasaan orang lain dan merespons dengan empati.',               'Siswa dapat menunjukkan empati kepada teman yang sedang kesulitan.',                     'sosial',   'world-2', 'sedang', 12, 25, 55, NULL,               'Empati adalah kekuatan nyata! Mari latih kemampuan luar biasa ini.',                   2, TRUE),
  ('Anti Bullying',           'Memahami bahaya bullying dan bagaimana menghentikannya.',                 'Siswa dapat mengidentifikasi bullying dan cara mencegahnya.',                            'sosial',   'world-2', 'sedang', 15, 30, 70, 'Sahabat Empati',   'Bersama kita ciptakan sekolah yang aman untuk semua!',                                 3, FALSE),
  ('Motivasi Belajar',        'Temukan sumber semangatmu untuk terus belajar.',                         'Siswa dapat mengidentifikasi motivasi internal dan eksternal dalam belajar.',             'belajar',  'world-3', 'mudah',  10, 20, 50, 'Semangat Belajar', 'Belajar bukan hanya soal nilai! Ada banyak alasan indah untuk terus belajar.',         1, TRUE),
  ('Strategi Belajar Efektif','Teknik belajar yang terbukti efektif untuk otak remaja.',                'Siswa dapat menerapkan minimal 3 strategi belajar yang efektif.',                        'belajar',  'world-3', 'sedang', 15, 25, 60, NULL,               'Cara belajar yang tepat bisa membuat hasil belajarmu 2x lebih baik!',                  2, TRUE),
  ('Pemacu Karier',           'Mengenal berbagai pilihan karier dan profesi masa depan.',               'Siswa dapat menghubungkan minat dengan pilihan karier.',                                 'karier',   'world-4', 'sedang', 15, 30, 70, NULL,               'Masa depanmu penuh kemungkinan! Yuk mulai kenali pilihan kariermu.',                   1, FALSE),
  ('Rencana Hidupku',         'Membuat rencana hidup sederhana yang realistis dan inspiratif.',         'Siswa dapat membuat rencana hidup jangka pendek dan menengah.',                          'karier',   'world-4', 'sulit',  20, 40, 100,'Sang Pemimpin',    'Impianmu adalah peta hidupmu. Mari mulai merencanakan!',                               2, FALSE)
ON CONFLICT DO NOTHING;
