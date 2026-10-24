# 📡 SAHABAT BK - API Endpoints Documentation

## Base URL
- **Production:** `https://your-app.vercel.app/api`
- **Development:** `http://localhost:3002/api` (old) or `/api` (new serverless)

---

## 🔐 Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 📚 API Endpoints

### Root & Health Check

#### `GET /api`
Get API information and available endpoints.

**Response:**
```json
{
  "status": "OK",
  "message": "SAHABAT BK API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoints": ["..."]
}
```

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 👤 Authentication Endpoints

### Student

#### `POST /api/auth/register-student`
Register new student account.

**Body:**
```json
{
  "name": "Budi Santoso",
  "username": "budi123",
  "password": "password123",
  "kelas": "7A",
  "gender": "male"
}
```

**Response:**
```json
{
  "user": { "id": "uuid", "email": "budi123@sahabatbk.internal" },
  "profile": { "id": "uuid", "role": "student", "name": "Budi Santoso", ... },
  "token": "jwt-token"
}
```

#### `POST /api/auth/login-student`
Login student.

**Body:**
```json
{
  "username": "budi123",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { "id": "uuid", "email": "..." },
  "profile": { "id": "uuid", "name": "...", "xp": 100, "level": 2, ... },
  "token": "jwt-token"
}
```

### Teacher

#### `POST /api/auth/register-teacher`
Register new teacher account.

**Body:**
```json
{
  "name": "Ibu Rina",
  "email": "rina@school.com",
  "password": "password123",
  "school": "SMP Negeri 1"
}
```

#### `POST /api/auth/login-teacher`
Login teacher.

**Body:**
```json
{
  "email": "rina@school.com",
  "password": "password123"
}
```

### Profile

#### `GET /api/auth/profile`
Get current user profile. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "role": "student",
  "name": "Budi Santoso",
  "username": "budi123",
  "kelas": "7A",
  "xp": 100,
  "level": 2,
  "coins": 500
}
```

---

## 👨‍🏫 Teacher Endpoints

### Students Management

#### `GET /api/teacher/students`
Get all students with their progress. **Teacher only.**

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Budi Santoso",
    "username": "budi123",
    "kelas": "7A",
    "gender": "male",
    "avatar": "boy1",
    "xp": 100,
    "level": 2,
    "coins": 500,
    "missionsCompleted": 0,
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
]
```

### Missions Management

#### `GET /api/teacher/missions`
Get all missions. **Teacher only.**

#### `POST /api/teacher/missions`
Create new mission. **Teacher only.**

**Body:**
```json
{
  "title": "Memahami Emosi",
  "description": "Belajar mengenali dan mengelola emosi",
  "category": "pribadi",
  "difficulty": "mudah",
  "worldId": "world-1",
  "xpReward": 20,
  "coinReward": 50,
  "estimatedMinutes": 10,
  "status": "active"
}
```

#### `PUT /api/teacher/missions/:id`
Update mission by ID. **Teacher only.**

#### `DELETE /api/teacher/missions/:id`
Delete mission by ID. **Teacher only.**

### Case Studies Management

#### `GET /api/teacher/case-studies`
Get all case studies. **Teacher only.**

#### `POST /api/teacher/case-studies`
Create new case study. **Teacher only.**

**Body:**
```json
{
  "title": "Kasus Bullying di Sekolah",
  "description": "Membantu siswa mengatasi bullying",
  "category": "Sosial Emosional",
  "story": "Di sebuah sekolah...",
  "missionsCount": 4,
  "status": "active"
}
```

#### `PUT /api/teacher/case-studies/:id`
Update case study by ID. **Teacher only.**

#### `DELETE /api/teacher/case-studies/:id`
Delete case study by ID. **Teacher only.**

### Classes Management

#### `GET /api/teacher/classes`
Get all classes. **Teacher only.**

#### `POST /api/teacher/classes`
Create new class. **Teacher only.**

