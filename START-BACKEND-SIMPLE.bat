@echo off
echo ================================================
echo   SAHABAT BK - Backend Server
echo ================================================
echo.
echo Checking Node.js...
where node
if errorlevel 1 (
    echo ERROR: Node.js tidak ditemukan!
    echo Pastikan Node.js sudah terinstall.
    pause
    exit /b 1
)
echo.
echo Checking server folder...
if not exist "server" (
    echo ERROR: Folder server tidak ditemukan!
    echo Pastikan file .bat ada di folder SAHABAT BK
    pause
    exit /b 1
)
echo.
echo Starting backend...
echo.
cd server
npm start
if errorlevel 1 (
    echo.
    echo ERROR: Gagal menjalankan npm start
    pause
    exit /b 1
)
