# 🔧 TODO: Fix Priority - 4 Masalah Utama

## Status: BELUM DIKERJAKAN

Tanggal: 25 Oktober 2026

---

## 📋 RINGKASAN MASALAH

### ❌ Problem 1: Jurnal Siswa Tidak Tersimpan
**Status:** Critical  
**Impact:** Data jurnal hilang ketika refresh

**Penyebab:**
- Data jurnal hanya disimpan di `useState` (state lokal)
- Tidak ada API call ke backend
- Tidak ada localStorage fallback

**Yang Perlu Dibuat:**
1. Database table `journals` (id, student_id, date, mood, title, content, private)
2. API endpoints:
   - GET `/api/student/journals` - Get all journals
   - POST `/api/student/journals` - Create journal
   - PUT `/api/student/journals/:id` - Update journal
   - DELETE `/api/student/journals/:id` - Delete journal
3. Update `StudentJournal.jsx` untuk hit API

---

### ❌ Problem 2: Edit/Tambah Soal Bank Soal Tidak Tersimpan
**Status:** Critical  
**Impact:** Soal baru/edit tidak muncul, siswa tidak bisa lihat soal yang diupdate

**Penyebab:**
- Sepertinya ada bug di API atau data tidak ter-fetch ulang setelah create/update
- Atau ada mismatch antara data di database vs data yang ditampilkan

**Yang Perlu Dicek:**
1. Apakah API `/api/teacher/missions` (POST/PUT) berfungsi?
2. Apakah setelah save, halaman QuestionBank re-fetch data?
3. Apakah data missions di database benar-benar terupdate?
4. Apakah student mengambil missions dari API yang sama?

**Yang Perlu Dibuat:**
- Pastikan missions table sudah ada dan terupdate
- Seed default 6 missions ke database (seperti case studies)
- Student ambil missions dari `/api/student/missions` atau `/api/teacher/missions`

---

### ❌ Problem 3: Layanan BK Tidak Sinkron dengan Konsultasi Siswa
**Status:** Medium  
**Impact:** Guru BK tidak bisa lihat permintaan konsultasi dari siswa

**Penyebab:**
- Form konsultasi di `StudentJournal.jsx` hanya show popup "Terkirim"
- Tidak ada API call untuk save konsultasi request
- Tidak ada database table untuk menyimpan konsultasi

**Yang Perlu Dibuat:**
1. Database table `counseling_requests` (id, student_id, topic, message, preferred_time, status, created_at)
2. API endpoints:
   - POST `/api/student/counseling` - Submit counseling request
   - GET `/api/teacher/counseling` - Get all counseling requests
   - PUT `/api/teacher/counseling/:id` - Update status (approved/rejected/completed)
3. Update `StudentJournal.jsx` untuk POST ke API
4. Update `CounselingPage.jsx` (teacher) untuk GET dan display requests

---

### ❌ Problem 4: Tambah Data Siswa Tidak Bisa & Tidak Sinkron dengan Absensi
**Status:** Medium  
**Impact:** Data siswa terpisah, maintenance susah

**Penyebab:**
- Ada 2 table terpisah: `profiles` (untuk login) dan `attendance_students` (untuk absensi)
- Tidak ada sinkronisasi antara keduanya
- Teacher tidak bisa "Tambah Siswa" dari halaman Data Siswa

**Yang Perlu Diperbaiki:**
1. **Option A (Recommended):** Sinkronkan kedua table
   - Ketika student register → auto create entry di `attendance_students`
   - Halaman Absensi query dari `profiles` WHERE role='student'
   - Hapus table `attendance_students` (redundant)

2. **Option B:** Tetap pisah, tapi buat sync mechanism
   - Buat button "Sync Students" di halaman Attendance
   - Query semua students dari `profiles`, insert ke `attendance_students` jika belum ada

3. **Option C:** Buat halaman "Tambah Siswa" untuk teacher
   - Teacher bisa manual add student ke system
   - Form: Name, Username, Password (auto-generated), Kelas
   - Create di `profiles` dan `attendance_students` sekaligus

---

## 🎯 PRIORITY ORDER (Rekomendasi)

### HIGH PRIORITY (Kerjakan Dulu)
1. **Problem 2: Bank Soal** - Paling critical karena mempengaruhi core functionality
2. **Problem 1: Jurnal Siswa** - Data hilang, bad UX

### MEDIUM PRIORITY
3. **Problem 4: Data Siswa + Absensi** - Architecture issue, tapi masih bisa workaround
4. **Problem 3: Layanan BK** - Feature baru, belum banyak yang pakai

---

## 📂 FILES YANG PERLU DIUBAH

### Problem 1: Jurnal Siswa
- `database/` - Create migration for journals table
- `api/student.js` - Add journal endpoints
- `src/pages/student/StudentJournal.jsx` - Integrate with API
- `src/lib/api.js` - Add journal methods

### Problem 2: Bank Soal
- `database/seed_missions.sql` - Seed default 6 missions
- `api/teacher.js` - Check missions endpoints
- `src/pages/teacher/QuestionBank.jsx` - Check re-fetch logic
- `src/pages/teacher/MissionEditor.jsx` - Check save logic
- `src/hooks/useMissionProgress.js` - Ensure fetch from API

### Problem 3: Layanan BK
- `database/` - Create counseling_requests table
- `api/student.js` - Add POST /counseling
- `api/teacher.js` - Add GET /counseling, PUT /counseling/:id
- `src/pages/student/StudentJournal.jsx` - Integrate API
- `src/pages/teacher/CounselingPage.jsx` - Display requests
- `src/lib/api.js` - Add counseling methods

### Problem 4: Data Siswa + Absensi
- `src/pages/teacher/StudentData.jsx` - Add "Tambah Siswa" button
- `src/pages/teacher/AttendancePage.jsx` - Query from profiles
- `api/teacher.js` - Add POST /students endpoint (optional)
- `database/` - Migration to sync or merge tables (optional)

---

## 🚀 NEXT STEPS

1. **Pilih approach:** Mau fix semua sekaligus atau satu-satu?
2. **Diskusi priority:** Setuju dengan urutan priority di atas?
3. **Start dengan Problem 2** (Bank Soal) karena paling critical
4. **Lalu Problem 1** (Jurnal)
5. **Terakhir Problem 3 & 4**

---

## ⏱️ ESTIMASI WAKTU

- Problem 2 (Bank Soal): ~30 menit
- Problem 1 (Jurnal): ~45 menit
- Problem 4 (Data Siswa): ~30 menit  
- Problem 3 (Layanan BK): ~45 menit

**Total: ~2.5 jam** untuk fix semua

---

## ✅ CHECKLIST

- [ ] Fix Bank Soal (Edit/Tambah tidak tersimpan)
- [ ] Fix Jurnal Siswa (Data hilang ketika refresh)
- [ ] Fix Data Siswa + Absensi (Sinkronisasi)
- [ ] Fix Layanan BK + Konsultasi (Integrasi)

---

**Ready to start?** Kasih tahu mau mulai dari Problem yang mana! 🚀
