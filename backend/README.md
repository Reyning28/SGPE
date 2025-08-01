# Backend SGPE

Backend del Sistema de Gestión para Pequeñas Empresas (SGPE) desarrollado con Node.js, Express y MySQL.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

#### Opción A: Usar archivo .env (Recomendado)
1. Copia el archivo de ejemplo:
```bash
cp config.env.example .env
```

2. Edita el archivo `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sgpe_db
DB_USER=root
DB_PASSWORD=tu_contraseña
PORT=3000
NODE_ENV=development
```

#### Opción B: Usar configuración por defecto
Si no tienes archivo `.env`, el sistema usará la configuración por defecto:
- Host: localhost
- Puerto: 3306
- Base de datos: sgpe_db
- Usuario: root
- Contraseña: (vacía)

### 3. Base de Datos

#### Para Desarrollo (Recomendado):
El sistema usa **SQLite** automáticamente en desarrollo, no necesitas configurar nada.

#### Para Producción (MySQL):
```sql
CREATE DATABASE sgpe_db;
```

### 4. Inicializar Base de Datos
```bash
npm run init-db
```

### 5. Ejecutar el Servidor

#### Desarrollo (con auto-reload):
```bash
npm run dev
```

#### Producción:
```bash
npm start
```

## 📊 Estructura del Proyecto

```
backend/
├── config/
│   ├── database.js          # Configuración de base de datos
│   └── initDatabase.js      # Script de inicialización
├── controllers/
│   └── clienteController.js # Lógica de negocio para clientes
├── models/
│   └── Cliente.js           # Modelo de datos para clientes
├── routes/
│   └── clienteRoutes.js     # Rutas API para clientes
├── server.js                # Servidor principal
└── package.json
```

## 🔌 APIs Disponibles

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `POST /api/clientes` - Crear nuevo cliente

## 🛠️ Scripts Disponibles

- `npm start` - Ejecutar servidor en producción
- `npm run dev` - Ejecutar servidor en desarrollo con auto-reload
- `npm run init-db` - Inicializar base de datos y crear datos de ejemplo

## 📝 Notas

- El servidor corre por defecto en el puerto 3000
- **Desarrollo**: Usa SQLite automáticamente (archivo `database.sqlite`)
- **Producción**: Configura MySQL en el archivo `.env`
- Los logs de SQL se muestran solo en modo desarrollo
- El archivo `database.sqlite` se crea automáticamente en el directorio backend 