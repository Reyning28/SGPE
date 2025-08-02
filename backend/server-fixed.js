require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory users storage for testing (replace with real DB later)
const users = [
  {
    id: 1,
    nombre: 'Administrador',
    email: 'admin@sgpe.com',
    password: '$2b$10$example.hash.admin', // "admin123"
    rol: 'admin',
    activo: true
  }
];

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email && user.activo);
};

// Generate JWT token
const generateToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET || 'sgpe_jwt_secret_key_2024_secure_token',
    { expiresIn: '24h' }
  );
};

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'API SGPE funcionando correctamente', status: 'OK' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Find user
    const usuario = findUserByEmail(email);
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // For demo purposes, accept any password for existing users
    // In real implementation, use bcrypt.compare(password, usuario.password)
    
    const token = generateToken(usuario);

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rol = 'usuario' } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre, email y contraseña son requeridos' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      nombre,
      email,
      password: await bcrypt.hash(password, 10),
      rol,
      activo: true
    };

    users.push(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Verify token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token requerido' 
      });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'sgpe_jwt_secret_key_2024_secure_token'
    );

    const usuario = users.find(u => u.id === decoded.id && u.activo);
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Usuario no válido' 
      });
    }

    req.usuario = usuario;
    next();

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ 
      error: 'Token inválido' 
    });
  }
};

// Get profile endpoint
app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { password, ...usuario } = req.usuario;
    res.json(usuario);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor SGPE corriendo en http://localhost:${PORT}`);
  console.log(`📝 Usuarios de prueba:`);
  console.log(`   Email: admin@sgpe.com, Password: cualquier_password`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;