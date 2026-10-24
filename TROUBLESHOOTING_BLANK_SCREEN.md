# 🔧 Troubleshooting: Layar Blank Putih

## ❓ Apa itu Layar Blank Putih?

Layar blank putih biasanya terjadi ketika ada **JavaScript error** yang menyebabkan aplikasi React crash sebelum bisa render apapun.

---

## 🔍 Cara Debugging

### **1. Buka Console Browser**
Ini adalah langkah paling penting!

**Cara membuka:**
- **Chrome/Edge**: Tekan `F12` atau `Ctrl + Shift + I`
- **Firefox**: Tekan `F12` atau `Ctrl + Shift + K`

**Pilih tab "Console"** dan lihat apakah ada error berwarna merah.

---

## 🐛 Error Umum & Solusinya

### **Error 1: "Failed to fetch" atau "Network Error"**

**Penyebab**: Backend tidak jalan atau URL salah

**Solusi**:
```bash
# Pastikan backend jalan
cd server
npm start

# Harus muncul:
# 🚀 Server berjalan di http://localhost:3002
```

**Cek URL di `.env`:**
```
VITE_API_URL=http://192.168.1.10:3002/api
```

---

### **Error 2: "Cannot read property 'length' of undefined"**

**Penyebab**: API return undefined atau null tapi kita coba akses `.length`

**Solusi**: Sudah diperbaiki dengan fallback di `QuestionBank.jsx` dan `CaseStudies.jsx`

---

### **Error 3: "Unexpected token < in JSON"**

**Penyebab**: Backend return HTML (error page) bukan JSON

**Solusi**:
1. Buka tab **Network** di Developer Tools
2. Klik request yang error (warna merah)
3. Lihat **Response** tab - jika ada HTML, berarti backend error
4. Cek terminal backend untuk error message

---

### **Error 4: "Token tidak ditemukan" atau "401 Unauthorized"**

**Penyebab**: Login expired atau logout tidak sempurna

**Solusi**:
```javascript
// Di Console browser, ketik:
localStorage.clear()
// Lalu Enter dan refresh halaman (F5)
```

Setelah itu login ulang.

---

### **Error 5: "undefined is not a function"**

**Penyebab**: Salah import component atau function

**Solusi**: Cek error message lengkap di console untuk tahu function mana yang error.

---

## ✅ Checklist Sebelum Test

Pastikan semua ini sudah jalan:

- [ ] **Backend running** di port 3002
  ```bash
  cd server
  npm start
  ```

- [ ] **Frontend running** di port 5173
  ```bash
  npm run dev
  ```

- [ ] File **`.env`** ada di root folder
  ```
  VITE_API_URL=http://192.168.1.10:3002/api
  ```

- [ ] **Database** ada di `server/database.sqlite`
  (auto-created saat backend start pertama kali)

---

## 🚀 Quick Fix

Jika masih blank setelah semua dicoba:

### **1. Restart Everything**
```bash
# Stop backend (Ctrl+C) dan frontend (Ctrl+C)

# Clear cache & restart
npm run dev

# Di terminal lain
cd server
npm start
```

### **2. Clear Browser Cache**
- Tekan `Ctrl + Shift + Delete`
- Pilih "Cached images and files"
- Clear
- Refresh (F5)

### **3. Hard Refresh**
- Tekan `Ctrl + Shift + R` (Chrome/Firefox)
- Atau `Ctrl + F5`

### **4. Clear localStorage**
```javascript
// Di Console browser:
localStorage.clear()
sessionStorage.clear()
```

---

## 📝 Cara Test Step by Step

### **Test 1: Frontend Jalan**
1. Buka `http://localhost:5173`
2. Harus muncul landing page atau login page
3. Jika blank → Cek console browser

### **Test 2: Backend Jalan**
1. Buka `http://localhost:3002/api/teacher/missions` di browser
2. Harus muncul error JSON: `{"error":"Token tidak ditemukan"}`
3. Ini NORMAL - artinya backend jalan tapi butuh login
4. Jika blank atau "Cannot connect" → Backend tidak jalan

