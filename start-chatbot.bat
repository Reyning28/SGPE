@echo off
echo ================================
echo    SGPE con Chatbot IA
echo ================================
echo.
echo Iniciando el sistema...
echo.

REM Iniciar backend
echo [1/2] Iniciando servidor backend...
cd /d "%~dp0backend"
start "SGPE Backend" cmd /k "npm start"

REM Esperar un poco para que el backend se inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend (servidor de desarrollo)
echo [2/2] Iniciando servidor frontend...
cd /d "%~dp0frontend"

REM Verificar si live-server está instalado
npm list -g live-server >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando live-server...
    npm install -g live-server
)

start "SGPE Frontend" cmd /k "live-server --port=8080 --open=pages/chatbot-demo.html"

echo.
echo ================================
echo  Sistema SGPE iniciado!
echo ================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8080
echo Demo Chatbot: http://localhost:8080/pages/chatbot-demo.html
echo.
echo Presiona cualquier tecla para salir...
pause >nul
