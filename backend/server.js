require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./config/database');
const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API SGPE funcionando correctamente', status: 'OK' });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de clientes (protegidas)
app.use('/api/clientes', clienteRoutes);

// Probar conexión DB
db.authenticate()
  .then(() => console.log('✅ Conectado a la base de datos SQLite'))
  .catch(err => console.error('❌ Error de conexión a la base de datos:', err));

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
});
// Exportar la aplicación para pruebas
module.exports = app;