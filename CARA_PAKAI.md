# 🚀 Cara Menjalankan Aplikasi Sahabat BK

## ✅ Backend & Frontend Sudah Berfungsi!

Backend sudah ditest dan berfungsi 100%:
- ✅ Register siswa: BERHASIL
- ✅ Login siswa: BERHASIL  
- ✅ Password validation: BERHASIL
- ✅ Database SQLite: BERHASIL

---

## 📋 Langkah-Langkah Menjalankan

### **Opsi 1: Cara Cepat (Pakai Batch File)**

**Double-click file ini:**
```
START_SEMUA.bat
```

File ini akan:
1. Start Backend (port 3002)
2. Start Frontend (port 5173)
3. Otomatis membuka 2 terminal

---

### **Opsi 2: Manual (Step by Step)**

#### **1. Start Backend**

Buka terminal baru, jalankan:
```bash
cd server
node server.js
```

Tunggu sampai muncul:
```
✅ SQLite Database initialized
🚀 Server berjalan di http://localhost:3002
📱 Akses dari HP: http://192.168.1.10:3002
```

#### **2. Start Frontend**

Buka terminal baru lagi, jalankan:
```bash
npm run dev
```

Tunggu sampai muncul:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.10:5173/
```

---

## 🌐 URL Akses

**Di Laptop:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002`

**Di HP (via WiFi):**
- Frontend: `http://192.168.1.10:5173`
- Backend: `http://192.168.1.10:3002`

---

## 👤 Cara Daftar & Login

### **Daftar Akun Siswa:**
1. Buka aplikasi di browser
2. Klik **"Daftar"** → **"Siswa"**
3. Isi form:
   - Nama Lengkap
   - Username (unique, tanpa spasi)
   - Kelas (contoh: 7A, 8B)
   - Jenis Kelamin (Laki-laki/Perempuan)
   - Password (minimal 8 karakter)
4. Klik **"Daftar"**
5. Otomatis login dan masuk dashboard

### **Login:**
1. Klik **"Masuk"** → **"Siswa"**
2. Masukkan:
   - Username (yang tadi didaftarkan)
   - Password (yang tadi dibuat)
3. Klik **"Masuk"**
4. Berhasil masuk dashboard!

### **Daftar Akun Guru:**
1. Klik **"Daftar"** → **"Guru BK"**
2. Isi form:
   - Nama Lengkap
   - Email
   - Nama Sekolah
   - Password (minimal 8 karakter)
3. Klik **"Buat Akun Guru BK"**

---

## 🔧 Troubleshooting

### **Problem: "Failed to fetch"**

**Penyebab:** Backend belum jalan atau port 3002 dipakai aplikasi lain

**Solusi:**
```bash
# Stop semua node process
taskkill /F /IM node.exe

# Start backend lagi
cd server
node server.js
```

### **Problem: "Port 3002 already in use"**

**Solusi:**
```bash
# Cari process yang pakai port 3002
netstat -ano | findstr :3002

# Kill process (ganti PID dengan hasil di atas)
taskkill /F /PID [PID]

# Start backend lagi
cd server
node server.js
```

### **Problem: Password salah terus**

**Penyebab:** Mungkin daftar dengan backend mati, lalu login dengan backend hidup

**Solusi:**
```bash
# Hapus database lama
cd server
del database.sqlite

# Start backend (database baru otomatis dibuat)
node server.js

# Daftar ulang dari awal
```

---

## 📊 Cek Backend Jalan atau Tidak

Buka browser, akses:
```
http://192.168.1.10:3002/api/auth/login/student
```

Kalau muncul:
- ✅ `{"error":"Username dan password wajib diisi"}` → Backend JALAN
- ❌ "This site can't be reached" → Backend MATI

---

## 🗄️ Database

**Lokasi:** `server/database.sqlite`

**Info:**
- Type: SQLite (file-based, offline)
- Size: ~100KB (awal)
- Auto-created saat backend start
- Data tersimpan permanen

**Lihat isi database:**
1. Install DB Browser for SQLite
2. Open file `server/database.sqlite`
3. Browse tables: `profiles`, `student_progress`, `mission_progress`

---

## 🔐 Keamanan

✅ **Sudah Aman:**
- Password di-hash dengan bcrypt
- JWT token untuk authentication
- Username unique validation
- SQL injection protection

⚠️ **Belum (untuk Production):**
- HTTPS (masih HTTP)
- Rate limiting (anti brute force)
- Email verification
- Password reset

---

## 🎯 Mode Deployment

**Sekarang (Development):**
- Backend: SQLite + Express.js
- Frontend: Vite dev server
- Network: Local WiFi only

**Nanti (Production - Vercel + Supabase):**
- Backend: Supabase (Postgres + Auth)
- Frontend: Vercel (Static hosting)
- Network: Internet (global access)

---

## 📞 Bantuan

**Backend tidak jalan?**
1. Pastikan Node.js terinstall: `node --version`
2. Pastikan di folder `server`: `cd server`
3. Install dependencies: `npm install`
4. Jalankan: `node server.js`

**Frontend tidak jalan?**
1. Pastikan di root folder: `cd ..`
2. Install dependencies: `npm install`
3. Jalankan: `npm run dev`

**Masih error?**
- Cek file `.env.local` ada dan isinya benar
- Cek file `server/.env` ada dan isinya benar
- Restart laptop (sering solve masalah aneh)

---

## ✨ Status Fitur

**✅ Sudah Jalan:**
- Register & Login (Siswa & Guru)
- Dashboard Siswa (Mode Individu & Kelompok)
- Peta Petualangan (6 misi)
- Mode Kelompok (3 studi kasus, 4 misi + challenge)
- Progressive unlock system
- XP & Coins system
- Mission progress tracking
- Teacher dashboard
- Bank Soal (Individu & Kelompok)
- Preview Game untuk guru

**🚧 Belum:**
- Edit soal (UI sudah ada, logic belum)
- Reports & Analytics (UI sudah ada, data dummy)
- Real-time collaboration
- Notifikasi

---

**Selamat menggunakan Sahabat BK! 🎉**
