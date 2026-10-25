# 📋 CHECKLIST TEST SEMUA MENU - SAHABAT BK

Gunakan checklist ini untuk memastikan semua menu berfungsi dengan baik.

---

## 🎓 STUDENT MENU

### 1. Authentication
- [ ] **Register Student** - Buka `/student/register`
  - Isi: Name, Username, Password, Kelas, Gender
  - Klik Register
  - **Expected:** Redirect ke dashboard student dengan profile tersimpan

- [ ] **Login Student** - Buka `/student/login`
  - Isi: Username, Password
  - Klik Login
  - **Expected:** Redirect ke dashboard student

### 2. Dashboard Student
- [ ] **View Dashboard** - Buka `/student/dashboard`
  - **Expected:** Lihat profile, XP, Level, Coins
  - **Expected:** Lihat tombol "Mulai Petualangan"

### 3. Adventure Map (Peta Misi)
- [ ] **View Map** - Buka `/student/map`
  - **Expected:** Lihat 6 misi
  - **Expected:** Mission 1 terbuka (not locked)
  - **Expected:** Mission 2-6 terkunci (locked) jika belum ada yang completed

### 4. Mission Detail
- [ ] **View Mission 1** - Klik Mission 1 di peta
  - **Expected:** Lihat detail misi (tujuan, reward XP/coin, estimasi waktu)
  - **Expected:** Tombol "Mulai Misi" aktif (tidak disabled)

- [ ] **Try to View Locked Mission** - Klik Mission 2 (jika locked)
  - **Expected:** Lihat detail misi
  - **Expected:** Badge "Misi Terkunci" muncul
  - **Expected:** Tombol "Mulai Misi" tidak ada / disabled

### 5. Play Mission
- [ ] **Play Mission 1** - Klik "Mulai Misi" di Mission 1
  - **Expected:** Redirect ke halaman game `/student/mission/mission-1/play`
  - **Expected:** Lihat cerita intro
  - **Expected:** Lihat soal-soal interaktif
  - **Expected:** Bisa jawab soal dan dapat feedback

- [ ] **Complete Mission 1** - Selesaikan semua soal
  - **Expected:** Redirect ke halaman complete
  - **Expected:** Lihat celebrasi, XP earned, coin earned
  - **Expected:** Tombol "Kembali ke Peta"

### 6. Mission Unlock (CRITICAL TEST)
- [ ] **Verify Mission 2 Unlocked** - Klik "Kembali ke Peta" setelah selesai Mission 1
  - **Expected:** Mission 2 sekarang UNLOCKED (tidak ada gembok)
  - **Expected:** Mission 1 menunjukkan status "Completed" atau badge ✅

- [ ] **Play Mission 2** - Klik Mission 2
  - **Expected:** Bisa klik "Mulai Misi"
  - **Expected:** Game Mission 2 bisa dimainkan

### 7. Profile
- [ ] **View Profile** - Klik icon profile
  - **Expected:** Lihat nama, username, kelas, avatar
  - **Expected:** Lihat total XP, Level, Coins (updated setelah complete mission)

---

## 👨‍🏫 TEACHER MENU

### 1. Authentication
- [ ] **Register Teacher** - Buka `/teacher/register`
  - Isi: Name, Email, Password, School
  - Klik Register
  - **Expected:** Redirect ke dashboard teacher

- [ ] **Login Teacher** - Buka `/teacher/login`
  - Isi: Email, Password
  - Klik Login
  - **Expected:** Redirect ke dashboard teacher

### 2. Dashboard Teacher
- [ ] **View Dashboard** - Buka `/teacher/dashboard`
  - **Expected:** Lihat welcome card dengan nama guru
  - **Expected:** Lihat statistik: Total Siswa, Kelas Aktif, Misi Aktif, % Penyelesaian
  - **Expected:** Lihat quick action menu (Bank Soal Individu, Bank Soal Kelompok, Preview Game)
  - **Expected:** Lihat daftar "Aktivitas Terbaru" (jika ada siswa)

- [ ] **Verify Real Mission Counts (CRITICAL)** - Lihat dashboard
  - **Expected:** Jumlah misi completed di statistik adalah REAL dari database
  - **Expected:** BUKAN hardcoded 0
  - **Expected:** Jika siswa sudah complete misi, angkanya muncul

