# 🧪 Testing Backend API - Panduan Lengkap

## 📋 Checklist Testing

### ✅ Persiapan
- [ ] Backend berjalan di `http://localhost:3002`
- [ ] Frontend berjalan di `http://localhost:5173`
- [ ] File `.env` sudah ada dengan `VITE_API_URL=http://192.168.1.10:3002/api`
- [ ] Sudah punya akun teacher (jika belum, daftar dulu)

---

## 🔧 Cara Memulai

### 1. **Start Backend & Frontend**
```bash
# Windows - Jalankan semua sekaligus
START_SEMUA.bat

# Atau manual:
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

### 2. **Cek Backend Running**
Buka browser: `http://localhost:3002/api/teacher/missions`

**Expected**: Error 401 "Token tidak ditemukan" (ini NORMAL, artinya backend jalan)

---

## 🧪 Test Case 1: Fetch Missions (Bank Soal Individu)

### **Langkah:**
1. Login sebagai **Teacher**
2. Klik menu **"Bank Soal"**
3. Pastikan di tab **"Bank Soal Individu"**

### **Expected Result:**
- ✅ Loading spinner muncul sebentar
- ✅ Muncul list misi (bisa dari demo data atau database)
- ✅ Setiap misi punya tombol: Edit, Duplicate, Delete
- ✅ Console browser menunjukkan: `✅ API Success: /teacher/missions`

### **Jika Gagal:**
- ❌ Loading terus → Cek backend jalan atau tidak
- ❌ Error 401 → Token expired, login ulang
- ❌ Error CORS → Cek backend `cors()` middleware

---

## 🧪 Test Case 2: Delete Mission

### **Langkah:**
1. Di Bank Soal Individu
2. Klik tombol **🗑️ (Trash)** pada salah satu misi
3. Klik **"OK"** pada konfirmasi

### **Expected Result:**
- ✅ Muncul popup konfirmasi "Yakin ingin menghapus?"
- ✅ Setelah OK, misi hilang dari list
- ✅ Muncul alert "Misi berhasil dihapus!"
- ✅ Console browser: `✅ API Success: /teacher/missions/:id`

### **Verifikasi Persistent:**
1. Refresh halaman (F5)
2. Misi yang dihapus **tidak muncul lagi** ✅

### **Verifikasi Database:**
```bash
cd server
sqlite3 database.sqlite
SELECT * FROM missions;
.exit
```

---

## 🧪 Test Case 3: Duplicate Mission

### **Langkah:**
1. Di Bank Soal Individu
2. Klik tombol **📋 (Copy)** pada salah satu misi

### **Expected Result:**
- ✅ Muncul misi baru di paling atas list
- ✅ Judul misi baru = judul asli + " (Copy)"
- ✅ Status misi baru = "Draft" (locked)
- ✅ Muncul alert "Misi berhasil diduplikasi!"
- ✅ Console browser: `✅ API Success: /teacher/missions`

### **Verifikasi Persistent:**
1. Refresh halaman (F5)
2. Misi duplikat **masih ada** ✅

### **Verifikasi Database:**
```bash
cd server
sqlite3 database.sqlite
SELECT id, title, status FROM missions ORDER BY created_at DESC LIMIT 5;
.exit
```

---

## 🧪 Test Case 4: Fetch Case Studies (Bank Soal Kelompok)

### **Langkah:**
1. Di Bank Soal
2. Klik tab **"Bank Soal Kelompok"**

### **Expected Result:**
- ✅ Loading spinner muncul sebentar
- ✅ Muncul 3 studi kasus default:
  - Rani dan Presentasi
  - Budi dan Tugas Kelompok
  - Siti dan Pertemanan
- ✅ Setiap case punya tombol: Edit, Preview, Duplicate, Delete
- ✅ Console browser: `✅ API Success: /teacher/case-studies`

---

## 🧪 Test Case 5: Delete Case Study

### **Langkah:**
1. Di Bank Soal Kelompok
2. Klik tombol **🗑️ (Trash)** pada salah satu studi kasus
3. Klik **"OK"** pada konfirmasi

### **Expected Result:**
- ✅ Muncul popup konfirmasi "Yakin ingin menghapus?"
- ✅ Setelah OK, case hilang dari list
- ✅ Muncul alert "Studi kasus berhasil dihapus!"
- ✅ Console browser: `✅ API Success: /teacher/case-studies/:id`

### **Verifikasi Persistent:**
1. Refresh halaman (F5)
2. Case yang dihapus **tidak muncul lagi** ✅

---

## 🧪 Test Case 6: Duplicate Case Study

### **Langkah:**
1. Di Bank Soal Kelompok
2. Klik tombol **📋 (Copy)** pada salah satu studi kasus

### **Expected Result:**
- ✅ Muncul case baru di paling atas list
- ✅ Judul case baru = judul asli + " (Copy)"
- ✅ Muncul alert "Studi kasus berhasil diduplikasi!"
- ✅ Console browser: `✅ API Success: /teacher/case-studies`

### **Verifikasi Persistent:**
1. Refresh halaman (F5)
2. Case duplikat **masih ada** ✅

---

## 🧪 Test Case 7: Preview Case Study

### **Langkah:**
1. Di Bank Soal Kelompok
2. Klik tombol **👁️ (Preview)** pada salah satu studi kasus

### **Expected Result:**
- ✅ Redirect ke halaman intro case study
- ✅ Tampil sebagai "Preview Guru"
- ✅ Bisa lanjut ke peta misi dan main seperti student

---

## 🧪 Test Case 8: Student Mission Progress

