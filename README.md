# 🏢 SGPE - Sistema de Gestión para Pequeñas Empresas

Un sistema completo de gestión empresarial desarrollado con **Node.js**, **Express**, **SQLite** y **HTML/CSS/JavaScript** para pequeñas empresas que necesitan gestionar su inventario, clientes y facturación.

**🚀 Nuevo: Incluye un Chatbot IA integrado para asistencia al usuario.**

## ✨ Características Principales

### 🤖 **Chatbot Inteligente (Nuevo)**
- **Asistente virtual 24/7** para ayuda con el sistema
- **Respuestas contextuales** sobre clientes, productos y facturación
- **Interfaz moderna y responsive** integrada en todas las páginas
- **Modo básico** (sin API key) y **modo IA avanzado** (con OpenAI)
- **Botones de acción rápida** para consultas frecuentes

### 📋 **Gestión de Clientes**
- Registro completo de clientes con validación
- Búsqueda y filtros avanzados
- Historial de transacciones por cliente

### 📦 **Control de Inventario**
- Gestión completa de productos
- Control de stock en tiempo real
- Alertas de bajo inventario
- Categorización y códigos SKU

### 💰 **Sistema de Facturación**
- Generación automática de facturas
- Cálculo de totales e impuestos
- Historial completo de ventas
- Reportes de facturación

### 📊 **Dashboard Empresarial**
- Métricas en tiempo real
- Gráficos de ventas y tendencias
- Resumen ejecutivo del negocio
- Accesos rápidos a funciones principales


## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 16+ y npm
- Editor de código (VS Code recomendado)
- Navegador web moderno
- (Opcional) API key de OpenAI para chatbot IA

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd SGPE
```

2. **Configurar el Backend**
```bash
cd backend
npm install
npm run init-db
npm start
```

3. **Configurar el Frontend**
```bash
cd frontend
npm install
REM Abrir pages/dashboard.html en tu navegador
REM O usar un servidor web local
REM Ejemplo: abrir frontend/pages/dashboard.html con doble clic o desde el navegador
```

4. **Configurar Chatbot (Opcional)**
```bash
# Editar backend/config.env
# Descomentar y configurar la línea:
OPENAI_API_KEY=tu_api_key_aqui
```

5. **Acceder al Sistema**
- **Backend API:** http://localhost:3000
- **Frontend:** Abrir `frontend/pages/dashboard.html`
- **Demo Chatbot:** `frontend/pages/chatbot-demo.html`
- **Login:** admin@sgpe.com / admin123

## 📁 Estructura del Proyecto

```
SGPE/
├── backend/                 # Servidor Node.js + Express
│   ├── config/             # Configuración de BD y variables de entorno
│   ├── controllers/        # Lógica de negocio
│   │   ├── authController.js
│   │   ├── clienteController.js
│   │   ├── productoController.js
│   │   ├── facturaController.js
│   │   └── chatbotController.js  #  Nuevo: Controlador del chatbot
│   ├── models/            # Modelos de datos (Sequelize)
│   ├── routes/            # Rutas API
│   │   └── chatbotRoutes.js     #  Nuevo: Rutas del chatbot
│   ├── server.js          # Servidor principal
│   └── package.json       # Dependencias del backend
├── frontend/              # Interfaz de usuario
│   ├── pages/            # Páginas HTML
│   │   ├── chatbot.css          #  Nuevo: Estilos del chatbot
│   │   ├── chatbot.js           #  Nuevo: Lógica del chatbot
│   │   └── chatbot-demo.html    #  Nuevo: Demo del chatbot
│   ├── js/               # JavaScript del frontend
│   ├── components/       # Componentes reutilizables
│   │   └── chatbot-widget.html  #  Nuevo: Widget del chatbot
│   ├── index.html        # Página principal
│   └── package.json      # Dependencias del frontend
├── database/             # Scripts de base de datos
├── SETUP.md             # Guía completa de configuración
├── CHATBOT-README.md    #  Nuevo: Documentación del chatbot
├── CHATBOT-GUIA-RAPIDA.md #  Nuevo: Guía rápida del chatbot
├── start-chatbot.bat    #  Nuevo: Script para iniciar con chatbot
└── README.md            # Este archivo
```

##  Base de Datos

El sistema utiliza **SQLite** para desarrollo (archivo `database.sqlite`) con las siguientes tablas:


## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `GET /api/facturas/:id` - Obtener factura

###  Chatbot (Nuevo)
- `GET /api/chatbot/status` - Estado del chatbot
- `POST /api/chatbot/message` - Enviar mensaje al chatbot
- `POST /api/chatbot/clear` - Limpiar historial de conversación

## Funcionalidades Implementadas

### ✅ Backend Completo
- ✅ API REST con Express.js
- ✅ Base de datos SQLite con Sequelize
- ✅ Sistema de autenticación JWT
- ✅ Controladores para todas las entidades
- ✅ **Chatbot IA integrado** 
- ✅ Validaciones y manejo de errores
- ✅ CORS configurado para frontend

### ✅ Frontend Completo
- ✅ Interfaz responsiva HTML/CSS/JS
- ✅ Dashboard con métricas
- ✅ Gestión completa de clientes
- ✅ Control de inventario
- ✅ Sistema de facturación
- ✅ **Chatbot flotante en todas las páginas** 
- ✅ Login y autenticación
- ✅ Validaciones en tiempo real

### ✅ Integración Completa
- ✅ Comunicación frontend-backend
- ✅ Autenticación entre componentes
- ✅ Manejo de tokens JWT
- ✅ **API del chatbot funcionando** 
- ✅ Validaciones en tiempo real
- ✅ Manejo de errores y estados de carga

###  Chatbot IA (Nuevo)
- ✅ **Asistente virtual inteligente**
- ✅ **Respuestas contextuales sobre SGPE**
- ✅ **Interfaz moderna y responsive**
- ✅ **Modo básico** (funciona sin API key)
- ✅ **Modo IA avanzado** (con OpenAI GPT-3.5)
- ✅ **Botones de acción rápida**
- ✅ **Historial de conversaciones**
- ✅ **Integrado en dashboard y páginas principales**

##  Scripts Disponibles

### Backend
```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo (con auto-reload)
npm run init-db    # Inicializar base de datos
npm run test-api   # Probar endpoints de la API
```

### Frontend
```bash
npm start          # Ejecutar servidor de desarrollo
npm run dev        # Ejecutar servidor de desarrollo
npm run build      # Construir para producción
```

## Datos de Ejemplo

El sistema incluye datos de ejemplo para pruebas:

### Usuario Administrador

### Clientes de Ejemplo

### Productos de Ejemplo

## Solución de Problemas

### Error de conexión
1. Verificar que el backend esté ejecutándose en puerto 3000
2. Verificar que el frontend esté ejecutándose en puerto 8080
3. Revisar la consola del navegador para errores CORS

### Error de base de datos
```bash
cd backend
npm run init-db
```

### Error de autenticación

## Documentación Adicional

Para información detallada sobre configuración, consulte:
- **[SETUP.md](./SETUP.md)** - Guía completa de instalación y configuración
- **[CHATBOT-README.md](./CHATBOT-README.md)**  - Documentación técnica del chatbot
- **[CHATBOT-GUIA-RAPIDA.md](./CHATBOT-GUIA-RAPIDA.md)**  - Guía rápida para usar el chatbot
- **[roadmap.md](./roadmap.md)** - Cronograma y fases del proyecto

###  Archivos específicos del Chatbot
- `start-chatbot.bat` - Script para iniciar el sistema con chatbot
- `frontend/pages/chatbot-demo.html` - Página de demostración
- `frontend/components/chatbot-widget.html` - Widget reutilizable

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

##  Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## Autores
Reyning Perdomo Feliz 2023-1110

David Alejandro Liranzo 2023-1127

Elier Moreta Encarnación 2023-1168




