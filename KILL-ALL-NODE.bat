@echo off
echo ================================================
echo   STOP SEMUA NODE PROCESS
echo ================================================
echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe /T
echo.
echo Done! Semua Node.js process sudah dihentikan.
echo.
pause
