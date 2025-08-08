#  CHATBOT SGPE - GUÍA RÁPIDA

##  ¡Chatbot Implementado Exitosamente!

Tu sistema SGPE ahora incluye un chatbot inteligente que puede ayudar a los usuarios.

##  ¿Qué puedes hacer?

### 1. **Probar el Chatbot Inmediatamente**
- Ejecuta `start-chatbot.bat` para iniciar todo el sistema
- O abre manualmente: `frontend/pages/chatbot-demo.html`

### 2. **Usar el Chatbot en el Dashboard**
- Abre `frontend/pages/dashboard.html`
- Verás un botón flotante 💬 en la esquina inferior derecha
- ¡Haz clic y comienza a chatear!

### 3. **Preguntas que puedes hacer al bot:**
- "¿Cómo crear un cliente?"
- "¿Cómo generar una factura?"
- "¿Cómo agregar productos?"
- "Ayuda con el sistema"
- "¿Qué es SGPE?"

## 🔧 Configuración Avanzada (Opcional)

### Para activar IA completa con OpenAI:
1. Ve a: https://platform.openai.com/api-keys
2. Crea una API key
3. Edita `backend/config.env`
4. Descomenta y configura: `OPENAI_API_KEY=tu_api_key_aqui`
5. Reinicia el servidor

**Sin API key:** El chatbot funciona con respuestas inteligentes predefinidas
**Con API key:** El chatbot usa IA real de OpenAI

##  Páginas con Chatbot

- ✅ `dashboard.html` - Ya integrado
- ✅ `chatbot-demo.html` - Página de demostración

### Agregar a otras páginas:
```html
<!-- En el <head> -->
<link rel="stylesheet" href="chatbot.css">

<!-- Antes de </body> -->
<script src="chatbot.js"></script>
```

##  Características del Chatbot

- **Interfaz moderna** con animaciones suaves
- **Responsive** - funciona en móvil y desktop
- **Botones de acción rápida** para consultas frecuentes
- **Indicador de escritura** cuando el bot está respondiendo
- **Historial de conversación** mantenido por usuario
- **Modo fallback** cuando no hay conexión

##  Cómo Iniciar

### Opción 1: Script Automático
```bash
# Ejecutar el archivo .bat
start-chatbot.bat
```

### Opción 2: Manual
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Abrir frontend
cd frontend
# Abrir pages/chatbot-demo.html en tu navegador
```

##  Verificar que Funciona

1. **Backend:** Ve a http://localhost:3000/api/chatbot/status
2. **Frontend:** Abre `chatbot-demo.html`
3. **Integración:** Abre `dashboard.html` y busca el botón 💬

##  Solución de Problemas

###  El botón del chatbot no aparece
- Verificar que los archivos `chatbot.css` y `chatbot.js` estén incluidos
- Abrir la consola del navegador para ver errores

###  Error de conexión
- Verificar que el backend esté ejecutándose (puerto 3000)
- Verificar la URL de la API en `chatbot.js`

###  Respuestas básicas solamente
- Es normal si no tienes API key de OpenAI configurada
- Para IA completa, configura `OPENAI_API_KEY` en `config.env`


**Archivos principales:**
- `CHATBOT-README.md` - Documentación completa
- `start-chatbot.bat` - Script de inicio rápido
- `frontend/pages/chatbot-demo.html` - Página de prueba

