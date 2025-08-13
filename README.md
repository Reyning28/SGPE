# 🏢 SGPE - Sistema de Gestión para Pequeñas Empresas

Un sistema completo de gestión empresarial desarrollado con **Node.js**, **Express**, **SQLite** y **HTML/CSS/JavaScript** vanilla para pequeñas empresas que necesitan gestionar su inventario, clientes y facturación de manera eficiente.

## ✨ Características Principales

### 📋 **Gestión de Clientes**
- Registro completo de clientes con validación en tiempo real
- Búsqueda inteligente por nombre
- Modal personalizado para confirmación de eliminación
- Interfaz moderna y responsive

### 📦 **Control de Inventario**
- Gestión completa de productos con códigos únicos
- Control de stock en tiempo real
- Alertas visuales de stock bajo/mínimo
- Categorización por tipos (Electrónicos, Ropa, etc.)

### 💰 **Sistema de Facturación**
- Generación de facturas con múltiples productos
- Cálculo automático de subtotales, ITBIS y totales
- Búsqueda de clientes y productos en tiempo real
- Interfaz intuitiva para creación de facturas

### 📊 **Dashboard Empresarial**
- Métricas en tiempo real (productos, clientes, facturas, ventas)
- Gráficos interactivos con Chart.js
  - Distribución por categorías (gráfico de dona)
  - Análisis de stock (gráfico de barras)
- Resumen ejecutivo del negocio
- Accesos rápidos a todas las funciones

### 🔐 **Sistema de Autenticación**
- Login seguro con JWT tokens
- Validación de sesión en todas las páginas
- Logout automático por expiración de token
- Registro de nuevos usuarios

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **SQLite** - Base de datos ligera
- **Sequelize** - ORM para base de datos
- **JWT (jsonwebtoken)** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Grid, Flexbox, Variables CSS)
- **JavaScript Vanilla** - Lógica del cliente
- **Chart.js** - Gráficos interactivos
- **Font Awesome** - Iconografía
- **Google Fonts (Inter)** - Tipografía moderna

### Herramientas de Desarrollo
- **npm** - Gestor de paquetes
- **Visual Studio Code** - Editor recomendado
- **Git** - Control de versiones

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js 16+** y **npm**
- **Navegador web moderno** (Chrome, Firefox, Edge)
- **Editor de código** (VS Code recomendado)

### Instalación Automática

**Opción 1: Script de inicio (Recomendado)**
```bash
# Doble clic en start-project.bat o ejecutar:
start-project.bat
```

**Opción 2: Instalación manual**

1. **Configurar el Backend**
```bash
cd backend
npm install
npm start
```

2. **Configurar el Frontend**
```bash
cd frontend
npm install
npm start
```

3. **Acceder al Sistema**
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Credenciales:** admin@sgpe.com / admin123

## 📁 Estructura del Proyecto

