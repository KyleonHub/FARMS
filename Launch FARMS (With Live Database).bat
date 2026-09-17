@echo off
title FARMS - Login With Live Database
echo ============================================================
echo   FARMS - Faculty Availability & Room Management System
echo   Mode: Login With Live Database (Auto-Starts Server)
echo ============================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Falling back to normal browser login...
    start "" "frontend\login.html"
    pause
    exit /b 1
)

echo [2/3] Starting FARMS Database Server on Port 5000...
cd /d "%~dp0backend"
start "FARMS Live Database Server" cmd /k "node server.js"

echo [3/3] Connecting to database...
timeout /t 2 /nobreak >nul

echo.
echo Opening FARMS Login Page connected to Database (http://localhost:5000/login.html)...
start "" "http://localhost:5000/login.html"
echo.
echo ============================================================
echo   Database is active on http://localhost:5000
echo   You can close this window at any time.
echo ============================================================
timeout /t 3 /nobreak >nul
exit
