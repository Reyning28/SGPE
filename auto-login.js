// Script para hacer login automático y configurar el token
// Ejecutar en la consola del navegador para probar la facturación

async function autoLogin() {
    console.log('🔑 Iniciando login automático...');
    
    try {
        const credentials = {
            email: 'admin@sgpe.com',
            password: 'admin123'
        };
        
        console.log('📤 Enviando credenciales...');
        const response = await ApiService.AuthService.login(credentials);
        
        if (response.token) {
            console.log('✅ Login exitoso!');
            console.log('Token configurado:', response.token.substring(0, 20) + '...');
            
            // Verificar que el token se guardó
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                console.log('✅ Token guardado en localStorage');
                
                // Probar acceso a la API
                console.log('🌐 Probando acceso a la API...');
                const clientes = await ApiService.ClienteService.getAll();
                console.log(`✅ API funcionando - ${clientes.length} clientes encontrados`);
                
                // Recargar la página de facturación
                if (window.location.pathname.includes('facturacion.html')) {
                    console.log('🔄 Recargando página de facturación...');
                    window.location.reload();
                } else {
                    console.log('🎯 Ve a la página de facturación para probar');
                }
            } else {
                console.log('❌ Error: Token no se guardó correctamente');
            }
        } else {
            console.log('❌ Error: No se recibió token del servidor');
        }
        
    } catch (error) {
        console.error('❌ Error en login automático:', error);
        console.log('💡 Verifica que el backend esté ejecutándose en http://localhost:3000');
    }
}

// Función para verificar el estado actual
function checkAuthStatus() {
    console.log('🔍 Verificando estado de autenticación...');
    
    const token = localStorage.getItem('token');
    const isAuth = AuthMiddleware.isAuthenticated();
    const userInfo = AuthMiddleware.getUserInfo();
    
    console.log('Token presente:', !!token);
    console.log('Autenticado:', isAuth);
    console.log('Info usuario:', userInfo);
    
    return { token: !!token, isAuth, userInfo };
}

// Función para limpiar token
function clearAuth() {
    console.log('🗑️ Limpiando autenticación...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Token eliminado');
}

// Función para probar la API
async function testAPI() {
    console.log('🌐 Probando endpoints de la API...');
    
    try {
        const clientes = await ApiService.ClienteService.getAll();
        console.log(`✅ Clientes: ${clientes.length}`);
        
        const productos = await ApiService.ProductoService.getAll();
        console.log(`✅ Productos: ${productos.length}`);
        
        const facturas = await ApiService.FacturaService.getAll();
        console.log(`✅ Facturas: ${facturas.length}`);
        
        return { clientes, productos, facturas };
    } catch (error) {
        console.error('❌ Error probando API:', error);
        return null;
    }
}

// Función para ir a facturación
function goToFacturacion() {
    window.location.href = 'facturacion.html';
}

// Función para ir al login
function goToLogin() {
    window.location.href = 'login.html';
}

// Mostrar ayuda
console.log(`
🚀 Script de Login Automático - SGPE
====================================

Funciones disponibles:
- autoLogin()     - Hacer login automático
- checkAuthStatus() - Verificar estado de autenticación
- clearAuth()     - Limpiar token
- testAPI()       - Probar endpoints de la API
- goToFacturacion() - Ir a la página de facturación
- goToLogin()     - Ir a la página de login

Para usar:
1. Ejecuta: autoLogin()
2. Ve a facturación: goToFacturacion()

Credenciales: admin@sgpe.com / admin123
`);

// Auto-ejecutar si estamos en la página de facturación
if (window.location.pathname.includes('facturacion.html')) {
    console.log('📄 Detectada página de facturación');
    checkAuthStatus();
} 