# 🏢 SGPE - Sistema de Gestión para Pequeñas Empresas

Un sistema completo de gestión empresarial desarrollado con **Node.js**, **Express**, **SQLite** y **HTML/CSS/JavaScript** para pequeñas empresas que necesitan gestionar su inventario, clientes y facturación.
## Licencia
## ✨ Características Principales


## 🚀 Inicio Rápido

### Prerrequisitos

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


## API Endpoints

### Autenticación

### Clientes

### Productos

### Facturas

## Funcionalidades Implementadas

### ✅ Backend Completo

### ✅ Frontend Completo

### ✅ Integración Completa

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

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## Autores
Reyning Perdomo Feliz 2023-1110
David Alejandro Liranzo 2023-1127
Elier Moreta Encarnación 2023-1168

**¡El sistema SGPE está completamente funcional y listo para usar!**

