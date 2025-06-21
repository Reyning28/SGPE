// Define el modelo de Cliente usando Sequelize

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Cliente = db.define('Cliente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  }
});

module.exports = Cliente;
