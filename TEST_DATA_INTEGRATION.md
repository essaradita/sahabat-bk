# 🧪 Testing Data Integration - Step by Step

## 🎯 GOAL
Memastikan semua data sudah saling terhubung dengan benar di semua menu teacher.

---

## 📝 TEST SCENARIO 1: Siswa Daftar & Main Game

### Setup:
1. Pastikan backend jalan: `cd server && npm start`
2. Pastikan frontend jalan: `npm run dev`

### Steps:
```
1. Buka browser: http://localhost:5174
2. Klik "Daftar Akun Siswa"
3. Isi form:
   - Nama: Andi Pratama
   - Username: andi123
   - Password: password123
   - Kelas: 8A
   - Gender: Laki-laki
4. Klik "Daftar"
5. Login dengan username & password di atas
6. Buka "Peta Petualangan"
7. Klik Mission 1 "Mengenal Diriku"
8. Selesaikan semua pertanyaan
9. Klik "Selesai"
10. Cek XP bertambah (seharusnya +20 XP)
11. Logout
```

### Verify as Teacher:
```
1. Login sebagai Teacher (guru@test.com / password123)
2. Cek Dashboard:
   ✓ Total Siswa = 1
   ✓ Avg Penyelesaian > 0%
   
3. Buka "Data Siswa" → Tab "Data Akun Game"
   ✓ Andi Pratama muncul
   ✓ Kelas = 8A
   ✓ Level = 1
   ✓ Misi Selesai = 1
   
4. Buka "Laporan & Analitik"
   ✓ Total Siswa = 1
   ✓ Misi Selesai = 1
   ✓ Rata-rata Nilai > 0%
   ✓ Progress per siswa: Andi muncul dengan persentase
```

**EXPECTED RESULT**: ✅ Semua data Andi muncul di Dashboard, Data Siswa, dan Laporan

---

## 📝 TEST SCENARIO 2: Tambah Siswa untuk Absensi

### Steps:
```
1. Login teacher
2. Buka "Data Siswa"
3. Klik tab "Data Absensi"
4. Klik "+ Tambah Siswa"
5. Isi form:
   - Nama: Budi Santoso
   - Kelas: 8A
6. Klik "Simpan"
7. Tambah siswa lagi:
   - Nama: Citra Dewi
   - Kelas: 8B
8. Simpan
```

### Verify:
```
1. Masih di tab "Data Absensi"
   ✓ Budi Santoso muncul (Kelas 8A)
   ✓ Citra Dewi muncul (Kelas 8B)
   
2. Refresh browser (F5)
   ✓ Data masih ada (persistent)
   
3. Buka "Absensi Digital"
   ✓ Dropdown kelas ada: 8A, 8B
   ✓ Pilih 8A → Hanya Budi yang muncul
   ✓ Pilih 8B → Hanya Citra yang muncul
```

**EXPECTED RESULT**: ✅ Siswa yang ditambah di "Data Siswa" muncul di "Absensi Digital"

---

## 📝 TEST SCENARIO 3: Isi Absensi & Cek Laporan

### Steps:
```
1. Login teacher
2. Buka "Absensi Digital"
3. Pilih Kelas: 8A
4. Pilih Tanggal: Hari ini
5. Isi absensi:
   - Budi Santoso: Klik "Hadir"
6. Pilih Kelas: 8B
7. Isi absensi:
   - Citra Dewi: Klik "Sakit"
8. Klik "Simpan Absensi"
9. Alert: "Absensi berhasil disimpan!"
```

### Verify:
```
1. Refresh browser
   ✓ Status Budi = Hadir (hijau)
   ✓ Status Citra = Sakit (kuning)
   
2. Klik tab "Rekap"
   ✓ Muncul history hari ini
   ✓ Kelas 8A: 1 Hadir, 0 Izin, 0 Sakit, 0 Alpa
   (NOTE: Ini per kelas, jadi Citra tidak termasuk)
   
3. Buka "Laporan & Analitik"
   ✓ Kehadiran: 50% (1 hadir dari 2 total)
```

**EXPECTED RESULT**: ✅ Absensi tersimpan dan update Laporan

---

## 📝 TEST SCENARIO 4: Bank Soal CRUD

### Steps:
```
1. Login teacher
2. Buka "Bank Soal"
3. Tab "Bank Soal Individu"
4. Cari misi "Mengenal Diriku"
5. Klik icon Copy (📋)
6. Alert: "Misi berhasil diduplikasi!"
7. Refresh browser (F5)
8. Cek misi copy muncul: "Mengenal Diriku (Copy)"

9. Klik icon Trash (🗑️) pada misi copy
10. Confirm: OK
11. Alert: "Misi berhasil dihapus!"
12. Refresh browser (F5)
13. Misi copy sudah hilang
```

### Verify:
```
✓ Duplicate → Data tersimpan di database
✓ Delete → Data terhapus dari database
✓ Refresh → Data persistent
```

**EXPECTED RESULT**: ✅ CRUD Bank Soal berfungsi dan persistent

---

