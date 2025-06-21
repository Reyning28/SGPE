const { Sequelize } = require('sequelize');

const db = new Sequelize('sgpe_db', 'root', '', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desactiva los logs de SQL
  pool: {
    max: 5, // Máximo número de conexiones en el pool
    min: 0, // Mínimo número de conexiones en el pool
    acquire: 30000, // Tiempo máximo para adquirir una conexión
    idle: 10000 // Tiempo máximo que una conexión puede estar inactiva antes de ser liberada
  }
});

module.exports = db;
