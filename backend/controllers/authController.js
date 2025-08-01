const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Generar token JWT
const generateToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET || 'tu_jwt_secret_aqui',
    { expiresIn: '24h' }
  );
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ 
      where: { email, activo: true } 
    });

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.comparePassword(password);
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generateToken(usuario);

    // Respuesta exitosa
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
};

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'usuario' } = req.body;

    // Validaciones
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

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ 
      where: { email } 
    });

    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      rol
    });

    // Generar token
    const token = generateToken(nuevoUsuario);

    // Respuesta exitosa
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

// Verificar token (middleware)
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token requerido' 
      });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'tu_jwt_secret_aqui'
    );

    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario || !usuario.activo) {
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

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(usuario);

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
}; 