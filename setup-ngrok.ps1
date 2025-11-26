# NGROK SETUP FOR GYM APP
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NGROK SETUP FOR GYM APP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Get your authtoken" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow
Write-Host "1. Sign up at: https://dashboard.ngrok.com/signup"
Write-Host "2. After login, go to: https://dashboard.ngrok.com/get-started/your-authtoken"
Write-Host "3. Copy your authtoken"
Write-Host ""

Write-Host "Step 2: Authenticate ngrok" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow
$authtoken = Read-Host "Paste your authtoken here and press Enter"
Write-Host ""

Write-Host "Authenticating ngrok..." -ForegroundColor Green
ngrok config add-authtoken $authtoken
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ NGROK AUTHENTICATED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Starting ngrok tunnel..." -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow
Write-Host "Your server is running on port 3000"
Write-Host "Starting public tunnel..."
Write-Host ""
Write-Host "🌐 Your public URL will appear below:" -ForegroundColor Cyan
Write-Host ""

ngrok http 3000