### 3. Student Data
- [ ] **View Student Data** - Buka `/teacher/students`
  - **Expected:** Lihat daftar semua siswa yang terdaftar
  - **Expected:** Setiap siswa menunjukkan: Nama, Username, Kelas, Level, XP, Coins
  - **Expected:** Kolom "Misi Selesai" menunjukkan angka REAL (bukan 0)

### 4. Bank Soal Individu (Missions)
- [ ] **View Missions** - Klik "Bank Soal Individu" atau buka `/teacher/question-bank`
  - **Expected:** Lihat daftar 6 misi (mission-1 sampai mission-6)
  - **Expected:** Setiap misi menunjukkan: Title, Category, Difficulty, XP, Coins

- [ ] **Create New Mission** - Klik tombol "Tambah Misi Baru"
  - Isi form: Title, Description, Category, Difficulty, XP Reward, Coin Reward
  - Klik "Simpan"
  - **Expected:** Misi baru muncul di daftar
  - **Expected:** Alert success muncul

- [ ] **Edit Mission** - Klik icon edit di salah satu misi
  - Ubah title atau field lainnya
  - Klik "Simpan"
  - **Expected:** Perubahan tersimpan
  - **Expected:** Alert success muncul

- [ ] **Delete Mission** - Klik icon delete di salah satu misi
  - Konfirmasi delete
  - **Expected:** Misi terhapus dari daftar
  - **Expected:** Alert success muncul

### 5. Bank Soal Kelompok (Case Studies)
- [ ] **View Case Studies** - Klik "Bank Soal Kelompok" atau buka `/teacher/case-studies`
  - **Expected:** Lihat daftar studi kasus untuk mode kelompok
  - **Expected:** Setiap case study menunjukkan: Title, Category, Story

- [ ] **Create Case Study** - Klik tombol "Tambah Studi Kasus"
  - Isi form: Title, Description, Category, Story, Missions Count
  - Klik "Simpan"
  - **Expected:** Case study baru muncul di daftar

- [ ] **Edit Case Study** - Klik icon edit
  - Ubah data
  - Klik "Simpan"
  - **Expected:** Perubahan tersimpan

- [ ] **Delete Case Study** - Klik icon delete
  - Konfirmasi delete
  - **Expected:** Case study terhapus

### 6. Class Management
- [ ] **View Classes** - Buka `/teacher/classes`
  - **Expected:** Lihat daftar kelas yang sudah dibuat
  - **Expected:** Setiap kelas menunjukkan: Name, Grade, Teacher Name, Student Count

- [ ] **Create Class** - Klik tombol "Tambah Kelas"
  - Isi: Name (e.g., "Kelas 7A"), Grade (e.g., 7), Teacher Name, Student Count
  - Klik "Simpan"
  - **Expected:** Kelas baru muncul di daftar

- [ ] **Edit Class** - Klik icon edit
  - Ubah data
  - Klik "Simpan"
  - **Expected:** Perubahan tersimpan

- [ ] **Delete Class** - Klik icon delete
  - Konfirmasi delete
  - **Expected:** Kelas terhapus

### 7. Attendance Management
- [ ] **View Attendance** - Buka `/teacher/attendance`
  - **Expected:** Lihat daftar siswa untuk absensi
  - **Expected:** Lihat kalender atau form untuk mark attendance

- [ ] **Add Attendance Student** - Klik "Tambah Siswa"
  - Isi: Name, Kelas
  - Klik "Simpan"
  - **Expected:** Siswa baru muncul di daftar attendance

- [ ] **Mark Attendance** - Pilih siswa dan tanggal
  - Pilih status: Hadir / Izin / Sakit / Alpa
  - Klik "Simpan"
  - **Expected:** Attendance tersimpan
  - **Expected:** Status muncul di record

- [ ] **View Attendance Records** - Lihat history absensi
  - **Expected:** Lihat summary per tanggal
  - **Expected:** Lihat detail per siswa

- [ ] **Delete Attendance Student** - Klik icon delete di siswa
  - Konfirmasi delete
  - **Expected:** Siswa terhapus dari attendance list

