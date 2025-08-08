const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Ruta para enviar mensaje al chatbot
router.post('/message', chatbotController.sendMessage);

// Ruta para limpiar historial de conversación
router.post('/clear', chatbotController.clearHistory);

// Ruta para obtener estado del chatbot
router.get('/status', chatbotController.getStatus);

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    message: 'API del Chatbot SGPE',
    version: '1.0.0',
    endpoints: {
      'POST /message': 'Enviar mensaje al chatbot',
      'POST /clear': 'Limpiar historial de conversación',
      'GET /status': 'Estado del chatbot',
    },
    usage: {
      message: {
        method: 'POST',
        url: '/api/chatbot/message',
        body: {
          message: 'string (requerido)',
          userId: 'string (opcional)'
        }
      }
    }
  });
});

module.exports = router;