## 📝 TEST SCENARIO 5: Multiple Students & Reports

### Setup - Tambah lebih banyak siswa:
```
1. Register 3 siswa lagi:
   - Dewi Lestari (dewi / password123 / 8A)
   - Eka Putra (eka / password123 / 8B)
   - Fajar Rizki (fajar / password123 / 8A)
   
2. Login masing-masing siswa:
   - Dewi: Selesaikan Mission 1
   - Eka: Selesaikan Mission 1 & 2
   - Fajar: Tidak main (0 misi)
```

### Verify as Teacher:
```
1. Dashboard:
   ✓ Total Siswa = 4 (Andi + Dewi + Eka + Fajar)
   ✓ Avg Penyelesaian = (1+1+2+0)/4/6*100 = 16.67%
   
2. Data Siswa - Tab Akun Game:
   ✓ 4 siswa muncul
   ✓ Andi: 1 misi
   ✓ Dewi: 1 misi
   ✓ Eka: 2 misi
   ✓ Fajar: 0 misi
   
3. Filter Kelas 8A:
   ✓ Hanya Andi, Dewi, Fajar yang muncul
   
4. Laporan & Analitik:
   ✓ Total Siswa = 4
   ✓ Misi Selesai = 4 (1+1+2+0)
   ✓ Penyelesaian Misi per Siswa:
     - Andi: 16.67%
     - Dewi: 16.67%
     - Eka: 33.33%
     - Fajar: 0%
```

**EXPECTED RESULT**: ✅ Semua data akurat dengan multiple students

---

## 🔍 DEBUGGING CHECKLIST

Jika ada yang salah, cek:

### 1. Browser Console (F12)
```javascript
// Cek error di console
console.log(errors)

// Cek localStorage
console.log(localStorage.getItem('attendance_students'))

// Cek session
console.log(localStorage.getItem('sahabatbk_session'))
```

### 2. Backend Logs
```
Terminal backend harus menunjukkan:
✅ API Success: /teacher/students
✅ API Success: /teacher/missions
✅ API Success: /teacher/case-studies
```

### 3. Database Verification
```bash
cd server
sqlite3 database.sqlite

# Check students
SELECT name, kelas, username FROM profiles WHERE role='student';

# Check progress
SELECT p.name, sp.xp, sp.level, sp.coins 
FROM profiles p 
JOIN student_progress sp ON p.id = sp.student_id;

# Check missions completed
SELECT p.name, COUNT(*) as completed
FROM mission_progress mp
JOIN profiles p ON mp.student_id = p.id
WHERE mp.status = 'completed'
GROUP BY mp.student_id;

.exit
```

### 4. localStorage Verification
```javascript
// Di browser console
const attendance = JSON.parse(localStorage.getItem('attendance_students'))
console.log(attendance)

// Harus berisi array siswa dengan structure:
// [{ id, name, kelas, attendance: [{date, status}] }]
```

---

## ✅ ACCEPTANCE CRITERIA

System dinyatakan "SUDAH SESUAI SEMUA" jika:

- [x] ✅ Siswa daftar → Muncul di Dashboard, Data Siswa, Laporan
- [x] ✅ Siswa selesai misi → XP bertambah, muncul di Laporan
- [x] ✅ Guru tambah siswa absensi → Muncul di Absensi Digital
- [x] ✅ Guru isi absensi → Tersimpan, muncul di Rekap & Laporan
- [x] ✅ Bank Soal CRUD → Persistent di database
- [x] ✅ Filter kelas berfungsi di semua halaman
- [x] ✅ Refresh browser → Data tidak hilang
- [x] ✅ Multiple students → Semua data akurat
- [x] ✅ Tidak ada demo/dummy data yang muncul

---

## 📊 TESTING REPORT TEMPLATE

Setelah test, isi report ini:

```
DATE: __________
TESTER: __________

SCENARIO 1: Siswa Daftar & Main Game
□ Pass  □ Fail
Notes: ___________

SCENARIO 2: Tambah Siswa Absensi
□ Pass  □ Fail
Notes: ___________

SCENARIO 3: Isi Absensi & Laporan
□ Pass  □ Fail
Notes: ___________

SCENARIO 4: Bank Soal CRUD
□ Pass  □ Fail
Notes: ___________

SCENARIO 5: Multiple Students
□ Pass  □ Fail
Notes: ___________

BUGS FOUND:
1. ___________
2. ___________

OVERALL STATUS:
□ All Pass - Ready for Production
□ Some Fail - Need Fixes
□ Major Issues - Need Refactor
```

---

## 🎉 EXPECTED FINAL RESULT

Setelah semua test pass:

✅ **Dashboard**: Real data dari database
✅ **Data Siswa**: 2 tabs dengan sumber berbeda, semua real
✅ **Bank Soal**: CRUD persistent, no demo data
✅ **Absensi Digital**: Terintegrasi dengan Data Siswa
✅ **Laporan**: Aggregasi dari database + localStorage

**SISTEM SUDAH FULLY INTEGRATED!** 🚀
