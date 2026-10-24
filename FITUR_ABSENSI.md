# 📋 Fitur Absensi - Data Siswa

## ✅ Fitur Baru: Tab Data Siswa

Menu **Data Siswa** sekarang memiliki 2 tab:

### 1. **Data Akun Game** (Tab Pertama)
- Menampilkan siswa yang sudah daftar akun game
- Data dari database (backend API)
- Informasi: Nama, Username, Kelas, Level, Misi Selesai, Terakhir Aktif

### 2. **Data Absensi** (Tab Kedua) ⭐ **BARU**
- Daftar siswa untuk absensi harian
- Tambah siswa manual (tidak perlu daftar akun)
- Sistem absensi dengan 4 status
- Data tersimpan di localStorage (offline)

---

## 🎯 Cara Kerja Tab Absensi

### **A. Tambah Siswa**

1. Klik tab **"Data Absensi"**
2. Klik tombol **"+ Tambah Siswa"**
3. Isi form:
   - **Nama Siswa**: Nama lengkap
   - **Kelas**: Contoh `7A`, `8B`, `9C`
4. Klik **"Simpan"**
5. Siswa muncul di list absensi

### **B. Filter Berdasarkan Kelas**

1. Pilih kelas di filter (7A, 8A, 8B, dll)
2. Hanya siswa dari kelas tersebut yang tampil
3. Pilih **"Semua"** untuk lihat semua kelas

### **C. Absensi Harian**

Untuk setiap siswa, ada 4 tombol status:

- **Hadir** (hijau) - Siswa hadir
- **Sakit** (kuning) - Siswa sakit
- **Izin** (biru) - Siswa izin
- **Alpha** (merah) - Siswa tidak hadir tanpa keterangan

**Cara mengisi:**
1. Klik tombol status sesuai kehadiran siswa
2. Status akan berubah warna (highlight)
3. Status tersimpan otomatis

**Catatan:**
- Absensi per hari (hari ini)
- Bisa diubah sewaktu-waktu di hari yang sama
- Data tersimpan di browser (localStorage)

---

## 📊 Status Absensi

| Status | Warna | Emoji | Keterangan |
|--------|-------|-------|------------|
| Hadir | Hijau | ✓ | Siswa hadir di kelas |
| Sakit | Kuning | 🏥 | Siswa tidak masuk karena sakit |
| Izin | Biru | 📝 | Siswa izin (urusan keluarga, dll) |
| Alpha | Merah | ✗ | Tidak hadir tanpa keterangan |
| Belum diabsen | Abu | - | Belum diisi |

---

## 💾 Penyimpanan Data

### **Data Akun Game**
- **Sumber**: Database SQLite (backend)
- **Persistent**: Ya (tersimpan di server)
- **Sinkronisasi**: Otomatis saat fetch

### **Data Absensi**
- **Sumber**: localStorage browser
- **Persistent**: Ya (tersimpan di browser)
- **Sinkronisasi**: Tidak (per perangkat)
- **Format**: JSON

**Struktur data:**
```json
{
  "id": "1234567890",
  "name": "Rani Kusuma",
  "kelas": "7A",
  "attendance": [
    {
      "date": "2026-10-24",
      "status": "hadir"
    },
    {
      "date": "2026-10-23",
      "status": "sakit"
    }
  ]
}
```

---

## 🔧 Fitur Lengkap

### **Filter & Search**
- ✅ Search by nama
- ✅ Filter by kelas
- ✅ Tab switching (Game vs Absensi)

### **Data Akun Game**
- ✅ Fetch dari database
- ✅ Tampil level & XP
- ✅ Tampil misi selesai
- ✅ Tampil terakhir aktif

### **Data Absensi**
- ✅ Tambah siswa manual
- ✅ Absensi harian (4 status)
- ✅ Filter per kelas
- ✅ Visual status (warna badge)
- ✅ Data persistent (localStorage)

---

## 🎨 UI/UX

### **Tab Design**
- 2 tab dengan icon berbeda
- Badge counter menunjukkan jumlah siswa
- Active state jelas (border bottom + warna)

