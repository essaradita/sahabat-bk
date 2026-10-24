# 🔧 Fix Error: Tidak Bisa Edit Bank Soal Kelompok

## ❌ Error yang Muncul:
```
Gagal memuat data: Unexpected token '<'; "<!DOCTYPE "... is not valid JSON
```

---

## 🎯 ROOT CAUSE:

Error ini terjadi karena **BACKEND TIDAK JALAN**!

Ketika backend tidak jalan:
- Frontend mencoba fetch data dari `http://localhost:3002/api/...`
- Server tidak response (karena tidak jalan)
- Browser redirect ke error page HTML
- Frontend mengira HTML itu JSON → ERROR!

---

## ✅ SOLUSI 3 LANGKAH:

### **Langkah 1: CEK BACKEND JALAN ATAU TIDAK**

Buka terminal baru dan cek:

```bash
cd server
npm start
```

**HARUS MUNCUL INI:**
```
✅ SQLite Database initialized
🚀 Server berjalan di http://localhost:3002
📱 Akses dari HP: http://192.168.1.10:3002
📊 Database: SQLite (database.sqlite)
✅ Siap digunakan!
```

**Jika muncul error "Port already in use":**
```bash
# Kill process di port 3002
netstat -ano | findstr :3002
taskkill /PID <PID_NUMBER> /F

# Start ulang
npm start
```

---

### **Langkah 2: PASTIKAN BACKEND ACCESSIBLE**

**Test 1: Buka di browser**
```
http://localhost:3002/api/teacher/missions
```

**Expected Result:**
```json
{"error":"Token tidak ditemukan"}
```

Ini **NORMAL**! Error ini artinya backend jalan, cuma butuh login.

**Jika muncul "Can't reach this page":**
→ Backend TIDAK jalan! Kembali ke Langkah 1.

---

### **Langkah 3: REFRESH FRONTEND**

Setelah backend jalan:

```
1. Close semua tab browser Sahabat BK
2. Buka ulang: http://localhost:5174
3. Login teacher
4. Bank Soal → Edit → HARUS BERHASIL ✅
```

---

## 🚀 QUICK FIX (TERMUDAH):

### **Option 1: Restart Semua**
```
1. Close semua terminal
2. Close browser
3. Double-click: START_SEMUA.bat
4. Tunggu backend jalan (lihat di terminal)
5. Buka browser: http://localhost:5174
```

### **Option 2: Test Backend Dulu**
```
1. Double-click: TEST_BACKEND.bat
2. Jika backend NOT running:
   → Double-click: RESTART_BACKEND.bat
3. Refresh browser
```

---

## 🐛 TROUBLESHOOTING LANJUTAN:

### **Problem 1: Backend Start tapi langsung close**

**Cek Error:**
```bash
cd server
npm start
```

**Common Errors:**

**Error: "Cannot find module"**
```bash
npm install
npm start
```

**Error: "ENOENT: no such file or directory"**
```bash
# Pastikan ada file package.json di folder server
dir package.json

# Jika tidak ada, cek lokasi:
cd c:\Users\ASUS\SAHABAT BK\server
npm start
```

**Error: "Database is locked"**
```bash
# Delete lock file
del database.sqlite-journal
npm start
```

---

### **Problem 2: Frontend Connect tapi tetap error**

**Check API URL:**

1. Buka file: `.env`
2. Pastikan isinya:
```
VITE_API_URL=http://localhost:3002/api
```

3. Jika salah, fix dan restart frontend:
```bash
npm run dev
```

---

### **Problem 3: CORS Error**

**Symptom:** Console browser menunjukkan CORS error

**Fix:**
```bash
cd server
# Edit server.js
# Pastikan ada: app.use(cors())
npm start
```

---

## 🔍 DEBUG CHECKLIST:

Sebelum edit Bank Soal, pastikan:

- [ ] ✅ Backend jalan di port 3002
  ```bash
  # Terminal harus menunjukkan:
  # Server berjalan di http://localhost:3002
  ```

- [ ] ✅ Backend accessible
  ```bash
  # Buka: http://localhost:3002/api/teacher/missions
  # Harus muncul JSON error (bukan "Can't reach")
  ```

- [ ] ✅ Frontend jalan di port 5174
  ```bash
  # Terminal harus menunjukkan:
  # Local: http://localhost:5174/
  ```

- [ ] ✅ Browser console tidak ada error merah
  ```
  F12 → Console tab
  Tidak ada error "Failed to fetch"
  ```

- [ ] ✅ Login berhasil
  ```
  Login teacher → Dashboard muncul
  ```

---

## 📊 VERIFICATION STEPS:

Setelah fix, test ini:

### **Test 1: Dashboard Load**
```
Dashboard → Total Siswa muncul angka ✅
```

### **Test 2: Bank Soal List**
```
Bank Soal → Tab Kelompok → List muncul ✅
```

### **Test 3: Edit**
```
Bank Soal → Klik Edit → Form muncul ✅
```

### **Test 4: Save**
```
Edit → Ubah title → Simpan → Berhasil ✅
```

---

## ⚡ FASTEST FIX (1 MENIT):

```bash
# Terminal 1 - Backend
cd server
npm start
# Tunggu "Server berjalan..."

# Terminal 2 - Frontend  
npm run dev
# Tunggu "Local: http://localhost:5174"

# Browser
http://localhost:5174
Login → Bank Soal → Edit → DONE! ✅
```

---

## 🎯 SUMMARY:

**ROOT CAUSE:** Backend tidak jalan  
**SYMPTOM:** Error "Unexpected token '<'"  
**FIX:** Start backend dengan `cd server && npm start`  
**VERIFY:** `http://localhost:3002/api/teacher/missions` return JSON  

**BACKEND HARUS JALAN DULU SEBELUM FRONTEND BISA AKSES DATA!** 🚀

---

## 📞 JIKA MASIH ERROR:

1. Screenshot error di console (F12)
2. Screenshot terminal backend
3. Screenshot terminal frontend
4. Cek file ini ada atau tidak:
   - `server/package.json` ✅
   - `server/database.sqlite` ✅
   - `.env` di root ✅
