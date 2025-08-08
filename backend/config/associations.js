// ===== ASOCIACIONES DE MODELOS =====

const Cliente = require('../models/Cliente');
const Factura = require('../models/Factura');
const DetalleFactura = require('../models/DetalleFactura');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

// Asociación Cliente - Factura (1:N)
Cliente.hasMany(Factura, {
  foreignKey: 'clienteId',
  as: 'facturas'
});

Factura.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  as: 'cliente'
});

// Asociación Factura - DetalleFactura (1:N)
Factura.hasMany(DetalleFactura, {
  foreignKey: 'facturaId',
  as: 'detalles'
});

DetalleFactura.belongsTo(Factura, {
  foreignKey: 'facturaId',
  as: 'factura'
});

// Asociación Producto - DetalleFactura (1:N)
Producto.hasMany(DetalleFactura, {
  foreignKey: 'productoId',
  as: 'detallesFactura'
});

DetalleFactura.belongsTo(Producto, {
  foreignKey: 'productoId',
  as: 'producto'
});

// Asociación Usuario - Factura (1:N) - Para el usuario que crea la factura
// Comentado por ahora ya que la tabla facturas no tiene usuarioId
// Usuario.hasMany(Factura, {
//   foreignKey: 'usuarioId',
//   as: 'facturasCreadas'
// });

// Factura.belongsTo(Usuario, {
//   foreignKey: 'usuarioId',
//   as: 'usuario'
// });

module.exports = {
  Cliente,
  Factura,
  DetalleFactura,
  Producto,
  Usuario
}; 