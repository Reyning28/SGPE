const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const authController = require('../controllers/authController');

// Middleware de autenticación para todas las rutas de facturas
router.use(authController.verifyToken);

// Rutas para facturas (protegidas)
router.get('/', facturaController.getFacturas);
router.get('/estadisticas', facturaController.getEstadisticas);
router.post('/', facturaController.createFactura);
router.get('/:id', facturaController.getFacturaById);
router.patch('/:id/estado', facturaController.updateEstado);
router.delete('/:id', facturaController.deleteFactura);

module.exports = router; 