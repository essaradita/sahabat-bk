@echo off
echo ================================================
echo   SAHABAT BK - Setup Database Otomatis
echo ================================================
echo.
echo Membuat database dan tabel...
echo.

REM Cari lokasi mysql.exe di XAMPP
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    echo ERROR: MySQL tidak ditemukan di %MYSQL_PATH%
    echo.
    echo Silakan edit file ini dan ganti MYSQL_PATH dengan lokasi mysql.exe kamu
    echo.
    pause
    exit /b 1
)

REM Import database
"%MYSQL_PATH%" -u root -e "SOURCE database/schema_mysql.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   ✅ Database berhasil dibuat!
    echo ================================================
    echo.
    echo Database: sahabat_bk
    echo Semua tabel sudah siap digunakan
    echo.
) else (
    echo.
    echo ================================================
    echo   ❌ Gagal membuat database
    echo ================================================
    echo.
    echo Coba cara manual di phpMyAdmin
    echo.
)

pause
