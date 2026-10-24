@echo off
echo ========================================
echo   SAHABAT BK - START ALL SERVICES
echo ========================================
echo.

REM Start Backend
echo [1/2] Starting Backend Server...
start "Backend Sahabat BK" cmd /k "cd server && node server.js"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend...
start "Frontend Sahabat BK" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVICES STARTED!
echo ========================================
echo.
echo Backend: http://192.168.1.10:3002
echo Frontend: http://192.168.1.10:5173
echo.
echo Tekan tombol apa saja untuk menutup...
pause >nul
