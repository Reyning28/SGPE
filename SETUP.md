# 🚀 Guía de Configuración Completa - SGPE

## 📋 Requisitos Previos

- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd SGPE-1
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
```

#### Inicializar la base de datos:
```bash
npm run init-db
```

Este comando:
- ✅ Crea las tablas en la base de datos
- ✅ Configura las relaciones entre modelos
- ✅ Crea datos de ejemplo (clientes, productos, usuario admin)
- ✅ Usuario administrador: `admin@sgpe.com` / `admin123`

#### Ejecutar el servidor backend:
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El backend estará disponible en: `http://localhost:3000`

### 3. Configurar el Frontend

#### Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

#### Ejecutar el frontend:
```bash
# Desarrollo
npm run dev

# O simplemente abrir index.html en el navegador
```

El frontend estará disponible en: `http://localhost:8080`

## 🗄️ Estructura de la Base de Datos

### Tablas Creadas:
- **usuarios** - Gestión de usuarios del sistema
- **clientes** - Información de clientes
- **productos** - Catálogo de productos
- **facturas** - Facturas generadas
- **detalle_facturas** - Líneas de detalle de cada factura

### Relaciones:
- Cliente → Facturas (1:N)
- Factura → DetalleFactura (1:N)
- Producto → DetalleFactura (1:N)

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/stock-bajo` - Productos con stock bajo
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `PATCH /api/productos/:id/stock` - Actualizar stock
- `DELETE /api/productos/:id` - Eliminar producto

### Facturas
- `GET /api/facturas` - Obtener todas las facturas
- `GET /api/facturas/estadisticas` - Estadísticas de facturación
- `GET /api/facturas/:id` - Obtener factura por ID
- `POST /api/facturas` - Crear factura
- `PATCH /api/facturas/:id/estado` - Actualizar estado
- `DELETE /api/facturas/:id` - Eliminar factura

## 🎯 Funcionalidades Implementadas

### ✅ Backend Completo
- [x] Autenticación JWT
- [x] Gestión de usuarios
- [x] CRUD de clientes
- [x] CRUD de productos
- [x] Gestión de inventario
- [x] Sistema de facturación
- [x] Relaciones entre entidades
- [x] Validaciones de datos
- [x] Manejo de errores
- [x] Base de datos SQLite (desarrollo)

### ✅ Frontend Completo
- [x] Página de inicio con redirección
- [x] Sistema de autenticación
- [x] Dashboard principal
- [x] Gestión de clientes
- [x] Gestión de productos
- [x] Sistema de facturación
- [x] Servicios API completos
- [x] Interfaz moderna y responsive

### ✅ Integración
- [x] Comunicación frontend-backend
- [x] Autenticación entre componentes
- [x] Manejo de tokens JWT
- [x] Validaciones en tiempo real

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
npm start          # Ejecutar servidor de desarrollo
npm run dev        # Ejecutar servidor de desarrollo
npm run build      # Construir para producción
```

## 🚨 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que el archivo database.sqlite existe
ls backend/database.sqlite

# Si no existe, ejecutar:
npm run init-db
```

### Error de CORS
- El backend ya tiene CORS configurado para desarrollo
- Verificar que el frontend accede a `http://localhost:3000`

### Error de autenticación
- Verificar que el token JWT esté en localStorage
- Probar login con: `admin@sgpe.com` / `admin123`

### Puerto ocupado
```bash
# Cambiar puerto del backend en config.env
PORT=3001

# O cambiar puerto del frontend en package.json
"start": "live-server --port=8081"
```

## 📊 Datos de Ejemplo

### Usuario Administrador
- **Email:** admin@sgpe.com
- **Contraseña:** admin123

### Clientes de Ejemplo
- David Liranzo (david@empresa.com)
- Reyning Perdomo (reyning@empresa.com)
- Elier Moreta (elier@empresa.com)

### Productos de Ejemplo
- Laptop HP Pavilion ($45,000)
- Mouse Inalámbrico ($1,200)
- Teclado Mecánico ($3,500)
- Monitor 24" ($8,500)

## 🎉 ¡Listo para Usar!

Una vez completados todos los pasos:

1. **Backend ejecutándose:** `http://localhost:3000`
2. **Frontend ejecutándose:** `http://localhost:8080`
3. **Acceder al sistema:** `http://localhost:8080`
4. **Login:** admin@sgpe.com / admin123

El sistema está completamente funcional con todas las características implementadas:
- ✅ Gestión de inventario
- ✅ Gestión de clientes
- ✅ Sistema de facturación
- ✅ Autenticación y autorización
- ✅ Interfaz moderna y responsive

## 📞 Soporte

Si encuentras algún problema:
1. Verificar que todos los servicios estén ejecutándose
2. Revisar la consola del navegador para errores
3. Verificar los logs del servidor backend
4. Ejecutar `npm run init-db` para reinicializar la base de datos 