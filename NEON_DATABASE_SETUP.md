# 🐘 NEON POSTGRES DATABASE SETUP

## Setup Database di Neon.tech (100% GRATIS)

### 1. Buat Account Neon

1. Buka: https://neon.tech
2. Klik **"Sign Up"**
3. Login dengan **GitHub** (paling mudah)
4. Authorize Neon

### 2. Create New Project

1. Klik **"Create a project"** atau **"New Project"**
2. Setting:
   - **Project Name:** `sahabatbk`
   - **Region:** Singapore (pilih yang terdekat)
   - **Postgres Version:** 16 (latest)
3. Klik **"Create Project"**

### 3. Copy Connection String

Setelah project dibuat, akan muncul **Connection String**:

```
postgresql://user:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**COPY connection string ini!** Akan dipakai nanti di Vercel environment variables.

### 4. Run SQL Schema

1. Di Neon Dashboard, klik tab **"SQL Editor"**
2. Copy isi file `database/schema_postgres.sql`
3. Paste di SQL Editor
4. Klik **"Run"**
5. ✅ Database tables sudah dibuat!

---

## Testing Database

Di SQL Editor, coba query ini:

```sql
SELECT COUNT(*) FROM profiles;
```

Harus return `0` (karena belum ada data).

---

## Connection String untuk Vercel

Format connection string:

```
postgres://[user]:[password]@[host]/[database]?sslmode=require
```

Ini akan di-paste ke **Vercel Environment Variables** dengan key:
- `POSTGRES_URL`

---

Selesai! Database siap dipakai! 🎉
