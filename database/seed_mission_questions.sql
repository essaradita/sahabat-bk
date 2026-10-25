-- ============================================================
-- SEED MISSION QUESTIONS
-- Insert demo questions from demoData.js into database
-- ============================================================

-- Mission 1: Detektif Emosi (5 questions)
INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q1-1', 'mission-1', 'multiple_choice', 
 'Ketika kamu merasa marah kepada teman, tindakan yang paling tepat adalah...', 
 '[{"id":"A","text":"Langsung membalas perkataannya dengan keras"},{"id":"B","text":"Menenangkan diri dulu, lalu berbicara baik-baik"},{"id":"C","text":"Menjauhi semua teman selamanya"},{"id":"D","text":"Menceritakan masalahnya kepada semua orang"}]',
 'B',
 'Kamu hebat! Menenangkan diri sebelum berbicara adalah cara terbaik. Ketika marah, otak kita kurang bisa berpikir jernih. Dengan menenangkan diri dulu (misalnya tarik napas dalam, hitung 1-10), kita bisa berbicara dengan lebih baik dan masalah bisa diselesaikan.',
 1);

INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q1-2', 'mission-1', 'multiple_choice', 
 'Apa yang dimaksud dengan "empati"?', 
 '[{"id":"A","text":"Merasa sedih sepanjang waktu"},{"id":"B","text":"Tidak peduli dengan perasaan orang lain"},{"id":"C","text":"Memahami dan ikut merasakan perasaan orang lain"},{"id":"D","text":"Selalu mengikuti keinginan teman"}]',
 'C',
 'Empati adalah kemampuan untuk memahami dan merasakan apa yang dirasakan orang lain. Dengan berempati, kita bisa menjadi teman yang lebih baik dan menciptakan hubungan yang lebih harmonis.',
 2);

INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q1-3', 'mission-1', 'true_false', 
 'Merasa sedih, marah, atau takut adalah hal yang normal dan wajar dialami oleh semua orang.', 
 '[{"id":"A","text":"Benar"},{"id":"B","text":"Salah"}]',
 'A',
 'Benar sekali! Semua emosi, termasuk yang negatif seperti sedih atau marah, adalah bagian normal dari pengalaman manusia. Yang penting adalah bagaimana kita mengelola dan mengekspresikan emosi tersebut dengan cara yang sehat.',
 3);

INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q1-4', 'mission-1', 'situational', 
 'Temanmu terlihat murung dan sendirian di sudut kelas. Apa yang sebaiknya kamu lakukan?', 
 '[{"id":"A","text":"Pura-pura tidak melihat dan terus bermain dengan teman lain"},{"id":"B","text":"Menghampirinya, menanyakan kabarnya dengan lembut, dan mendengarkan"},{"id":"C","text":"Langsung menceritakan masalah temanmu kepada guru"},{"id":"D","text":"Mengajak semua teman untuk menghampirinya sekaligus agar ramai"}]',
 'B',
 'Hebat! Menghampiri dengan lembut dan mendengarkan adalah tindakan empati yang tepat. Terkadang orang hanya butuh seseorang yang mau mendengarkan. Jangan lupa untuk menjaga privasi temanmu ya!',
 4);

INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q1-5', 'mission-1', 'reflection', 
 'Tuliskan satu emosi yang sering kamu rasakan dan bagaimana cara kamu menghadapinya selama ini.', 
 NULL,
 NULL,
 'Terima kasih sudah mau berefleksi! Mengenali emosi diri adalah langkah pertama menuju kecerdasan emosional yang baik. Teruslah berlatih mengelola emosimu dengan cara yang sehat.',
 5);

-- Mission 2: Minat dan Bakatku (3 questions)
INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q2-1', 'mission-2', 'multiple_choice', 
 'Apa perbedaan antara "minat" dan "bakat"?', 
 '[{"id":"A","text":"Keduanya sama saja, tidak ada bedanya"},{"id":"B","text":"Minat adalah hal yang kamu sukai, bakat adalah kemampuan alami yang kamu miliki"},{"id":"C","text":"Bakat adalah hal yang kamu sukai, minat adalah kemampuan alami"},{"id":"D","text":"Keduanya hanya ditentukan oleh orang tua"}]',
 'B',
 'Tepat! Minat adalah hal yang kamu sukai atau ingin lakukan, sementara bakat adalah kemampuan alami yang kamu miliki. Keduanya penting! Idealnya, kamu bisa mengembangkan bakat di bidang yang kamu minati.',
 1);

INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q2-2', 'mission-2', 'multiple_choice', 
 'Apa yang paling kamu sukai dalam mengisi waktu luang?', 
 '[{"id":"A","text":"Membaca buku atau belajar hal baru"},{"id":"B","text":"Bermain game atau olahraga"},{"id":"C","text":"Berkumpul dengan teman dan mengobrol"},{"id":"D","text":"Menggambar, musik, atau berkreasi"}]',
 NULL,
 'Semua pilihan itu bagus! Apa yang kamu sukai di waktu luang bisa menjadi petunjuk tentang minat dan bakatmu. Tidak ada jawaban yang salah di sini — ini adalah tentang mengenali dirimu sendiri.',
 2);

INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num) VALUES
('q2-3', 'mission-2', 'true_false', 
 'Bakat yang tidak dikembangkan akan hilang begitu saja dan tidak berguna.', 
 '[{"id":"A","text":"Benar"},{"id":"B","text":"Salah"}]',
 'B',
 'Salah! Bakat memang perlu dikembangkan agar mencapai potensi penuhnya, tapi bakat tidak akan "hilang". Yang tepat adalah: bakat yang tidak dikembangkan tidak akan berkembang maksimal. Tidak pernah terlambat untuk mulai mengembangkan bakatmu!',
 3);

-- ============================================================
-- DONE! Run this AFTER creating the mission_questions table
-- ============================================================
