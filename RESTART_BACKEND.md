# ⚠️ PENTING: RESTART BACKEND UNTUK UPDATE DATABASE

## ❗ Error yang Muncul:
```
Gagal memuat data: Unexpected token '<'; "<!DOCTYPE "... is not valid JSON
```

## 🔍 Penyebab:
Backend belum restart setelah update code. Database tables baru (`attendance_students`, `attendance_records`) belum dibuat.

---

## ✅ SOLUSI: Restart Backend

### **Cara 1: Manual Restart**

```bash
# 1. Stop backend yang sekarang
# Tekan Ctrl+C di terminal backend

# 2. Start ulang
cd server
npm start

# Harus muncul:
# ✅ SQLite Database initialized
# 🚀 Server berjalan di http://localhost:3002
```

### **Cara 2: Pakai START_SEMUA.bat**

```bash
# 1. Close semua terminal
# 2. Double-click: START_SEMUA.bat
```

---

## 🧪 Verifikasi Database Tables

Setelah restart, cek apakah tables sudah dibuat:

```bash
cd server
sqlite3 database.sqlite

# Cek tables
.tables

# Harus ada:
# attendance_records
# attendance_students
# case_studies
# mission_progress
# missions
# profiles
# questions
# student_progress

# Exit
.exit
```

---

## 🔄 Test Setelah Restart

### **1. Test Data Siswa - Tab Absensi**
```
1. Login Teacher
2. Data Siswa → Tab "Data Absensi"
3. Klik "+ Tambah Siswa"
4. Isi: Nama = "Test", Kelas = "8A"
5. Simpan
6. ✅ Harus berhasil (tidak error)
```

### **2. Test Absensi Digital**
```
1. Absensi Digital
2. Pilih kelas 8A
3. ✅ Test muncul di list
4. Klik "Hadir"
5. Simpan
6. ✅ Harus berhasil
```

### **3. Test Edit Case Study**
```
1. Bank Soal → Tab Kelompok
2. Klik "Edit" pada case study
3. ✅ Form muncul (tidak 404)
4. Edit dan simpan
5. ✅ Berhasil update
```

---

## 🐛 Jika Masih Error

### **Error 1: "Cannot find module"**
```bash
cd server
npm install
npm start
```

### **Error 2: "Port 3002 already in use"**
```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Lalu start ulang
npm start
```

### **Error 3: Database locked**
```bash
# Stop backend (Ctrl+C)
cd server
del database.sqlite-journal
npm start
```

### **Error 4: "ENOENT: no such file"**
```bash
# Pastikan di folder yang benar
cd c:\Users\ASUS\SAHABAT BK\server
npm start
```

---

## 📊 Status Checklist

Setelah restart, pastikan:

- [ ] Backend jalan di port 3002
- [ ] Console backend menunjukkan: "✅ SQLite Database initialized"
- [ ] Tables baru sudah ada di database
- [ ] Frontend bisa tambah siswa absensi
- [ ] Frontend bisa edit case study
- [ ] Tidak ada error "Unexpected token"

---

## 🎯 Quick Commands

### **Stop Backend**
```
Ctrl+C di terminal backend
```

### **Start Backend**
```bash
cd server
npm start
```

### **Start Frontend**
```bash
npm run dev
```

### **Start Semua**
```bash
START_SEMUA.bat
```

---

## ✅ Setelah Restart Berhasil

Sistem akan:
✅ Create tables baru otomatis
✅ API endpoints ready
✅ Data Siswa - Tab Absensi bisa tambah siswa
✅ Absensi Digital load data dari database
✅ Edit Case Study berfungsi
✅ Tidak ada error JSON lagi

**RESTART BACKEND DULU, BARU TEST LAGI!** 🚀
