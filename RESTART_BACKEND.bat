@echo off
echo.
echo ================================================
echo   RESTART BACKEND - SAHABAT BK
echo ================================================
echo.

echo [1/3] Stopping existing backend...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Navigating to server folder...
cd server

echo [3/3] Starting backend...
echo.
start cmd /k "npm start"

echo.
echo ================================================
echo   Backend is restarting in new window!
echo ================================================
echo.
echo Backend akan jalan di: http://localhost:3002
echo.
echo Tunggu sampai muncul: "Server berjalan di..."
echo.
pause
