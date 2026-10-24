Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SAHABAT BK - Frontend Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm tidak ditemukan!" -ForegroundColor Red
    Write-Host "Pastikan Node.js sudah terinstall." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Check package.json
Write-Host "Checking package.json..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json tidak ditemukan!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "package.json found!" -ForegroundColor Green
Write-Host ""

# Start frontend
Write-Host "Starting frontend server for mobile access..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Akan muncul URL Network, gunakan itu untuk HP" -ForegroundColor Yellow
Write-Host "Contoh: http://192.168.1.10:5174" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

npm run dev:hp
