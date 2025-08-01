const db = require('./database');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

// Función para inicializar la base de datos
async function initDatabase() {
  try {
    // Sincronizar todos los modelos con la base de datos
    await db.sync({ force: false }); // force: false mantiene los datos existentes
    console.log(' Base de datos sincronizada correctamente');
    
    // Verificar si hay clientes de ejemplo
    const clientCount = await Cliente.count();
    if (clientCount === 0) {
      // Crear algunos clientes de ejemplo
      await Cliente.bulkCreate([
        {
          nombre: 'David Liranzo',
          correo: 'david@empresa.com',
          telefono: '809-639-4567'
        },
        {
          nombre: 'Reyning Perdomo',
          correo: 'reyning@empresa.com',
          telefono: '809-987-6543'
        },
        {
          nombre: 'Elier Moreta',
          correo: 'elier@empresa.com',
          telefono: '809-456-7890'
        }
      ]);
      console.log(' Clientes de ejemplo creados');
    } else {
      console.log(` Base de datos ya contiene ${clientCount} clientes`);
    }

    // Verificar si hay usuarios de ejemplo
    const userCount = await Usuario.count();
    if (userCount === 0) {
      // Crear usuario administrador
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@sgpe.com',
        password: 'admin123',
        rol: 'admin'
      });
      console.log('✅ Usuario administrador creado');
      console.log('📧 Email: admin@sgpe.com');
      console.log('🔑 Contraseña: admin123');
    } else {
      console.log(`👥 Base de datos ya contiene ${userCount} usuarios`);
    }
    
  } catch (error) {
    console.error(' Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase; 