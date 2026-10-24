@echo off
echo ================================================
echo   SAHABAT BK - Start untuk HP
echo ================================================
echo.

REM Set environment variable
set VITE_API_URL=http://192.168.1.10:3002/api
set VITE_API_MODE=local

echo Stopping old processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend...
start "SAHABAT BK Backend" cmd /k "cd /d "%~dp0server" && npm start"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend with Network Access...
start "SAHABAT BK Frontend" cmd /k "cd /d "%~dp0" && set VITE_API_URL=http://192.168.1.10:3002/api && npm run dev:hp"

echo.
echo ================================================
echo   Backend: http://192.168.1.10:3002
echo   Frontend: http://192.168.1.10:5174
echo ================================================
echo.
echo Tunggu 10 detik sampai server siap...
echo Jangan tutup window ini!
pause
