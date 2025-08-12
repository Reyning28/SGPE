function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 0;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        min-width: 320px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: linear-gradient(135deg, #10b981 0%, #059669 100%);' : 
          type === 'error' ? 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);' : 
          'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);'}
    `;
    
    // Agregar estilos para el contenido del mensaje
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .message-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            gap: 1rem;
        }
        .message-text {
            flex: 1;
            font-weight: 600;
            font-size: 0.875rem;
            line-height: 1.4;
        }
        .message-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            opacity: 0.8;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
        }
        .message-close:hover {
            opacity: 1;
            background-color: rgba(255,255,255,0.1);
        }
    `;
    
    if (!document.querySelector('style[data-message-styles]')) {
        styleSheet.setAttribute('data-message-styles', 'true');
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(messageDiv);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Validación básica
    if (!email || !password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Obtener referencias del botón al inicio para que estén disponibles en todo el scope
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Mostrar indicador de carga
        submitBtn.textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;

        // Intentar login con la API
        let response;
        try {
            response = await ApiService.AuthService.login({ email, password });
        } catch (apiError) {
            // Si no hay backend, simular validación local
            if (apiError.status === 0 || !apiError.status) {
                console.log('Backend no disponible, validando localmente...');
                
                // Validaciones locales básicas para demo
                const validUsers = [
                    { email: 'admin@sgpe.com', password: 'admin123' },
                    { email: 'usuario@sgpe.com', password: '123456' },
                    { email: 'test@test.com', password: 'test123' }
                ];
                
                const user = validUsers.find(u => u.email === email);
                
                if (!user) {
                    throw { status: 404, message: 'Usuario no encontrado' };
                } else if (user.password !== password) {
                    throw { status: 401, message: 'Contraseña incorrecta' };
                } else {
                    // Simular token para demo local
                    response = { 
                        success: true, 
                        token: 'demo-token-' + Date.now(),
                        user: { email: user.email, name: 'Usuario Demo' }
                    };
                }
            } else {
                throw apiError;
            }
        }
        
        // Guardar token
        ApiService.AuthService.setToken(response.token);
        
        showMessage('✅ Login exitoso! Redirigiendo...', 'success');
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Error en login:', error);
        
        // Manejar diferentes tipos de errores
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.status === 401) {
            errorMessage = '❌ Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.status === 400) {
            errorMessage = '⚠️ Datos incompletos. Por favor verifica los campos.';
        } else if (error.status === 404) {
            errorMessage = '❌ Usuario no encontrado. Verifica tu email.';
        } else if (error.status === 500) {
            errorMessage = '🔧 Error del servidor. Intenta nuevamente en unos momentos.';
        } else if (error.status === 0 || !error.status) {
            errorMessage = '🌐 Sin conexión al servidor. Verifica tu conexión a internet.';
        } else {
            errorMessage = error.message || 'Error desconocido al iniciar sesión';
        }
        
        showMessage(errorMessage, 'error');
        
        // Limpiar el campo de contraseña si es error de credenciales
        if (error.status === 401 || error.status === 404) {
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    } finally {
        // Restaurar botón siempre, sin importar si hubo éxito o error
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

document.getElementById('email').addEventListener('input', function(e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        e.target.setCustomValidity('Por favor ingresa un email válido');
    } else {
        e.target.setCustomValidity('');
    }
});

document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    
    if (password && password.length < 6) {
        e.target.setCustomValidity('La contraseña debe tener al menos 6 caracteres');
    } else {
        e.target.setCustomValidity('');
    }
});

document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Funcionalidad para "¿Olvidaste tu contraseña?"
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarModalRecuperarPassword();
});

function mostrarModalRecuperarPassword() {
    // Crear modal de recuperación de contraseña
    const modalHtml = `
        <div class="modal-overlay" id="password-recovery-modal">
            <div class="recovery-modal">
                <div class="recovery-header">
                    <h2>
                        <i class="fas fa-key"></i>
                        Recuperar Contraseña
                    </h2>
                    <button class="close-modal" onclick="cerrarModalRecuperacion()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="recovery-content">
                    <p class="recovery-description">
                        Ingresa tu dirección de correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                    </p>
                    
                    <form id="recovery-form" class="recovery-form">
                        <div class="form-group">
                            <label for="recovery-email" class="form-label">Correo Electrónico</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input 
                                    type="email" 
                                    id="recovery-email" 
                                    name="recovery-email" 
                                    placeholder="usuario@empresa.com" 
                                    class="form-input"
                                    required
                                >
                            </div>
                        </div>
                        
                        <div class="recovery-actions">
                            <button type="button" class="btn-secondary" onclick="cerrarModalRecuperacion()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-paper-plane"></i>
                                Enviar Instrucciones
                            </button>
                        </div>
                    </form>
                    
                    <div class="recovery-help">
                        <p><strong>¿Necesitas ayuda?</strong></p>
                        <p>Si no recibes el correo, verifica:</p>
                        <ul>
                            <li>Tu carpeta de spam o correo no deseado</li>
                            <li>Que el correo electrónico esté escrito correctamente</li>
                            <li>Contacta al administrador del sistema si persiste el problema</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insertar modal en el DOM
    const existingModal = document.getElementById('password-recovery-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal con animación
    const modal = document.getElementById('password-recovery-modal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Enfocar el campo de email
    setTimeout(() => {
        document.getElementById('recovery-email').focus();
    }, 300);
    
    // Configurar eventos del formulario
    document.getElementById('recovery-form').addEventListener('submit', handlePasswordRecovery);
}

function cerrarModalRecuperacion() {
    const modal = document.getElementById('password-recovery-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

async function handlePasswordRecovery(e) {
    e.preventDefault();
    
    const email = document.getElementById('recovery-email').value.trim();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validación básica
    if (!email) {
        showMessage('Por favor, ingresa tu correo electrónico', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, ingresa un correo electrónico válido', 'error');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Intentar con la API
        let success = false;
        try {
            if (window.ApiService && window.ApiService.AuthService && window.ApiService.AuthService.forgotPassword) {
                const response = await window.ApiService.AuthService.forgotPassword(email);
                success = response && response.success;
            } else {
                throw new Error('API no disponible');
            }
        } catch (apiError) {
            console.log('API no disponible, simulando envío...');
            
            // Simular validación local para demo
            const validEmails = [
                'admin@sgpe.com',
                'usuario@sgpe.com', 
                'test@test.com'
            ];
            
            // Simular delay de envío
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (validEmails.includes(email)) {
                success = true;
            } else {
                throw { status: 404, message: 'Email no encontrado en el sistema' };
            }
        }
        
        if (success) {
            showMessage('✅ Se han enviado las instrucciones a tu correo electrónico', 'success');
            cerrarModalRecuperacion();
            
            // Mostrar información adicional
            setTimeout(() => {
                showMessage('📧 Revisa tu bandeja de entrada y spam', 'info');
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        
        let errorMessage = 'Error al enviar las instrucciones';
        
        if (error.status === 404) {
            errorMessage = '❌ No encontramos una cuenta con ese correo electrónico';
        } else if (error.status === 429) {
            errorMessage = '⏰ Demasiados intentos. Intenta nuevamente en unos minutos';
        } else if (error.status === 500) {
            errorMessage = '🔧 Error del servidor. Intenta nuevamente más tarde';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
        
    } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
        const form = e.target.closest('form');
        if (form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }
});

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', function(e) {
    const modal = document.getElementById('password-recovery-modal');
    if (modal && e.target === modal) {
        cerrarModalRecuperacion();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalRecuperacion();
    }
});



