# 🚀 PANDUAN DEPLOY SAHABAT BK - 100% GRATIS

Deploy **Backend ke Render.com** + **Frontend ke Vercel**

**Total Biaya: $0/bulan** ✅

---

## 📋 CHECKLIST PERSIAPAN

Sebelum mulai, pastikan:
- ✅ Sudah punya account GitHub
- ✅ Sudah install Git di komputer
- ✅ Sudah install Node.js
- ✅ Sistem jalan normal di localhost

---

## 🎯 ARSITEKTUR DEPLOYMENT

```
┌─────────────────────────────────────────────┐
│  User mengakses:                            │
│  https://sahabatbk.vercel.app              │
│         ↓                                   │
│  ┌──────────────────┐                      │
│  │ VERCEL (Frontend) │  100% FREE          │
│  │ React + Vite      │  ✅ No sleep        │
│  └────────┬──────────┘                      │
│           │ API Request                     │
│           ↓                                  │
│  ┌──────────────────┐                      │
│  │ RENDER (Backend)  │  100% FREE          │
│  │ Node.js + SQLite  │  ⚠️ Sleep 15min     │
│  └───────────────────┘                      │
└─────────────────────────────────────────────┘
```

---

# FASE 1: SETUP GIT & GITHUB

## 1.1 Initialize Git (jika belum)

Buka terminal di folder project:

```bash
cd "C:\Users\ASUS\SAHABAT BK"
git init
```

## 1.2 Tambahkan semua file ke Git

```bash
git add .
git commit -m "Initial commit - Sahabat BK ready for deployment"
```

## 1.3 Buat Repository di GitHub

1. Buka https://github.com
2. Login dengan account Anda
3. Klik tombol **[+ New]** → **New repository**
4. Setting repository:
   - **Repository name:** `sahabat-bk`
   - **Visibility:** Private (recommended) atau Public
   - ❌ **JANGAN centang** "Initialize with README"
   - Klik **Create repository**

## 1.4 Push ke GitHub

GitHub akan kasih command, tapi gunakan ini:

```bash
git remote add origin https://github.com/USERNAME/sahabat-bk.git
git branch -M main
git push -u origin main
```

**Ganti `USERNAME` dengan username GitHub Anda!**

✅ **Cek:** Refresh halaman GitHub, semua file sudah ada (kecuali yang di .gitignore)

---

# FASE 2: DEPLOY BACKEND KE RENDER

## 2.1 Buat Account Render

1. Buka https://render.com
2. Klik **Get Started for Free**
3. Sign up dengan **GitHub** (langsung connect!)
4. Authorize Render untuk akses GitHub
5. ✅ Selesai - tidak perlu kartu kredit!

## 2.2 Create New Web Service

1. Di Render Dashboard, klik **[+ New]** → **Web Service**
2. **Connect a repository:**
   - Pilih `sahabat-bk` dari list
   - Atau klik **Configure account** jika tidak muncul
   - Grant akses ke repository tersebut
3. Klik **Connect**

## 2.3 Configure Web Service

**Isi form berikut:**

| Field | Value |
|-------|-------|
| **Name** | `sahabatbk-api` (atau bebas) |
| **Region** | Singapore (terdekat) |
| **Branch** | `main` |
| **Root Directory** | *(kosongkan)* |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start` |
| **Plan** | ✅ **Free** |

## 2.4 Environment Variables

Scroll ke bawah ke section **Environment Variables**, klik **Add Environment Variable**:

**Tambahkan satu per satu:**

```
NODE_ENV = production
PORT = 3002
JWT_SECRET = ganti-dengan-random-string-panjang-minimal-32-karakter
FRONTEND_URL = https://sahabatbk.vercel.app
```

**Cara generate JWT_SECRET yang aman:**

Option 1 - Di terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Option 2 - Online: https://www.uuidgenerator.net/ (ambil 2-3 UUID gabung jadi satu)

**❗ PENTING:** Simpan JWT_SECRET di tempat aman! Jangan sampai hilang!

## 2.5 Add Persistent Disk (untuk Database)

1. Scroll ke **Disks** section
2. Klik **Add Disk**
3. Setting:
   - **Name:** `database-disk`
   - **Mount Path:** `/opt/render/project/src/server`
   - **Size:** 1 GB (gratis)
4. Klik **Add Disk**

## 2.6 Deploy!

1. Scroll ke bawah
2. Klik **Create Web Service**
3. ✅ Render akan otomatis:
   - Clone repository dari GitHub
   - Install dependencies (`npm install`)
   - Start server (`npm run start`)
   - Setup HTTPS dengan SSL gratis

## 2.7 Tunggu Deploy Selesai

**Monitor di Logs tab:**

```
Installing dependencies...
✓ Installed 147 packages
Starting server...
🚀 Server berjalan di http://localhost:3002
✅ SQLite Database initialized
✓ Deploy successful!
```

⏱️ **Waktu:** 3-5 menit pertama kali

## 2.8 Test Backend

Setelah deploy sukses, URL backend Anda:

```
https://sahabatbk-api.onrender.com
```

**Test di browser:**

1. Buka: `https://sahabatbk-api.onrender.com/`
   - Harus muncul:
   ```json
   {
     "status": "OK",
     "message": "SAHABAT BK API Server",
     "version": "1.0.0"
   }
   ```

