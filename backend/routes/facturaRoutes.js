const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const authController = require('../controllers/authController');

// Middleware de autenticación para todas las rutas de facturas
router.use(authController.verifyToken);

// Rutas para facturas (protegidas)
router.get('/', facturaController.getFacturas);
router.get('/estadisticas', facturaController.getEstadisticas);
router.get('/:id', facturaController.getFacturaById);
router.post('/', facturaController.createFactura);
router.patch('/:id/estado', facturaController.updateEstadoFactura);
router.delete('/:id', facturaController.deleteFactura);

module.exports = router; 