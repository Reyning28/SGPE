const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para desarrollo con SQLite (más fácil de configurar)
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

if (isDevelopment) {
  // Usar SQLite para desarrollo
  const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Archivo de base de datos local
    logging: console.log,
    define: {
      timestamps: true
    }
  });

  module.exports = db;
} else {
  // Usar MySQL para producción
  const db = new Sequelize(
    process.env.DB_NAME || 'sgpe_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

  module.exports = db;
}
