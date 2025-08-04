@echo off
echo ========================================
echo    SGPE - Sistema de Gestion
echo ========================================
echo.
echo Iniciando servicios...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

REM Verificar si las dependencias están instaladas
if not exist "backend\node_modules" (
    echo 📦 Instalando dependencias del backend...
    cd backend
    npm install
    cd ..
    echo.
)

if not exist "frontend\node_modules" (
    echo 📦 Instalando dependencias del frontend...
    cd frontend
    npm install
    cd ..
    echo.
)

REM Inicializar base de datos si no existe
if not exist "backend\database.sqlite" (
    echo 🗄️ Inicializando base de datos...
    cd backend
    npm run init-db
    cd ..
    echo.
)

echo 🚀 Iniciando servicios...
echo.

REM Iniciar backend en una nueva ventana
echo Iniciando backend en http://localhost:3000
start "SGPE Backend" cmd /k "cd backend && npm run dev"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en una nueva ventana
echo Iniciando frontend en http://localhost:8080
start "SGPE Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ Servicios iniciados correctamente
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:8080
echo 🔧 Backend:  http://localhost:3000
echo.
echo 👤 Usuario: admin@sgpe.com
echo 🔑 Contraseña: admin123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul 