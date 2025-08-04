#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando estado del sistema SGPE...\n');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - NO ENCONTRADO`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - NO ENCONTRADO`, 'red');
    return false;
  }
}

function checkNodeModules(dirPath, description) {
  const nodeModulesPath = path.join(dirPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - NO INSTALADAS`, 'yellow');
    return false;
  }
}

function checkDatabase() {
  const dbPath = path.join(__dirname, 'backend', 'database.sqlite');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    log(`✅ Base de datos SQLite (${sizeInMB} MB)`, 'green');
    return true;
  } else {
    log(`❌ Base de datos SQLite - NO ENCONTRADA`, 'red');
    return false;
  }
}

function checkPort(port, service) {
  try {
    const result = execSync(`netstat -an | findstr :${port}`, { encoding: 'utf8' });
    if (result.includes(`:${port}`)) {
      log(`✅ Puerto ${port} - ${service} ejecutándose`, 'green');
      return true;
    } else {
      log(`❌ Puerto ${port} - ${service} NO ejecutándose`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Puerto ${port} - ${service} NO ejecutándose`, 'red');
    return false;
  }
}

// Verificar estructura del proyecto
log('📁 Verificando estructura del proyecto:', 'bold');
checkDirectory('backend', 'Directorio backend');
checkDirectory('frontend', 'Directorio frontend');
checkDirectory('database', 'Directorio database');
console.log('');

// Verificar archivos de configuración
log('⚙️ Verificando archivos de configuración:', 'bold');
checkFile('backend/config.env', 'Archivo config.env');
checkFile('backend/package.json', 'Package.json del backend');
checkFile('frontend/package.json', 'Package.json del frontend');
checkFile('README.md', 'README principal');
checkFile('SETUP.md', 'Guía de configuración');
console.log('');

// Verificar dependencias
log('📦 Verificando dependencias:', 'bold');
checkNodeModules('backend', 'Dependencias del backend');
checkNodeModules('frontend', 'Dependencias del frontend');
console.log('');

// Verificar base de datos
log('🗄️ Verificando base de datos:', 'bold');
checkDatabase();
console.log('');

// Verificar modelos y controladores
log('🔧 Verificando componentes del backend:', 'bold');
checkFile('backend/models/Cliente.js', 'Modelo Cliente');
checkFile('backend/models/Producto.js', 'Modelo Producto');
checkFile('backend/models/Factura.js', 'Modelo Factura');
checkFile('backend/models/DetalleFactura.js', 'Modelo DetalleFactura');
checkFile('backend/controllers/clienteController.js', 'Controlador Cliente');
checkFile('backend/controllers/productoController.js', 'Controlador Producto');
checkFile('backend/controllers/facturaController.js', 'Controlador Factura');
checkFile('backend/routes/clienteRoutes.js', 'Rutas Cliente');
checkFile('backend/routes/productoRoutes.js', 'Rutas Producto');
checkFile('backend/routes/facturaRoutes.js', 'Rutas Factura');
console.log('');

// Verificar frontend
log('🌐 Verificando componentes del frontend:', 'bold');
checkFile('frontend/index.html', 'Página principal');
checkFile('frontend/js/api.js', 'Servicios API');
checkFile('frontend/js/auth.js', 'Servicios de autenticación');
checkFile('frontend/pages/dashboard.html', 'Dashboard');
checkFile('frontend/pages/login.html', 'Página de login');
console.log('');

// Verificar scripts de inicio
log('🚀 Verificando scripts de inicio:', 'bold');
checkFile('start.bat', 'Script de inicio Windows');
checkFile('start.sh', 'Script de inicio Linux/Mac');
console.log('');

// Verificar puertos (solo si están ejecutándose)
log('🔌 Verificando servicios ejecutándose:', 'bold');
const backendRunning = checkPort(3000, 'Backend');
const frontendRunning = checkPort(8080, 'Frontend');
console.log('');

// Resumen
log('📊 RESUMEN DEL ESTADO:', 'bold');
console.log('======================================');

if (backendRunning && frontendRunning) {
  log('🎉 ¡Sistema completamente funcional!', 'green');
  log('🌐 Accede a: http://localhost:8080', 'blue');
  log('👤 Usuario: admin@sgpe.com', 'blue');
  log('🔑 Contraseña: admin123', 'blue');
} else if (!backendRunning && !frontendRunning) {
  log('⚠️ Servicios no ejecutándose', 'yellow');
  log('💡 Ejecuta: ./start.bat (Windows) o ./start.sh (Linux/Mac)', 'blue');
} else {
  log('⚠️ Algunos servicios no están ejecutándose', 'yellow');
  if (!backendRunning) {
    log('💡 Inicia el backend: cd backend && npm run dev', 'blue');
  }
  if (!frontendRunning) {
    log('💡 Inicia el frontend: cd frontend && npm run dev', 'blue');
  }
}

console.log('======================================');
console.log('');

// Sugerencias
log('💡 SUGERENCIAS:', 'bold');
if (!fs.existsSync('backend/database.sqlite')) {
  log('• Ejecuta: cd backend && npm run init-db', 'yellow');
}
if (!fs.existsSync('backend/node_modules')) {
  log('• Ejecuta: cd backend && npm install', 'yellow');
}
if (!fs.existsSync('frontend/node_modules')) {
  log('• Ejecuta: cd frontend && npm install', 'yellow');
}

console.log('');
log('✅ Verificación completada', 'green'); 