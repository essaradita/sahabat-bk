# Panduan Testing Mode Kelompok

## Cara Menggunakan Fitur Mode Kelompok

### 1️⃣ **Akses Mode Kelompok**
Dari Dashboard Siswa, klik tombol **"Mode Kelompok 👥"**

### 2️⃣ **Isi Data Kelompok (Step 1)**

#### Form yang harus diisi:
- **Nama Kelompok** (wajib)
  - Contoh: "Kelompok Hebat", "Tim Juara"
- **Anggota Kelompok** (minimal 2 orang)
  - Klik "+ Tambah Anggota" untuk menambah
  - Klik tombol "×" untuk menghapus anggota
  - Maksimal 6 anggota

#### Tombol:
- **"Lanjut ke Pilih Studi Kasus →"** - Validasi form dan lanjut ke Step 2

---

### 3️⃣ **Pilih Studi Kasus (Step 2)**

#### 3 Studi Kasus Tersedia:

**A. Rani dan Presentasi** (Kepercayaan Diri)
- Tentang: Rani takut presentasi di depan kelas
- Fokus: Mengatasi pikiran negatif dan meningkatkan kepercayaan diri

**B. Budi dan Tugas Kelompok** (Kerja Sama)
- Tentang: Budi bekerja sendirian dalam tugas kelompok
- Fokus: Komunikasi asertif dan menyelesaikan konflik

**C. Siti dan Pertemanan** (Sosial Emosional)
- Tentang: Siti merasa kesepian di sekolah baru
- Fokus: Membangun pertemanan dan keterampilan sosial

#### Tombol:
- **"← Kembali"** - Kembali ke form
- **"Lihat Peta Misi →"** - Lanjut ke halaman penjelasan (disabled jika belum pilih)

---

### 4️⃣ **Halaman Penjelasan Studi Kasus**

#### Konten yang ditampilkan:
- 📖 **Cerita Lengkap**: Konteks dan latar belakang masalah
- 🎯 **4 Misi Overview**: Detil setiap misi yang akan dikerjakan
  - Misi 1: Detektif Pikiran 🔍
  - Misi 2: Cari Kekuatan 💪
  - Misi 3: Ubah Pikiran 🔄
  - Misi 4: Pilih Strategi 🎯
- 🏁 **Challenge Final**: Informasi challenge yang akan dikerjakan
- 💡 **Tips Kelompok**: Cara kerja sama yang efektif
- 👥 **Anggota**: Daftar semua anggota kelompok

#### Tombol:
- **"🗺️ Mulai Petualangan! →"** - Masuk ke peta misi
  - ✅ Button sudah inline, tidak ketutup navbar
  - ✅ Ada padding bottom yang cukup

---

### 5️⃣ **Peta Misi (Map View)**

#### Visual:
- Background: Gambar peta petualangan (`petahp1.png`)
- 4 Mission nodes dengan positioning vertikal
- Karakter anak kecil yang bergerak sesuai progress
- Challenge badge di bagian atas

#### Status Misi:

**🟢 AVAILABLE (Tersedia)**
- Badge: Purple/pink gradient dengan icon misi
- Effect: Glow animation (berkedip)
- Bisa diklik untuk memulai misi

**⭐ COMPLETED (Selesai)**
- Badge: Gold/amber gradient dengan bintang
- Card: Teal/green gradient
- Bisa diklik untuk melihat detail

**🔒 LOCKED (Terkunci)**
- Badge: Gray gradient dengan icon gembok
- Card: Dark gray
- Tidak bisa diklik
- Muncul tooltip saat hover

#### Progressive Unlock:
```
Awal:       Misi 1 ✓ available | Misi 2 🔒 | Misi 3 🔒 | Misi 4 🔒
Selesai M1: Misi 1 ⭐ | Misi 2 ✓ available | Misi 3 🔒 | Misi 4 🔒
Selesai M2: Misi 1 ⭐ | Misi 2 ⭐ | Misi 3 ✓ available | Misi 4 🔒
Selesai M3: Misi 1 ⭐ | Misi 2 ⭐ | Misi 3 ⭐ | Misi 4 ✓ available
Selesai M4: Misi 1 ⭐ | Misi 2 ⭐ | Misi 3 ⭐ | Misi 4 ⭐ | 🏁 Challenge UNLOCKED
```

#### Challenge Badge:
- **Sebelum 4 misi selesai**: Gray, disabled, text "Selesaikan 4 misi dulu"
- **Setelah 4 misi selesai**: Orange/red, clickable, text "Klik untuk mulai!"

#### Tombol:
- **Reset** (kanan atas, muncul jika ada progress) - Reset progress untuk testing

---

### 6️⃣ **Play Mission**

#### Struktur:
- **Header**: Nama studi kasus, nama kelompok, progress bar
- **Mission Content**: 
  - Icon dan judul misi
  - Pertanyaan essay (textarea)
  - Atau checkbox untuk pilihan strategi
- **Collaboration Tip**: Reminder untuk diskusi bersama
- **Navigation**: 
  - "← Kembali" (jika bukan misi pertama)
  - "Selesai & Kembali ke Peta 🗺️" (setelah jawab)

