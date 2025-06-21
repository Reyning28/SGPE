const Cliente = require('../models/Cliente');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json(clientes);
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const nuevoCliente = await Cliente.create({ nombre, correo, telefono });
  res.status(201).json(nuevoCliente);
};