2. Buka: `https://sahabatbk-api.onrender.com/api/health`
   - Harus muncul:
   ```json
   {
     "status": "healthy",
     "database": "connected"
   }
   ```

✅ **Jika kedua endpoint berhasil → Backend ONLINE!**

❌ **Jika error:**
- Klik tab **Logs** di Render dashboard
- Cari error message berwarna merah
- Screenshot dan minta bantuan

---

# FASE 3: DEPLOY FRONTEND KE VERCEL

## 3.1 Update API URL di Frontend

**PENTING:** Ganti URL API ke backend Render yang baru!

**File:** `src/lib/api.js`

**SEBELUM:**
```javascript
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1'
const API_BASE = isLocalhost ? 'http://localhost:3002' : 
                 `http://${window.location.hostname}:3002`
```

**SESUDAH:**
```javascript
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1'
const API_BASE = isLocalhost 
  ? 'http://localhost:3002' 
  : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://sahabatbk-api.onrender.com')
```

**Ganti `sahabatbk-api` dengan nama service Render Anda!**

## 3.2 Update File .env.production

**File:** `.env.production`

```
VITE_API_URL=https://sahabatbk-api.onrender.com/api
```

**Ganti dengan URL backend Anda!**

## 3.3 Commit Perubahan

```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

## 3.4 Install Vercel CLI

Buka terminal (Command Prompt atau PowerShell):

```bash
npm install -g vercel
```

## 3.5 Login Vercel

```bash
vercel login
```

- Pilih metode login (GitHub recommended)
- Browser akan terbuka
- Authorize Vercel
- Kembali ke terminal

## 3.6 Deploy Frontend

Di terminal, pastikan di folder project:

```bash
cd "C:\Users\ASUS\SAHABAT BK"
vercel
```

**Jawab pertanyaan:**

```
? Set up and deploy "~\SAHABAT BK"? [Y/n] 
→ Y

? Which scope do you want to deploy to?
→ Pilih username/team Anda

? Link to existing project? [y/N]
→ N (pertama kali)

? What's your project's name?
→ sahabatbk (atau sesuai keinginan)

? In which directory is your code located?
→ ./ (tekan Enter)

? Want to override the settings? [y/N]
→ N (tekan Enter)
```

✅ Vercel akan otomatis:
- Detect Vite framework
- Install dependencies
- Build frontend (`npm run build`)
- Upload ke CDN global
- Setup HTTPS gratis

⏱️ **Waktu:** 1-2 menit

## 3.7 Deploy Production

Setelah preview sukses:

```bash
vercel --prod
```

**✅ Frontend URL:**
```
https://sahabatbk.vercel.app
```

*(URL bisa beda tergantung nama project)*

---

# FASE 4: UPDATE CORS DI BACKEND

## 4.1 Update CORS di Render

Frontend Vercel perlu diizinkan akses ke backend Render!

**Edit file:** `server/server.js`

**Cari bagian CORS:**
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
```

**GANTI JADI:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',              // Local dev
    'https://sahabatbk.vercel.app',       // Production frontend
    'https://sahabatbk-*.vercel.app'      // Vercel preview deploys
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
```

**Ganti dengan URL Vercel Anda!**

## 4.2 Commit & Push

```bash
git add server/server.js
git commit -m "Update CORS for Vercel frontend"
git push origin main
```

✅ **Render akan auto-deploy ulang!** (tunggu 2-3 menit)

---

# FASE 5: TESTING PRODUCTION

## 5.1 Test Akses Website

Buka di browser:
```
https://sahabatbk.vercel.app
```

✅ **Harus muncul:**
- Landing page dengan logo Sahabat BK
- Tombol "Guru BK" dan "Siswa"
- Gambar karakter siswa

## 5.2 Test Login Guru

