╔═══════════════════════════════════════════════════════════╗
║         SAHABAT BK - MySQL Lokal Setup                    ║
║         Panduan Singkat untuk Memulai                     ║
╚═══════════════════════════════════════════════════════════╝

📋 LANGKAH SETUP (Hanya 1x)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Pastikan MySQL di XAMPP sudah HIJAU (running)

2. Buat Database:
   - Buka: http://localhost/phpmyadmin
   - Klik tab "SQL"
   - Copy isi file: database/schema_mysql.sql
   - Paste & klik "Go"
   ✅ Database siap!

3. Sudah selesai! Backend dependencies sudah terinstall.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 CARA MENJALANKAN APLIKASI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUDAH! Tinggal double-click 2 file ini:

   1️⃣  start-backend.bat   (jalankan dulu)
   2️⃣  start-frontend.bat  (jalankan kedua)

Tunggu beberapa detik, browser otomatis terbuka!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CEK BACKEND RUNNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Setelah jalankan start-backend.bat, harus muncul:

   🚀 Server berjalan di http://localhost:3001
   📊 Database: sahabat_bk

Kalau muncul itu, backend BERHASIL! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Buka: http://localhost:5173
2. Klik "Daftar" → Pilih Guru/Siswa
3. Isi form dan submit
4. Kalau berhasil → langsung masuk dashboard
5. Logout dan login lagi → data masih ada! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CEK DATA DI DATABASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Buka: http://localhost/phpmyadmin
2. Klik database "sahabat_bk"
3. Klik tabel "profiles"
4. Lihat data user yang baru dibuat!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 CARA STOP SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Tekan Ctrl+C di jendela backend
- Tekan Ctrl+C di jendela frontend
- Atau langsung close windownya

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: Backend error ECONNREFUSED
Solusi:  Start MySQL di XAMPP (harus HIJAU)

Problem: Database sahabat_bk not found
Solusi:  Jalankan SQL di phpMyAdmin (lihat step 2)

Problem: Frontend error "Failed to fetch"
Solusi:  Backend belum running, jalankan start-backend.bat

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Untuk panduan lengkap, baca: SETUP_MYSQL.md

Happy Coding! 🚀
