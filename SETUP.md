# 🛠️ Guía de Configuración Completa - SGPE

## 📋 Requisitos Previos
- **Node.js 16+** y npm
- **Editor de código** (VS Code recomendado)
- **Navegador web moderno** (Chrome, Firefox, Edge)
- **(Opcional)** Cuenta de OpenAI para chatbot IA avanzado

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd SGPE
```

### 2. Configurar el Backend

#### Instalar dependencias del backend:
```bash
cd backend
npm install
```

#### Configurar variables de entorno:
El archivo `config.env` ya está creado con la configuración por defecto. Si necesitas personalizarlo:

```bash
# Editar config.env si es necesario
# Las configuraciones por defecto son:
# - Puerto: 3000
# - Base de datos: SQLite (desarrollo)
# - JWT Secret: sgpe_jwt_secret_key_2024_secure

# 🤖 NUEVO: Para activar chatbot IA avanzado
# OPENAI_API_KEY=tu_api_key_de_openai_aqui
```

#### 🤖 Configurar Chatbot IA (Opcional):
Para habilitar el chatbot con IA real de OpenAI:

1. **Obtener API key de OpenAI:**
   - Ve a https://platform.openai.com/api-keys
   - Crea una nueva API key
   - Cópiala para el siguiente paso

2. **Configurar la API key:**
   ```bash
   # Editar backend/config.env
   # Descomentar y configurar:
   OPENAI_API_KEY=tu_api_key_aqui
   ```

3. **Sin API key:** El chatbot funciona en modo básico con respuestas predefinidas

#### Inicializar la base de datos:
```bash
npm run init-db
```

**✅ Usuario administrador creado:** `admin@sgpe.com` / `admin123`

#### Ejecutar el servidor backend:
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

**✅ El backend estará disponible en:** `http://localhost:3000`
**✅ API del chatbot:** `http://localhost:3000/api/chatbot`

### 3. Configurar el Frontend

#### Opción A: Uso directo (Recomendado)
```bash
cd ../frontend

# Abrir directamente en el navegador:
# - pages/dashboard.html (Sistema principal)
# - pages/chatbot-demo.html (Demo del chatbot)
# - pages/login.html (Inicio de sesión)
```

#### Opción B: Servidor web local
```bash
# Si tienes Python instalado:
python -m http.server 8080

# Si tienes Node.js live-server:
npx live-server --port=8080

# Luego abrir: http://localhost:8080/pages/dashboard.html
```

### 4. 🤖 Probar el Chatbot

#### Verificar estado del chatbot:
```bash
# Abrir en navegador:
http://localhost:3000/api/chatbot/status
```

#### Probar el chatbot:
1. **Demo completa:** Abrir `frontend/pages/chatbot-demo.html`
2. **En el sistema:** Abrir `frontend/pages/dashboard.html` y buscar el botón 💬
3. **Preguntas de prueba:**
   - "¿Cómo crear un cliente?"
   - "Control de inventario"
   - "¿Cómo generar una factura?"
   - "Ayuda"

### 5. 🚀 Inicio Rápido con Script
```bash
# Windows: Ejecutar el script que inicia todo
start-chatbot.bat
```

## 🗄️ Base de Datos

El sistema utiliza **SQLite** para desarrollo (archivo `database.sqlite`) con las siguientes tablas:

### Tablas Creadas:
- **usuarios** - Gestión de usuarios del sistema
- **clientes** - Información de clientes
- **productos** - Catálogo de productos
- **facturas** - Registro de ventas
- **detalle_facturas** - Líneas de productos por factura

### Datos de Ejemplo Incluidos:
- ✅ Usuario administrador
- ✅ 5 clientes de ejemplo
- ✅ 10 productos de ejemplo
- ✅ 3 facturas de muestra

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con auto-reload
npm run init-db    # Inicializar base de datos
npm run test-api   # Probar endpoints de la API
```

### Frontend
```bash
# No requiere instalación de dependencias
# Abrir directamente los archivos HTML en el navegador
```

### 🤖 Chatbot
```bash
# Verificar estado
curl http://localhost:3000/api/chatbot/status

