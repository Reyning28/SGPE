// Configuración de la API
// Usamos una ruta relativa para evitar problemas si el frontend **no** se sirve desde
// http://localhost:3000 (por ejemplo cuando se despliega en producción, se accede desde
// otra IP o se consulta a través de un túnel).  De esta forma la llamada se dirige al
// mismo host donde se está sirviendo la aplicación, solo añadiendo el prefijo /api.
const API_BASE_URL = '/api';

// Clase para manejar errores de la API
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Función para hacer peticiones HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(`Error ${response.status}: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error;
  }
}

// Servicios para Autenticación
const AuthService = {
  // Login
  async login(credentials) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Registro
  async register(userData) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Obtener perfil
  async getProfile() {
    return await apiRequest('/auth/profile');
  },

  // Guardar token en localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // Obtener token de localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Eliminar token
  removeToken() {
    localStorage.removeItem('token');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }
};

// Servicios para Clientes
const ClienteService = {
  // Obtener todos los clientes
  async getAll() {
    return await apiRequest('/clientes');
  },

  // Crear un nuevo cliente
  async create(cliente) {
    return await apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente)
    });
  },

  // Actualizar un cliente
  async update(id, cliente) {
    return await apiRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente)
    });
  },

  // Eliminar un cliente
  async delete(id) {
    return await apiRequest(`/clientes/${id}`, {
      method: 'DELETE'
    });
  }
};

// Servicios para Productos (para el futuro)
const ProductoService = {
  async getAll() {
    return await apiRequest('/productos');
  },

  async create(producto) {
    return await apiRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(producto)
    });
  }
};

// Servicios para Facturación (para el futuro)
const FacturacionService = {
  async getAll() {
    return await apiRequest('/facturas');
  },

  async create(factura) {
    return await apiRequest('/facturas', {
      method: 'POST',
      body: JSON.stringify(factura)
    });
  }
};

// Exportar servicios
window.ApiService = {
  AuthService,
  ClienteService,
  ProductoService,
  FacturacionService,
  ApiError
}; 