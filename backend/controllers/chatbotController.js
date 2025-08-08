const OpenAI = require('openai');

// Configurar OpenAI solo si la API key está disponible
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Contexto del sistema para el chatbot
const SYSTEM_CONTEXT = `
Eres un asistente virtual para el Sistema de Gestión de Pequeñas Empresas (SGPE). 
Tu función es ayudar a los usuarios con:

1. Gestión de clientes: crear, buscar, actualizar información de clientes
2. Productos: gestionar inventario, precios, categorías
3. Facturación: crear facturas, consultar ventas, reportes
4. Navegación del sistema: explicar cómo usar las diferentes funciones

Características del sistema:
- Es un sistema web de gestión empresarial
- Incluye módulos de clientes, productos y facturación
- Permite generar reportes de ventas
- Interfaz amigable con dashboard

Responde de manera útil, concisa y profesional. Si no sabes algo específico sobre el sistema, 
sugiere al usuario contactar al administrador o revisar la documentación.
`;

// Historial de conversaciones por usuario (en producción usar una BD)
const conversationHistory = new Map();

const chatbotController = {
  // Función para generar respuestas básicas sin IA
  getBasicResponse: function(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Respuestas de cortesía y agradecimientos
    if (lowerMessage.includes('gracias') || lowerMessage.includes('thank') || lowerMessage.includes('muchas gracias')) {
      return `¡De nada! 😊 Es un placer ayudarte con el sistema SGPE.

¿Hay algo más en lo que pueda asistirte? Puedo ayudarte con:
• Gestión de clientes
• Control de inventario  
• Proceso de facturación
• Navegación del sistema`;
    }

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas') || lowerMessage.includes('saludos')) {
      return `¡Hola! 👋 Bienvenido al asistente virtual de SGPE.

Estoy aquí para ayudarte con todas las funciones del sistema:

📋 **¿En qué puedo ayudarte hoy?**
• Gestión de clientes
• Control de inventario
• Proceso de facturación  
• Navegación del sistema
• Reportes y consultas

Solo pregúntame lo que necesites. ¿Por dónde empezamos?`;
    }

    if (lowerMessage.includes('adios') || lowerMessage.includes('adiós') || lowerMessage.includes('bye') || lowerMessage.includes('hasta')) {
      return `¡Hasta pronto! 👋 

Ha sido un gusto ayudarte con el sistema SGPE. Recuerda que estoy disponible 24/7 para cualquier consulta.

¡Que tengas un excelente día! 😊`;
    }
    
    // Respuestas sobre clientes
    if (lowerMessage.includes('cliente') || lowerMessage.includes('crear cliente')) {
      return `📋 **GESTIÓN DE CLIENTES - SGPE**

🔹 **Para crear un nuevo cliente:**
1. Ve al módulo **"Clientes"** en el menú lateral
2. Haz clic en **"Nuevo Cliente"** o el botón **"+"**
3. Completa los datos requeridos:
   • Nombre completo
   • Email (debe ser único)
   • Teléfono
   • Dirección
4. Haz clic en **"Guardar"**

✅ **El sistema validará automáticamente:**
• Email único en la base de datos
• Campos obligatorios completos
• Formato correcto de datos

💡 **Tip:** Puedes buscar y editar clientes existentes desde la misma sección.`;
    }
    
    // Respuestas sobre facturación
    if (lowerMessage.includes('factura') || lowerMessage.includes('facturar') || lowerMessage.includes('venta') || lowerMessage.includes('ventas')) {
      return `💰 **FACTURACIÓN - SGPE**

🔹 **Para generar una nueva factura:**
1. Ve al módulo **"Facturación"**
2. Selecciona el **cliente** de la lista
3. Agrega **productos/servicios:**
   • Busca el producto
   • Define cantidad
   • Verifica precio unitario
4. El sistema calculará **automáticamente:**
   • Subtotal por producto
   • Total general
   • Impuestos (si aplican)
5. Haz clic en **"Generar Factura"**

📊 **Funciones adicionales:**
• Consultar historial de facturas
• Imprimir o exportar facturas
• Ver estadísticas de ventas

💡 **Tip:** Puedes filtrar facturas por fecha, cliente o monto.`;
    }
    
    // Respuestas específicas sobre control de inventario
    if (lowerMessage.includes('control de inventario') || lowerMessage.includes('control del inventario')) {
      return `📦 **CONTROL DE INVENTARIO - SGPE**

🔹 **Funciones principales del control de inventario:**

📊 **Monitoreo en tiempo real:**
• Visualización del stock actual
• Alertas automáticas de bajo inventario
• Historial completo de movimientos
• Trazabilidad de productos

🔄 **Gestión de movimientos:**
• Entradas de mercancía
• Salidas por ventas
• Ajustes de inventario
• Transferencias entre ubicaciones

📈 **Reportes y análisis:**
• Productos más vendidos
• Análisis de rotación
• Valorización del inventario
• Productos con bajo stock

⚙️ **Configuraciones:**
• Establecer puntos de reorden
• Definir stock mínimo y máximo
• Categorización de productos
• Códigos y SKUs

💡 **Tip:** Revisa regularmente los reportes de inventario para optimizar tus compras y evitar faltantes.`;
    }
    
    // Respuestas sobre productos e inventario general
    if (lowerMessage.includes('producto') || lowerMessage.includes('inventario') || lowerMessage.includes('agregar producto') || 
        lowerMessage.includes('stock') || lowerMessage.includes('almacen') || 
        lowerMessage.includes('almacén') || lowerMessage.includes('gestión de productos') || lowerMessage.includes('productos')) {
      return `📦 **GESTIÓN DE PRODUCTOS - SGPE**

🔹 **Para agregar un nuevo producto:**
1. Ve al módulo **"Inventario"** o **"Productos"**
2. Haz clic en **"Nuevo Producto"** o **"+"**
3. Completa la información:
   • **Nombre** del producto
   • **Descripción** detallada
   • **Precio** de venta
   • **Precio** de compra (opcional)
   • **Categoría**
   • **Stock** inicial
   • **Código** o SKU (opcional)
4. Guarda los cambios

📊 **Funciones del inventario:**
• Control de stock en tiempo real
• Alertas de productos con bajo inventario
• Historial de movimientos
• Categorización de productos
• Búsqueda rápida por nombre/código

💡 **Tip:** Mantén actualizado el stock para un mejor control de ventas.`;
    }

    // Respuestas sobre el dashboard
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('panel') || lowerMessage.includes('inicio')) {
      return `🏠 **DASHBOARD - SGPE**

El panel principal te muestra un resumen completo del negocio:

📊 **Métricas principales:**
• Total de ventas del período
• Número de clientes registrados
• Productos en inventario
• Facturas generadas

📈 **Gráficos y estadísticas:**
• Ventas por período
• Productos más vendidos
• Tendencias de facturación
• Estado del inventario

🚀 **Accesos rápidos:**
• Crear nueva factura
• Registrar cliente
• Agregar producto
• Ver reportes

💡 **Tip:** El dashboard se actualiza automáticamente con los datos más recientes.`;
    }

    // Respuestas sobre ayuda general
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('como usar') || lowerMessage.includes('qué es sgpe')) {
      return `🤖 **ASISTENTE VIRTUAL - SGPE**

¡Hola! Soy tu asistente virtual del Sistema de Gestión de Pequeñas Empresas.

🔹 **¿Qué es SGPE?**
Un sistema completo para gestionar tu negocio que incluye:

📋 **Módulos principales:**
• **Clientes:** Gestión completa de clientes
• **Inventario:** Control de productos y stock  
• **Facturación:** Generar ventas y facturas
• **Dashboard:** Panel de control y estadísticas

💬 **¿Cómo puedo ayudarte?**
Puedes preguntarme sobre:
• "¿Cómo crear un cliente?"
• "¿Cómo generar una factura?"
• "¿Cómo agregar productos?"
• "¿Cómo usar el dashboard?"

🎯 **También puedes usar los botones de acción rápida** para consultas frecuentes.

¡Pregúntame lo que necesites! 😊`;
    }

    // Respuestas sobre reportes
    if (lowerMessage.includes('reporte') || lowerMessage.includes('estadistica') || lowerMessage.includes('consulta')) {
      return `📊 **REPORTES Y ESTADÍSTICAS - SGPE**

🔹 **Tipos de reportes disponibles:**

📈 **Ventas:**
• Ventas por período (día, semana, mes)
• Comparativa entre períodos
• Productos más vendidos
• Clientes con más compras

📦 **Inventario:**
• Stock actual por producto
• Productos con bajo inventario
• Movimientos de stock
• Valorización del inventario

👥 **Clientes:**
• Lista completa de clientes
• Historial de compras por cliente
• Clientes más activos

💰 **Financiero:**
• Ingresos totales
• Análisis de rentabilidad
• Facturas pendientes

💡 **Tip:** Los reportes se pueden filtrar por fechas y exportar para análisis externos.`;
    }

    // Respuesta por defecto
    return `¡Hola! 👋 Soy el asistente virtual de SGPE.

Puedo ayudarte con información sobre:
• **Gestión de clientes** - crear, editar, consultar
• **Control de inventario** - productos, stock, precios
• **Proceso de facturación** - generar ventas y facturas
• **Navegación del sistema** - cómo usar cada módulo
• **Reportes y consultas** - estadísticas y análisis

¿Sobre qué te gustaría saber más? 😊

*Tip: También puedes usar los botones de acción rápida para consultas frecuentes.*`;
  },

  // Enviar mensaje al chatbot
  sendMessage: async (req, res) => {
    try {
      const { message, userId = 'anonymous' } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'El mensaje es requerido'
        });
      }

      // Verificar si la API key está configurada
      if (!process.env.OPENAI_API_KEY || !openai) {
        // Respuesta básica sin IA
        const basicResponse = chatbotController.getBasicResponse(message);
        return res.json({
          success: true,
          message: 'Respuesta generada (modo básico)',
          response: basicResponse,
          timestamp: new Date().toISOString()
        });
      }

      // Obtener o crear historial para el usuario
      if (!conversationHistory.has(userId)) {
        conversationHistory.set(userId, [
          { role: 'system', content: SYSTEM_CONTEXT }
        ]);
      }

      const userHistory = conversationHistory.get(userId);
      
      // Agregar mensaje del usuario al historial
      userHistory.push({ role: 'user', content: message });

      // Limitar historial a últimos 10 mensajes (para evitar exceder límites)
      if (userHistory.length > 11) { // 1 system + 10 mensajes
        userHistory.splice(1, userHistory.length - 11);
      }

      // Hacer petición a OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: userHistory,
        max_tokens: 500,
        temperature: 0.7,
      });

      const botResponse = completion.choices[0].message.content;

      // Agregar respuesta del bot al historial
      userHistory.push({ role: 'assistant', content: botResponse });

      res.json({
        success: true,
        message: 'Respuesta generada exitosamente',
        response: botResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error en chatbot:', error);
      
      // Respuesta de fallback si falla la API
      const fallbackResponse = `Lo siento, no pude procesar tu mensaje en este momento. 
      
Puedes intentar:
- Reformular tu pregunta
- Revisar la sección de ayuda del sistema
- Contactar al administrador

¿En qué más puedo ayudarte con el sistema SGPE?`;

      res.status(500).json({
        success: false,
        message: 'Error al procesar mensaje',
        response: fallbackResponse,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Limpiar historial de conversación
  clearHistory: (req, res) => {
    try {
      const { userId = 'anonymous' } = req.body;
      
      conversationHistory.set(userId, [
        { role: 'system', content: SYSTEM_CONTEXT }
      ]);

      res.json({
        success: true,
        message: 'Historial de conversación limpiado'
      });
    } catch (error) {
      console.error('Error limpiando historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al limpiar historial'
      });
    }
  },

  // Obtener estado del chatbot
  getStatus: (req, res) => {
    res.json({
      success: true,
      status: 'online',
      hasApiKey: !!process.env.OPENAI_API_KEY,
      activeConversations: conversationHistory.size,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = chatbotController;