### 8. Preview Game
- [ ] **Preview as Teacher** - Klik "Preview Game" di dashboard
  - **Expected:** Redirect ke preview mode (tampilan seperti siswa)
  - **Expected:** Bisa lihat peta misi
  - **Expected:** Bisa klik misi dan lihat detail
  - **Expected:** Bisa play game (demo mode, tidak save progress)

---

## 🔧 TECHNICAL CHECKS

### API Health Check
- [ ] **Check API Status** - Buka `/api` di browser
  - **Expected:** Lihat JSON response dengan list 24 endpoints
  - **Expected:** Status "OK"
  - **Expected:** `postgres_url: ✅ SET` dan `jwt_secret: ✅ SET`

### Environment Variables
- [ ] **Check Env Vars** - Buka `/api/debug` di browser
  - **Expected:** `POSTGRES_URL: ✅ SET`
  - **Expected:** `JWT_SECRET: ✅ SET`
  - **Expected:** Instructions: "✅ Environment variables OK!"

### Database Connection
- [ ] **Test Database** - Login student/teacher berhasil
  - **Expected:** Jika login berhasil, database connection OK
  - **Expected:** Jika error, check Vercel logs

---

## 🎯 CRITICAL TESTS (MUST PASS)

### ✅ Test 1: Student Mission Sequential Unlock
1. Register/Login sebagai student baru
2. Complete Mission 1
3. Kembali ke peta
4. **VERIFY:** Mission 2 UNLOCKED (tidak ada gembok)
5. Klik Mission 2
6. **VERIFY:** Bisa play Mission 2

**Status:** [ ] PASS / [ ] FAIL

### ✅ Test 2: Teacher Dashboard Real Mission Counts
1. Login sebagai teacher
2. Buka dashboard
3. **VERIFY:** Statistik "Penyelesaian" menunjukkan % real (bukan 0%)
4. Buka Student Data
5. **VERIFY:** Kolom "Misi Selesai" menunjukkan angka real dari database

**Status:** [ ] PASS / [ ] FAIL

### ✅ Test 3: Mission Completion Saves to Database
1. Login sebagai student
2. Complete Mission 1
3. Logout
4. Login lagi dengan student yang sama
5. Buka peta
6. **VERIFY:** Mission 1 masih menunjukkan status "Completed"
7. **VERIFY:** Mission 2 masih unlocked
8. **VERIFY:** XP dan Coins tersimpan

**Status:** [ ] PASS / [ ] FAIL

### ✅ Test 4: All CRUD Operations Work
**Missions:**
- [ ] Create mission: PASS / FAIL
- [ ] Edit mission: PASS / FAIL
- [ ] Delete mission: PASS / FAIL

**Case Studies:**
- [ ] Create case study: PASS / FAIL
- [ ] Edit case study: PASS / FAIL
- [ ] Delete case study: PASS / FAIL

**Classes:**
- [ ] Create class: PASS / FAIL
- [ ] Edit class: PASS / FAIL
- [ ] Delete class: PASS / FAIL

**Attendance:**
- [ ] Add student: PASS / FAIL
- [ ] Mark attendance: PASS / FAIL
- [ ] View records: PASS / FAIL
- [ ] Delete student: PASS / FAIL

---

## 📊 TEST RESULTS SUMMARY

**Total Tests:** 50+  
**Passed:** ___  
**Failed:** ___  
**Percentage:** ___%

**Critical Tests (4):**
- [ ] Sequential Mission Unlock
- [ ] Real Mission Counts in Dashboard
- [ ] Mission Progress Persisted in Database
- [ ] All CRUD Operations Work

**Status:** [ ] ALL PASS ✅ / [ ] NEEDS FIX ⚠️

---

## 🐛 ISSUES FOUND (If Any)

### Issue 1:
**Menu:** _______________  
**Description:** _______________  
**Expected:** _______________  
**Actual:** _______________  
**Priority:** High / Medium / Low  

### Issue 2:
**Menu:** _______________  
**Description:** _______________  
**Expected:** _______________  
**Actual:** _______________  
**Priority:** High / Medium / Low  

---

## ✅ SIGN-OFF

**Tested By:** _______________  
**Date:** _______________  
**Overall Status:** [ ] APPROVED ✅ / [ ] NEEDS WORK ⚠️  

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
