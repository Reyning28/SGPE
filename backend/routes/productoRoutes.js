const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authController = require('../controllers/authController');

// Middleware de autenticación para todas las rutas de productos
router.use(authController.verifyToken);

// Rutas para productos (protegidas)
router.get('/', productoController.getProductos);
router.get('/stock-bajo', productoController.getProductosStockBajo);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);
router.put('/:id', productoController.updateProducto);
router.patch('/:id/stock', productoController.updateStock);
router.delete('/:id', productoController.deleteProducto);

module.exports = router; 