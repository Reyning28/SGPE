const Factura = require('../models/Factura');
const DetalleFactura = require('../models/DetalleFactura');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Producto');
const { Op } = require('sequelize');
const db = require('../config/database');

const facturaController = {
  // Obtener todas las facturas
  async getFacturas(req, res) {
    try {
      const { page = 1, limit = 10, estado, clienteId, fechaInicio, fechaFin, search } = req.query;
      const offset = (page - 1) * limit;
      
      let whereClause = {};
      let includeClause = [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ];
      
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
      
      // Filtro de búsqueda por número de factura o nombre de cliente
      if (search) {
        // Búsqueda con prioridad: exacta primero, luego parcial
        whereClause[Op.or] = [
          // Coincidencia exacta en número de factura (mayor prioridad)
          {
            numero: {
              [Op.eq]: search
            }
          },
          // Coincidencia exacta en nombre de cliente
          {
            '$cliente.nombre$': {
              [Op.eq]: search
            }
          },
          // Coincidencias parciales (menor prioridad)
          {
            numero: {
              [Op.like]: `%${search}%`
            }
          },
          {
            '$cliente.nombre$': {
              [Op.like]: `%${search}%`
            }
          }
        ];
      }
      
      const facturas = await Factura.findAndCountAll({
        where: whereClause,
        attributes: [
          'id', 'numero', 'fecha', 'clienteId', 'subtotal', 
          'impuesto', 'total', 'estado', 'metodoPago', 'notas', 
          'fechaVencimiento', 'createdAt', 'updatedAt'
        ],
        include: includeClause,
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
        attributes: [
          'id', 'numero', 'fecha', 'clienteId', 'subtotal', 
          'impuesto', 'total', 'estado', 'metodoPago', 'notas', 
          'fechaVencimiento', 'createdAt', 'updatedAt'
        ],
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
      const itbis = 0.18; // 18% ITBIS
      
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
      
      const totalItbis = subtotal * itbis;
      const total = subtotal + totalItbis;
      
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
        impuesto: totalItbis,
        total,
        metodoPago,
        notas,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento + 'T12:00:00') : null
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

  // Actualizar estado de una factura
  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      // Validar que el estado es válido
      const estadosValidos = ['pendiente', 'pagada', 'cancelada'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado no válido. Los estados permitidos son: pendiente, pagada, cancelada'
        });
      }
      
      // Buscar la factura
      const factura = await Factura.findByPk(id);
      if (!factura) {
        return res.status(404).json({
          success: false,
          message: 'Factura no encontrada'
        });
      }
      
      // Actualizar el estado
      await factura.update({ estado });
      
      // Devolver la factura actualizada con información del cliente
      const facturaActualizada = await Factura.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre', 'correo', 'telefono']
          }
        ]
      });
      
      res.json({
        success: true,
        message: `Estado de la factura actualizado a ${estado}`,
        data: facturaActualizada
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
      
      // Obtener estadísticas agrupadas por estado
      const facturasPorEstado = await Factura.findAll({
        where: whereClause,
        attributes: [
          'estado',
          [db.fn('SUM', db.col('total')), 'totalVentas'],
          [db.fn('COUNT', db.col('id')), 'cantidadFacturas']
        ],
        group: ['estado']
      });
      
      // Inicializar contadores
      let totalVentas = 0;
      let totalFacturas = 0;
      let pendientes = 0;
      let pagadas = 0;
      let canceladas = 0;
      
      // Procesar los resultados
      facturasPorEstado.forEach(fila => {
        const estado = fila.dataValues.estado;
        const ventas = parseFloat(fila.dataValues.totalVentas || 0);
        const cantidad = parseInt(fila.dataValues.cantidadFacturas || 0);
        
        totalVentas += ventas;
        totalFacturas += cantidad;
        
        if (estado === 'pendiente') {
          pendientes = cantidad;
        } else if (estado === 'pagada') {
          pagadas = cantidad;
        } else if (estado === 'cancelada') {
          canceladas = cantidad;
        }
      });
      
      res.json({
        success: true,
        data: {
          totalVentas,
          totalFacturas,
          pendientes,
          pagadas,
          canceladas
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