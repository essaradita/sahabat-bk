-- Seed Default Case Studies untuk Bank Soal Kelompok
-- Run this SQL in your Neon.tech PostgreSQL dashboard

-- Insert default case studies if they don't exist
INSERT INTO case_studies (id, title, description, category, story, missions_count, status)
VALUES 
  (
    'case-1',
    'Rani dan Presentasi',
    'Rani ditunjuk untuk mempresentasikan hasil diskusi kelompok...',
    'Kepercayaan Diri',
    'Rani adalah siswa kelas 7 yang pintar dan rajin belajar. Suatu hari, guru menunjuk Rani untuk mempresentasikan hasil diskusi kelompok di depan kelas. Rani merasa gugup dan tidak percaya diri meskipun ia sudah mempersiapkan materinya dengan baik. Bagaimana Rani bisa mengatasi rasa gugupnya?',
    4,
    'active'
  ),
  (
    'case-2',
    'Budi dan Tugas Kelompok',
    'Budi merasa kesal karena dalam tugas kelompok, hanya dia yang bekerja...',
    'Kerja Sama',
    'Budi adalah siswa yang bertanggung jawab. Ketika guru memberikan tugas kelompok, Budi sangat bersemangat. Namun, teman-teman sekelompoknya tidak ikut mengerjakan. Budi merasa kesal dan bingung harus bagaimana. Apakah ia harus mengerjakan sendiri atau mengomunikasikan masalah ini?',
    4,
    'active'
  ),
  (
    'case-3',
    'Siti dan Pertemanan',
    'Siti tidak diajak bermain oleh teman-temannya...',
    'Sosial Emosional',
    'Siti adalah siswa baru di kelas 7B. Ia merasa kesulitan untuk berteman karena teman-temannya sudah memiliki kelompok masing-masing. Siti sering melihat teman-temannya bermain bersama tapi ia tidak diajak. Siti merasa sedih dan kesepian. Bagaimana Siti bisa mengatasi situasi ini?',
    4,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the data
SELECT * FROM case_studies ORDER BY id;
