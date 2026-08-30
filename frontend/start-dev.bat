@echo off
echo ==============================================
echo   Vectr Frontend Dev Server
echo   Logs and errors will show here in real-time
echo   Press Ctrl+C to stop
echo ==============================================
echo.

cd /d "%~dp0"
npm run dev -- --host
