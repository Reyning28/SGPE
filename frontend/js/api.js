// Configuración de la API - Funciona con Live Server y otros servidores
const API_BASE_URL = "http://localhost:3000/api";

// Detectar automáticamente el puerto del frontend
const FRONTEND_PORT = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
const BACKEND_PORT = '3000';

console.log('🌐 Frontend ejecutándose en puerto:', FRONTEND_PORT);
console.log('🔧 Backend configurado en puerto:', BACKEND_PORT);

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
    console.log('🌐 Intentando conectar a:', url);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(`Error ${response.status}: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en petición API:', error);
    
    // Mensaje más específico para errores de conexión
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError(`Error de conexión con el servidor. Verifica que el backend esté ejecutándose en http://localhost:${BACKEND_PORT}`, 0);
    }
    
    throw error;
  }
}

// Función para verificar si el backend está disponible
async function checkBackendConnection() {
  try {
    console.log('🔍 Verificando conexión con el backend...');
    const response = await fetch(`http://localhost:${BACKEND_PORT}/api`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Backend conectado correctamente');
      return true;
    } else {
      console.log('❌ Backend respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend no disponible:', error);
    return false;
  }
}

// Función para mostrar estado de conexión en la página - DESHABILITADA
function showConnectionStatus(isConnected) {
  // Función deshabilitada - no mostrar indicador de conexión
  return;
  
  /* CÓDIGO ORIGINAL COMENTADO:
  // Crear o actualizar el indicador de estado
  let statusIndicator = document.getElementById('connection-status');
  
  if (!statusIndicator) {
    statusIndicator = document.createElement('div');
    statusIndicator.id = 'connection-status';
    statusIndicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      z-index: 9999;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(statusIndicator);
  }
  
  if (isConnected) {
    statusIndicator.textContent = '🟢 Conectado';
    statusIndicator.style.backgroundColor = '#d4edda';
    statusIndicator.style.color = '#155724';
    statusIndicator.style.border = '1px solid #c3e6cb';
  } else {
    statusIndicator.textContent = '🔴 Desconectado';
    statusIndicator.style.backgroundColor = '#f8d7da';
    statusIndicator.style.color = '#721c24';
    statusIndicator.style.border = '1px solid #f5c6cb';
  }
  */
}

// Verificar conexión automáticamente al cargar - DESHABILITADO
document.addEventListener('DOMContentLoaded', async function() {
  // Eliminar indicador de conexión si ya existe
  const existingIndicator = document.getElementById('connection-status');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Función deshabilitada - no verificar ni mostrar estado de conexión
  return;
  
  /* CÓDIGO ORIGINAL COMENTADO:
  const isConnected = await checkBackendConnection();
  showConnectionStatus(isConnected);
  */
  
  // Verificar cada 30 segundos
  setInterval(async () => {
    const connected = await checkBackendConnection();
    showConnectionStatus(connected);
  }, 30000);
});

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

  // Recuperar contraseña
  async forgotPassword(email) {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Restablecer contraseña
  async resetPassword(token, newPassword) {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
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
  ApiError,
  checkBackendConnection,
  showConnectionStatus
}; 