const Factura = require('../models/Factura');
const DetalleFactura = require('../models/DetalleFactura');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Producto');
const { Op } = require('sequelize');

const facturaController = {
  // Obtener todas las facturas
  async getFacturas(req, res) {
    try {
      const { page = 1, limit = 10, estado, clienteId, fechaInicio, fechaFin } = req.query;
      const offset = (page - 1) * limit;
      
      let whereClause = {};
      
      // Filtro por estado
      if (estado) {
        whereClause.estado = estado;
      }
      
      // Filtro por cliente
      if (clienteId) {
        whereClause.clienteId = clienteId;
      }
      
      // Filtro por rango de fechas
      if (fechaInicio && fechaFin) {
        whereClause.fecha = {
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
        };
      }
      
      const facturas = await Factura.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre', 'correo', 'telefono']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'DESC']]
      });
      
      res.json({
        success: true,
        data: facturas.rows,
        total: facturas.count,
        page: parseInt(page),
        totalPages: Math.ceil(facturas.count / limit)
      });
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener una factura por ID con detalles
  async getFacturaById(req, res) {
    try {
      const { id } = req.params;
      
      const factura = await Factura.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre', 'correo', 'telefono']
          },
          {
            model: DetalleFactura,
            as: 'detalles',
            include: [
              {
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre', 'codigo', 'precio']
              }
            ]
          }
        ]
      });
      
      if (!factura) {
        return res.status(404).json({
          success: false,
          message: 'Factura no encontrada'
        });
      }
      
      res.json({
        success: true,
        data: factura
      });
    } catch (error) {
      console.error('Error al obtener factura:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear una nueva factura
  async createFactura(req, res) {
    try {
      const { clienteId, detalles, metodoPago, notas, fechaVencimiento } = req.body;
      
      // Validar que el cliente existe
      const cliente = await Cliente.findByPk(clienteId);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }
      
      // Calcular totales
      let subtotal = 0;
      const impuesto = 0.16; // 16% IVA
      
      // Validar productos y calcular subtotal
      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.productoId);
        if (!producto) {
          return res.status(404).json({
            success: false,
            message: `Producto con ID ${detalle.productoId} no encontrado`
          });
        }
        
        if (producto.stock < detalle.cantidad) {
          return res.status(400).json({
            success: false,
            message: `Stock insuficiente para el producto ${producto.nombre}`
          });
        }
        
        detalle.precioUnitario = producto.precio;
        detalle.subtotal = producto.precio * detalle.cantidad;
        subtotal += detalle.subtotal;
      }
      
      const totalImpuesto = subtotal * impuesto;
      const total = subtotal + totalImpuesto;
      
      // Generar número de factura
      const ultimaFactura = await Factura.findOne({
        order: [['numero', 'DESC']]
      });
      
      let numeroFactura = 'F001';
      if (ultimaFactura) {
        const ultimoNumero = parseInt(ultimaFactura.numero.substring(1));
        numeroFactura = `F${String(ultimoNumero + 1).padStart(3, '0')}`;
      }
      
      // Crear la factura
      const factura = await Factura.create({
        numero: numeroFactura,
        clienteId,
        subtotal,
        impuesto: totalImpuesto,
        total,
        metodoPago,
        notas,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null
      });
      
      // Crear los detalles de la factura
      const detallesFactura = await Promise.all(
        detalles.map(detalle => 
          DetalleFactura.create({
            facturaId: factura.id,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal,
            descuento: detalle.descuento || 0
          })
        )
      );
      
      // Actualizar stock de productos
      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.productoId);
        await producto.update({
          stock: producto.stock - detalle.cantidad
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Factura creada exitosamente',
        data: {
          factura,
          detalles: detallesFactura
        }
      });
    } catch (error) {
      console.error('Error al crear factura:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar estado de una factura
  async updateEstadoFactura(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      const factura = await Factura.findByPk(id);
      
      if (!factura) {
        return res.status(404).json({
          success: false,
          message: 'Factura no encontrada'
        });
      }
      
      await factura.update({ estado });
      
      res.json({
        success: true,
        message: 'Estado de factura actualizado exitosamente',
        data: factura
      });
    } catch (error) {
      console.error('Error al actualizar estado de factura:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar una factura (solo si está pendiente)
  async deleteFactura(req, res) {
    try {
      const { id } = req.params;
      
      const factura = await Factura.findByPk(id);
      
      if (!factura) {
        return res.status(404).json({
          success: false,
          message: 'Factura no encontrada'
        });
      }
      
      if (factura.estado !== 'pendiente') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden eliminar facturas pendientes'
        });
      }
      
      // Restaurar stock de productos
      const detalles = await DetalleFactura.findAll({
        where: { facturaId: id },
        include: [{ model: Producto, as: 'producto' }]
      });
      
      for (const detalle of detalles) {
        await detalle.producto.update({
          stock: detalle.producto.stock + detalle.cantidad
        });
      }
      
      // Eliminar detalles y factura
      await DetalleFactura.destroy({ where: { facturaId: id } });
      await factura.destroy();
      
      res.json({
        success: true,
        message: 'Factura eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener estadísticas de facturación
  async getEstadisticas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      let whereClause = {};
      if (fechaInicio && fechaFin) {
        whereClause.fecha = {
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
        };
      }
      
      const facturas = await Factura.findAll({
        where: whereClause,
        attributes: [
          'estado',
          [db.fn('SUM', db.col('total')), 'totalVentas'],
          [db.fn('COUNT', db.col('id')), 'cantidadFacturas']
        ],
        group: ['estado']
      });
      
      const totalVentas = facturas.reduce((sum, f) => sum + parseFloat(f.dataValues.totalVentas || 0), 0);
      const totalFacturas = facturas.reduce((sum, f) => sum + parseInt(f.dataValues.cantidadFacturas || 0), 0);
      
      res.json({
        success: true,
        data: {
          estadisticas: facturas,
          totalVentas,
          totalFacturas
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = facturaController; 