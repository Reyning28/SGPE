// Dashboard Simple JavaScript

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Variables globales
let ventasChart = null;
let categoriasChart = null;

// Datos de ejemplo para las gráficas
const ventasDatos = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
        label: 'Ventas (RD$)',
        data: [1200, 1900, 3000, 5000, 2300, 3200, 4100],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

const categoriasDatos = {
    labels: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Otros'],
    datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
        ],
        borderWidth: 0
    }]
};

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log(' Dashboard DOMContentLoaded - iniciando...');
    initializeDashboard();
});

async function initializeDashboard() {
    try {
        console.log(' Inicializando dashboard...');
        
        // Verificar que los elementos críticos existan
        console.log(' Verificando elementos del DOM...');
        console.log('- ventas-mes:', document.getElementById('ventas-mes'));
        console.log('- total-productos:', document.getElementById('total-productos'));
        console.log('- total-clientes:', document.getElementById('total-clientes'));
        console.log('- total-facturas:', document.getElementById('total-facturas'));
        
        // Mostrar datos de loading
        showLoadingStats();
        
        // Cargar datos del servidor
        await loadDashboardData();
        
        // Inicializar gráficas
        initializeCharts();
        
        // Cargar actividad reciente
        loadRecentActivity();
        
        // Cargar alertas
        loadAlerts();
        
        // Configurar auto-refresh cada 5 minutos
        setInterval(refreshDashboard, 300000);
        
    } catch (error) {
        console.error('Error al inicializar dashboard:', error);
        showErrorMessage('Error al cargar el dashboard');
    }
}

function updateElement(id, value) {
    console.log(` Intentando actualizar elemento ${id} con valor: ${value}`);
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        console.log(`✅ Actualizado ${id}: ${value}`);
    } else {
        console.error(`❌ Elemento NO encontrado: ${id}`);
        // Lista todos los elementos con IDs para debug
        const allElements = document.querySelectorAll('[id]');
        console.log(' Todos los elementos con ID encontrados:', Array.from(allElements).map(el => el.id));
    }
}

function showLoadingStats() {
    console.log('Mostrando estado de carga...');
    updateElement('ventas-mes', 'Cargando...');
    updateElement('total-productos', 'Cargando...');
    updateElement('total-clientes', 'Cargando...');
    updateElement('total-facturas', 'Cargando...');
}

async function loadDashboardData() {
    console.log('Cargando datos del dashboard usando ApiService...');
    
    try {
        let facturas = [];
        let productos = [];
        let clientes = [];
        
        // Cargar productos usando EXACTAMENTE la misma lógica que Producto.js
        console.log('Verificando ApiService...');
        if (!window.ApiService) {
            console.error('ApiService no está disponible');
            productos = createTestProducts();
        } else if (!window.ApiService.ProductoService) {
            console.error('ProductoService no está disponible');
            productos = createTestProducts();
        } else {
            try {
                console.log('Intentando cargar productos desde API...');
                const ProductoService = window.ApiService.ProductoService;
                const response = await ProductoService.getAll();
                
                if (response && response.success) {
                    productos = response.data || [];
                    console.log('Productos cargados desde API:', productos.length);
                } else {
                    console.error('Error al cargar productos:', response?.message);
                    console.log('Usando productos de prueba como fallback');
                    productos = createTestProducts();
                }
            } catch (error) {
                console.error('Error cargando productos:', error);
                console.log('Usando productos de prueba como fallback');
                productos = createTestProducts();
            }
        }
        
        // Cargar facturas si hay servicio disponible
        if (window.ApiService && window.ApiService.FacturacionService) {
            try {
                const FacturacionService = window.ApiService.FacturacionService;
                const response = await FacturacionService.getAll();
                if (response && response.success) {
                    facturas = response.data || [];
                }
            } catch (error) {
                console.log('Error cargando facturas:', error);
            }
        }
        
        // Cargar clientes si hay servicio disponible
        if (window.ApiService && window.ApiService.ClienteService) {
            try {
                const ClienteService = window.ApiService.ClienteService;
                const response = await ClienteService.getAll();
                if (response && response.success) {
                    clientes = response.data || [];
                }
            } catch (error) {
                console.log('Error cargando clientes:', error);
            }
        }
        
        console.log('Datos finales del dashboard:', { 
            facturas: facturas.length, 
            productos: productos.length, 
            clientes: clientes.length 
        });
        
        // Actualizar estadísticas con los datos obtenidos
        updateStats(facturas, productos, clientes);
        
    } catch (error) {
        console.error('Error general al cargar datos del dashboard:', error);
        // En caso de error total, mostrar datos de fallback
        updateStatsWithFallback();
    }
}

