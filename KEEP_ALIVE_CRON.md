# 🔄 KEEP BACKEND ALIVE (OPTIONAL)

Render free tier **sleep setelah 15 menit** tidak ada request.

Request pertama setelah sleep: **30-60 detik loading** ⏱️

**Solusi:** Ping backend setiap 10 menit untuk prevent sleep.

---

## 🎯 METODE: CRON-JOB.ORG (100% GRATIS)

### **Keuntungan:**
- ✅ 100% Gratis
- ✅ Tidak perlu coding
- ✅ Tidak perlu server sendiri
- ✅ Reliable

### **Cara Kerja:**
```
Cron-job.org → Ping backend setiap 10 menit
                  ↓
Backend tetap awake (tidak sleep)
```

---

## 📋 LANGKAH-LANGKAH

### 1. Buat Account Cron-Job.org

1. Buka: https://cron-job.org/en/
2. Klik **Sign up for free**
3. Isi form:
   - Email: email@example.com
   - Password: buat password
4. Verify email
5. Login

### 2. Create New Cron Job

1. Di dashboard, klik **Create cron job**
2. Isi form:

| Field | Value |
|-------|-------|
| **Title** | Keep SAHABAT BK Backend Alive |
| **Address (URL)** | `https://sahabatbk-api.onrender.com/api/health` |
| **Execution** | Every 10 minutes |
| **Schedule** | |
| - **Minutes** | */10 (setiap 10 menit) |
| - **Hours** | * (setiap jam) |
| - **Days** | * (setiap hari) |
| - **Months** | * (setiap bulan) |
| - **Weekdays** | * (setiap hari dalam seminggu) |
| **Enabled** | ✅ YES |
| **Save responses** | ✅ YES (untuk monitoring) |

3. Klik **Create cron job**

### 3. Test Cron Job

1. Klik tombol **▶ Execute now** untuk test
2. Tunggu beberapa detik
3. Lihat **Execution history**
4. ✅ Status harus **200 OK**
5. ✅ Response harus:
   ```json
   {
     "status": "healthy",
     "database": "connected"
   }
   ```

---

## 📊 MONITORING

### Cek Execution History

1. Login ke cron-job.org
2. Lihat **Execution history**
3. Cek status setiap execution:
   - ✅ **200** = Success
   - ❌ **500** = Backend error
   - ❌ **Timeout** = Backend sleep/down

### Notifikasi (Optional)

1. Edit cron job
2. Tab **Notifications**
3. Set email notification jika failed
4. ✅ Dapat email otomatis jika backend down

---

## 🎯 HASIL

**SEBELUM Keep-Alive:**
- ❌ Backend sleep setelah 15 menit
- ❌ Request pertama: 30-60 detik loading
- ❌ User experience buruk

**SETELAH Keep-Alive:**
- ✅ Backend selalu awake
- ✅ Request pertama: < 1 detik
- ✅ User experience baik
- ✅ Terasa seperti server berbayar

---

## ⚠️ CATATAN PENTING

### Render Free Tier Limits

Render free tier punya limit:
- **750 jam/bulan** execution time

**Perhitungan:**
- 1 bulan = 720 jam (30 hari × 24 jam)
- Cron ping 10 menit = backend jalan 720 jam
- ✅ Masih dalam limit 750 jam!

### Alternative: UptimeRobot

Jika cron-job.org bermasalah, gunakan **UptimeRobot**:

1. Buka: https://uptimerobot.com/
2. Free: 50 monitors
3. Setup HTTP(s) monitor
4. Check interval: 5 minutes (free tier)

---

## 💡 TIPS

### Hemat Execution Time

Jika mendekati limit 750 jam:

**Option 1:** Ping setiap 14 menit (bukan 10)
- Backend sleep at 15 minutes
- Ping at 14 minutes
- Hemat ~30 jam/bulan

**Option 2:** Hanya ping saat jam kerja
- Senin-Jumat, 07:00 - 17:00
- Hemat ~50% execution time

**Option 3:** Biarkan sleep malam hari
- Ping hanya 06:00 - 22:00
- User jarang akses malam hari

### Monitor Resource Usage

1. Render Dashboard → Service → Metrics
2. Lihat **Execution Hours** usage
3. Jika mendekati limit, adjust cron schedule

---

## ❓ FAQ

**Q: Apakah keep-alive wajib?**
A: Tidak wajib. Tapi sangat recommended untuk UX yang baik.

**Q: Apakah melanggar ToS Render?**
A: Tidak. Ini legal dan banyak yang pakai.

**Q: Bisakah pakai GitHub Actions?**
A: Bisa, tapi lebih ribet setup-nya.

**Q: Berapa lama cron-job.org gratis?**
A: Selamanya. Tidak ada limit waktu.

---

## 🎉 SELESAI

Backend Anda sekarang:
- ✅ Jalan 24/7
- ✅ Tidak sleep
- ✅ Fast response time
- ✅ Professional UX

**Total biaya: $0/month** 🎊
