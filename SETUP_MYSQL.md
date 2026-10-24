# 🚀 Setup MySQL Lokal - Sahabat BK

Panduan lengkap untuk menjalankan aplikasi dengan MySQL di XAMPP.

---

## 📋 Prerequisites

✅ XAMPP sudah terinstall
✅ MySQL di XAMPP sudah running (hijau)
✅ Node.js sudah terinstall

---

## 🗄️ Step 1: Setup Database

### 1.1 Buka phpMyAdmin
- Buka browser, akses: `http://localhost/phpmyadmin`
- Login dengan user `root` (tanpa password)

### 1.2 Buat Database
- Klik tab **"SQL"** di menu atas
- Copy seluruh isi file `database/schema_mysql.sql`
- Paste ke editor SQL
- Klik **"Go"** atau **"Kirim"**

✅ Database `sahabat_bk` dan semua tabel berhasil dibuat!

---

## 🔧 Step 2: Install Dependencies Backend

Buka Command Prompt di folder `server`:

```cmd
cd server
npm install
```

Tunggu sampai selesai (~1-2 menit)

---

## ⚙️ Step 3: Konfigurasi Backend

File `server/.env` sudah otomatis dibuat dengan config:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sahabat_bk
DB_PORT=3306
JWT_SECRET=sahabat-bk-super-secret-key-2024
PORT=3001
```

**Jika MySQL kamu pakai password:**
- Edit file `server/.env`
- Isi `DB_PASSWORD=password_mysql_kamu`

---

## 🚀 Step 4: Jalankan Backend API

Di folder `server`, jalankan:

```cmd
npm start
```

**Output yang benar:**
```
🚀 Server berjalan di http://localhost:3001
📊 Database: sahabat_bk
```

✅ **Backend API sudah running!**

---

## 🎨 Step 5: Jalankan Frontend

Buka **Command Prompt BARU** (jangan tutup yang backend), lalu:

```cmd
cd..
npm run dev
```

**Output yang benar:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## ✅ Testing

1. **Buka browser:** `http://localhost:5173`
2. **Klik "Daftar"** → Pilih Guru atau Siswa
3. **Isi form registrasi** dan submit
4. **Jika berhasil:** Langsung masuk ke dashboard
5. **Logout dan login lagi** → Data tersimpan!

---

## 🔍 Troubleshooting

### ❌ Backend Error: ECONNREFUSED
- **Masalah:** MySQL belum running
- **Solusi:** Start MySQL di XAMPP Control Panel

### ❌ Backend Error: ER_ACCESS_DENIED_ERROR
- **Masalah:** Password MySQL salah
- **Solusi:** Edit `server/.env`, isi password yang benar

### ❌ Frontend Error: Failed to fetch
- **Masalah:** Backend belum running
- **Solusi:** Jalankan `npm start` di folder `server`

### ❌ Database sahabat_bk not found
- **Masalah:** Database belum dibuat
- **Solusi:** Jalankan SQL di phpMyAdmin (Step 1.2)

---

## 📝 Cara Cek Data Tersimpan

1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Pilih database **sahabat_bk** di sidebar kiri
3. Klik tabel **profiles**
4. Lihat data user yang baru didaftar!

---

## 🔄 Cara Stop Server

- **Backend:** Tekan `Ctrl + C` di terminal server
- **Frontend:** Tekan `Ctrl + C` di terminal frontend
- **MySQL:** Klik "Stop" di XAMPP Control Panel (opsional)

---

## 🎉 Selesai!

Sekarang aplikasi kamu:
✅ Pakai database MySQL lokal (100% offline)
✅ Data tersimpan permanen
✅ Bisa login setelah daftar
✅ Tidak perlu internet

**Happy Coding! 🚀**
