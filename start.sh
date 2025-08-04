#!/bin/bash

echo "========================================"
echo "    SGPE - Sistema de Gestion"
echo "========================================"
echo ""
echo "Iniciando servicios..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado o no está en el PATH"
    echo "Por favor, instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado"
echo ""

# Verificar si las dependencias están instaladas
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd frontend
    npm install
    cd ..
    echo ""
fi

# Inicializar base de datos si no existe
if [ ! -f "backend/database.sqlite" ]; then
    echo "🗄️ Inicializando base de datos..."
    cd backend
    npm run init-db
    cd ..
    echo ""
fi

echo "🚀 Iniciando servicios..."
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    pkill -f "npm run dev"
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT SIGTERM

# Iniciar backend en background
echo "Iniciando backend en http://localhost:3000"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend inicie
sleep 3

# Iniciar frontend en background
echo "Iniciando frontend en http://localhost:8080"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "✅ Servicios iniciados correctamente"
echo "========================================"
echo ""
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "👤 Usuario: admin@sgpe.com"
echo "🔑 Contraseña: admin123"
echo ""
echo "Presiona Ctrl+C para detener los servicios"
echo ""

# Mantener el script ejecutándose
wait 