**Body:**
```json
{
  "name": "7A",
  "grade": 7,
  "teacherName": "Ibu Rina",
  "studentCount": 30
}
```

#### `PUT /api/teacher/classes/:id`
Update class by ID. **Teacher only.**

#### `DELETE /api/teacher/classes/:id`
Delete class by ID. **Teacher only.**

### Attendance Management

#### `GET /api/teacher/attendance/students`
Get all attendance students with records. **Teacher only.**

**Response:**
```json
[
  {
    "id": "att-123",
    "name": "Budi Santoso",
    "kelas": "7A",
    "attendance": [
      { "date": "2024-01-15", "status": "hadir" },
      { "date": "2024-01-14", "status": "sakit" }
    ]
  }
]
```

#### `POST /api/teacher/attendance/students`
Add new student to attendance list. **Teacher only.**

**Body:**
```json
{
  "name": "Budi Santoso",
  "kelas": "7A"
}
```

#### `DELETE /api/teacher/attendance/students/:id`
Delete student from attendance list. **Teacher only.**

#### `POST /api/teacher/attendance/mark`
Mark attendance for a student. **Teacher only.**

**Body:**
```json
{
  "studentId": "att-123",
  "date": "2024-01-15",
  "status": "hadir"
}
```

**Valid status:** `hadir`, `sakit`, `izin`, `alpa`

#### `GET /api/teacher/attendance/records?date=2024-01-15`
Get attendance records by date or summary. **Teacher only.**

**Query Parameters:**
- `date` (optional): Get records for specific date

**Response (with date):**
```json
[
  {
    "id": "rec-123",
    "student_id": "att-123",
    "date": "2024-01-15",
    "status": "hadir",
    "name": "Budi Santoso",
    "kelas": "7A"
  }
]
```

**Response (without date - summary):**
```json
[
  {
    "date": "2024-01-15",
    "total": 30,
    "hadir": 28,
    "izin": 1,
    "sakit": 1,
    "alpa": 0
  }
]
```

---

## 🎮 Student Endpoints

### Missions

#### `GET /api/student/missions`
Get current student's mission progress. **Student only.**

**Response:**
```json
[
  {
    "mission_id": "mission-123",
    "status": "completed",
    "score": 100,
    "completed_at": "2024-01-15T10:30:00.000Z"
  }
]
```

#### `POST /api/student/missions/complete`
Complete a mission and earn rewards. **Student only.**

**Body:**
```json
{
  "missionId": "mission-123",
  "score": 100,
  "xpReward": 20,
  "coinReward": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Misi berhasil diselesaikan!",
  "progress": {
    "xp": 120,
    "level": 2,
    "coins": 550
  }
}
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "error": "Semua field wajib diisi"
}
```

### 401 Unauthorized
```json
{
  "error": "Token tidak ditemukan"
}
```

### 403 Forbidden
```json
{
  "error": "Akses ditolak"
}
```

### 404 Not Found
```json
{
  "error": "User tidak ditemukan"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Gagal memproses permintaan"
}
```

---

## 🧪 Testing

### Using cURL

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Register student
curl -X POST https://your-app.vercel.app/api/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","username":"budi123","password":"password123","kelas":"7A","gender":"male"}'

# Login student
curl -X POST https://your-app.vercel.app/api/auth/login-student \
  -H "Content-Type: application/json" \
  -d '{"username":"budi123","password":"password123"}'

# Get profile (with token)
curl https://your-app.vercel.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
Import collection dari repository atau gunakan endpoints di atas.

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs use UUID v4 format
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- CORS enabled for all origins (development)
- Database uses PostgreSQL with @neondatabase/serverless

---

## 🔄 Migration from Old API

**Old:** `https://sahabatbk-api.onrender.com/api/*`
**New:** `https://your-app.vercel.app/api/*`

All endpoints remain the same, just change the base URL.

---

Happy coding! 🚀
