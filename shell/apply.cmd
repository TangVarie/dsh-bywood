@echo off
rem BYWOOD desktop shell patch (optional): tray label + taskbar thumbnail icon.
rem Detects the DeepSeek Harness installation, patches resources\app.asar in place
rem and installs the BYWOOD tray/app icons. Restart the app afterwards.
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0apply.ps1" %*
set "CODE=%ERRORLEVEL%"
echo.
pause
exit /b %CODE%