#### Flow:
1. Baca pertanyaan
2. Diskusi dengan kelompok
3. Isi jawaban
4. Klik "Selesai & Kembali ke Peta"
5. Otomatis kembali ke peta dengan misi ditandai completed

---

### 7️⃣ **Challenge Final**

#### Aktivasi:
- Muncul setelah 4 misi selesai
- Klik badge orange 🏁 di peta

#### Konten:
- **Instruksi**: Setiap anggota berbicara 30 detik
- **Timer**: 30 detik per orang
- **Checklist**: Centang setelah anggota selesai
- **Tombol**: "Challenge Selesai!" (hijau)

#### Flow:
1. Baca instruksi challenge
2. Setiap anggota praktik berbicara (30 detik)
3. Centang nama anggota yang sudah selesai
4. Klik "Challenge Selesai!"
5. Klik "Selesai & Lihat Hasil ✨"

---

### 8️⃣ **Halaman Complete**

#### Konten:
- 🏆 Trophy dengan confetti animation
- Nama studi kasus yang selesai
- Info kelompok dan anggota
- Statistik:
  - Jumlah misi selesai
  - Status challenge
- Refleksi kelompok (textarea, opsional)

#### Tombol:
- **"Coba Studi Kasus Lain"** - Kembali ke pilih studi kasus
- **"Kembali ke Beranda"** - Ke dashboard

---

## Testing Checklist

### ✅ Visual & Responsiveness
- [ ] Semua button visible di mobile (tidak ketutup navbar)
- [ ] Text readable dengan ukuran font yang sesuai
- [ ] Background image peta tampil dengan benar
- [ ] Icon dan badge terlihat jelas
- [ ] Padding bottom cukup di semua halaman

### ✅ Navigation Flow
- [ ] Dashboard → Group Mode works
- [ ] Form validation works (nama kelompok & minimal 2 anggota)
- [ ] Form → Select Case works
- [ ] Select Case → Intro works
- [ ] Intro → Map works (button tidak ketutup)
- [ ] Map → Mission Play works
- [ ] Mission Play → Back to Map works
- [ ] Map → Challenge works (setelah 4 misi selesai)
- [ ] Challenge → Complete works

### ✅ Progressive Unlock
- [ ] Hanya Misi 1 available di awal
- [ ] Misi 2 unlock setelah Misi 1 selesai
- [ ] Misi 3 unlock setelah Misi 2 selesai
- [ ] Misi 4 unlock setelah Misi 3 selesai
- [ ] Challenge unlock setelah semua 4 misi selesai
- [ ] Misi yang locked tidak bisa diklik

### ✅ Visual Indicators
- [ ] Available mission: Purple/pink gradient + glow
- [ ] Completed mission: Gold gradient + star ⭐
- [ ] Locked mission: Gray gradient + lock 🔒
- [ ] Character moves to current mission position
- [ ] Challenge badge changes from gray to orange

### ✅ Data Persistence
- [ ] Completed missions tersimpan di localStorage
- [ ] Progress tidak hilang saat back/forward
- [ ] Reset button works untuk testing

### ✅ Content Display
- [ ] Full story tampil di Intro page
- [ ] 4 mission overview tampil lengkap
- [ ] Challenge info tampil
- [ ] Tips dan member list tampil
- [ ] Questions tampil di mission play
- [ ] Confetti animation di complete page

---

## Common Issues & Solutions

### Issue 1: Button ketutup navbar
**Solution**: Sudah fixed dengan `pb-28` di CaseStudyIntro

### Issue 2: Progress hilang saat refresh
**Solution**: Progress disimpan di localStorage dengan key `group_progress_{caseId}`

### Issue 3: Misi tidak unlock
**Solution**: Check console, pastikan `completedMission` passed via navigation state

### Issue 4: Character tidak di posisi yang benar
**Solution**: Character position calculated based on first available mission

---

## Development Notes

### LocalStorage Keys:
- `group_progress_case-1` - Progress untuk studi kasus Rani
- `group_progress_case-2` - Progress untuk studi kasus Budi
- `group_progress_case-3` - Progress untuk studi kasus Siti

### Routes:
- `/student/group-mode` - Form dan select case
- `/student/case-study-intro/:caseId` - Penjelasan studi kasus
- `/student/group-map/:caseId` - Peta misi
- `/student/case-study/:caseId/mission/:missionId` - Play mission
- `/student/case-study/:caseId/mission/challenge` - Challenge
- `/student/case-study-complete` - Results page

### State Management:
- Group data (name, members) passed via `location.state`
- Completed missions tracked in localStorage
- Mission unlock logic in GroupMap component

---

## Next Steps (Future Improvements)

1. **Database Integration**
   - Save group progress to database
   - Teacher can monitor group progress
   - Generate reports

2. **Timer for Challenge**
   - Actual 30-second countdown timer
   - Sound effects when time's up

3. **Answer Validation**
   - Minimum character count for essay questions
   - Required fields validation

4. **Scoring System**
   - Points for each mission
   - Leaderboard for groups

5. **Feedback from Teacher**
   - Teacher can review group answers
   - Provide comments and suggestions

---

**Happy Testing! 🎉**
