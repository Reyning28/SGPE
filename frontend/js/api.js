// Configuración de la API
const API_BASE_URL = "http://localhost:3000/api";

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

// Servicios para Productos
const ProductoService = {
  // Obtener todos los productos
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/productos?${queryString}` : '/productos';
    return await apiRequest(endpoint);
  },

  // Obtener productos con stock bajo
  async getStockBajo() {
    return await apiRequest('/productos/stock-bajo');
  },

  // Obtener un producto por ID
  async getById(id) {
    return await apiRequest(`/productos/${id}`);
  },

  // Crear un nuevo producto
  async create(producto) {
    return await apiRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(producto)
    });
  },

  // Actualizar un producto
  async update(id, producto) {
    return await apiRequest(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto)
    });
  },

  // Actualizar stock de un producto
  async updateStock(id, cantidad, tipo) {
    return await apiRequest(`/productos/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ cantidad, tipo })
    });
  },

  // Eliminar un producto
  async delete(id) {
    return await apiRequest(`/productos/${id}`, {
      method: 'DELETE'
    });
  }
};

// Servicios para Facturación
const FacturacionService = {
  // Obtener todas las facturas
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/facturas?${queryString}` : '/facturas';
    return await apiRequest(endpoint);
  },

  // Obtener estadísticas de facturación
  async getEstadisticas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/facturas/estadisticas?${queryString}` : '/facturas/estadisticas';
    return await apiRequest(endpoint);
  },

  // Obtener una factura por ID
  async getById(id) {
    return await apiRequest(`/facturas/${id}`);
  },

  // Crear una nueva factura
  async create(factura) {
    return await apiRequest('/facturas', {
      method: 'POST',
      body: JSON.stringify(factura)
    });
  },

  // Actualizar estado de una factura
  async updateEstado(id, estado) {
    return await apiRequest(`/facturas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado })
    });
  },

  // Eliminar una factura
  async delete(id) {
    return await apiRequest(`/facturas/${id}`, {
      method: 'DELETE'
    });
  }
};

// Servicios para Inventario (alias de ProductoService para compatibilidad)
const InventarioService = {
  ...ProductoService,
  // Métodos específicos del inventario
  async getProductosBajoStock() {
    return await ProductoService.getStockBajo();
  },

  async registrarEntrada(productoId, cantidad, motivo = 'Entrada manual') {
    return await ProductoService.updateStock(productoId, cantidad, 'entrada');
  },

  async registrarSalida(productoId, cantidad, motivo = 'Salida manual') {
    return await ProductoService.updateStock(productoId, cantidad, 'salida');
  }
};

// Exportar servicios
window.ApiService = {
  AuthService,
  ClienteService,
  ProductoService,
  FacturacionService,
  InventarioService,
  ApiError
}; 