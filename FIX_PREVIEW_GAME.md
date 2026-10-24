# FIX: Preview Game Mode Selection

## Masalah
Ketika guru klik "Mode Individu" atau "Mode Kelompok" di Preview Game, malah kembali ke dashboard guru dan tidak bisa mulai permainan.

## Penyebab
- `PreviewGame.jsx` mengirim state `{previewMode: true}` ke route student
- `ProtectedRoute.jsx` mengecek role user, dan memblokir guru dari route student
- State `previewMode` hilang ketika navigasi di dalam route student

## Solusi
### 1. Update ProtectedRoute.jsx
- Mendeteksi `previewMode: true` dari location state
- Menyimpan preview mode ke `sessionStorage` agar persisten
- Mengizinkan guru akses route student ketika dalam preview mode
- Preview mode berlaku untuk semua navigasi di route student

### 2. Update StudentLayout.jsx
- Menambahkan banner "Mode Preview" di atas ketika guru dalam preview mode
- Banner menampilkan info "Anda melihat sebagai siswa"
- Tombol "Keluar" untuk kembali ke dashboard guru
- Banner sticky di atas halaman dengan warna orange/amber

## Cara Kerja
1. Guru klik "Mode Individu" atau "Mode Kelompok" di Preview Game
2. Navigate ke `/student/dashboard` atau `/student/group-mode` dengan state `previewMode: true`
3. ProtectedRoute deteksi preview mode dan simpan ke sessionStorage
4. Guru bisa navigasi bebas di semua route student (map, journal, profile, dll)
5. Banner "Mode Preview" muncul di atas dengan tombol "Keluar"
6. Klik "Keluar" untuk hapus preview mode dan kembali ke dashboard guru

## Files Modified
- `src/components/ProtectedRoute.jsx` - Added preview mode detection & sessionStorage
- `src/layouts/StudentLayout.jsx` - Added preview mode banner with exit button

## Testing
1. Login sebagai guru
2. Buka Preview Game dari dashboard
3. Klik "Mode Individu" - harus bisa masuk ke student dashboard
4. Klik "Mode Kelompok" - harus bisa masuk ke group mode
5. Navigasi ke menu lain (Peta Misi, Jurnal, Profil) - preview mode tetap aktif
6. Banner orange "Mode Preview" muncul di atas
7. Klik "Keluar" - kembali ke dashboard guru
