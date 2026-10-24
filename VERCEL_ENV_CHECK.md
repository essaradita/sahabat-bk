# ✅ Checklist: Vercel Environment Variables

## Error yang Kamu Alami:
```
Status 500: Gagal memproses permintaan
```

Ini biasanya karena **Environment Variables belum di-set di Vercel**.

---

## 🔑 Environment Variables yang WAJIB di Vercel:

### 1. **POSTGRES_URL**
- Connection string dari Neon.tech
- Format: `postgresql://username:password@host/database?sslmode=require`
- Cara dapat: Buka Neon.tech → Dashboard → Connection String

### 2. **JWT_SECRET**
- Rahasia untuk token authentication
- Bisa pakai string random apa saja
- Contoh: `mysupersecretkey12345`

---

## 📝 Cara Set Environment Variables di Vercel:

### **Option 1: Via Vercel Dashboard (MUDAH)**

1. Buka https://vercel.com/dashboard
2. Klik project **sahabat-bk**
3. Klik tab **"Settings"**
4. Klik **"Environment Variables"** di sidebar kiri
5. Tambahkan 2 variables ini:

   **Variable 1:**
   - Name: `POSTGRES_URL`
   - Value: [connection string dari Neon.tech]
   - Environment: Production, Preview, Development (centang semua)

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: `sahabatbk_secret_key_2024_production`
   - Environment: Production, Preview, Development (centang semua)

6. Klik **"Save"**
7. **PENTING:** Klik **"Redeploy"** untuk apply changes

---

### **Option 2: Via CLI**

```bash
# Set POSTGRES_URL
vercel env add POSTGRES_URL

# Set JWT_SECRET
vercel env add JWT_SECRET

# Redeploy
vercel --prod
```

---

## 🔍 Cara Cek Environment Variables Sudah Ter-Set:

### 1. **Via Vercel Dashboard:**
- Settings → Environment Variables
- Pastikan ada 2 variables: `POSTGRES_URL` dan `JWT_SECRET`

### 2. **Via Test Endpoint:**
Buat file test untuk cek env vars (sudah saya buatkan di bawah)

---

## ⚠️ CATATAN PENTING:

1. **Jangan commit** connection string ke Git (rahasia!)
2. **POSTGRES_URL** harus dari Neon.tech, bukan localhost
3. Setelah set env vars, **WAJIB redeploy**
4. Test lagi setelah redeploy selesai (tunggu 1-2 menit)

---

## 🧪 Langkah Testing Setelah Set Env:

1. ✅ Set POSTGRES_URL di Vercel
2. ✅ Set JWT_SECRET di Vercel
3. ✅ Klik "Redeploy" di Vercel
4. ⏱️ Tunggu deployment selesai (1-2 menit)
5. 🧪 Test register/login lagi
6. ✅ Harusnya berhasil!

---

## 📞 Kalau Masih Gagal:

1. Buka Vercel Dashboard → Project → Deployments
2. Klik deployment terakhir
3. Klik tab "Functions"
4. Klik function "api/auth"
5. Lihat logs error detail
6. Screenshot dan kasih ke saya

---

## 🎯 Quick Check - Env Vars Sudah Ada?

Cek di: https://vercel.com/[your-username]/sahabat-bk/settings/environment-variables

Harusnya ada 2 items:
- ✅ POSTGRES_URL
- ✅ JWT_SECRET

Kalau belum ada, tambahkan sekarang!