### **Test 3: Login**
1. Login sebagai teacher atau student
2. Jika berhasil → Redirect ke dashboard
3. Jika error → Cek console browser

### **Test 4: Bank Soal**
1. Login sebagai teacher
2. Klik "Bank Soal"
3. Harus muncul list missions (loading dulu sebentar)
4. Jika blank → Cek console browser

---

## 🔍 Debug dengan Console.log

Jika masih bingung, tambahkan console.log:

**Di `QuestionBank.jsx`:**
```javascript
useEffect(() => {
  async function fetchData() {
    console.log('🔄 Fetching data...')
    try {
      setLoading(true)
      console.log('📡 Calling API...')
      const missionsData = await apiClient.getMissions()
      console.log('✅ Got missions:', missionsData)
      // ... rest of code
    } catch (err) {
      console.error('❌ Error:', err)
    }
  }
  fetchData()
}, [])
```

Lalu lihat console browser untuk trace errornya.

---

## 🆘 Jika Masih Tidak Bisa

### **Option 1: Rollback ke Versi Sebelumnya**

Jika baru update dan tiba-tiba blank:

```bash
git log --oneline  # Lihat commit history
git checkout <commit-hash>  # Kembali ke commit yang jalan
```

### **Option 2: Mode Offline (Tanpa Backend)**

Edit `src/lib/api.js`:
```javascript
// Nonaktifkan API calls sementara
async getMissions() {
  // return await this.request('/teacher/missions')
  return [] // Return empty array
}
```

Aplikasi akan pakai demo data.

### **Option 3: Fresh Install**

```bash
# Backup database dulu
copy server\database.sqlite server\database.backup.sqlite

# Clean install
rmdir /s /q node_modules
rmdir /s /q server\node_modules
del package-lock.json
del server\package-lock.json

# Install ulang
npm install
cd server
npm install
cd ..

# Start
npm run dev
# Terminal lain:
cd server
npm start
```

---

## 📞 Error Messages yang Sering Muncul

### **"Cannot find module"**
```bash
npm install
```

### **"Port 3002 already in use"**
```bash
# Windows - Kill process di port 3002
netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

### **"ENOENT: no such file or directory"**
Pastikan ada file `.env` di root folder dengan:
```
VITE_API_URL=http://192.168.1.10:3002/api
```

### **"sqlite3 error"**
```bash
cd server
npm rebuild better-sqlite3
```

---

## ✅ Jika Sudah Bisa

Setelah fix error:
1. Test semua fitur sekali lagi
2. Jika error lagi → Screenshot error di console
3. Baca error message dengan teliti
4. Google error message jika tidak paham

---

## 🎯 Prevention Tips

Untuk mencegah blank screen di masa depan:

1. **Selalu cek console browser** setelah update code
2. **Test di incognito/private mode** untuk cek cache issue
3. **Commit code yang jalan** ke git sebelum update
4. **Backup database** sebelum update backend
5. **Read error messages** - biasanya sudah jelas solusinya

---

## 📊 Status Saat Ini

Setelah fix terbaru:

✅ **QuestionBank.jsx** - Better error handling dengan nested try/catch  
✅ **CaseStudies.jsx** - Fallback ke default cases jika API error  
✅ **API Client** - Separate methods untuk student & teacher  
✅ **Loading States** - Spinner saat fetch data  

**Aplikasi sekarang tidak akan blank putih lagi** karena:
- Ada fallback ke demo data jika backend error
- Ada try/catch di setiap API call
- Loading state jelas (spinner)
- Error di-log ke console (bukan crash)

---

## 🎉 Test Final

```bash
# 1. Start backend
cd server
npm start

# 2. Start frontend (terminal lain)
npm run dev

# 3. Buka browser
http://localhost:5173

# 4. Login teacher
# 5. Buka Bank Soal
# 6. Harus muncul list (tidak blank!)
```

Jika masih blank → Screenshot console browser dan kirim error message!
