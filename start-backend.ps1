Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SAHABAT BK - Backend Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js tidak ditemukan!" -ForegroundColor Red
    Write-Host "Pastikan Node.js sudah terinstall." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check server folder
Write-Host "Checking server folder..." -ForegroundColor Yellow
if (-not (Test-Path "server")) {
    Write-Host "ERROR: Folder server tidak ditemukan!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Server folder found!" -ForegroundColor Green
Write-Host ""

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Local:   http://localhost:3002" -ForegroundColor Green
Write-Host "Network: http://192.168.1.10:3002" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location server
npm start
