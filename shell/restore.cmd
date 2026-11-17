@echo off
rem BYWOOD desktop shell patch: restore the original app.asar and icons
rem from resources\bywood-backup. Restart DeepSeek Harness afterwards.
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0apply.ps1" -Restore %*
set "CODE=%ERRORLEVEL%"
echo.
pause
exit /b %CODE%
