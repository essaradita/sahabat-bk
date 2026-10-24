# 📱 Cara Akses dari HP (Network Access)

## Masalah: "Load Failed" di HP

### Penyebab:
- Backend hanya listen di `localhost` (tidak bisa diakses dari HP)
- Frontend pakai URL `localhost:3002` yang tidak bisa diakses dari HP
- Firewall Windows memblokir koneksi dari jaringan

---

## ✅ Solusi Lengkap

### 1. Setup Backend (Sudah OK!)
Backend sudah dikonfigurasi untuk listen di `0.0.0.0` yang artinya bisa diakses dari network.

```js
app.listen(PORT, '0.0.0.0', () => { ... })
```

### 2. Setup Frontend

#### File .env
Sudah diupdate untuk pakai IP network:
```env
VITE_API_URL=http://192.168.1.10:3002/api
```

#### package.json
Sudah ditambah script `dev:hp`:
```json
"dev:hp": "vite --host"
```

---

## 🚀 Cara Menjalankan

### A. Dari PC/Laptop (Untuk PC sendiri)
```bash
# 1. Start Backend
cd server
npm start

# 2. Start Frontend (Terminal baru)
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3002

### B. Untuk Akses dari HP

#### Windows - Pakai File Batch
```bash
# 1. Start Backend
Klik 2x: start-backend.bat

# 2. Start Frontend 
Klik 2x: start-frontend-hp.bat
```

#### Manual
```bash
# 1. Start Backend
cd server
npm start

# 2. Start Frontend (Terminal baru)
npm run dev:hp
```

Setelah jalan, cek terminal untuk alamat network:
```
  ➜  Local:   http://localhost:5174/
  ➜  Network: http://192.168.1.10:5174/
```

### C. Akses dari HP
1. Pastikan HP terhubung ke WiFi yang sama dengan PC
2. Buka browser di HP
3. Ketik: `http://192.168.1.10:5174`

---

## 🔥 Troubleshooting

### 1. "Load Failed" / Connection Refused

**Cek 1: Backend jalan?**
```bash
# Buka browser di PC, ketik:
http://192.168.1.10:3002/api/auth/profile
# Harus ada response (meski error 401 - itu normal)
```

**Cek 2: Frontend jalan?**
```bash
# Buka browser di PC, ketik:
http://192.168.1.10:5174
# Harus tampil halaman landing
```

**Cek 3: Firewall Windows**
```
1. Buka Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Cari "Node.js" atau "npm"
4. Centang Public & Private
5. Restart backend & frontend
```

### 2. IP Address Berubah

Jika IP berubah (misal jadi 192.168.1.15), update:

**File .env:**
```env
VITE_API_URL=http://192.168.1.15:3002/api
```

**Cara cek IP PC:**
```bash
# Windows
ipconfig

# Cari "IPv4 Address" di bagian "Wireless LAN adapter Wi-Fi"
# Contoh: 192.168.1.10
```

### 3. HP Tidak Bisa Akses

**Cek WiFi:**
- PC dan HP harus di WiFi yang SAMA
- Jangan pakai hotspot HP

**Cek Port:**
- Frontend: 5174 (atau 5173)
- Backend: 3002
- Pastikan tidak terblokir firewall

**Test koneksi:**
```bash
# Di HP, buka browser:
http://192.168.1.10:5174

# Jika blank, coba:
http://192.168.1.10:3002
```

### 4. Keterangan Error di Console

Buka DevTools di browser (F12), cek Console:
- `ERR_CONNECTION_REFUSED` → Backend mati
- `ERR_CONNECTION_TIMED_OUT` → Firewall blokir
- `404 Not Found` → URL salah
- `Unexpected token '<'` → Backend mati, frontend dapat HTML error

---

## 📝 File Penting

### .env (Frontend Root)
```env
VITE_API_MODE=local
VITE_API_URL=http://192.168.1.10:3002/api
```

### .env.hp (Backup - tidak dipakai)
File backup untuk referensi

### package.json
```json
"scripts": {
  "dev": "vite",
  "dev:hp": "vite --host"
}
```

### server/server.js
```js
app.listen(PORT, '0.0.0.0', () => { ... })
```

---

## 🎯 Quick Check

### Backend OK?
```bash
curl http://192.168.1.10:3002/api/auth/profile
# atau buka di browser
```
**Expected:** Error 401 (Token tidak ditemukan) - INI NORMAL!
**Problem:** Connection refused - Backend mati

### Frontend OK?
```bash
# Buka browser:
http://192.168.1.10:5174
```
**Expected:** Tampil halaman landing
**Problem:** Tidak bisa akses - Frontend mati atau IP salah

### HP Bisa Akses?
```bash
# Di HP browser:
http://192.168.1.10:5174
```
**Expected:** Tampil halaman landing, bisa login
**Problem:** Load failed - Cek firewall atau WiFi berbeda

---

## 🔑 Kesimpulan

### Untuk Development di PC saja:
- Pakai `npm run dev` (localhost)
- Tidak perlu `--host`

### Untuk Akses dari HP:
- Pakai `npm run dev:hp` (network)
- Update .env dengan IP network (192.168.1.10)
- Pastikan firewall allow Node.js

### File Batch:
- `start-backend.bat` - Start backend
- `start-frontend-hp.bat` - Start frontend untuk HP
- Klik 2x untuk jalankan

---

## 🆘 Masih Error?

1. Restart PC & HP
2. Cek IP address PC: `ipconfig`
3. Update IP di .env
4. Matikan antivirus sementara
5. Pakai browser lain (Chrome/Firefox)
6. Cek log di console browser (F12)

Jika masih error, cek:
- WiFi: PC dan HP di network yang sama
- Firewall: Allow Node.js
- Port: 3002 dan 5174 tidak dipakai aplikasi lain
