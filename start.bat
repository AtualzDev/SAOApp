@echo off
echo ========================================
echo   Iniciando Sistema SAO
echo ========================================
echo.

cd /d "%~dp0backend"
echo [1/2] Iniciando Backend (porta 3001)...
start "SAO Backend" cmd /k "node src/server.js"

timeout /t 3 /nobreak >nul

cd /d "%~dp0"
echo [2/2] Iniciando Frontend (porta 3000)...
start "SAO Frontend" cmd /k "npx vite"

echo.
echo ========================================
echo   Sistema iniciado!
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:3000
echo ========================================
echo.
pause
