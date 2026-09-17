@echo off
title FARMS - Launcher Menu
color 0A
:MENU
cls
echo =======================================================================
echo     FARMS - FACULTY AVAILABILITY & ROOM MANAGEMENT SYSTEM
echo                       LAUNCHER MENU
echo =======================================================================
echo.
echo   [1] Normal Login (Standard Browser Mode)
echo   [2] Login With Live Database (Auto-Starts Backend Server on Port 5000)
echo   [3] Open Visual Launcher Hub (FARMS Launcher Hub.html)
echo   [4] Start Database Server Only
echo   [5] Exit
echo.
echo =======================================================================
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto LAUNCH_STD
if "%choice%"=="2" goto LAUNCH_DB
if "%choice%"=="3" goto LAUNCH_HUB
if "%choice%"=="4" goto START_BACKEND
if "%choice%"=="5" exit
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto MENU

:LAUNCH_STD
echo.
echo Launching Normal FARMS Login...
cd /d "%~dp0"
start "" "frontend\login.html"
exit

:LAUNCH_DB
echo.
echo Checking Node.js runtime...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found on this machine!
    echo Launching standard browser mode instead...
    start "" "frontend\login.html"
    pause
    exit
)
echo Starting Express Database Server on Port 5000...
cd /d "%~dp0backend"
start "FARMS Live Database Server" cmd /k "node server.js"
timeout /t 2 /nobreak >nul
echo Opening Database-Connected Login Portal...
start "" "http://localhost:5000/login.html"
exit

:LAUNCH_HUB
echo.
echo Opening Visual Launcher Hub...
cd /d "%~dp0"
start "" "FARMS Launcher Hub.html"
exit

:START_BACKEND
echo.
echo Starting Express Database Server...
cd /d "%~dp0backend"
node server.js
pause
goto MENU