```
SGPE/
├── backend/                 # Servidor Node.js + Express
│   ├── config/             
│   │   ├── database.js     # Configuración de SQLite
│   │   ├── associations.js # Relaciones entre modelos
│   │   └── initDatabase.js # Inicialización de BD
│   ├── controllers/        # Lógica de negocio
│   │   ├── authController.js    # Autenticación JWT
│   │   ├── clienteController.js # CRUD clientes
│   │   ├── productoController.js # CRUD productos
│   │   └── facturaController.js # CRUD facturas
│   ├── models/            # Modelos Sequelize
│   │   ├── Usuario.js     # Modelo de usuarios
│   │   ├── Cliente.js     # Modelo de clientes
│   │   ├── Producto.js    # Modelo de productos
│   │   ├── Factura.js     # Modelo de facturas
│   │   └── DetalleFactura.js # Detalles de factura
│   ├── routes/            # Rutas API REST
│   │   ├── authRoutes.js      # /api/auth/*
│   │   ├── clienteRoutes.js   # /api/clientes/*
│   │   ├── productoRoutes.js  # /api/productos/*
│   │   └── facturaRoutes.js   # /api/facturas/*
│   ├── database.sqlite    # Base de datos SQLite
│   ├── server.js         # Servidor principal
│   └── package.json      # Dependencias backend
├── frontend/             # Interfaz de usuario
│   ├── pages/           # Páginas principales
│   │   ├── dashboard.html + .css + .js    # Dashboard principal
│   │   ├── login.html + .css + .js        # Página de login
│   │   ├── register.html + .js            # Registro de usuarios
│   │   ├── clientes.html + pagina_cliente.css + .js # Gestión clientes
│   │   ├── producto.html + Producto.css + .js       # Gestión productos
│   │   ├── facturacion.html + .css + .js           # Sistema facturación
│   │   └── chatbot.css + .js              # Estilos chatbot (dashboard)
│   ├── js/              # JavaScript compartido
│   │   ├── api.js       # Servicios API y comunicación backend
│   │   └── auth.js      # Sistema autenticación frontend
│   ├── index.html       # Página de carga y verificación
│   └── package.json     # Dependencias frontend
├── start-project.bat    # Script inicio automático Windows
├── start.bat + start.sh # Scripts alternativos
└── documentación/       # Archivos informativos
```

## 🗄️ Base de Datos

El sistema utiliza **SQLite** con las siguientes tablas principales:

### Usuarios
- **id** (Primary Key)
- **email** (Unique)
- **password** (Encrypted)
- **rol** (admin/usuario)
- **activo** (Boolean)

### Clientes
- **id** (Primary Key)
- **nombre** (String)
- **email** (String)
- **telefono** (String)

### Productos
- **id** (Primary Key)
- **codigo** (Unique)
- **nombre** (String)
- **categoria** (String)
- **precio** (Decimal)
- **stock** (Integer)
- **stockMinimo** (Integer)

### Facturas & DetalleFactura
- Sistema completo de facturación con relaciones
- Cálculo automático de totales e ITBIS (18%)

## 🌐 API Endpoints

### Autenticación
```
POST /api/auth/login     # Iniciar sesión
POST /api/auth/register  # Registrar usuario
GET  /api/auth/profile   # Obtener perfil usuario
```

### Gestión de Clientes
```
GET    /api/clientes     # Listar todos los clientes
POST   /api/clientes     # Crear nuevo cliente
PUT    /api/clientes/:id # Actualizar cliente existente
DELETE /api/clientes/:id # Eliminar cliente
```

### Gestión de Productos
```
GET    /api/productos     # Listar todos los productos
POST   /api/productos     # Crear nuevo producto
PUT    /api/productos/:id # Actualizar producto existente
DELETE /api/productos/:id # Eliminar producto
```

### Sistema de Facturación
```
GET    /api/facturas     # Listar todas las facturas
POST   /api/facturas     # Crear nueva factura
GET    /api/facturas/:id # Obtener factura específica
PUT    /api/facturas/:id # Actualizar factura
DELETE /api/facturas/:id # Eliminar factura
```

### Endpoints de Estado
```
GET /api               # Estado general de la API
GET /api/status        # Verificación de salud del servidor
```

## ✅ Funcionalidades Implementadas

### 🔧 Backend Completo
- ✅ API REST con Express.js
- ✅ Base de datos SQLite con Sequelize ORM
- ✅ Sistema de autenticación JWT completo
- ✅ Controladores para todas las entidades (CRUD)
- ✅ Validaciones de entrada y manejo de errores
- ✅ CORS configurado para desarrollo y producción
- ✅ Middleware de autenticación
- ✅ Inicialización automática de base de datos

