# 🚀 Fitur Backend API - Persistent Data

## ✅ Status: SELESAI & SIAP DIGUNAKAN

Backend API untuk Bank Soal telah berhasil diimplementasikan dengan fitur **persistent data** ke database SQLite.

---

## 📊 Database Schema

### 1. **missions** (Misi Individu)
```sql
CREATE TABLE missions (
  id TEXT PRIMARY KEY,              -- mission-1234567890
  title TEXT NOT NULL,              -- "Mengenal Diriku"
  description TEXT,                 -- Deskripsi misi
  category TEXT,                    -- pribadi, sosial, belajar, karier
  difficulty TEXT,                  -- mudah, sedang, sulit
  world_id TEXT,                    -- world-1, world-2, dst
  xp_reward INTEGER DEFAULT 20,    -- XP yang didapat
  coin_reward INTEGER DEFAULT 50,  -- Koin yang didapat
  estimated_minutes INTEGER DEFAULT 10,  -- Estimasi waktu
  thumbnail TEXT,                   -- URL gambar (optional)
  status TEXT DEFAULT 'active',    -- active, locked, draft
  created_at DATETIME,
  updated_at DATETIME
)
```

### 2. **case_studies** (Studi Kasus Kelompok)
```sql
CREATE TABLE case_studies (
  id TEXT PRIMARY KEY,              -- case-1234567890
  title TEXT NOT NULL,              -- "Rani dan Presentasi"
  description TEXT,                 -- Deskripsi singkat
  category TEXT,                    -- Kepercayaan Diri, Kerja Sama, dst
  story TEXT,                       -- Cerita lengkap (untuk intro)
  missions_count INTEGER DEFAULT 4, -- Jumlah misi (default 4)
  status TEXT DEFAULT 'active',    -- active, draft
  created_at DATETIME,
  updated_at DATETIME
)
```

### 3. **questions** (Soal-soal)
```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  mission_id TEXT,                  -- FK ke missions
  case_study_id TEXT,               -- FK ke case_studies
  question_text TEXT NOT NULL,      -- Teks pertanyaan
  question_type TEXT,               -- multiple_choice, essay, rating
  options TEXT,                     -- JSON array untuk pilihan ganda
  correct_answer TEXT,              -- Jawaban benar (untuk multiple choice)
  order_num INTEGER,                -- Urutan soal
  created_at DATETIME
)
```

---

## 🔗 Backend API Endpoints

### **Missions (Misi Individu)**

#### 1. GET `/api/teacher/missions`
Mengambil semua misi
- **Auth**: Required (Teacher)
- **Response**: Array of missions

#### 2. POST `/api/teacher/missions`
Membuat misi baru
- **Auth**: Required (Teacher)
- **Body**:
```json
{
  "title": "Judul Misi",
  "description": "Deskripsi",
  "category": "pribadi",
  "difficulty": "mudah",
  "worldId": "world-1",
  "xpReward": 20,
  "coinReward": 50,
  "estimatedMinutes": 10,
  "status": "active"
}
```
- **Response**: `{ success: true, mission: {...} }`

#### 3. PUT `/api/teacher/missions/:id`
Update misi
- **Auth**: Required (Teacher)
- **Body**: Same as POST
- **Response**: `{ success: true, mission: {...} }`

#### 4. DELETE `/api/teacher/missions/:id`
Hapus misi
- **Auth**: Required (Teacher)
- **Response**: `{ success: true, message: "..." }`

---

### **Case Studies (Studi Kasus Kelompok)**

#### 1. GET `/api/teacher/case-studies`
Mengambil semua studi kasus
- **Auth**: Required (Teacher)
- **Response**: Array of case studies

#### 2. POST `/api/teacher/case-studies`
Membuat studi kasus baru
- **Auth**: Required (Teacher)
- **Body**:
```json
{
  "title": "Judul Kasus",
  "description": "Deskripsi singkat",
  "category": "Sosial Emosional",
  "story": "Cerita lengkap...",
  "missionsCount": 4,
  "status": "active"
}
```
- **Response**: `{ success: true, caseStudy: {...} }`

#### 3. PUT `/api/teacher/case-studies/:id`
Update studi kasus
- **Auth**: Required (Teacher)
- **Body**: Same as POST
- **Response**: `{ success: true, caseStudy: {...} }`

#### 4. DELETE `/api/teacher/case-studies/:id`
Hapus studi kasus
- **Auth**: Required (Teacher)
- **Response**: `{ success: true, message: "..." }`

---

## 💻 Frontend Integration

### **API Client Methods** (`src/lib/api.js`)

```javascript
// Mission Management (Teacher)
apiClient.getMissions()                      // Get all missions
apiClient.createMission(data)                // Create new mission
apiClient.updateMission(id, data)            // Update mission
apiClient.deleteMission(id)                  // Delete mission

// Case Study Management (Teacher)
apiClient.getCaseStudies()                   // Get all case studies
apiClient.createCaseStudy(data)              // Create new case study
apiClient.updateCaseStudy(id, data)          // Update case study
apiClient.deleteCaseStudy(id)                // Delete case study

// Student Mission Progress
apiClient.getStudentMissions()               // Get student's mission progress
apiClient.completeMission(id, score, xp, coins)  // Complete a mission
```

---

