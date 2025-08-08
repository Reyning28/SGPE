#  Chatbot SGPE - Asistente Virtual Inteligente

##  Descripción

El Chatbot SGPE es un asistente virtual inteligente integrado en el Sistema de Gestión de Pequeñas Empresas. Utiliza la API de OpenAI para proporcionar respuestas útiles y contextualmente relevantes sobre el uso del sistema.

##  Características

- **Conversación Natural**: Interactúa con el bot usando lenguaje natural
- **Conocimiento Especializado**: Conoce todas las funciones del sistema SGPE
- **Respuestas Contextuales**: Mantiene el contexto de la conversación
- **Acciones Rápidas**: Botones para consultas frecuentes
- **Interfaz Intuitiva**: Diseño moderno y responsive
- **Modo Fallback**: Funciona con respuestas básicas sin API key

##  Instalación y Configuración

### 1. Dependencias del Backend

Las dependencias ya están instaladas, pero si necesitas reinstalar:

```bash
cd backend
npm install openai
```

### 2. Configuración de la API Key

1. Obtén una API key de OpenAI en: https://platform.openai.com/api-keys
2. Edita el archivo `backend/config.env`
3. Descomenta y configura la línea:
   ```env
   OPENAI_API_KEY=tu_api_key_aqui
   ```

### 3. Archivos del Chatbot

- `backend/controllers/chatbotController.js` - Lógica del backend
- `backend/routes/chatbotRoutes.js` - Rutas de la API
- `frontend/pages/chatbot.css` - Estilos del chatbot
- `frontend/pages/chatbot.js` - Funcionalidad del frontend
- `frontend/pages/chatbot-demo.html` - Página de demostración

##  Uso

### Integrar en una Página

Agrega estas líneas al `<head>` de tu página HTML:

```html
<link rel="stylesheet" href="chatbot.css">
```

Y estas al final del `<body>`:

```html
<script src="chatbot.js"></script>
```

### Uso Programático

```javascript
// El chatbot se inicializa automáticamente
// Pero puedes controlarlo programáticamente:

// Abrir chatbot
window.sgpeChatbot.open();

// Cerrar chatbot
window.sgpeChatbot.close();

// Limpiar historial
await window.sgpeChatbot.clearHistory();

// Verificar estado
const status = await window.sgpeChatbot.getStatus();
```

##  API del Backend

### Endpoints Disponibles

#### POST `/api/chatbot/message`
Enviar mensaje al chatbot

```json
{
  "message": "¿Cómo crear un cliente?",
  "userId": "user_123" // opcional
}
```

**Respuesta:**
```json
{
  "success": true,
  "response": "Para crear un cliente en SGPE...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### GET `/api/chatbot/status`
Verificar estado del chatbot

**Respuesta:**
```json
{
  "success": true,
  "status": "online",
  "hasApiKey": true,
  "activeConversations": 5,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### POST `/api/chatbot/clear`
Limpiar historial de conversación

```json
{
  "userId": "user_123" // opcional
}
```

##  Personalización

### Estilos CSS

Puedes personalizar los colores y estilos editando `chatbot.css`:

```css
/* Cambiar colores principales */
.chatbot-toggle {
    background: linear-gradient(135deg, #tu-color1, #tu-color2);
}

.chatbot-header {
    background: linear-gradient(135deg, #tu-color1, #tu-color2);
}
```

### Contexto del Sistema

Edita el `SYSTEM_CONTEXT` en `chatbotController.js` para personalizar el conocimiento del bot:

```javascript
const SYSTEM_CONTEXT = `
Eres un asistente virtual para tu sistema personalizado.
Aquí puedes agregar información específica sobre tu negocio...
`;
```

##  Funciones Avanzadas

### Historial de Conversaciones

El chatbot mantiene un historial por usuario que se puede:
- Limpiar manualmente
- Limitar automáticamente (últimos 10 mensajes)
- Persistir en base de datos (implementación futura)

### Respuestas de Fallback

Si la API de OpenAI no está disponible, el chatbot muestra respuestas predeterminadas útiles.

### Indicador de Escritura

Muestra cuando el bot está "escribiendo" para una mejor experiencia de usuario.

## 🌐 Responsive Design

El chatbot está optimizado para:
- ✅ Desktop
- ✅ Tablet
- ✅ Móvil
- ✅ Diferentes resoluciones

##  Solución de Problemas

### El chatbot no aparece
1. Verificar que `chatbot.css` y `chatbot.js` estén incluidos
2. Verificar que no haya errores en la consola del navegador
3. Verificar que el backend esté corriendo en el puerto 3000

### Error de conexión
1. Verificar que el backend esté funcionando: `http://localhost:3000/api/chatbot/status`
2. Verificar la configuración de CORS
3. Verificar que no haya adblockers bloqueando requests

### Respuestas limitadas
1. Verificar que la API key de OpenAI esté configurada correctamente
2. Verificar que tengas créditos en tu cuenta de OpenAI
3. Verificar logs del backend para errores específicos

##  Páginas con Chatbot Integrado

- ✅ `dashboard.html` - Dashboard principal
- ✅ `chatbot-demo.html` - Página de demostración

Para agregar a otras páginas, simplemente incluye los archivos CSS y JS.

##  Próximas Mejoras

- [ ] Persistencia de conversaciones en base de datos
- [ ] Análisis de sentimiento de mensajes
- [ ] Respuestas con imágenes y archivos
- [ ] Integración con funciones específicas del sistema
- [ ] Dashboard de analíticas del chatbot
- [ ] Soporte para múltiples idiomas

##  Soporte

Si tienes problemas o preguntas sobre el chatbot:

1. Revisa este README
2. Verifica los logs del backend
3. Prueba la página de demo: `chatbot-demo.html`
4. Revisa la consola del navegador para errores

---


