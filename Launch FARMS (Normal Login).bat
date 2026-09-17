@echo off
title FARMS - Normal Login
echo ============================================================
echo   FARMS - Faculty Availability & Room Management System
echo   Mode: Normal Login (Standard Browser)
echo ============================================================
echo.
echo Opening FARMS Login Page in your default browser...
cd /d "%~dp0"
start "" "frontend\login.html"
exit
