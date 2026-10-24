# 🎮 Sahabat BK

> **Belajar, Bertumbuh, Jadi Versi Terbaik.**

Platform gamifikasi Bimbingan dan Konseling berbasis web untuk siswa SMP. Dibangun dengan React + Vite + Tailwind CSS + Supabase.

---

## ✨ Fitur

### Siswa
- 🗺️ Peta petualangan dengan 4 dunia BK (Pribadi, Sosial, Belajar, Karier)
- 🎯 Misi interaktif dengan kuis pilihan ganda, skenario, dan refleksi
- ⭐ Sistem XP, Level, Koin, dan Badge
- 📔 Jurnal diri pribadi + tracker mood
- 💬 Form permohonan konsultasi ke Guru BK
- 🏆 Layar reward dengan confetti setelah misi selesai

### Guru BK
- 📊 Dashboard dengan statistik kelas dan siswa
- 🏫 Kelola Kelas (tambah, edit, kode kelas)
- 📋 Bank Soal + Editor Misi (WYSIWYG, tanpa coding)
- ✅ Absensi Digital dengan unduh CSV
- 📈 Laporan & Analitik kemajuan belajar
- 💬 Kelola permohonan konsultasi siswa
- ⚙️ Pengaturan akun

### Keamanan
- Row Level Security (RLS) Supabase
- RBAC: siswa dan guru punya akses berbeda
- XP tidak bisa dimanipulasi dari frontend
- Kunci jawaban tidak dikirim ke browser sebelum diperlukan
- Jurnal siswa bersifat privat

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 18+ dan npm
- Akun Supabase (opsional untuk mode demo)

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment

```bash
# Salin file contoh
copy .env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Tanpa Supabase:** Aplikasi tetap berjalan dalam **Mode Demo** — semua fitur bisa dicoba dengan data contoh.

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka: http://localhost:5173

---

## 🗄️ Setup Supabase

### Langkah 1: Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) → New Project
2. Pilih nama project, region, dan password database
3. Tunggu project selesai dibuat (~2 menit)

### Langkah 2: Jalankan Schema SQL
1. Buka **SQL Editor** di dashboard Supabase
2. Copy isi file `supabase/schema.sql`
3. Paste dan klik **Run**
4. Ulangi dengan `supabase/seed.sql`

### Langkah 3: Buat Akun Guru BK
Akun guru tidak bisa dibuat sendiri dari UI. Gunakan SQL Editor:

```sql
-- 1. Buat user via Supabase Auth (Authentication > Users > Add User)
--    Email: guru@sekolah.sch.id | Password: (bebas)

-- 2. Set role menjadi teacher (jalankan di SQL Editor setelah user dibuat)
UPDATE profiles SET role = 'teacher', name = 'Nama Guru'
WHERE email = 'guru@sekolah.sch.id';
```

Atau buat via Authentication dashboard → **Add User** → lalu update tabel profiles.

### Langkah 4: Buat Akun Siswa
Guru dapat membuat akun siswa melalui dashboard:
1. Login sebagai Guru BK
2. Buka **Kelola Kelas** → salin **Kode Kelas**
3. Buat akun siswa via Supabase Auth (Email: `username@sekolah.sch.id`)
4. Update profil siswa di tabel `profiles`:

```sql
UPDATE profiles SET
  role = 'student',
  name = 'Andi Pratama',
  username = 'andi.pratama',
  kelas = '8A'
WHERE email = 'andi.pratama@sekolah.sch.id';
```

### Langkah 5: Dapatkan API Keys
1. Buka **Settings → API** di Supabase dashboard
2. Copy **Project URL** dan **anon/public key**
3. Masukkan ke `.env.local`

---

## 🌐 Deploy ke Vercel

### Cara 1: Via GitHub (Direkomendasikan)

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial Sahabat BK project"
   git remote add origin https://github.com/username/sahabat-bk.git
   git push -u origin main
   ```

2. **Import di Vercel:**
   - Buka [vercel.com](https://vercel.com) → New Project
   - Import repository GitHub
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables di Vercel:**
   - Settings → Environment Variables
   - Tambahkan:
     - `VITE_SUPABASE_URL` = URL Supabase project kamu
     - `VITE_SUPABASE_ANON_KEY` = Anon key Supabase
   - Klik **Redeploy**

4. **SPA Routing** sudah dikonfigurasi di `vercel.json`

### Cara 2: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── ui/          # Komponen reusable (Modal, Toast, Avatar, dll)
│   └── ProtectedRoute.jsx
├── data/
│   └── demoData.js  # Data demo untuk mode offline
├── hooks/
│   ├── useAuth.js
│   └── useStudentProgress.js
├── layouts/
│   ├── StudentLayout.jsx
│   └── TeacherLayout.jsx
├── lib/
│   └── supabase.js
├── pages/
│   ├── auth/        # Landing, Login Student, Login Teacher
│   ├── student/     # Dashboard, Map, Misi, Jurnal, Profil
│   └── teacher/     # Dashboard, Kelas, Siswa, Soal, Absensi, dll
└── styles/
    └── index.css

supabase/
├── schema.sql       # Schema + RLS policies
└── seed.sql         # Data awal

public/
vercel.json          # SPA routing config
```

---

## 🛡️ Keamanan Data Siswa

- **Tidak ada service-role key di frontend** — semua operasi menggunakan anon key + RLS
- **XP/Level tidak bisa diubah langsung** oleh siswa — diproses via database function `award_xp()`
- **Jurnal bersifat privat** — siswa lain dan guru tidak bisa membaca (kecuali diizinkan)
- **Absensi hanya bisa diubah guru** — siswa hanya bisa melihat
- **Kunci jawaban** tidak dikirim ke client sebelum siswa menjawab

---

## 🔧 Scripts

```bash
npm run dev      # Development server (localhost:5173)
npm run build    # Build untuk production
npm run preview  # Preview build hasil production
```

---

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi"`
4. Push dan buat Pull Request

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan pendidikan.

---

*Dibuat dengan ❤️ untuk Bimbingan dan Konseling Indonesia*