## 🎯 Fitur yang Sudah Berfungsi

### ✅ **Bank Soal Individu** (`QuestionBank.jsx`)
- **Fetch**: Load semua misi dari database saat halaman dibuka
- **Loading State**: Tampil spinner saat loading
- **Fallback**: Jika database kosong, gunakan demo data
- **Delete**: Hapus misi dari database (dengan konfirmasi)
- **Duplicate**: Duplikasi misi dan simpan ke database
- **Edit**: Button edit (TODO: buat halaman editor)

### ✅ **Bank Soal Kelompok** (`CaseStudies.jsx`)
- **Fetch**: Load semua studi kasus dari database
- **Loading State**: Tampil spinner saat loading
- **Delete**: Hapus studi kasus dari database (dengan konfirmasi)
- **Duplicate**: Duplikasi studi kasus dan simpan ke database
- **Preview**: Preview sebagai student (redirect ke intro page)
- **Edit**: Button edit (TODO: buat halaman editor)

### ✅ **Student Mission Progress** (`useMissionProgress.js`)
- **Fetch**: Load progress dari `/api/student/missions`
- **Status Tracking**: Merge demo missions dengan progress dari database
- **Auto Unlock**: Mission unlock secara bertahap

---

## 🔄 Cara Kerja Data Flow

### **Teacher membuat misi baru:**
1. User klik "Misi Baru" di Bank Soal
2. Frontend panggil `apiClient.createMission(data)`
3. Backend insert ke table `missions`
4. Frontend update state dan tampilkan misi baru

### **Teacher hapus misi:**
1. User klik tombol hapus (trash icon)
2. Konfirmasi "Yakin ingin menghapus?"
3. Frontend panggil `apiClient.deleteMission(id)`
4. Backend delete dari table `missions`
5. Frontend remove dari state (UI update otomatis)

### **Teacher duplikasi misi:**
1. User klik tombol duplicate (copy icon)
2. Frontend copy data misi + tambahkan " (Copy)" di judul
3. Frontend panggil `apiClient.createMission(dataCopy)`
4. Backend insert misi baru dengan ID baru
5. Frontend tambahkan ke state dan tampilkan

### **Student selesaikan misi:**
1. Student selesai mission dan dapat XP + coins
2. Frontend panggil `apiClient.completeMission(id, score, xp, coins)`
3. Backend:
   - Insert/update `mission_progress` table
   - Update XP & coins di `student_progress` table
4. Frontend refresh profile (XP & coins update otomatis)

---

## 📝 TODO: Fitur Berikutnya

### 🔨 **Mission Editor Page**
- [ ] Buat halaman `/teacher/question-bank/mission/:id`
- [ ] Form untuk edit judul, deskripsi, kategori, difficulty
- [ ] CRUD untuk soal-soal (questions table)
- [ ] Preview mode untuk lihat misi sebagai student

### 🔨 **Case Study Editor Page**
- [ ] Buat halaman `/teacher/case-studies/edit/:id`
- [ ] Form untuk edit judul, deskripsi, kategori, story
- [ ] CRUD untuk soal-soal per misi
- [ ] Preview mode untuk lihat case study sebagai student

### 🔨 **Questions Management**
- [ ] API endpoints untuk CRUD questions
- [ ] Drag & drop untuk urutan soal
- [ ] Support multiple question types
- [ ] Image upload untuk soal

### 🔨 **Better Error Handling**
- [ ] Replace `alert()` dengan Toast notification component
- [ ] Network error handling (offline mode)
- [ ] Retry mechanism untuk failed requests

### 🔨 **Data Validation**
- [ ] Validasi di backend (schema validation)
- [ ] Client-side validation sebelum submit
- [ ] Better error messages

---

## 🧪 Cara Testing

### **Test Create Mission:**
1. Login sebagai teacher
2. Buka "Bank Soal" → Tab "Bank Soal Individu"
3. Klik "Misi Baru" (coming soon)
4. Isi form dan simpan
5. Cek apakah misi baru muncul di list

### **Test Delete Mission:**
1. Login sebagai teacher
2. Buka "Bank Soal"
3. Klik tombol trash (🗑️) pada salah satu misi
4. Konfirmasi hapus
5. Cek apakah misi hilang dari list
6. Restart server dan cek apakah masih hilang (persistent)

### **Test Duplicate Mission:**
1. Login sebagai teacher
2. Buka "Bank Soal"
3. Klik tombol copy (📋) pada salah satu misi
4. Cek apakah misi baru muncul dengan judul + " (Copy)"
5. Restart server dan cek apakah masih ada (persistent)

### **Test dengan Database:**
```bash
# Cek isi database
cd server
sqlite3 database.sqlite

# Query untuk melihat misi
SELECT * FROM missions;

# Query untuk melihat case studies
SELECT * FROM case_studies;

# Exit
.exit
```

---

## 🎉 Kesimpulan

✅ **Backend API sudah selesai dan berfungsi**
✅ **Data tersimpan persistent di SQLite database**
✅ **Frontend sudah terintegrasi dengan loading states**
✅ **Delete & Duplicate sudah berfungsi sempurna**
✅ **Error handling sudah ada (bisa diperbaiki lagi)**

**Status**: Sistem dasar sudah jalan, tinggal buat halaman editor untuk create/edit missions & case studies.
