# 🔧 Cara Perbaiki "Failed to Fetch"

## Masalah: Frontend tidak bisa connect ke Backend

**Error:** "Failed to fetch" saat register/login

---

## ✅ Solusi Cepat

### **1. Stop Frontend (kalau masih jalan)**

Di terminal frontend, tekan: **Ctrl + C**

### **2. Copy file env yang sesuai**

**Kalau pakai LAPTOP/PC (localhost):**
```bash
copy .env.local .env
```

Atau manual: Rename `.env.local` jadi `.env`

**Kalau pakai HP (network):**
```bash
copy .env.hp .env
```

Atau manual: Rename `.env.hp` jadi `.env`

### **3. Restart Frontend**

```bash
npm run dev
```

### **4. Hard Refresh Browser**

Tekan: **Ctrl + Shift + R** (atau **Ctrl + F5**)

### **5. Coba Register/Login Lagi**

---

## 🔍 Cek Backend Jalan atau Tidak

Buka browser, ke:
```
http://localhost:3002/api/auth/login/student
```

**Hasilnya harus:**
```json
{"error":"Username dan password wajib diisi"}
```

Kalau muncul error di atas, artinya backend **JALAN** ✅

Kalau muncul "This site can't be reached", artinya backend **MATI** ❌

---

## 🚀 Start Ulang Semuanya (Clean Start)

### **1. Stop Semua Process**

```bash
# Kill all node
taskkill /F /IM node.exe
```

### **2. Start Backend**

Terminal 1:
```bash
cd server
node server.js
```

Tunggu sampai muncul "✅ Siap digunakan!"

### **3. Start Frontend** 

Terminal 2:
```bash
npm run dev
```

### **4. Akses**

- Laptop: `http://localhost:5173`
- HP: `http://192.168.1.10:5173`

---

## 📊 Debug Mode

Kalau masih error, buka **Console Browser** (F12):

1. Tekan **F12**
2. Klik tab **Console**
3. Coba register lagi
4. Screenshot error yang muncul
5. Kasih tau saya error messagenya

---

## ⚙️ Settings File

**.env** (untuk laptop):
```
VITE_API_MODE=local
VITE_API_URL=http://localhost:3002/api
```

**.env.hp** (untuk HP via WiFi):
```
VITE_API_MODE=local
VITE_API_URL=http://192.168.1.10:3002/api
```

**server/.env**:
```
DB_TYPE=sqlite
DB_FILE=./database.sqlite
JWT_SECRET=sahabat-bk-super-secret-key-2024
PORT=3002
```

---

## 🎯 Checklist Troubleshooting

- [ ] Backend jalan? (Cek terminal ada tulisan "✅ Siap digunakan!")
- [ ] Port 3002 available? (Cek `netstat -ano | findstr :3002`)
- [ ] File `.env` ada dan benar?
- [ ] Frontend sudah restart?
- [ ] Browser sudah hard refresh? (Ctrl+Shift+R)
- [ ] Console browser ada error apa?

---

Coba ikuti langkah di atas, lalu kabari hasilnya!
