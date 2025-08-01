const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authController = require('../controllers/authController');

// Middleware de autenticación para todas las rutas de clientes
router.use(authController.verifyToken);

// Rutas para clientes (protegidas)
router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
