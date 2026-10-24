@echo off
echo.
echo ================================================
echo   TEST BACKEND CONNECTION
echo ================================================
echo.

echo Testing backend at http://localhost:3002/api/teacher/missions
echo.

curl -s http://localhost:3002/api/teacher/missions >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Backend is RUNNING!
    echo.
    echo Backend accessible at: http://localhost:3002
) else (
    echo ❌ Backend is NOT running!
    echo.
    echo PLEASE START BACKEND:
    echo 1. Open terminal
    echo 2. cd server
    echo 3. npm start
    echo.
    echo OR double-click: START_SEMUA.bat
)

echo.
echo ================================================
pause
