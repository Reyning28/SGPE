// Dashboard Nuevo - JavaScript
console.log('🚀 Iniciando Dashboard Nuevo...');

// Verificar autenticación antes de cargar el dashboard
function checkAuthentication() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No hay token de autenticación. Redirigiendo al login...');
        window.location.href = 'login.html';
        return false;
    }
    
    // Verificar si el token ha expirado
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp < currentTime) {
            console.log(' Token expirado. Redirigiendo al login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return false;
        }
        
        console.log('✅ Usuario autenticado:', payload.email);
        return true;
        
    } catch (error) {
        console.error('❌ Token malformado:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return false;
    }
}

// Variables globales
let categoriesChart = null;
let stockChart = null;

// Datos globales del dashboard
let dashboardData = {
    productos: [],
    clientes: [],
    facturas: []
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log(' DOM cargado - verificando autenticación...');
    
    // Verificar autenticación antes de inicializar el dashboard
    if (!checkAuthentication()) {
        return; // Si no está autenticado, se redirige y no continúa
    }
    
    console.log(' Usuario autenticado - inicializando dashboard...');
    initDashboard();
});

async function initDashboard() {
    try {
        console.log(' Iniciando configuración del dashboard...');
        
        // Configurar fecha actual
        updateCurrentDate();
        
        // Mostrar estado de carga
        showLoadingState();
        
        // Cargar datos de todas las páginas
        await loadAllData();
        
        // Actualizar estadísticas
        updateStatistics();
        
        // Crear gráficos
        createCharts();
        
        // Configurar estado de conexión
        updateConnectionStatus(true);
        
        console.log('✅ Dashboard inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
        showErrorState();
    }
}

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('es-DO', options);
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = dateStr;
    }
}

function showLoadingState() {
    console.log(' Mostrando estado de carga...');
    
    const loadingElements = [
        'total-productos',
        'total-clientes', 
        'total-facturas',
        'ventas-totales'
    ];
    
    loadingElements.forEach(id => {
        updateElement(id, 'Cargando...');
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('loading');
        }
    });
}

async function loadAllData() {
    console.log(' Cargando datos de todas las páginas...');
    
    try {
        // Cargar productos (igual que en Producto.js)
        await loadProductos();
        
        // Cargar clientes 
        await loadClientes();
        
        // Cargar facturas
        await loadFacturas();
        
        console.log(' Datos cargados:', {
            productos: dashboardData.productos.length,
            clientes: dashboardData.clientes.length,
            facturas: dashboardData.facturas.length
        });
        
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        
        // Verificar si el error es de autenticación
        if (!localStorage.getItem('token')) {
            console.log(' Error de autenticación - redirigiendo al login');
            window.location.href = 'login.html';
            return;
        }
        
        // Solo usar datos de fallback si es un error de conectividad
        console.log(' Usando datos de fallback por error de conectividad');
        loadFallbackData();
    }
}

async function loadProductos() {
    console.log(' Cargando productos...');
    
    try {
        // Verificar ApiService como lo hace Producto.js
        if (!window.ApiService) {
            console.warn(' ApiService no disponible');
            dashboardData.productos = [];
            return;
        }
        
        if (!window.ApiService.ProductoService) {
            console.warn(' ProductoService no disponible');
            dashboardData.productos = [];
            return;
        }
        
        const ProductoService = window.ApiService.ProductoService;
        const response = await ProductoService.getAll();
        
        if (response && response.success) {
            dashboardData.productos = response.data || [];
            console.log('✅ Productos cargados desde API:', dashboardData.productos.length);
        } else {
            console.warn(' Error en respuesta de productos');
            dashboardData.productos = [];
        }
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        dashboardData.productos = [];
    }
}

async function loadClientes() {
    console.log(' Cargando clientes...');
    
    try {
        if (window.ApiService && window.ApiService.ClienteService) {
            const ClienteService = window.ApiService.ClienteService;
            // Usar la misma lógica que pagina_cliente.js
            const clientes = await ClienteService.getAll();
            
            // ClienteService.getAll() devuelve directamente el array, no un objeto con success/data
            if (Array.isArray(clientes)) {
                dashboardData.clientes = clientes;
                console.log('✅ Clientes cargados desde API:', dashboardData.clientes.length);
            } else {
                console.warn('Respuesta de clientes no es un array:', clientes);
                dashboardData.clientes = [];
            }
        } else {
            console.warn('ClienteService no disponible');
            dashboardData.clientes = [];
        }
    } catch (error) {
        console.error('❌ Error cargando clientes:', error);
        dashboardData.clientes = [];
    }
}

async function loadFacturas() {
    console.log(' Cargando facturas...');
    
    try {
        if (window.ApiService && window.ApiService.FacturacionService) {
            const FacturacionService = window.ApiService.FacturacionService;
            const response = await FacturacionService.getAll();
            
            if (response && response.success) {
                dashboardData.facturas = response.data || [];
                console.log('✅ Facturas cargadas desde API:', dashboardData.facturas.length);
            }
        } else {
            console.warn('FacturacionService no disponible');
            dashboardData.facturas = [];
        }
    } catch (error) {
        console.error('❌ Error cargando facturas:', error);
        dashboardData.facturas = [];
    }
}