### **Langkah:**
1. Login sebagai **Student**
2. Buka **Dashboard Student**
3. Klik **"Peta Petualangan"**

### **Expected Result:**
- ✅ Tampil 6 misi di peta
- ✅ Mission 1 available (bisa diklik)
- ✅ Mission 2-6 locked (ada ikon gembok)
- ✅ Console browser: `✅ API Success: /student/missions`

### **Complete Mission:**
1. Klik Mission 1
2. Selesaikan semua pertanyaan
3. Klik "Selesai"

### **Expected Result:**
- ✅ Muncul halaman completion dengan confetti
- ✅ XP dan coins bertambah
- ✅ Console: `✅ API Success: /student/missions/complete`
- ✅ Kembali ke peta → Mission 1 ada ⭐ (completed)
- ✅ Mission 2 sekarang **available** (unlock)

---

## 🔍 Debug dengan Console Browser

### **Buka Developer Tools**
- Chrome/Edge: `F12` atau `Ctrl+Shift+I`
- Firefox: `F12` atau `Ctrl+Shift+K`

### **Tab Console - Cek API Calls**
```
🌐 API URL: http://192.168.1.10:3002/api
🔄 API Request: /teacher/missions GET
✅ API Success: /teacher/missions
```

### **Tab Network - Cek Response**
1. Buka tab **Network**
2. Klik request `missions` atau `case-studies`
3. Cek **Response** tab untuk lihat data JSON
4. Cek **Headers** tab untuk lihat status code (200 = OK)

---

## 🐛 Troubleshooting

### ❌ **Error: "Failed to fetch"**
**Penyebab**: Backend tidak jalan atau URL salah

**Solusi**:
```bash
# Cek backend running
cd server
npm start

# Pastikan muncul:
# 🚀 Server berjalan di http://localhost:3002
```

---

### ❌ **Error: "Token tidak ditemukan" atau "Token tidak valid"**
**Penyebab**: Login expired atau logout tidak sempurna

**Solusi**:
1. Logout dari aplikasi
2. Clear localStorage:
   - Buka Console browser
   - Ketik: `localStorage.clear()`
   - Enter
3. Login ulang

---

### ❌ **Misi tidak muncul setelah duplicate**
**Penyebab**: State tidak terupdate atau database error

**Solusi**:
1. Cek console browser untuk error
2. Refresh halaman (F5)
3. Cek database langsung:
```bash
cd server
sqlite3 database.sqlite
SELECT * FROM missions ORDER BY created_at DESC LIMIT 1;
```

---

### ❌ **Delete berhasil tapi muncul lagi setelah refresh**
**Penyebab**: Delete tidak sampai ke database

**Solusi**:
1. Cek console browser saat delete
2. Pastikan ada: `✅ API Success: /teacher/missions/:id`
3. Jika tidak ada, cek backend logs di terminal
4. Pastikan tidak ada error SQL

---

### ❌ **Loading terus menerus**
**Penyebab**: API call timeout atau error

**Solusi**:
1. Buka Console browser
2. Cek error message (biasanya merah)
3. Pastikan backend jalan
4. Cek network di Dev Tools (tab Network)

---

## 📊 Verifikasi Database Langsung

### **Check Missions Table:**
```bash
cd server
sqlite3 database.sqlite

# Lihat semua misi
SELECT * FROM missions;

# Lihat misi terakhir dibuat
SELECT id, title, status, created_at FROM missions ORDER BY created_at DESC LIMIT 5;

# Count total misi
SELECT COUNT(*) FROM missions;
```

### **Check Case Studies Table:**
```bash
# Lihat semua case studies
SELECT * FROM case_studies;

# Lihat case terakhir dibuat
SELECT id, title, status, created_at FROM case_studies ORDER BY created_at DESC LIMIT 3;

# Count total cases
SELECT COUNT(*) FROM case_studies;
```

### **Check Mission Progress (Student):**
```bash
# Lihat progress semua student
SELECT p.name, mp.mission_id, mp.status, mp.score 
FROM mission_progress mp 
JOIN profiles p ON mp.student_id = p.id;

# Count completed missions per student
SELECT student_id, COUNT(*) as completed 
FROM mission_progress 
WHERE status = 'completed' 
GROUP BY student_id;
```

### **Exit SQLite:**
```
.exit
```

---

## ✅ Checklist Akhir

Setelah semua test case selesai, pastikan:

- [x] Fetch missions dari database ✅
- [x] Delete mission berhasil & persistent ✅
- [x] Duplicate mission berhasil & persistent ✅
- [x] Fetch case studies dari database ✅
- [x] Delete case study berhasil & persistent ✅
- [x] Duplicate case study berhasil & persistent ✅
- [x] Preview case study berfungsi ✅
- [x] Student mission progress tersimpan ✅
- [x] XP & coins update setelah complete mission ✅
- [x] Mission unlock bertahap ✅

---

## 🎉 Jika Semua Berhasil

**Selamat! Backend API sudah berfungsi sempurna!** 🎊

Next steps:
1. Buat halaman **Mission Editor** untuk create/edit missions
2. Buat halaman **Case Study Editor** untuk create/edit case studies
3. Implement **Questions CRUD** untuk manage soal-soal
4. Add **Toast notifications** untuk replace alert()
5. Add **error boundary** dan better error handling

---

## 📞 Bantuan

Jika ada error yang tidak bisa diselesaikan:
1. Screenshot error di console browser
2. Copy paste error message dari terminal backend
3. Cek file `FITUR_BACKEND_API.md` untuk dokumentasi lengkap