### 🎨 Frontend Completo
- ✅ Interfaz responsive con CSS Grid y Flexbox
- ✅ Dashboard interactivo con Chart.js
- ✅ Gestión completa de clientes con búsqueda
- ✅ Control de inventario con alertas visuales
- ✅ Sistema de facturación multi-producto
- ✅ Login/Register con validación en tiempo real
- ✅ Modales personalizados para confirmaciones
- ✅ Navegación fluida entre módulos
- ✅ Sistema de mensajes de éxito/error

### 🔗 Integración Sistema
- ✅ Comunicación frontend-backend sin librerías externas
- ✅ Autenticación consistente en todas las páginas
- ✅ Manejo de tokens JWT con expiración
- ✅ Validaciones sincronizadas frontend-backend
- ✅ Estados de carga y manejo de errores
- ✅ Respuestas en tiempo real

## 📊 Características del Dashboard

### Métricas en Tiempo Real
- **Total Productos** - Con indicador de stock bajo
- **Total Clientes** - Clientes registrados
- **Total Facturas** - Facturas del mes actual
- **Ventas Totales** - Ingresos en RD$

### Gráficos Interactivos
- **Gráfico de Dona** - Distribución de productos por categorías
- **Gráfico de Barras** - Análisis de stock actual vs. stock mínimo

### Accesos Rápidos
- Nuevo Producto
- Nuevo Cliente  
- Nueva Factura

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Ejecutar servidor en producción
npm run dev        # Desarrollo con auto-reload (nodemon)
npm run init-db    # Inicializar base de datos
npm test          # Ejecutar tests
```

### Frontend
```bash
npm start          # Servidor de desarrollo (port 8080)
npm run dev        # Alias para npm start
npm run preview    # Preview de producción
```

## 👥 Datos de Ejemplo

### Usuario Administrador
- **Email:** admin@sgpe.com  
- **Password:** admin123
- **Rol:** Administrador

### Productos de Ejemplo
- **Laptop Dell XPS 13** (Electrónicos) - RD$ 45,000
- **Camisa Polo** (Ropa) - RD$ 1,200

## 🚨 Solución de Problemas

### Error de Conexión API
1. Verificar que el backend esté en puerto 3000
2. Verificar que el frontend esté en puerto 8080  
3. Revisar consola del navegador para errores CORS

### Error de Base de Datos
```bash
cd backend
npm run init-db
rm database.sqlite  # Si es necesario reiniciar
npm start
```

### Problemas de Autenticación
1. Limpiar localStorage del navegador
2. Verificar que el token no haya expirado
3. Reiniciar sesión

### Puertos Ocupados
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8080

# Cambiar puertos en package.json si es necesario
```

## 🔮 Próximas Características

- [ ] **Reportes PDF** - Generación de facturas en PDF
- [ ] **Backup Automático** - Respaldo periódico de datos
- [ ] **Multi-idioma** - Soporte para inglés/español
- [ ] **API de Pagos** - Integración con pasarelas de pago
- [ ] **Notificaciones** - Sistema de alertas en tiempo real
- [ ] **Roles Avanzados** - Permisos granulares por usuario

## 📚 Documentación Adicional

- **[SETUP.md](./SETUP.md)** - Guía detallada de instalación
- **[roadmap.md](./roadmap.md)** - Hoja de ruta del proyecto  
- **[LICENSE](./LICENSE)** - Información de licencia

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la **Licencia ISC**. Ver [LICENSE](./LICENSE) para más detalles.

---

## 👨‍💻 Desarrolladores

**Equipo de Desarrollo SGPE:**

- **Reyning Perdomo Feliz** - 2023-1110
- **David Alejandro Liranzo** - 2023-1127  
- **Elier Moreta Encarnación** - 2023-1168

---

### 🎯 SGPE - Simplificando la gestión empresarial

*Un sistema moderno, eficiente y fácil de usar para pequeñas empresas dominicanas.*


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


## Autores
Reyning Perdomo Feliz 2023-1110

David Alejandro Liranzo 2023-1127

Elier Moreta Encarnación 2023-1168