function loadFallbackData() {
    console.log(' Cargando datos vacíos por error de conectividad...');
    dashboardData.productos = [];
    dashboardData.clientes = [];
    dashboardData.facturas = [];
}

function updateStatistics() {
    console.log(' Actualizando estadísticas...');
    
    // Remover clases de loading
    const elements = ['total-productos', 'total-clientes', 'total-facturas', 'ventas-totales'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('loading');
        }
    });
    
    // Calcular estadísticas
    const totalProductos = dashboardData.productos.length;
    const totalClientes = dashboardData.clientes.length;
    const totalFacturas = dashboardData.facturas.length;
    
    // Productos con stock bajo
    const productosStockBajo = dashboardData.productos.filter(producto => {
        const stock = parseInt(producto.stock || 0);
        const stockMinimo = parseInt(producto.stockMinimo || 10);
        return stock > 0 && stock < stockMinimo;
    }).length;
    
    // Calcular ventas totales
    const ventasTotales = dashboardData.facturas.reduce((total, factura) => {
        return total + parseFloat(factura.total || 0);
    }, 0);
    
    // Facturas del mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    
    const facturasMes = dashboardData.facturas.filter(factura => {
        if (!factura.fecha) return false;
        const fechaFactura = new Date(factura.fecha);
        return fechaFactura.getMonth() === mesActual && 
               fechaFactura.getFullYear() === añoActual;
    }).length;
    
    // Actualizar elementos del DOM
    updateElement('total-productos', totalProductos.toString());
    updateElement('total-clientes', totalClientes.toString());
    updateElement('total-facturas', totalFacturas.toString());
    updateElement('ventas-totales', `RD$ ${ventasTotales.toLocaleString('es-DO')}`);
    
    // Actualizar detalles
    updateElement('productos-bajo-stock', `${productosStockBajo} con stock bajo`);
    updateElement('clientes-activos', `${totalClientes} clientes registrados`);
    updateElement('facturas-mes', `${facturasMes} facturas este mes`);
    updateElement('ventas-mes', ventasTotales > 0 ? 'RD$ ' + ventasTotales.toLocaleString('es-DO') : 'Sin ventas registradas');
    
    console.log(' Estadísticas actualizadas:', {
        totalProductos,
        productosStockBajo,
        totalClientes,
        totalFacturas,
        facturasMes,
        ventasTotales
    });
}

function createCharts() {
    console.log(' Creando gráficos...');
    
    createCategoriesChart();
    createStockChart();
}

function createCategoriesChart() {
    const ctx = document.getElementById('categoriesChart');
    if (!ctx) return;
    
    // Agrupar productos por categoría
    const categorias = {};
    dashboardData.productos.forEach(producto => {
        const categoria = producto.categoria || 'Sin Categoría';
        categorias[categoria] = (categorias[categoria] || 0) + 1;
    });
    
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    
    if (categoriesChart) {
        categoriesChart.destroy();
    }
    
    categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['Sin Datos'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createStockChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;
    
    // Datos de stock de productos
    const labels = dashboardData.productos.map(p => p.nombre || 'Sin Nombre');
    const stockData = dashboardData.productos.map(p => parseInt(p.stock || 0));
    const stockMinimoData = dashboardData.productos.map(p => parseInt(p.stockMinimo || 10));
    
    if (stockChart) {
        stockChart.destroy();
    }
    
    stockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['Sin Productos'],
            datasets: [
                {
                    label: 'Stock Actual',
                    data: stockData.length > 0 ? stockData : [0],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: 'Stock Mínimo',
                    data: stockMinimoData.length > 0 ? stockMinimoData : [0],
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        console.log(`✅ ${id}: ${value}`);
    } else {
        console.warn(`❌ Elemento no encontrado: ${id}`);
    }
}

function updateConnectionStatus(isConnected) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        if (isConnected) {
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Conectado</span>';
            statusElement.style.backgroundColor = 'var(--success)';
        } else {
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Sin Conexión</span>';
            statusElement.style.backgroundColor = 'var(--error)';
        }
    }
}

function showErrorState() {
    console.log('❌ Mostrando estado de error...');
    
    updateElement('total-productos', 'Error');
    updateElement('total-clientes', 'Error');
    updateElement('total-facturas', 'Error');
    updateElement('ventas-totales', 'Error');
    
    updateConnectionStatus(false);
}

// Función para logout (debe estar disponible globalmente)
function handleLogout() {
    console.log(' Cerrando sesión...');
    
    // Limpiar localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirigir al login
    window.location.href = 'login.html';
}

// Hacer la función disponible globalmente
window.handleLogout = handleLogout;

console.log('✅ Dashboard JavaScript cargado correctamente');
