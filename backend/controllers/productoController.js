const Producto = require('../models/Producto');
const { Op } = require('sequelize');

const productoController = {
  // Obtener todos los productos
  async getProductos(req, res) {
    try {
      const { page = 1, limit = 10, search, categoria, estado } = req.query;
      const offset = (page - 1) * limit;
      
      let whereClause = {};
      
      // Filtro de búsqueda
      if (search) {
        whereClause = {
          [Op.or]: [
            { nombre: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
            { codigo: { [Op.like]: `%${search}%` } }
          ]
        };
      }
      
      // Filtro por categoría
      if (categoria) {
        whereClause.categoria = categoria;
      }
      
      // Filtro por estado
      if (estado) {
        whereClause.estado = estado;
      }
      
      const productos = await Producto.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: productos.rows,
        total: productos.count,
        page: parseInt(page),
        totalPages: Math.ceil(productos.count / limit)
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener un producto por ID
  async getProductoById(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear un nuevo producto
  async createProducto(req, res) {
    try {
      const productoData = req.body;
      
      // Validar que el código sea único
      const existingProducto = await Producto.findOne({
        where: { codigo: productoData.codigo }
      });
      
      if (existingProducto) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un producto con ese código'
        });
      }
      
      const producto = await Producto.create(productoData);
      
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar un producto
  async updateProducto(req, res) {
    try {
      const { id } = req.params;
      const productoData = req.body;
      
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      // Validar que el código sea único (si se está cambiando)
      if (productoData.codigo && productoData.codigo !== producto.codigo) {
        const existingProducto = await Producto.findOne({
          where: { codigo: productoData.codigo }
        });
        
        if (existingProducto) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un producto con ese código'
          });
        }
      }
      
      await producto.update(productoData);
      
      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar un producto
  async deleteProducto(req, res) {
    try {
      const { id } = req.params;
      
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      await producto.destroy();
      
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener productos con stock bajo
  async getProductosStockBajo(req, res) {
    try {
      const productos = await Producto.findAll({
        where: {
          stock: {
            [Op.lte]: db.col('stockMinimo')
          },
          estado: 'activo'
        },
        order: [['stock', 'ASC']]
      });
      
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar stock de un producto
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad, tipo } = req.body; // tipo: 'entrada' o 'salida'
      
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      let nuevoStock = producto.stock;
      
      if (tipo === 'entrada') {
        nuevoStock += parseInt(cantidad);
      } else if (tipo === 'salida') {
        nuevoStock -= parseInt(cantidad);
        if (nuevoStock < 0) {
          return res.status(400).json({
            success: false,
            message: 'Stock insuficiente para realizar la salida'
          });
        }
      }
      
      await producto.update({ stock: nuevoStock });
      
      res.json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: {
          id: producto.id,
          nombre: producto.nombre,
          stockAnterior: producto.stock,
          stockNuevo: nuevoStock
        }
      });
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = productoController; 