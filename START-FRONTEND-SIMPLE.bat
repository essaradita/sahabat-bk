@echo off
echo ================================================
echo   SAHABAT BK - Frontend Server
echo ================================================
echo.
echo Checking Node.js...
where npm
if errorlevel 1 (
    echo ERROR: npm tidak ditemukan!
    echo Pastikan Node.js sudah terinstall.
    pause
    exit /b 1
)
echo.
echo Checking package.json...
if not exist "package.json" (
    echo ERROR: package.json tidak ditemukan!
    echo Pastikan file .bat ada di folder SAHABAT BK
    pause
    exit /b 1
)
echo.
echo Starting frontend for mobile access...
echo.
npm run dev:hp
if errorlevel 1 (
    echo.
    echo ERROR: Gagal menjalankan npm run dev:hp
    pause
    exit /b 1
)
