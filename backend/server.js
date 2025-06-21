const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const db = require('./config/database');
const clienteRoutes = require('./routes/clienteRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);

// Probar conexión DB
db.authenticate()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión:', err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Exportar la aplicación para pruebas
module.exports = app;