### **Add Student Modal**
- Modal overlay dengan backdrop
- Form sederhana (nama + kelas)
- Validasi input
- Button batal & simpan

### **Attendance Buttons**
- 4 button per siswa
- Hover effect
- Active state (bold + dark background)
- Responsive (stack di mobile)

### **Empty State**
- Icon besar
- Pesan jelas
- Call-to-action (tombol tambah)

---

## 📱 Responsive Design

### **Desktop**
- Table layout dengan grid 4 kolom
- Semua button inline
- Header terlihat

### **Mobile**
- Stack layout (vertical)
- Button attendance wrap
- Touch-friendly (button besar)

---

## 🧪 Testing Guide

### **Test 1: Tambah Siswa**
1. Buka Data Siswa → Tab "Data Absensi"
2. Klik "+ Tambah Siswa"
3. Isi: Nama = "Rani", Kelas = "7A"
4. Simpan
5. ✅ Siswa muncul di list

### **Test 2: Absensi**
1. Klik tombol "Hadir" untuk siswa Rani
2. ✅ Button Hadir jadi hijau bold
3. ✅ Badge "✓ Hadir" muncul di kolom status
4. Refresh browser (F5)
5. ✅ Status masih tersimpan

### **Test 3: Filter Kelas**
1. Tambah siswa di kelas berbeda (7A, 7B, 8A)
2. Klik filter "7A"
3. ✅ Hanya siswa kelas 7A yang tampil

### **Test 4: Ubah Status**
1. Klik "Hadir" untuk siswa
2. Klik "Sakit" untuk siswa yang sama
3. ✅ Status berubah dari Hadir ke Sakit

### **Test 5: Multiple Students**
1. Tambah 10 siswa dari berbagai kelas
2. Isi absensi untuk semua siswa
3. Filter per kelas
4. ✅ Semua fungsi berjalan lancar

---

## 🚀 Future Improvements (TODO)

### **Backend Integration**
- [ ] Save attendance to database (persistent across devices)
- [ ] API endpoints for attendance CRUD
- [ ] Sync localStorage to database

### **Reporting**
- [ ] Rekap absensi per siswa (history)
- [ ] Statistik kehadiran (%)
- [ ] Export ke Excel/PDF
- [ ] Grafik kehadiran per bulan

### **Advanced Features**
- [ ] Bulk attendance (absen semua hadir)
- [ ] Import siswa dari Excel
- [ ] Edit/Delete siswa absensi
- [ ] Catatan/keterangan per absensi
- [ ] Notifikasi jika belum absen
- [ ] History absensi (lihat minggu/bulan lalu)

### **UI Enhancements**
- [ ] Calendar view untuk absensi
- [ ] Print-friendly layout
- [ ] Dark mode support
- [ ] Drag to mark multiple students

---

## 📝 Catatan Penting

### **Perbedaan Data Akun vs Data Absensi**

| Aspek | Data Akun Game | Data Absensi |
|-------|----------------|--------------|
| Sumber | Database (backend) | localStorage |
| Cara tambah | Siswa daftar sendiri | Guru tambah manual |
| Purpose | Track progress game | Track kehadiran |
| Persistent | Ya (server) | Ya (browser) |
| Sync | Multi-device | Single device |

### **Kapan Pakai yang Mana?**

**Gunakan Data Akun Game untuk:**
- Melihat progress siswa di game
- Cek level & XP siswa
- Monitoring pembelajaran game

**Gunakan Data Absensi untuk:**
- Absensi harian kelas
- Track kehadiran siswa
- Rekap presensi

---

## 🎉 Summary

**Fitur absensi sudah siap digunakan!**

✅ Tab terpisah untuk Game vs Absensi  
✅ Tambah siswa manual (nama + kelas)  
✅ 4 status absensi (Hadir, Sakit, Izin, Alpha)  
✅ Filter per kelas  
✅ Data persistent di localStorage  
✅ UI responsive & user-friendly  

**Next**: Bisa dikembangkan dengan backend integration untuk sync data across devices dan reporting features.