// Crear los mismos productos de prueba que usa producto.html
function createTestProducts() {
    return [
        {
            id: 1,
            codigo: 'PROD001',
            nombre: 'Producto Ejemplo 1',
            categoria: 'Electrónicos',
            precio: 100.00,
            stock: 50,
            stockMinimo: 10
        },
        {
            id: 2,
            codigo: 'PROD002',
            nombre: 'Producto Ejemplo 2',
            categoria: 'Ropa',
            precio: 25.00,
            stock: 5,
            stockMinimo: 10
        }
    ];
}

async function createSampleData(token) {
    if (!token) {
        updateStatsWithFallback();
        return;
    }
    
    console.log('Creando datos de ejemplo en el servidor...');
    
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        
        // Crear algunos productos de ejemplo
        const productosEjemplo = [
            { nombre: 'Laptop HP', descripcion: 'Laptop para oficina', precio: 45000, stock: 5, categoria: 'Electrónicos' },
            { nombre: 'Mouse Inalámbrico', descripcion: 'Mouse bluetooth', precio: 850, stock: 25, categoria: 'Electrónicos' },
            { nombre: 'Camisa Polo', descripcion: 'Camisa casual', precio: 1200, stock: 8, categoria: 'Ropa' },
            { nombre: 'Silla Oficina', descripcion: 'Silla ergonómica', precio: 8500, stock: 12, categoria: 'Hogar' }
        ];
        
        for (const producto of productosEjemplo) {
            try {
                await fetch(`${API_BASE_URL}/productos`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(producto)
                });
            } catch (error) {
                console.log('Error creando producto:', error);
            }
        }
        
        // Crear algunos clientes de ejemplo
        const clientesEjemplo = [
            { nombre: 'María García', email: 'maria@email.com', telefono: '809-555-0101', direccion: 'Santo Domingo' },
            { nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '809-555-0102', direccion: 'Santiago' },
            { nombre: 'Ana López', email: 'ana@email.com', telefono: '809-555-0103', direccion: 'Puerto Plata' }
        ];
        
        for (const cliente of clientesEjemplo) {
            try {
                await fetch(`${API_BASE_URL}/clientes`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(cliente)
                });
            } catch (error) {
                console.log('Error creando cliente:', error);
            }
        }
        
        console.log('Datos de ejemplo creados, recargando...');
        
        // Esperar un momento y recargar datos
        setTimeout(async () => {
            await loadDashboardData();
        }, 1000);
        
    } catch (error) {
        console.error('Error creando datos de ejemplo:', error);
        updateStatsWithFallback();
    }
}

function updateStats(facturas, productos, clientes) {
    console.log('Actualizando estadísticas con datos reales...');
    console.log('Datos recibidos:', { facturas: facturas.length, productos: productos.length, clientes: clientes.length });
    
    // Calcular ventas del mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    
    // Filtrar facturas del mes actual
    const facturasMes = facturas.filter(factura => {
        if (!factura.fecha) return false;
        const fechaFactura = new Date(factura.fecha);
        return fechaFactura.getMonth() === mesActual && 
               fechaFactura.getFullYear() === añoActual;
    });
    
    // Calcular ventas del mes (solo facturas pagadas o completadas)
    const ventasMes = facturasMes
        .filter(factura => factura.estado === 'pagada' || factura.estado === 'completada' || !factura.estado)
        .reduce((total, factura) => total + parseFloat(factura.total || 0), 0);
    
    // Productos con stock bajo (menos de 10 unidades)
    const stockBajo = productos.filter(producto => 
        parseInt(producto.stock || 0) < 10 && parseInt(producto.stock || 0) > 0
    ).length;
    
    // Clientes nuevos del mes
    const clientesNuevos = clientes.filter(cliente => {
        if (!cliente.fechaRegistro && !cliente.createdAt) return false;
        const fechaRegistro = new Date(cliente.fechaRegistro || cliente.createdAt);
        return fechaRegistro.getMonth() === mesActual && 
               fechaRegistro.getFullYear() === añoActual;
    }).length;
    
    // Facturas pendientes
    const facturasPendientes = facturas.filter(factura => 
        factura.estado === 'pendiente' || factura.estado === 'proceso'
    ).length;
    
    // Actualizar DOM con datos calculados
    updateElement('ventas-mes', `RD$ ${ventasMes.toLocaleString('es-DO')}`);
    updateElement('total-productos', productos.length.toString());
    updateElement('total-clientes', clientes.length.toString());
    updateElement('total-facturas', facturas.length.toString());
    
    // Actualizar indicadores
    updateElement('stock-bajo', `${stockBajo} con stock bajo`);
    updateElement('clientes-nuevos', `${clientesNuevos} nuevos este mes`);
    updateElement('facturas-pendientes', `${facturasPendientes} pendientes`);
    
    console.log('Estadísticas actualizadas:', {
        ventasMes,
        totalProductos: productos.length,
        stockBajo,
        totalClientes: clientes.length,
        clientesNuevos,
        totalFacturas: facturas.length,
        facturasPendientes
    });
}

