# 🏢 SGPE - Sistema de Gestión para Pequeñas Empresas

Un sistema completo de gestión empresarial desarrollado con **Node.js**, **Express**, **SQLite** y **HTML/CSS/JavaScript** para pequeñas empresas que necesitan gestionar su inventario, clientes y facturación.

## ✨ Características Principales

- 🔐 **Autenticación JWT** - Sistema seguro de login y registro
- 👥 **Gestión de Clientes** - CRUD completo de clientes
- 📦 **Gestión de Inventario** - Control de productos y stock
- 🧾 **Sistema de Facturación** - Generación y gestión de facturas
- 📊 **Dashboard Interactivo** - Estadísticas y métricas en tiempo real
- 📱 **Interfaz Responsive** - Funciona en desktop y móvil
- 🔄 **API REST Completa** - Endpoints para todas las funcionalidades

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd SGPE-1
```

2. **Configurar el Backend**
```bash
cd backend
npm install
npm run init-db
npm run dev
```

3. **Configurar el Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

4. **Acceder al Sistema**
- URL: `http://localhost:8080`
- Usuario: `admin@sgpe.com`
- Contraseña: `admin123`

## 📁 Estructura del Proyecto

```
SGPE-1/
├── backend/                 # Servidor Node.js + Express
│   ├── config/             # Configuración de BD y variables de entorno
│   ├── controllers/        # Lógica de negocio
│   ├── models/            # Modelos de datos (Sequelize)
│   ├── routes/            # Rutas API
│   ├── server.js          # Servidor principal
│   └── package.json       # Dependencias del backend
├── frontend/              # Interfaz de usuario
│   ├── pages/            # Páginas HTML
│   ├── js/               # JavaScript del frontend
│   ├── components/       # Componentes reutilizables
│   ├── index.html        # Página principal
│   └── package.json      # Dependencias del frontend
├── database/             # Scripts de base de datos
├── SETUP.md             # Guía completa de configuración
└── README.md            # Este archivo
```

## 🗄️ Base de Datos

El sistema utiliza **SQLite** para desarrollo (archivo `database.sqlite`) con las siguientes tablas:

- **usuarios** - Gestión de usuarios del sistema
- **clientes** - Información de clientes
- **productos** - Catálogo de productos con control de stock
- **facturas** - Facturas generadas
- **detalle_facturas** - Líneas de detalle de cada factura

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/stock-bajo` - Productos con stock bajo
- `POST /api/productos` - Crear producto
- `PATCH /api/productos/:id/stock` - Actualizar stock
- `DELETE /api/productos/:id` - Eliminar producto

### Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `PATCH /api/facturas/:id/estado` - Actualizar estado
- `GET /api/facturas/estadisticas` - Estadísticas

## 🎯 Funcionalidades Implementadas

### ✅ Backend Completo
- [x] Autenticación JWT con bcrypt
- [x] CRUD completo para todas las entidades
- [x] Validaciones de datos con Sequelize
- [x] Manejo de errores centralizado
- [x] Relaciones entre entidades
- [x] Control de stock automático
- [x] Generación automática de números de factura
- [x] Cálculo automático de totales e impuestos

### ✅ Frontend Completo
- [x] Interfaz moderna y responsive
- [x] Sistema de autenticación integrado
- [x] Dashboard con estadísticas en tiempo real
- [x] Gestión completa de clientes
- [x] Gestión completa de productos
- [x] Sistema de facturación completo
- [x] Notificaciones y alertas
- [x] Validaciones en tiempo real

### ✅ Integración Completa
- [x] Comunicación frontend-backend
- [x] Autenticación JWT entre componentes
- [x] Manejo de tokens en localStorage
- [x] CORS configurado para desarrollo
- [x] Manejo de errores de red

## 🔧 Scripts Disponibles

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

## 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo para pruebas:

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

## 🚨 Solución de Problemas

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
- Verificar credenciales: admin@sgpe.com / admin123
- Limpiar localStorage del navegador
- Verificar que el token JWT sea válido

## 📚 Documentación Adicional

Para información detallada sobre configuración, consulte:
- [SETUP.md](./SETUP.md) - Guía completa de configuración
- [backend/README.md](./backend/README.md) - Documentación del backend

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## 👥 Autores

- **David Liranzo** - Desarrollo inicial
- **Reyning Perdomo** - Contribuciones
- **Elier Moreta** - Contribuciones

## 🙏 Agradecimientos

- Express.js por el framework web
- Sequelize por el ORM
- SQLite por la base de datos
- Font Awesome por los iconos
- Inter font family por la tipografía

---

**¡El sistema SGPE está completamente funcional y listo para usar!** 🎉

