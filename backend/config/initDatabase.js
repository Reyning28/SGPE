const db = require('./database');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Factura = require('../models/Factura');
const DetalleFactura = require('../models/DetalleFactura');

// Definir las relaciones entre modelos
function setupAssociations() {
  // Relación Cliente - Factura (1:N)
  Cliente.hasMany(Factura, { foreignKey: 'clienteId', as: 'facturas' });
  Factura.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

  // Relación Factura - DetalleFactura (1:N)
  Factura.hasMany(DetalleFactura, { foreignKey: 'facturaId', as: 'detalles' });
  DetalleFactura.belongsTo(Factura, { foreignKey: 'facturaId', as: 'factura' });

  // Relación Producto - DetalleFactura (1:N)
  Producto.hasMany(DetalleFactura, { foreignKey: 'productoId', as: 'detallesFactura' });
  DetalleFactura.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
}

// Función para inicializar la base de datos
async function initDatabase() {
  try {
    // Configurar las relaciones
    setupAssociations();
    
    // Sincronizar todos los modelos con la base de datos
    await db.sync({ force: false }); // force: false mantiene los datos existentes
    console.log('✅ Base de datos sincronizada correctamente');
    
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
      console.log('✅ Clientes de ejemplo creados');
    } else {
      console.log(`📊 Base de datos ya contiene ${clientCount} clientes`);
    }

    // Verificar si hay productos de ejemplo
    const productCount = await Producto.count();
    if (productCount === 0) {
      // Crear algunos productos de ejemplo
      await Producto.bulkCreate([
        {
          nombre: 'Laptop HP Pavilion',
          descripcion: 'Laptop de 15 pulgadas con procesador Intel i5',
          precio: 45000.00,
          stock: 10,
          stockMinimo: 3,
          categoria: 'Electrónicos',
          codigo: 'LAP001',
          estado: 'activo'
        },
        {
          nombre: 'Mouse Inalámbrico',
          descripcion: 'Mouse inalámbrico ergonómico',
          precio: 1200.00,
          stock: 25,
          stockMinimo: 5,
          categoria: 'Accesorios',
          codigo: 'MOU001',
          estado: 'activo'
        },
        {
          nombre: 'Teclado Mecánico',
          descripcion: 'Teclado mecánico con switches blue',
          precio: 3500.00,
          stock: 15,
          stockMinimo: 4,
          categoria: 'Accesorios',
          codigo: 'TEC001',
          estado: 'activo'
        },
        {
          nombre: 'Monitor 24"',
          descripcion: 'Monitor LED de 24 pulgadas Full HD',
          precio: 8500.00,
          stock: 8,
          stockMinimo: 2,
          categoria: 'Electrónicos',
          codigo: 'MON001',
          estado: 'activo'
        }
      ]);
      console.log('✅ Productos de ejemplo creados');
    } else {
      console.log(`📦 Base de datos ya contiene ${productCount} productos`);
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
    
    console.log('🎉 Inicialización de base de datos completada');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase; 