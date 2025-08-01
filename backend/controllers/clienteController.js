const Cliente = require('../models/Cliente');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    
    // Validaciones básicas
    if (!nombre || !correo) {
      return res.status(400).json({ error: 'Nombre y correo son requeridos' });
    }
    
    const nuevoCliente = await Cliente.create({ nombre, correo, telefono });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono } = req.body;
    
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    await cliente.update({ nombre, correo, telefono });
    res.json(cliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    await cliente.destroy();
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