function updateStatsWithFallback() {
    console.log('Mostrando datos de fallback (mismos que en las páginas)');
    
    // Usar los mismos datos de prueba que en producto.html
    const productos = createTestProducts();
    const facturas = [];
    const clientes = [];
    
    updateStats(facturas, productos, clientes);
}

function initializeCharts() {
    // Gráfica de ventas
    const ventasCtx = document.getElementById('ventasChart').getContext('2d');
    ventasChart = new Chart(ventasCtx, {
        type: 'line',
        data: ventasDatos,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'RD$ ' + value.toLocaleString();
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
    
    // Gráfica de categorías
    const categoriasCtx = document.getElementById('categoriasChart').getContext('2d');
    categoriasChart = new Chart(categoriasCtx, {
        type: 'doughnut',
        data: categoriasDatos,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    
    const activities = [
        {
            icon: 'fas fa-file-invoice',
            iconClass: 'success',
            title: 'Nueva factura generada',
            description: 'Factura #001234 - Cliente: María García',
            time: 'Hace 15 min'
        },
        {
            icon: 'fas fa-box',
            iconClass: 'warning',
            title: 'Stock bajo detectado',
            description: 'Producto: Laptop HP - Quedan 3 unidades',
            time: 'Hace 1 hora'
        },
        {
            icon: 'fas fa-user-plus',
            iconClass: 'success',
            title: 'Nuevo cliente registrado',
            description: 'Juan Pérez - juan.perez@email.com',
            time: 'Hace 2 horas'
        },
        {
            icon: 'fas fa-dollar-sign',
            iconClass: 'success',
            title: 'Pago recibido',
            description: 'Factura #001230 - RD$ 2,500.00',
            time: 'Hace 3 horas'
        }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.iconClass}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

function loadAlerts() {
    const alertsList = document.getElementById('alerts-list');
    
    const alerts = [
        {
            type: 'warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Stock Bajo',
            description: '8 productos tienen stock menor a 10 unidades'
        },
        {
            type: 'info',
            icon: 'fas fa-info-circle',
            title: 'Backup Programado',
            description: 'El backup automático se ejecutará esta noche a las 2:00 AM'
        }
    ];
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-icon">
                <i class="${alert.icon}"></i>
            </div>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.description}</p>
            </div>
        </div>
    `).join('');
}

async function refreshDashboard() {
    try {
        await loadDashboardData();
        loadRecentActivity();
        console.log('Dashboard actualizado automáticamente');
    } catch (error) {
        console.error('Error al actualizar dashboard:', error);
    }
}

function generateReport() {
    // Simular generación de reporte
    const reportData = {
        fecha: new Date().toLocaleDateString('es-DO'),
        ventas: document.getElementById('ventas-mes').textContent,
        productos: document.getElementById('total-productos').textContent,
        clientes: document.getElementById('total-clientes').textContent,
        facturas: document.getElementById('total-facturas').textContent
    };
    
    // Crear contenido del reporte
    const reportContent = `
        REPORTE EJECUTIVO - SGPE
        ========================
        
        Fecha: ${reportData.fecha}
        
        RESUMEN DE VENTAS:
        - Ventas del mes: ${reportData.ventas}
        - Total de productos: ${reportData.productos}
        - Clientes activos: ${reportData.clientes}
        - Facturas generadas: ${reportData.facturas}
        
        INDICADORES:
        - Crecimiento en ventas: +12.5%
        - Productos con stock bajo: 8
        - Nuevos clientes este mes: 12
        - Facturas pendientes: 7
        
        ========================
        Generado por SGPE
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-sgpe-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showSuccessMessage('Reporte generado y descargado exitosamente');
}

function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirigir al login
        window.location.href = 'login.html';
    }
}

function showSuccessMessage(message) {
    // Crear notificación toast simple
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 9999;
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showErrorMessage(message) {
    // Crear notificación toast de error
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 9999;
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Función para manejar búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
    }
});

function performSearch(term) {
    // Implementar búsqueda global simple
    console.log('Buscando:', term);
    showSuccessMessage(`Buscando: "${term}"`);
    
    // Aquí se podría implementar una búsqueda más sofisticada
    // que incluya productos, clientes, facturas, etc.
}
