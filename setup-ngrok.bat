@echo off
echo ========================================
echo   NGROK SETUP FOR GYM APP
echo ========================================
echo.
echo Step 1: Get your authtoken
echo --------------------------
echo 1. Sign up at: https://dashboard.ngrok.com/signup
echo 2. After login, go to: https://dashboard.ngrok.com/get-started/your-authtoken
echo 3. Copy your authtoken
echo.
echo Step 2: Authenticate ngrok
echo --------------------------
set /p AUTHTOKEN="Paste your authtoken here and press Enter: "
echo.
echo Authenticating ngrok...
ngrok config add-authtoken %AUTHTOKEN%
echo.
echo ========================================
echo   ✅ NGROK AUTHENTICATED!
echo ========================================
echo.
echo Step 3: Starting ngrok tunnel...
echo --------------------------
echo Your server is running on port 3000
echo Starting public tunnel...
echo.
ngrok http 3000
