require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./config/database');
const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const facturaRoutes = require('./routes/facturaRoutes');

// Importar modelos para configurar relaciones
require('./config/initDatabase');

// Importar asociaciones entre modelos
console.log('🔗 Configurando asociaciones entre modelos...');
require('./config/associations');
console.log('✅ Asociaciones configuradas correctamente');

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API SGPE funcionando correctamente', 
    status: 'OK',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clientes: '/api/clientes',
      productos: '/api/productos',
      facturas: '/api/facturas'
    }
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de clientes (protegidas)
app.use('/api/clientes', clienteRoutes);

// Rutas de productos (protegidas)
app.use('/api/productos', productoRoutes);

// Rutas de facturas (protegidas)
app.use('/api/facturas', facturaRoutes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error('Error en el servidor:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Probar conexión DB
db.authenticate()
  .then(() => console.log('✅ Conectado a la base de datos SQLite'))
  .catch(err => console.error('❌ Error de conexión a la base de datos:', err));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

// Exportar la aplicación para pruebas
module.exports = app;