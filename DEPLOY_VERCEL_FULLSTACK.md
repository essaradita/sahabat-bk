# 🚀 Panduan Deploy SAHABAT BK ke Vercel Full-Stack

## 📋 Ringkasan
Backend dan Frontend dalam **SATU deployment Vercel**! Tidak perlu deploy terpisah lagi.

---

## ✅ Persiapan

### 1. Database PostgreSQL
Anda memerlukan database PostgreSQL. Pilihan:

**Opsi A: Neon (Gratis & Recommended)**
- Daftar di https://neon.tech
- Buat project baru
- Copy **Connection String** (format: `postgresql://...`)

**Opsi B: Supabase**
- Daftar di https://supabase.com
- Buat project baru
- Copy **Connection String** dari Settings > Database

### 2. Setup Database Schema
Jalankan schema PostgreSQL:
```bash
# File ada di: database/schema_postgres.sql
# Import via Neon Console atau psql
```

---

## 🎯 Langkah Deploy

### 1. Push Code ke GitHub
```bash
git add .
git commit -m "Migrate to Vercel full-stack serverless"
git push origin main
```

### 2. Connect ke Vercel
1. Login ke https://vercel.com
2. Klik **"Add New Project"**
3. Import repository dari GitHub
4. Pilih project **sahabat-bk**

### 3. Configure Project
**Framework Preset:** Vite
**Root Directory:** ./
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 4. Environment Variables
Tambahkan di Vercel Project Settings > Environment Variables:

```env
POSTGRES_URL=postgresql://user:password@your-db.neon.tech/sahabatbk?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Generate JWT Secret:**
```bash
# Di terminal:
openssl rand -base64 32
```

### 5. Deploy
Klik **"Deploy"** dan tunggu ~2-3 menit.

---

## 🌐 Setelah Deploy

### URL Structure
- **Frontend:** `https://your-app.vercel.app`
- **API:** `https://your-app.vercel.app/api/*`

### Test API
```bash
# Health check
curl https://your-app.vercel.app/api/health

# API info
curl https://your-app.vercel.app/api
```

---

## 📁 Struktur Serverless

```
/api
├── index.js                    # Root API endpoint
├── health.js                   # Health check
├── /auth
│   ├── register-student.js    # POST /api/auth/register-student
│   ├── register-teacher.js    # POST /api/auth/register-teacher
│   ├── login-student.js       # POST /api/auth/login-student
│   ├── login-teacher.js       # POST /api/auth/login-teacher
│   └── profile.js             # GET /api/auth/profile
├── /teacher
│   ├── students.js            # GET /api/teacher/students
│   ├── missions.js            # GET/POST /api/teacher/missions
│   ├── case-studies.js        # GET/POST /api/teacher/case-studies
│   ├── classes.js             # GET/POST /api/teacher/classes
│   ├── /missions
│   │   └── [id].js           # PUT/DELETE /api/teacher/missions/:id
│   ├── /case-studies
│   │   └── [id].js           # PUT/DELETE /api/teacher/case-studies/:id
│   ├── /classes
│   │   └── [id].js           # PUT/DELETE /api/teacher/classes/:id
│   └── /attendance
│       ├── students.js       # GET/POST /api/teacher/attendance/students
│       ├── mark.js           # POST /api/teacher/attendance/mark
│       ├── records.js        # GET /api/teacher/attendance/records
│       └── /students
│           └── [id].js       # DELETE /api/teacher/attendance/students/:id
└── /student
    ├── missions.js           # GET /api/student/missions
    └── /missions
        └── complete.js       # POST /api/student/missions/complete
```

---

## 🔧 Development Lokal

### Install Dependencies
```bash
npm install
```

### Setup Environment
```bash
cp .env.example .env
# Edit .env dengan POSTGRES_URL dan JWT_SECRET
```

### Run Development
```bash
# Frontend only (akan hit API production)
npm run dev

# Test API functions locally (requires Vercel CLI)
npm i -g vercel
vercel dev
```

---

## 🐛 Troubleshooting

### Error: "POSTGRES_URL not found"
- Pastikan environment variable sudah ditambahkan di Vercel
- Redeploy setelah menambahkan env vars

### Error: "Token tidak valid"
- Pastikan JWT_SECRET sama antara development dan production
- Clear localStorage dan login ulang

### Frontend tidak bisa koneksi ke API
- Pastikan `vercel.json` rewrites sudah benar
- Check browser console untuk error CORS
- Test API endpoint langsung: `https://your-app.vercel.app/api/health`

### Database connection error
- Pastikan connection string benar
- Pastikan database bisa diakses dari internet
- Check Neon/Supabase dashboard untuk connection limit

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments:** Lihat status deploy
- **Functions:** Monitor serverless functions performance
- **Logs:** Real-time logs dari API

### Database
- **Neon Dashboard:** Monitor database usage
- **Query Stats:** Lihat slow queries

---

## 🎉 Keuntungan Arsitektur Ini

✅ **Satu Deploy** - Frontend + Backend dalam satu project
✅ **Auto-scaling** - Serverless functions scale otomatis
✅ **Gratis** - Vercel free tier sangat generous
✅ **Global CDN** - Frontend served dari CDN global
✅ **Zero Config** - Tidak perlu setup CORS, proxy, dll
✅ **Fast Deploy** - Push to GitHub = auto deploy
✅ **Easy Rollback** - Rollback ke versi sebelumnya 1 klik

---

## 📝 Next Steps

1. ✅ Deploy ke Vercel
2. ✅ Test semua endpoint
3. ✅ Test login student & teacher
4. ✅ Verifikasi database connection
5. ✅ Setup custom domain (optional)
6. ✅ Enable analytics (optional)

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Check `vercel.json` untuk routing config
- Check `lib/db-postgres.js` untuk database config

Happy Deploying! 🚀
