// Verificar conexión con el backend al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔍 Verificando conexión con el backend...');
    
    try {
        const isConnected = await ApiService.checkBackendConnection();
        if (!isConnected) {
            showError('⚠️ No se puede conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:3000');
        } else {
            console.log('✅ Conexión con el backend establecida');
        }
    } catch (error) {
        console.error('❌ Error verificando conexión:', error);
        showError('⚠️ Error verificando conexión con el servidor');
    }
});

// Función para mostrar errores
function showError(message) {
    const errorDiv = document.getElementById('error-message') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.backgroundColor = '#fdf2f2';
    errorDiv.style.border = '1px solid #f5c6cb';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.marginBottom = '15px';
}

// Función para mostrar éxito
function showSuccess(message) {
    const successDiv = document.getElementById('success-message') || createSuccessDiv();
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    successDiv.style.color = '#155724';
    successDiv.style.backgroundColor = '#d4edda';
    successDiv.style.border = '1px solid #c3e6cb';
    successDiv.style.padding = '10px';
    successDiv.style.borderRadius = '5px';
    successDiv.style.marginBottom = '15px';
}

// Función para crear div de error
function createErrorDiv() {
    const div = document.createElement('div');
    div.id = 'error-message';
    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(div, form);
    return div;
}

// Función para crear div de éxito
function createSuccessDiv() {
    const div = document.createElement('div');
    div.id = 'success-message';
    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(div, form);
    return div;
}

// Función para limpiar mensajes
function clearMessages() {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Función para mostrar loading
function showLoading() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';
}

// Función para ocultar loading
function hideLoading() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Registrarse';
}

// Manejar el envío del formulario
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    clearMessages();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones básicas
    if (!nombre || !email || !password || !confirmPassword) {
        showError('Por favor, completa todos los campos');
        return;
    }

    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    // Mostrar loading
    showLoading();

    try {
        console.log('📝 Intentando registrar usuario:', { nombre, email });
        
        const response = await ApiService.AuthService.register({
            nombre,
            email,
            password
        });

        console.log('✅ Registro exitoso:', response);
        showSuccess('¡Registro exitoso! Redirigiendo al login...');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('❌ Error en registro:', error);
        
        if (error.status === 0) {
            showError('Error de conexión con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3000');
        } else if (error.status === 400) {
            showError(error.message || 'Datos de registro inválidos');
        } else if (error.status === 409) {
            showError('Ya existe un usuario con ese email');
        } else {
            showError(error.message || 'Error al registrar usuario. Intenta nuevamente.');
        }
    } finally {
        hideLoading();
    }
});

// Validación en tiempo real del email
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#e74c3c';
        showError('Por favor, ingresa un email válido');
    } else {
        this.style.borderColor = '#ddd';
        clearMessages();
    }
});

// Validación en tiempo real de las contraseñas
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.style.borderColor = '#e74c3c';
        showError('Las contraseñas no coinciden');
    } else {
        this.style.borderColor = '#ddd';
        clearMessages();
    }
});