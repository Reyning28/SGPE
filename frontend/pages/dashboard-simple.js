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
    initializeDashboard();
});

async function initializeDashboard() {
    try {
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

function showLoadingStats() {
    document.getElementById('ventas-mes').textContent = 'Cargando...';
    document.getElementById('total-productos').textContent = 'Cargando...';
    document.getElementById('total-clientes').textContent = 'Cargando...';
    document.getElementById('total-facturas').textContent = 'Cargando...';
}

async function loadDashboardData() {
    try {
        // Obtener datos de ventas
        const ventasResponse = await fetch(`${API_BASE_URL}/facturas`);
        const facturas = ventasResponse.ok ? await ventasResponse.json() : [];
        
        // Obtener productos
        const productosResponse = await fetch(`${API_BASE_URL}/productos`);
        const productos = productosResponse.ok ? await productosResponse.json() : [];
        
        // Obtener clientes
        const clientesResponse = await fetch(`${API_BASE_URL}/clientes`);
        const clientes = clientesResponse.ok ? await clientesResponse.json() : [];
        
        // Calcular estadísticas
        updateStats(facturas, productos, clientes);
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        // Mostrar datos de fallback
        updateStatsWithFallback();
    }
}

function updateStats(facturas, productos, clientes) {
    // Calcular ventas del mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    
    const ventasMes = facturas
        .filter(factura => {
            const fechaFactura = new Date(factura.fecha);
            return fechaFactura.getMonth() === mesActual && 
                   fechaFactura.getFullYear() === añoActual;
        })
        .reduce((total, factura) => total + parseFloat(factura.total || 0), 0);
    
    // Productos con stock bajo
    const stockBajo = productos.filter(producto => 
        parseInt(producto.stock || 0) < 10
    ).length;
    
    // Actualizar DOM
    document.getElementById('ventas-mes').textContent = 
        `RD$ ${ventasMes.toLocaleString('es-DO')}`;
    document.getElementById('total-productos').textContent = productos.length;
    document.getElementById('total-clientes').textContent = clientes.length;
    document.getElementById('total-facturas').textContent = facturas.length;
    
    // Actualizar indicadores
    document.getElementById('stock-bajo').textContent = 
        `${stockBajo} con stock bajo`;
    document.getElementById('clientes-nuevos').textContent = 
        `${Math.floor(clientes.length * 0.1)} nuevos este mes`;
    document.getElementById('facturas-pendientes').textContent = 
        `${Math.floor(facturas.length * 0.2)} pendientes`;
}

function updateStatsWithFallback() {
    document.getElementById('ventas-mes').textContent = 'RD$ 45,280';
    document.getElementById('total-productos').textContent = '124';
    document.getElementById('total-clientes').textContent = '89';
    document.getElementById('total-facturas').textContent = '56';
    
    document.getElementById('stock-bajo').textContent = '8 con stock bajo';
    document.getElementById('clientes-nuevos').textContent = '12 nuevos este mes';
    document.getElementById('facturas-pendientes').textContent = '7 pendientes';
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
        window.location.href = '../login.html';
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
