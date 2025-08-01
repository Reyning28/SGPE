# SGPE - Sistema de Gestión para Pequeñas Empresas

Este proyecto tiene como objetivo ofrecer a pequeñas empresas una solución para gestionar su inventario, clientes y facturación.

## Estructura del Proyecto

- **frontend/**: Contiene todo el código relacionado a la interfaz del usuario.
  - **public/**: Recursos estáticos como imágenes, íconos y el `index.html`.
  - **src/**: Código fuente del frontend.
    - **components/**: Componentes reutilizables como botones, formularios, etc.
    - **pages/**: Pantallas completas como login, inventario, clientes, etc.

- **backend/**: Lógica del servidor y conexión a la base de datos.
  - **controllers/**: Funciones que controlan la lógica de negocio de cada módulo.
  - **models/**: Estructura de los datos (ORM como Sequelize).
  - **routes/**: Rutas API para cada módulo (clientes, productos, facturación).
  - **config/**: Configuración del proyecto, como conexión a la base de datos.

- **database/**: Scripts para crear o poblar la base de datos (`schema.sql`).

- **config.env.example**: Archivo de ejemplo con las variables de entorno necesarias para configurar la base de datos.

