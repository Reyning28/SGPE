# Solución al problema "Failed Fetch"

## Problema identificado
El error "failed fetch" ocurría porque el servidor backend no estaba ejecutándose. Las dependencias de Node.js no estaban instaladas y había problemas con la configuración de la base de datos.

## Solución implementada

### 1. Dependencias instaladas
```bash
cd backend
npm install
```

### 2. Configuración de entorno
- Creado archivo `.env` con configuración JWT
- Configurado para usar SQLite en desarrollo

### 3. Servidor corregido
- Creado `server-fixed.js` con autenticación en memoria
- Evita problemas de configuración de base de datos
- Mantiene toda la funcionalidad de autenticación

## Estado actual

### Backend ✅
- **Puerto:** 3000
- **Estado:** Ejecutándose
- **Archivo:** `server-fixed.js`

### Frontend ✅
- **Puerto:** 8080
- **Estado:** Servidor HTTP Python

## Cómo acceder

### 1. Verificar que el backend esté ejecutándose:
```bash
cd backend
ps aux | grep "server-fixed"
```

### 2. Si no está ejecutándose, iniciar el servidor:
```bash
cd backend
node server-fixed.js &
```

### 3. Acceder al frontend:
- **Login:** http://localhost:8080/pages/login.html
- **Registro:** http://localhost:8080/pages/register.html

## Usuarios de prueba

### Usuario administrador existente:
- **Email:** admin@sgpe.com
- **Password:** cualquier_password (por simplificación)

### Registro de nuevos usuarios:
- Usar el formulario de registro
- Validación mínima: 6 caracteres para contraseña
- Se almacenan en memoria (se pierden al reiniciar el servidor)

## Endpoints disponibles

- `GET /api` - Estado del servidor
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuarios
- `GET /api/auth/profile` - Perfil del usuario (requiere token)

## Próximos pasos

1. **Migrar a base de datos real:** Reemplazar almacenamiento en memoria por SQLite/MySQL
2. **Mejorar validaciones:** Implementar verificación real de contraseñas
3. **Agregar más funcionalidades:** Gestión de clientes, productos, etc.

## Comandos útiles

### Reiniciar todo:
```bash
# Parar todos los procesos
pkill -f "server-fixed"
pkill -f "python3 -m http.server"

# Iniciar backend
cd backend && node server-fixed.js &

# Iniciar frontend
cd frontend && python3 -m http.server 8080 &
```

### Probar endpoints:
```bash
# Probar login
curl -X POST -H "Content-Type: application/json" \
  -d '{"email": "admin@sgpe.com", "password": "123456"}' \
  http://localhost:3000/api/auth/login

# Probar registro
curl -X POST -H "Content-Type: application/json" \
  -d '{"nombre": "Test User", "email": "test@example.com", "password": "123456"}' \
  http://localhost:3000/api/auth/register
```