# 🧪 Test API Vercel Full-Stack

## Quick Test Commands

Ganti `YOUR_VERCEL_URL` dengan URL Vercel Anda.

### 1. Health Check
```bash
curl https://YOUR_VERCEL_URL.vercel.app/api/health
```

Expected:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. API Info
```bash
curl https://YOUR_VERCEL_URL.vercel.app/api
```

### 3. Register Student
```bash
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "username": "teststudent",
    "password": "password123",
    "kelas": "7A",
    "gender": "male"
  }'
```

Expected: Returns user object with token

### 4. Login Student
```bash
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/auth/login-student \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teststudent",
    "password": "password123"
  }'
```

Save the token from response!

### 5. Get Profile (with token)
```bash
curl https://YOUR_VERCEL_URL.vercel.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Register Teacher
```bash
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/auth/register-teacher \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Teacher",
    "email": "testteacher@school.com",
    "password": "password123",
    "school": "SMP Test"
  }'
```

### 7. Login Teacher
```bash
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/auth/login-teacher \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testteacher@school.com",
    "password": "password123"
  }'
```

### 8. Get Students (Teacher)
```bash
curl https://YOUR_VERCEL_URL.vercel.app/api/teacher/students \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

### 9. Create Mission (Teacher)
```bash
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/teacher/missions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE" \
  -d '{
    "title": "Test Mission",
    "description": "This is a test mission",
    "category": "pribadi",
    "difficulty": "mudah",
    "worldId": "world-1",
    "xpReward": 20,
    "coinReward": 50,
    "estimatedMinutes": 10,
    "status": "active"
  }'
```

### 10. Complete Mission (Student)
```bash
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/student/missions/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN_HERE" \
  -d '{
    "missionId": "mission-123",
    "score": 100,
    "xpReward": 20,
    "coinReward": 50
  }'
```

---

## Browser Testing

### Using Browser Console

Open browser console (F12) and run:

```javascript
// Set your Vercel URL
const API_URL = 'https://YOUR_VERCEL_URL.vercel.app/api';

// Test health
fetch(`${API_URL}/health`)
  .then(r => r.json())
  .then(console.log);

// Register student
fetch(`${API_URL}/auth/register-student`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Student',
    username: 'teststudent' + Date.now(),
    password: 'password123',
    kelas: '7A',
    gender: 'male'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Register success:', data);
  localStorage.setItem('token', data.token);
});

// Login student
fetch(`${API_URL}/auth/login-student`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'teststudent',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login success:', data);
  localStorage.setItem('token', data.token);
});

// Get profile
const token = localStorage.getItem('token');
fetch(`${API_URL}/auth/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

---

## Test Checklist

- [ ] ✅ Health check returns healthy
- [ ] ✅ API root returns endpoint list
- [ ] ✅ Student registration works
- [ ] ✅ Student login works
- [ ] ✅ Get profile with token works
- [ ] ✅ Teacher registration works
- [ ] ✅ Teacher login works
- [ ] ✅ Teacher can get students list
- [ ] ✅ Teacher can create mission
- [ ] ✅ Teacher can update mission
- [ ] ✅ Teacher can delete mission
- [ ] ✅ Teacher can create case study
- [ ] ✅ Teacher can create class
- [ ] ✅ Teacher can manage attendance
- [ ] ✅ Student can get missions
- [ ] ✅ Student can complete mission
- [ ] ✅ XP and coins update correctly

---

## Monitoring

### Vercel Dashboard
1. Go to project on Vercel
2. Click "Functions" tab
3. See all serverless functions
4. Click on any function to see logs

### Real-time Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs
```

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Install Apache Bench (ab)
# On Ubuntu: sudo apt-get install apache2-utils
# On Mac: already included

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 https://YOUR_VERCEL_URL.vercel.app/api/health
```

### Expected Performance
- Response time: < 200ms
- Uptime: 99.9%
- Cold start: < 1s
- Warm requests: < 100ms

---

## Common Issues

### CORS Errors
If you see CORS errors in browser:
- Check vercel.json headers configuration
- Ensure API is returning correct CORS headers
- Clear browser cache

### Database Connection Timeout
- Check POSTGRES_URL is correct
- Check database is running
- Check connection limit not exceeded

### 401 Unauthorized
- Token expired (tokens last 7 days)
- Token invalid (wrong JWT_SECRET)
- Token not sent in header

### 500 Internal Server Error
- Check Vercel function logs
- Check database schema is imported
- Check all environment variables are set

---

Happy Testing! 🧪
