# ⚡ Quick Reference - Vercel Serverless

## 🎯 Quick Deploy (5 Steps)

```bash
# 1. Setup Database (Neon)
# Go to: https://neon.tech
# Create project → Copy connection string

# 2. Generate JWT Secret
openssl rand -base64 32

# 3. Push to GitHub
git add .
git commit -m "Migrate to Vercel serverless"
git push origin main

# 4. Deploy on Vercel
# Go to: https://vercel.com
# Import repository → Add env vars → Deploy

# 5. Test
curl https://your-app.vercel.app/api/health
```

---

## 🔧 Environment Variables

```env
# Required for Vercel deployment
POSTGRES_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
JWT_SECRET=your-32-char-secret-key-here
```

---

## 📡 API Endpoints Summary

### Base URL
```
Production: https://your-app.vercel.app/api
```

### Authentication
```bash
POST /api/auth/register-student    # Register student
POST /api/auth/register-teacher    # Register teacher
POST /api/auth/login-student       # Login student
POST /api/auth/login-teacher       # Login teacher
GET  /api/auth/profile             # Get profile (auth required)
```

### Teacher Endpoints
```bash
GET    /api/teacher/students              # Get all students
GET    /api/teacher/missions              # Get missions
POST   /api/teacher/missions              # Create mission
PUT    /api/teacher/missions/:id          # Update mission
DELETE /api/teacher/missions/:id          # Delete mission
GET    /api/teacher/case-studies          # Get case studies
POST   /api/teacher/case-studies          # Create case study
PUT    /api/teacher/case-studies/:id      # Update case study
DELETE /api/teacher/case-studies/:id      # Delete case study
GET    /api/teacher/classes               # Get classes
POST   /api/teacher/classes               # Create class
PUT    /api/teacher/classes/:id           # Update class
DELETE /api/teacher/classes/:id           # Delete class
GET    /api/teacher/attendance/students   # Get attendance students
POST   /api/teacher/attendance/students   # Add student
DELETE /api/teacher/attendance/students/:id # Delete student
POST   /api/teacher/attendance/mark       # Mark attendance
GET    /api/teacher/attendance/records    # Get records
```

### Student Endpoints
```bash
GET  /api/student/missions           # Get missions progress
POST /api/student/missions/complete  # Complete mission
```

---

## 🧪 Quick Test Commands

```bash
# Replace YOUR_APP with your Vercel URL

# Health check
curl https://YOUR_APP.vercel.app/api/health

# Register student
curl -X POST https://YOUR_APP.vercel.app/api/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","username":"test123","password":"password123","kelas":"7A","gender":"male"}'

# Login student
curl -X POST https://YOUR_APP.vercel.app/api/auth/login-student \
  -H "Content-Type: application/json" \
  -d '{"username":"test123","password":"password123"}'
```

---

## 📁 Project Structure

```
/api                              # Serverless functions
├── index.js                      # Root endpoint
├── health.js                     # Health check
├── /auth                         # Authentication
├── /teacher                      # Teacher features
└── /student                      # Student features

/lib
└── db-postgres.js               # Database connection

/src                             # Frontend (unchanged)
└── ...
```

---

## 🔍 Common Issues & Fixes

### Issue: "POSTGRES_URL not found"
```bash
# Fix: Add in Vercel dashboard
Settings → Environment Variables → Add POSTGRES_URL
```

### Issue: "Token invalid"
```bash
# Fix: Check JWT_SECRET matches
# Logout and login again
```

### Issue: Database connection failed
```bash
# Fix: Verify connection string
# Ensure ?sslmode=require at the end
# Check database is active in Neon
```

### Issue: CORS error
```bash
# Fix: Already configured in vercel.json
# Clear browser cache (Ctrl+Shift+Delete)
```

---

## 📊 Performance Expectations

| Metric | Expected |
|--------|----------|
| Cold start | < 1s |
| Warm response | 50-200ms |
| Uptime | 99.9% |
| Availability | Always active |

---

## 💰 Cost (Free Tier)

| Service | Free Tier Limits |
|---------|------------------|
| Vercel | 100GB bandwidth, 100 functions |
| Neon | 0.5GB storage, 10GB bandwidth |
| Total | **FREE** |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `!!!DEPLOY_VERCEL_CHECKLIST!!!.txt` | Step-by-step deploy |
| `!!!MIGRASI_SELESAI_BACA_INI!!!.txt` | Migration overview |
| `DEPLOY_VERCEL_FULLSTACK.md` | Complete guide |
| `API_ENDPOINTS.md` | API documentation |
| `TEST_API_VERCEL.md` | Testing guide |
| `MIGRATION_SUMMARY.md` | Technical details |
| `VERIFICATION_CHECKLIST.md` | Quality checks |
| `QUICK_REFERENCE.md` | This file |

---

## 🎯 Deployment Status

✅ **Backend migrated**: 22 serverless functions
✅ **No breaking changes**: Frontend unchanged
✅ **Production ready**: All tests passing
✅ **Documentation**: Complete and clear

**Time to deploy**: ~20-30 minutes
**Deployment time**: 2-3 minutes

---

## 🔗 Important Links

- **Vercel**: https://vercel.com
- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs

---

## ⚡ Quick Commands Reference

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Deploy with Vercel CLI
vercel --prod

# View logs
vercel logs

# View functions
vercel ls

# Rollback
vercel rollback
```

---

## 🎊 Success Indicators

✅ Health check returns `"status": "healthy"`
✅ API returns endpoint list
✅ Student can register and login
✅ Teacher can register and login
✅ All features working as before
✅ Response time < 300ms
✅ No errors in Vercel logs

---

**Ready to go live?** 🚀

Follow: `!!!DEPLOY_VERCEL_CHECKLIST!!!.txt`