# Enviar mensaje de prueba
curl -X POST http://localhost:3000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola"}'
```

## 🛠️ Solución de Problemas

### Error de conexión a la base de datos
```bash
cd backend
npm run init-db
```

### Error de conexión entre frontend y backend
- Verificar que el backend esté ejecutándose en puerto 3000
- Verificar que el frontend accede a `http://localhost:3000`
- Revisar la consola del navegador para errores CORS

### Error de autenticación
- Verificar que el token JWT esté en localStorage
- Probar login con: `admin@sgpe.com` / `admin123`

### 🤖 Problemas con el Chatbot

#### El chatbot no aparece
1. Verificar que `chatbot.css` y `chatbot.js` estén incluidos en la página
2. Abrir la consola del navegador para ver errores
3. Verificar que el backend esté corriendo

#### Error de conexión del chatbot
1. Verificar: `http://localhost:3000/api/chatbot/status`
2. Revisar logs del backend para errores
3. Verificar configuración de CORS

#### Respuestas básicas solamente
- Es normal si no tienes API key de OpenAI configurada
- Para IA completa, configura `OPENAI_API_KEY` en `config.env`
- Reinicia el servidor después de configurar la API key

#### API key de OpenAI no funciona
1. Verificar que la API key sea válida en https://platform.openai.com
2. Verificar que tengas créditos disponibles en tu cuenta
3. Revisar logs del backend para errores específicos

## 📚 Documentación Adicional

- **[CHATBOT-README.md](./CHATBOT-README.md)** - Documentación técnica completa del chatbot
- **[CHATBOT-GUIA-RAPIDA.md](./CHATBOT-GUIA-RAPIDA.md)** - Guía rápida de uso del chatbot
- **[README.md](./README.md)** - Información general del proyecto

---

**¡El sistema SGPE con chatbot IA está listo para usar! 🚀🤖**

## 🗄️ Base de Datos

El sistema utiliza **SQLite** para desarrollo (archivo `database.sqlite`) con las siguientes tablas:

### Tablas Creadas:
- **usuarios** - Gestión de usuarios del sistema
- **clientes** - Información de clientes
- **productos** - Catálogo de productos
- **facturas** - Registro de ventas
- **detalle_facturas** - Líneas de productos por factura

### Datos de Ejemplo Incluidos:
- ✅ Usuario administrador
- ✅ 5 clientes de ejemplo
- ✅ 10 productos de ejemplo
- ✅ 3 facturas de muestra
- `PUT /api/clientes/:id` - Actualizar cliente
- `POST /api/productos` - Crear producto
- [x] Gestión de clientes
- [x] Gestión de productos
###  Integración
- [x] Comunicación frontend-backend
- [x] Autenticación entre componentes
- [x] Manejo de tokens JWT
- [x] Validaciones en tiempo real

##  Scripts Disponibles

### Backend
```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con auto-reload
npm run init-db    # Inicializar base de datos
npm run test-api   # Probar endpoints de la API
```

### Frontend
```bash
npm start          # Ejecutar servidor de desarrollo
npm run dev        # Ejecutar servidor de desarrollo
npm run build      # Construir para producción
```

### Error de conexión a la base de datos
```bash

```

- Verificar que el frontend accede a `http://localhost:3000`

### Error de autenticación
- Verificar que el token JWT esté en localStorage
- Probar login con: `admin@sgpe.com` / `admin123`

# Cambiar puerto del backend en config.env
- **Contraseña:** admin123

- Elier Moreta (elier@empresa.com)

### Productos de Ejemplo
- Laptop HP Pavilion ($45,000)
- Mouse Inalámbrico ($1,200)
- Teclado Mecánico ($3,500)

El sistema está completamente funcional con todas las características implementadas:
-  Gestión de inventario
-  Gestión de clientes
-  Sistema de facturación
-  Autenticación y autorización
-  Interfaz moderna y responsive