1. Klik tombol **"Guru BK"**
2. Jika belum punya akun, klik **"Daftar"**
3. Isi form registrasi:
   - Nama: Kartika Wulandari
   - Email: kartika@sekolah.sch.id
   - Password: minimal8karakter
   - Sekolah: SMP Negeri 1
4. Klik **"Daftar Sekarang"**
5. ✅ Harus auto-login ke Dashboard Guru

## 5.3 Test Login Siswa

1. Logout dari akun guru
2. Kembali ke landing page
3. Klik tombol **"Siswa"**
4. Klik **"Daftar"**
5. Isi form:
   - Nama: Test Student
   - Username: teststudent
   - Password: password123
   - Kelas: 8A
   - Jenis Kelamin: Laki-laki
6. Klik **"Daftar"**
7. ✅ Harus auto-login ke Dashboard Siswa

## 5.4 Test CRUD Operations

**Test sebagai Guru:**

1. ✅ Buat kelas baru di **Kelola Kelas**
2. ✅ Refresh halaman → kelas masih ada
3. ✅ Edit kelas → berhasil
4. ✅ Hapus kelas → berhasil & permanent

**Test sebagai Siswa:**

1. ✅ Lihat profil siswa
2. ✅ Cek XP, level, coins
3. ✅ Navigasi ke Peta Misi

## 5.5 Test Database Persistence

**PENTING:** Test apakah database benar-benar persistent!

1. Buat data baru (misal: kelas baru)
2. Tunggu 20 menit (backend sleep)
3. Akses lagi website (backend wake up)
4. ✅ Data harus masih ada (tidak hilang)

---

# ⚠️ TROUBLESHOOTING

## Error: "Failed to fetch"

**Penyebab:** Frontend tidak bisa connect ke backend

**Solusi:**
1. Cek backend jalan: `https://sahabatbk-api.onrender.com/api/health`
2. Jika backend sleep (first request slow), tunggu 30-60 detik
3. Cek CORS sudah benar di `server/server.js`
4. Cek API URL di `.env.production` sudah benar

## Error: "Network Error" atau "CORS blocked"

**Penyebab:** CORS tidak allow frontend domain

**Solusi:**
1. Edit `server/server.js`
2. Tambahkan URL Vercel ke CORS origin
3. Commit & push ke GitHub
4. Tunggu Render auto-deploy (2-3 menit)

## Backend Sleep (15 menit idle)

**Symptom:** Request pertama lambat (30-60 detik)

**Solusi:**
- Normal untuk free tier Render
- Request berikutnya cepat
- Atau setup cron ping (lihat KEEP_ALIVE_CRON.md)

## Database Kosong Setelah Deploy

**Penyebab:** Persistent disk belum mount dengan benar

**Solusi:**
1. Masuk Render dashboard
2. Pilih service backend
3. Tab **Disks**
4. Cek **Mount Path** = `/opt/render/project/src/server`
5. Jika salah, delete disk & buat ulang dengan path yang benar

---

# 🎉 SELESAI!

Sistem Anda sekarang LIVE dan bisa diakses dari mana saja!

**URLs:**
- 🌐 **Frontend:** https://sahabatbk.vercel.app
- 🔧 **Backend API:** https://sahabatbk-api.onrender.com
- 📊 **Health Check:** https://sahabatbk-api.onrender.com/api/health

**Monitoring:**
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard

---

# 📱 SHARE KE USER

Kirim link ini ke guru & siswa:

```
🎮 SAHABAT BK - Platform Pembelajaran BK

Website: https://sahabatbk.vercel.app

Login Guru:
- Buat akun baru di halaman login guru
- Kelola kelas, siswa, dan soal

Login Siswa:
- Daftar dengan username & password
- Mulai petualangan belajar BK!

Dikembangkan oleh: Kartika Wulandari, S.Sos.
```

---

# 🔄 UPDATE APLIKASI

Kalau ada perubahan kode:

```bash
# 1. Edit code
# 2. Test di localhost

# 3. Commit & push
git add .
git commit -m "Deskripsi perubahan"
git push origin main

# 4. Auto-deploy!
# - Render: Auto-deploy backend (2-3 menit)
# - Vercel: Manual dengan `vercel --prod`
```

---

# 💰 BIAYA

- ✅ Render: FREE (0.1 CPU, 512MB RAM)
- ✅ Vercel: FREE (100GB bandwidth/month)
- ✅ Total: **$0/month**

**Upgrade kapan?**
- Traffic > 100k page views/month
- Butuh 24/7 no sleep
- Butuh lebih banyak storage

---

**Selamat! Sistem sudah online dan siap dipakai! 🚀**
