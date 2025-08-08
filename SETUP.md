#  Guía de Configuración Completa - SGPE

##  Requisitos Previos


##  Instalación y Configuración

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

-  Usuario administrador: `admin@sgpe.com` / `admin123`

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



### Tablas Creadas:
- **usuarios** - Gestión de usuarios del sistema
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

