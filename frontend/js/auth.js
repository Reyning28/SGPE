// Middleware de autenticación para el frontend
class AuthMiddleware {
  // Verificar si el usuario está autenticado
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obtener información del usuario desde el token
  static getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Decodificar el token JWT (parte del payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        rol: payload.rol
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  // Obtener el token actual
  static getToken() {
    return localStorage.getItem('token');
  }

  // Verificar si el token ha expirado
  static isTokenExpired() {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Redirigir a login si no está autenticado
  static requireAuth() {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }

  // Logout
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }

  // Verificar permisos de rol
  static hasRole(requiredRole) {
    const userInfo = this.getUserInfo();
    if (!userInfo) return false;
    
    return userInfo.rol === requiredRole || userInfo.rol === 'admin';
  }

  // Mostrar información del usuario en la interfaz
  static updateUserInterface() {
    const userInfo = this.getUserInfo();
    if (!userInfo) return;

    // Actualizar nombre de usuario en el dashboard
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
      element.textContent = userInfo.email;
    });

    // Actualizar rol de usuario
    const userRoleElements = document.querySelectorAll('.user-role');
    userRoleElements.forEach(element => {
      element.textContent = userInfo.rol === 'admin' ? 'Administrador' : 'Usuario';
    });
  }

  // Agregar botón de logout a la interfaz
  static addLogoutButton() {
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    });
  }

  // Verificar autenticación al cargar la página
  static init() {
    // Verificar si estamos en la página de login
    if (window.location.pathname.includes('login.html')) {
      // Si ya está autenticado, redirigir al dashboard
      if (this.isAuthenticated() && !this.isTokenExpired()) {
        window.location.href = 'dashboard.html';
      }
      return;
    }

    // Para otras páginas, verificar autenticación
    if (!this.requireAuth()) {
      return;
    }

    // Actualizar interfaz de usuario
    this.updateUserInterface();
    this.addLogoutButton();

    // Verificar token cada 5 minutos
    setInterval(() => {
      if (this.isTokenExpired()) {
        this.logout();
      }
    }, 5 * 60 * 1000);
  }
}

// Inicializar middleware cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  AuthMiddleware.init();
});

// Exportar para uso global
window.AuthMiddleware = AuthMiddleware; 