// ===== Producto.js - Gestión de Inventario =====
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const tbody = document.querySelector("tbody");
    const searchInput = document.getElementById('search-input');
    const categoriaFilter = document.getElementById('categoria-filter');
    const stockFilter = document.getElementById('stock-filter');
    const nuevoProductoBtn = document.getElementById('nuevo-producto-btn');
    const inventarioBtn = document.getElementById('inventario-btn');
    const searchResults = document.getElementById('search-results');
    const clearSearchBtn = document.querySelector('.clear-search');

    // Variables de estado
    let productos = [];
    let todosLosProductos = [];
    let currentSearchTerm = '';
    let isLoading = false;

    // Inicialización
    init();

    async function init() {
        console.log('🚀 Inicializando página de productos...');
        
        // Verificar elementos críticos
        console.log('Verificando elementos del DOM...');
        console.log('- tbody:', document.querySelector("tbody"));
        console.log('- nuevo-producto-btn:', document.getElementById('nuevo-producto-btn'));
        console.log('- search-input:', document.getElementById('search-input'));
        
        await loadProductos();
        setupEventListeners();
        
        // Test del botón después de un delay
        setTimeout(() => {
            const testBtn = document.getElementById('nuevo-producto-btn');
            console.log('🧪 Test del botón después de init:', testBtn);
            if (testBtn) {
                console.log('✅ Botón encontrado y listo para usar');
            } else {
                console.error('❌ Botón aún no encontrado después de init');
            }
        }, 1000);
        
        console.log('✅ Inicialización completada');
    }

    // Configurar event listeners
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 150));
            console.log('Event listener de búsqueda configurado');
        } else {
            console.warn('Elemento search-input no encontrado');
        }

        // Filtros
        if (categoriaFilter) {
            categoriaFilter.addEventListener('change', handleCategoriaFilter);
            console.log('Event listener de filtro categoría configurado');
        } else {
            console.warn('Elemento categoria-filter no encontrado');
        }

        if (stockFilter) {
            stockFilter.addEventListener('change', handleStockFilter);
            console.log('Event listener de filtro stock configurado');
        } else {
            console.warn('Elemento stock-filter no encontrado');
        }

        // Botones de acción
        const nuevoBtn = document.getElementById('nuevo-producto-btn');
        console.log('Buscando botón nuevo-producto-btn:', nuevoBtn);
        
        if (nuevoBtn) {
            nuevoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Click en botón Nuevo Producto detectado');
                mostrarModalNuevoProducto();
            });
            console.log('✅ Event listener agregado al botón Nuevo Producto');
        } else {
            console.error('❌ No se encontró el botón nuevo-producto-btn');
            // Intentar con selector alternativo
            const btnAlternativo = document.querySelector('.btn-primary');
            if (btnAlternativo) {
                console.log('Encontrado botón alternativo:', btnAlternativo);
                btnAlternativo.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Click en botón alternativo detectado');
                    mostrarModalNuevoProducto();
                });
                console.log('✅ Event listener agregado al botón alternativo');
            }
        }

        if (inventarioBtn) {
            inventarioBtn.addEventListener('click', mostrarReporteInventario);
            console.log('Event listener de inventario configurado');
        } else {
            console.warn('Elemento inventario-btn no encontrado');
        }

        // Botón para limpiar búsqueda
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', clearSearch);
            console.log('Event listener de limpiar búsqueda configurado');
        } else {
            console.warn('Elemento clear-search no encontrado');
        }

        // Delegación de eventos para botones de acción en la tabla
        if (tbody) {
            tbody.addEventListener('click', handleTableActions);
            console.log('Event listener de tabla configurado');
        } else {
            console.warn('Elemento tbody no encontrado');
        }
        
        console.log('✅ Todos los event listeners configurados');
    }

    // Cargar productos desde la API
    async function loadProductos(params = {}) {
        if (isLoading) return;

        isLoading = true;
        console.log('Cargando productos...');

        try {
            // Verificar si ApiService está disponible
            if (!window.ApiService) {
                console.error('ApiService no está disponible');
                // Intentar cargar desde localStorage primero
                const backupData = tryLoadFromLocalStorage();
                if (backupData && backupData.length > 0) {
                    productos = backupData;
                    todosLosProductos = [...productos];
                    renderProductos();
                    updateEstadisticas();
                    showNotification('Datos cargados desde el respaldo local', 'info');
                    return;
                }
                // Crear productos de prueba si no hay respaldo
                productos = createTestProducts();
                todosLosProductos = [...productos];
                renderProductos();
                updateEstadisticas();
                return;
            }

            if (!window.ApiService.ProductoService) {
                console.error('ProductoService no está disponible');
                // Intentar cargar desde localStorage primero
                const backupData = tryLoadFromLocalStorage();
                if (backupData && backupData.length > 0) {
                    productos = backupData;
                    todosLosProductos = [...productos];
                    renderProductos();
                    updateEstadisticas();
                    showNotification('Datos cargados desde el respaldo local', 'info');
                    return;
                }
                productos = createTestProducts();
                todosLosProductos = [...productos];
                renderProductos();
                updateEstadisticas();
                return;
            }

            const ProductoService = window.ApiService.ProductoService;
            const response = await ProductoService.getAll(params);

            if (response && response.success) {
                productos = response.data || [];
                todosLosProductos = [...productos];
                console.log('Productos cargados:', productos.length);
                renderProductos();
                updateEstadisticas();
            } else {
                console.error('Error al cargar productos:', response?.message);
                showNotification('Error al cargar los productos: ' + (response?.message || 'Error desconocido'), 'error');
                // Intentar cargar desde localStorage antes del fallback
                const backupData = tryLoadFromLocalStorage();
                if (backupData && backupData.length > 0) {
                    productos = backupData;
                    todosLosProductos = [...productos];
                    renderProductos();
                    updateEstadisticas();
                    showNotification('Datos cargados desde el respaldo local', 'info');
                    return;
                }
                // Usar productos de prueba como fallback final
                productos = createTestProducts();
                todosLosProductos = [...productos];
                renderProductos();
                updateEstadisticas();
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
            showNotification('Error al cargar los productos: ' + (error.message || 'Error desconocido'), 'error');
            // Intentar cargar desde localStorage antes del fallback
            const backupData = tryLoadFromLocalStorage();
            if (backupData && backupData.length > 0) {
                productos = backupData;
                todosLosProductos = [...productos];
                renderProductos();
                updateEstadisticas();
                showNotification('Datos cargados desde el respaldo local', 'info');
                return;
            }
            // Usar productos de prueba como fallback final
            productos = createTestProducts();
            todosLosProductos = [...productos];
            renderProductos();
            updateEstadisticas();
        } finally {
            isLoading = false;
        }
    }

    // Crear productos de prueba
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

    // Renderizar productos en la tabla
    function renderProductos() {
        if (!tbody) {
            console.error('No se encontró el tbody');
            return;
        }

        const fragment = document.createDocumentFragment();

        if (productos.length === 0) {
            const mensaje = currentSearchTerm
                ? `No se encontraron productos que coincidan con "${currentSearchTerm}"`
                : 'No hay productos registrados';

            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" class="text-center">${mensaje}</td>`;
            fragment.appendChild(tr);
        } else {
            productos.forEach(producto => {
                const tr = document.createElement("tr");
                
                // Determinar estado del stock
                const stockStatus = getStockStatus(producto.stock, producto.stockMinimo);
                
                // Resaltar si es una búsqueda específica
                const isExactMatch = currentSearchTerm && (
                    producto.codigo?.toLowerCase() === currentSearchTerm.toLowerCase() ||
                    producto.nombre?.toLowerCase() === currentSearchTerm.toLowerCase()
                );

                if (isExactMatch) {
                    tr.classList.add('highlighted-row');
                }

                tr.innerHTML = `
                    <td>${resaltarTexto(producto.codigo || '', currentSearchTerm)}</td>
                    <td>${resaltarTexto(producto.nombre || 'Sin nombre', currentSearchTerm)}</td>
                    <td>${producto.categoria || 'Sin categoría'}</td>
                    <td>${formatCurrency(producto.precio || 0)}</td>
                    <td class="stock-cell">
                        <span class="stock-value">${producto.stock || 0}</span>
                        <div class="stock-actions">
                            <button class="btn-stock btn-stock-add" data-id="${producto.id}" title="Agregar stock">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn-stock btn-stock-remove" data-id="${producto.id}" title="Reducir stock">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </td>
                    <td><span class="stock-badge ${stockStatus.class}">${stockStatus.text}</span></td>
                    <td class="acciones">
                        <button class="btn-action btn-view" data-id="${producto.id}" title="Ver producto">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" data-id="${producto.id}" title="Editar producto">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" data-id="${producto.id}" title="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                fragment.appendChild(tr);
            });
        }

        tbody.innerHTML = "";
        tbody.appendChild(fragment);
    }

    // Manejar acciones de la tabla
    function handleTableActions(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const productoId = target.dataset.id;

        if (target.classList.contains('btn-view')) {
            verProducto(productoId);
        } else if (target.classList.contains('btn-edit')) {
            editarProducto(productoId);
        } else if (target.classList.contains('btn-delete')) {
            eliminarProducto(productoId);
        } else if (target.classList.contains('btn-stock-add')) {
            ajustarStock(productoId, 'add');
        } else if (target.classList.contains('btn-stock-remove')) {
            ajustarStock(productoId, 'remove');
        }
    }

    // Obtener estado del stock
    function getStockStatus(stock, stockMinimo = 5) {
        if (stock <= 0) {
            return { class: 'agotado', text: 'Agotado' };
        } else if (stock <= stockMinimo) {
            return { class: 'bajo', text: 'Stock Bajo' };
        } else {
            return { class: 'disponible', text: 'Disponible' };
        }
    }

    // Funciones auxiliares
    function resaltarTexto(texto, termino) {
        if (!termino || !texto) return texto;
        const regex = new RegExp(`(${termino})`, 'gi');
        return texto.replace(regex, '<mark>$1</mark>');
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        }).format(amount);
    }

    function showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Crear notificación visual simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Función para cargar datos desde localStorage
    function tryLoadFromLocalStorage() {
        try {
            const backupData = localStorage.getItem('productos_backup');
            if (backupData) {
                const parsedData = JSON.parse(backupData);
                console.log('✅ Datos encontrados en localStorage:', parsedData.length, 'productos');
                return parsedData;
            }
        } catch (error) {
            console.warn('⚠️ Error al cargar desde localStorage:', error);
        }
        return null;
    }

    // Funciones de búsqueda y filtros
    function handleSearch(event) {
        currentSearchTerm = event.target.value.trim();
        buscarLocalmente(currentSearchTerm);
    }

    function buscarLocalmente(searchTerm) {
        if (!searchTerm) {
            productos = [...todosLosProductos];
        } else {
            const termino = searchTerm.toLowerCase();
            productos = todosLosProductos.filter(producto => {
                return (
                    producto.codigo?.toLowerCase().includes(termino) ||
                    producto.nombre?.toLowerCase().includes(termino) ||
                    producto.categoria?.toLowerCase().includes(termino)
                );
            });
        }
        renderProductos();
        updateSearchResults(searchTerm, productos.length);
    }

    function handleCategoriaFilter(event) {
        const categoria = event.target.value;
        if (!categoria || categoria === 'todas') {
            productos = [...todosLosProductos];
        } else {
            productos = todosLosProductos.filter(producto => 
                producto.categoria?.toLowerCase() === categoria.toLowerCase()
            );
        }
        renderProductos();
        updateEstadisticas();
    }

    function handleStockFilter(event) {
        const stockFilter = event.target.value;
        
        switch (stockFilter) {
            case 'disponible':
                productos = todosLosProductos.filter(p => (p.stock || 0) > (p.stockMinimo || 5));
                break;
            case 'bajo':
                productos = todosLosProductos.filter(p => (p.stock || 0) <= (p.stockMinimo || 5) && (p.stock || 0) > 0);
                break;
            case 'agotado':
                productos = todosLosProductos.filter(p => (p.stock || 0) <= 0);
                break;
            default:
                productos = [...todosLosProductos];
        }
        
        renderProductos();
        updateEstadisticas();
    }

    function updateSearchResults(searchTerm, count) {
        if (searchResults) {
            if (searchTerm) {
                searchResults.textContent = `${count} resultado${count !== 1 ? 's' : ''} para "${searchTerm}"`;
                searchResults.style.display = 'block';
            } else {
                searchResults.style.display = 'none';
            }
        }
    }

    function clearSearch() {
        if (searchInput) {
            searchInput.value = '';
        }
        currentSearchTerm = '';
        productos = [...todosLosProductos];
        renderProductos();
        updateSearchResults('', productos.length);
    }

    // Funciones de productos
    async function verProducto(id) {
        const producto = productos.find(p => p.id == id);
        if (producto) {
            mostrarModalVerProducto(producto);
        }
    }

    async function editarProducto(id) {
        const producto = productos.find(p => p.id == id);
        if (producto) {
            console.log('Editando producto:', producto);
            mostrarModalEditarProducto(producto);
        }
    }

    async function eliminarProducto(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

        try {
            if (window.ApiService && window.ApiService.ProductoService) {
                const ProductoService = window.ApiService.ProductoService;
                const response = await ProductoService.delete(id);

                if (response && response.success) {
                    showNotification('Producto eliminado correctamente', 'success');
                    await loadProductos();
                } else {
                    showNotification('Error al eliminar el producto: ' + (response?.message || 'Error desconocido'), 'error');
                }
            } else {
                // Eliminar localmente si no hay API
                productos = productos.filter(p => p.id != id);
                todosLosProductos = todosLosProductos.filter(p => p.id != id);
                renderProductos();
                updateEstadisticas();
                showNotification('Producto eliminado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error eliminando producto:', error);
            showNotification('Error al eliminar el producto: ' + error.message, 'error');
        }
    }

    async function ajustarStock(id, action) {
        const cantidad = await mostrarModalAjustarStock(action);
        if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) return;

        const producto = productos.find(p => p.id == id);
        if (!producto) return;

        let nuevoStock = parseInt(producto.stock || 0);
        const ajuste = parseInt(cantidad);

        if (action === 'add') {
            nuevoStock += ajuste;
        } else {
            nuevoStock = Math.max(0, nuevoStock - ajuste);
        }

        try {
            if (window.ApiService && window.ApiService.ProductoService) {
                const ProductoService = window.ApiService.ProductoService;
                const response = await ProductoService.update(id, { stock: nuevoStock });

                if (response && response.success) {
                    producto.stock = nuevoStock;
                    renderProductos();
                    updateEstadisticas();
                    showNotification(`Stock ${action === 'add' ? 'agregado' : 'reducido'} correctamente`, 'success');
                } else {
                    showNotification('Error al actualizar el stock: ' + (response?.message || 'Error desconocido'), 'error');
                }
            } else {
                // Actualizar localmente si no hay API
                producto.stock = nuevoStock;
                renderProductos();
                updateEstadisticas();
                showNotification(`Stock ${action === 'add' ? 'agregado' : 'reducido'} correctamente`, 'success');
            }
        } catch (error) {
            console.error('Error actualizando stock:', error);
            showNotification('Error al actualizar el stock: ' + error.message, 'error');
        }
    }

    function mostrarModalNuevoProducto() {
        console.log('🎯 Ejecutando mostrarModalNuevoProducto...');
        
        try {
            // Verificar si ya existe un modal
            const existingModal = document.querySelector('.modal');
            if (existingModal) {
                console.log('Removiendo modal existente...');
                existingModal.remove();
            }

            // Crear modal dinámicamente
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = `
                display: block;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                overflow-y: auto;
                padding: 20px 0;
            `;
            
            modal.innerHTML = `
                <div class="modal-content" style="
                    background-color: white;
                    margin: 0 auto;
                    padding: 0;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 450px;
                    max-height: 90vh;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                ">
                    <div class="modal-header" style="
                        background-color: #f1f5f9;
                        padding: 1rem 1.5rem;
                        border-bottom: 1px solid #e2e8f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 12px 12px 0 0;
                        flex-shrink: 0;
                    ">
                        <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #1e293b;">Nuevo Producto</h2>
                        <span class="close" style="
                            font-size: 1.25rem;
                            font-weight: bold;
                            cursor: pointer;
                            color: #64748b;
                            width: 1.75rem;
                            height: 1.75rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            transition: 0.3s ease;
                        ">&times;</span>
                    </div>
                    <form id="nuevo-producto-form" style="
                        padding: 1rem 1.5rem 1.5rem;
                        overflow-y: auto;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    ">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="nuevo-codigo" style="display: block; margin-bottom: 0.375rem; font-weight: 600; color: #1e293b; font-size: 0.8rem;">Código:</label>
                                <input type="text" id="nuevo-codigo" name="codigo" required placeholder="PROD001" style="
                                    width: 100%;
                                    padding: 0.625rem;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 6px;
                                    font-size: 0.85rem;
                                    transition: 0.3s ease;
                                    font-family: inherit;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="nueva-categoria" style="display: block; margin-bottom: 0.375rem; font-weight: 600; color: #1e293b; font-size: 0.8rem;">Categoría:</label>
                                <input type="text" id="nueva-categoria" name="categoria" required placeholder="Electrónicos" style="
                                    width: 100%;
                                    padding: 0.625rem;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 6px;
                                    font-size: 0.85rem;
                                    transition: 0.3s ease;
                                    font-family: inherit;
                                    box-sizing: border-box;
                                ">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="nuevo-nombre" style="display: block; margin-bottom: 0.375rem; font-weight: 600; color: #1e293b; font-size: 0.8rem;">Nombre del producto:</label>
                            <input type="text" id="nuevo-nombre" name="nombre" required placeholder="Nombre completo del producto" style="
                                width: 100%;
                                padding: 0.625rem;
                                border: 2px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 0.85rem;
                                transition: 0.3s ease;
                                font-family: inherit;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="nuevo-precio" style="display: block; margin-bottom: 0.375rem; font-weight: 600; color: #1e293b; font-size: 0.8rem;">Precio (DOP):</label>
                                <input type="number" id="nuevo-precio" name="precio" step="0.01" min="0" required placeholder="0.00" style="
                                    width: 100%;
                                    padding: 0.625rem;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 6px;
                                    font-size: 0.85rem;
                                    transition: 0.3s ease;
                                    font-family: inherit;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="nuevo-stock" style="display: block; margin-bottom: 0.375rem; font-weight: 600; color: #1e293b; font-size: 0.8rem;">Stock inicial:</label>
                                <input type="number" id="nuevo-stock" name="stock" min="0" value="0" required style="
                                    width: 100%;
                                    padding: 0.625rem;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 6px;
                                    font-size: 0.85rem;
                                    transition: 0.3s ease;
                                    font-family: inherit;
                                    box-sizing: border-box;
                                ">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label for="nuevo-stockMinimo" style="display: block; margin-bottom: 0.375rem; font-weight: 600; color: #1e293b; font-size: 0.8rem;">Stock mínimo (para alertas):</label>
                            <input type="number" id="nuevo-stockMinimo" name="stockMinimo" min="0" value="5" style="
                                width: 100%;
                                padding: 0.625rem;
                                border: 2px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 0.85rem;
                                transition: 0.3s ease;
                                font-family: inherit;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div class="form-actions" style="
                            display: flex;
                            gap: 0.75rem;
                            justify-content: flex-end;
                            padding-top: 0.75rem;
                            border-top: 1px solid #e2e8f0;
                            margin-top: auto;
                            flex-shrink: 0;
                        ">
                            <button type="button" class="btn-cancel" style="
                                padding: 0.625rem 1.25rem;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: 0.3s ease;
                                text-decoration: none;
                                display: inline-flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 0.85rem;
                                background-color: white;
                                color: #1e293b;
                            ">Cancelar</button>
                            <button type="submit" class="btn-save" style="
                                padding: 0.625rem 1.25rem;
                                border: none;
                                border-radius: 6px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: 0.3s ease;
                                text-decoration: none;
                                display: inline-flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 0.85rem;
                                background-color: #2563eb;
                                color: white;
                            ">Guardar</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            console.log('✅ Modal agregado al DOM');

            // Event listeners del modal
            const closeBtn = modal.querySelector('.close');
            const cancelBtn = modal.querySelector('.btn-cancel');
            const form = modal.querySelector('#nuevo-producto-form');

            const closeModal = () => {
                console.log('Cerrando modal...');
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            };

            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('📝 Formulario enviado');
                
                const formData = new FormData(form);
                const productoData = {
                    codigo: formData.get('codigo').trim(),
                    nombre: formData.get('nombre').trim(),
                    categoria: formData.get('categoria').trim(),
                    precio: parseFloat(formData.get('precio')),
                    stock: parseInt(formData.get('stock')),
                    stockMinimo: parseInt(formData.get('stockMinimo')) || 5
                };

                console.log('📊 Datos del producto:', productoData);

                // Validaciones
                if (!productoData.codigo || !productoData.nombre || !productoData.categoria) {
                    showNotification('Por favor completa todos los campos requeridos', 'error');
                    return;
                }

                if (isNaN(productoData.precio) || productoData.precio < 0) {
                    showNotification('El precio debe ser un número válido mayor o igual a 0', 'error');
                    return;
                }

                try {
                    if (window.ApiService && window.ApiService.ProductoService) {
                        console.log('🔄 Enviando a API...');
                        const ProductoService = window.ApiService.ProductoService;
                        const response = await ProductoService.create(productoData);

                        if (response && response.success) {
                            showNotification('Producto creado correctamente', 'success');
                            closeModal();
                            await loadProductos();
                        } else {
                            showNotification('Error al crear el producto: ' + (response?.message || 'Error desconocido'), 'error');
                        }
                    } else {
                        console.log('💾 Guardando localmente...');
                        // Crear localmente si no hay API
                        const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
                        const nuevoProducto = { ...productoData, id: nuevoId };
                        productos.push(nuevoProducto);
                        todosLosProductos.push(nuevoProducto);
                        renderProductos();
                        updateEstadisticas();
                        showNotification('Producto creado correctamente', 'success');
                        closeModal();
                    }
                } catch (error) {
                    console.error('💥 Error creando producto:', error);
                    showNotification('Error al crear el producto: ' + error.message, 'error');
                }
            });

            // Focus en el primer campo
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                    console.log('🎯 Focus puesto en primer campo');
                }
            }, 100);
            
            console.log('🎉 Modal completamente configurado');

        } catch (error) {
            console.error('💥 Error en mostrarModalNuevoProducto:', error);
            showNotification('Error al abrir el formulario: ' + error.message, 'error');
        }
    }

    function mostrarModalEditarProducto(producto) {
        console.log('Mostrar modal editar producto:', producto);
        
        // Crear modal de edición
        const modalHtml = `
            <div class="modal" id="editar-producto-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-edit"></i>
                            Editar Producto
                        </h2>
                        <button class="modal-close" onclick="cerrarModal('editar-producto-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form" id="form-editar-producto">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="edit-nombre">Nombre del Producto</label>
                                    <input type="text" id="edit-nombre" value="${producto.nombre}" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="edit-codigo">Código</label>
                                    <input type="text" id="edit-codigo" value="${producto.codigo || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label for="edit-categoria">Categoría</label>
                                    <select id="edit-categoria" required>
                                        <option value="">Seleccionar categoría</option>
                                        <option value="Electrónicos" ${producto.categoria === 'Electrónicos' ? 'selected' : ''}>Electrónicos</option>
                                        <option value="Ropa" ${producto.categoria === 'Ropa' ? 'selected' : ''}>Ropa</option>
                                        <option value="Hogar" ${producto.categoria === 'Hogar' ? 'selected' : ''}>Hogar</option>
                                        <option value="Deportes" ${producto.categoria === 'Deportes' ? 'selected' : ''}>Deportes</option>
                                        <option value="Libros" ${producto.categoria === 'Libros' ? 'selected' : ''}>Libros</option>
                                        <option value="Salud" ${producto.categoria === 'Salud' ? 'selected' : ''}>Salud</option>
                                        <option value="Belleza" ${producto.categoria === 'Belleza' ? 'selected' : ''}>Belleza</option>
                                        <option value="Otros" ${producto.categoria === 'Otros' ? 'selected' : ''}>Otros</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="edit-precio">Precio (DOP)</label>
                                    <input type="number" id="edit-precio" step="0.01" min="0" value="${producto.precio}" required>
                                </div>
                                <div class="form-group">
                                    <label for="edit-stock">Stock</label>
                                    <input type="number" id="edit-stock" min="0" value="${producto.stock || 0}" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="edit-stock-minimo">Stock Mínimo</label>
                                    <input type="number" id="edit-stock-minimo" min="0" value="${producto.stockMinimo || 5}">
                                </div>
                                <div class="form-group">
                                    <label for="edit-proveedor">Proveedor</label>
                                    <input type="text" id="edit-proveedor" value="${producto.proveedor || ''}">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="edit-descripcion">Descripción</label>
                                    <textarea id="edit-descripcion" rows="3" placeholder="Descripción del producto">${producto.descripcion || ''}</textarea>
                                </div>
                            </div>
                            
                            <div class="modal-actions">
                                <button type="button" class="btn-secondary" onclick="cerrarModal('editar-producto-modal')">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-save"></i> Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Insertar modal en el DOM
        const existingModal = document.getElementById('editar-producto-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Mostrar modal
        const modal = document.getElementById('editar-producto-modal');
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Configurar eventos del formulario
        const form = document.getElementById('form-editar-producto');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const datosActualizados = {
                    id: producto.id,
                    nombre: document.getElementById('edit-nombre').value.trim(),
                    codigo: document.getElementById('edit-codigo').value.trim(),
                    categoria: document.getElementById('edit-categoria').value,
                    precio: parseFloat(document.getElementById('edit-precio').value),
                    stock: parseInt(document.getElementById('edit-stock').value),
                    stockMinimo: parseInt(document.getElementById('edit-stock-minimo').value) || 5,
                    proveedor: document.getElementById('edit-proveedor').value.trim(),
                    descripcion: document.getElementById('edit-descripcion').value.trim()
                };
                
                // Validar datos
                if (!datosActualizados.nombre || !datosActualizados.codigo || !datosActualizados.categoria) {
                    showNotification('Por favor, complete todos los campos obligatorios', 'error');
                    return;
                }
                
                if (datosActualizados.precio <= 0) {
                    showNotification('El precio debe ser mayor a 0', 'error');
                    return;
                }
                
                // Actualizar producto
                if (window.ApiService && window.ApiService.ProductoService) {
                    const ProductoService = window.ApiService.ProductoService;
                    const response = await ProductoService.update(producto.id, datosActualizados);

                    if (response && response.success) {
                        // Actualizar arrays locales con los datos del servidor
                        const index = productos.findIndex(p => p.id === producto.id);
                        if (index !== -1) {
                            productos[index] = { ...productos[index], ...datosActualizados };
                            todosLosProductos = todosLosProductos.map(p => 
                                p.id === producto.id ? { ...p, ...datosActualizados } : p
                            );
                        }
                        
                        renderProductos();
                        updateEstadisticas();
                        cerrarModal('editar-producto-modal');
                        showNotification('Producto actualizado correctamente', 'success');
                    } else {
                        showNotification('Error al actualizar el producto: ' + (response?.message || 'Error desconocido'), 'error');
                    }
                } else {
                    // Fallback: actualizar solo localmente y guardar en localStorage
                    console.warn('API no disponible, actualizando solo localmente');
                    const index = productos.findIndex(p => p.id === producto.id);
                    if (index !== -1) {
                        productos[index] = { ...productos[index], ...datosActualizados };
                        todosLosProductos = todosLosProductos.map(p => 
                            p.id === producto.id ? { ...p, ...datosActualizados } : p
                        );
                        
                        // Guardar en localStorage como respaldo
                        try {
                            localStorage.setItem('productos_backup', JSON.stringify(todosLosProductos));
                            console.log('✅ Datos guardados en localStorage como respaldo');
                        } catch (e) {
                            console.warn('⚠️ No se pudo guardar en localStorage:', e);
                        }
                        
                        renderProductos();
                        updateEstadisticas();
                        cerrarModal('editar-producto-modal');
                        showNotification('Producto actualizado localmente. Para persistir los cambios, asegúrate de que el servidor esté funcionando.', 'warning');
                    }
                }
                
            } catch (error) {
                console.error('Error al actualizar producto:', error);
                showNotification('Error al actualizar el producto: ' + error.message, 'error');
            }
        });
    }

    function mostrarModalVerProducto(producto) {
        console.log('Mostrar modal ver producto:', producto);
        
        // Crear modal de visualización
        const modalHtml = `
            <div class="modal" id="ver-producto-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-eye"></i>
                            Detalles del Producto
                        </h2>
                        <button class="modal-close" onclick="cerrarModal('ver-producto-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="producto-detalle">
                            <div class="producto-header">
                                <div class="producto-info-principal">
                                    <h3 class="producto-nombre">${producto.nombre}</h3>
                                    <span class="producto-codigo">Código: ${producto.codigo || 'N/A'}</span>
                                </div>
                                <div class="producto-precio">
                                    <span class="precio-valor">${formatCurrency(producto.precio)}</span>
                                    <span class="precio-label">Precio unitario</span>
                                </div>
                            </div>
                            
                            <div class="producto-stats">
                                <div class="stat-item ${(producto.stock || 0) <= (producto.stockMinimo || 5) ? 'stock-bajo' : ''}">
                                    <div class="stat-icon">
                                        <i class="fas fa-boxes"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-valor">${producto.stock || 0}</span>
                                        <span class="stat-label">Stock disponible</span>
                                    </div>
                                </div>
                                
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-valor">${producto.stockMinimo || 5}</span>
                                        <span class="stat-label">Stock mínimo</span>
                                    </div>
                                </div>
                                
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-dollar-sign"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-valor">${formatCurrency((producto.precio || 0) * (producto.stock || 0))}</span>
                                        <span class="stat-label">Valor total</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="producto-detalles">
                                <div class="detalle-row">
                                    <div class="detalle-item">
                                        <label>Categoría</label>
                                        <span class="categoria-badge ${(producto.categoria || '').toLowerCase()}">${producto.categoria || 'Sin categoría'}</span>
                                    </div>
                                    <div class="detalle-item">
                                        <label>Proveedor</label>
                                        <span>${producto.proveedor || 'No especificado'}</span>
                                    </div>
                                </div>
                                
                                ${producto.descripcion ? `
                                <div class="detalle-row">
                                    <div class="detalle-item full-width">
                                        <label>Descripción</label>
                                        <p class="descripcion">${producto.descripcion}</p>
                                    </div>
                                </div>
                                ` : ''}
                                
                                <div class="detalle-row">
                                    <div class="detalle-item">
                                        <label>Estado</label>
                                        <span class="estado-badge ${getEstadoClase(producto)}">${getEstadoTexto(producto)}</span>
                                    </div>
                                    <div class="detalle-item">
                                        <label>Fecha de registro</label>
                                        <span>${producto.fechaCreacion ? new Date(producto.fechaCreacion).toLocaleDateString('es-ES') : 'No disponible'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="modal-actions">
                                <button type="button" class="btn-primary" onclick="cerrarModal('ver-producto-modal')">
                                    <i class="fas fa-times"></i> Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar modal en el DOM
        const existingModal = document.getElementById('ver-producto-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Mostrar modal
        const modal = document.getElementById('ver-producto-modal');
        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    // Funciones auxiliares para el modal de ver producto
    function getEstadoClase(producto) {
        const stock = producto.stock || 0;
        const stockMinimo = producto.stockMinimo || 5;
        
        if (stock <= 0) return 'agotado';
        if (stock <= stockMinimo) return 'stock-bajo';
        return 'disponible';
    }

    function getEstadoTexto(producto) {
        const stock = producto.stock || 0;
        const stockMinimo = producto.stockMinimo || 5;
        
        if (stock <= 0) return 'Agotado';
        if (stock <= stockMinimo) return 'Stock bajo';
        return 'Disponible';
    }

    // Modal para ajustar stock
    function mostrarModalAjustarStock(action) {
        return new Promise((resolve) => {
            // Remover modal anterior si existe
            const existingModal = document.querySelector('.stock-modal-overlay');
            if (existingModal) {
                existingModal.remove();
            }
            
            const isAdd = action === 'add';
            const titulo = isAdd ? 'Agregar Stock' : 'Reducir Stock';
            const icono = isAdd ? 'fas fa-plus-circle' : 'fas fa-minus-circle';
            const color = isAdd ? '#10b981' : '#f59e0b';
            const gradient = isAdd ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            
            // Crear modal
            const modalHtml = `
                <div class="stock-modal-overlay" id="stock-modal">
                    <div class="stock-modal">
                        <div class="stock-header">
                            <div class="stock-icon" style="background: ${gradient};">
                                <i class="${icono}"></i>
                            </div>
                            <h3 class="stock-title">${titulo}</h3>
                            <p class="stock-subtitle">Ingresa la cantidad que deseas ${isAdd ? 'agregar al' : 'reducir del'} inventario</p>
                        </div>
                        
                        <div class="stock-content">
                            <form id="stock-form" class="stock-form">
                                <div class="form-group">
                                    <label for="stock-cantidad" class="form-label">Cantidad</label>
                                    <div class="input-wrapper">
                                        <div class="input-icon" style="color: ${color};">
                                            <i class="${isAdd ? 'fas fa-plus' : 'fas fa-minus'}"></i>
                                        </div>
                                        <input 
                                            type="number" 
                                            id="stock-cantidad" 
                                            name="cantidad" 
                                            placeholder="Ej: 10" 
                                            class="form-input"
                                            min="1"
                                            step="1"
                                            required
                                            autofocus
                                        >
                                        <div class="input-suffix">unidades</div>
                                    </div>
                                </div>
                                
                                <div class="stock-actions">
                                    <button type="button" class="btn-cancel" onclick="window.resolveStock(null)">
                                        <i class="fas fa-times"></i>
                                        Cancelar
                                    </button>
                                    <button type="submit" class="btn-confirm" style="background: ${gradient};">
                                        <i class="${icono}"></i>
                                        ${titulo}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            // Insertar estilos si no existen
            if (!document.querySelector('style[data-stock-styles]')) {
                const styleSheet = document.createElement('style');
                styleSheet.setAttribute('data-stock-styles', 'true');
                styleSheet.textContent = `
                    .stock-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(4px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        padding: 1rem;
                        animation: fadeIn 0.2s ease-out;
                    }
                    
                    .stock-modal {
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        width: 100%;
                        max-width: 450px;
                        overflow: hidden;
                        animation: scaleIn 0.2s ease-out;
                    }
                    
                    .stock-header {
                        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                        padding: 2rem 2rem 1.5rem 2rem;
                        text-align: center;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .stock-icon {
                        width: 4rem;
                        height: 4rem;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1rem auto;
                        color: white;
                        font-size: 1.5rem;
                    }
                    
                    .stock-title {
                        margin: 0 0 0.5rem 0;
                        font-size: 1.375rem;
                        font-weight: 700;
                        color: #1e293b;
                    }
                    
                    .stock-subtitle {
                        margin: 0;
                        font-size: 0.875rem;
                        color: #64748b;
                        line-height: 1.4;
                    }
                    
                    .stock-content {
                        padding: 2rem;
                    }
                    
                    .stock-form .form-group {
                        margin-bottom: 2rem;
                    }
                    
                    .stock-form .form-label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                        color: #374151;
                        font-size: 0.875rem;
                    }
                    
                    .stock-form .input-wrapper {
                        position: relative;
                        display: block;
                    }
                    
                    .stock-form .input-icon {
                        position: absolute;
                        left: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 2;
                        font-size: 1rem;
                        pointer-events: none;
                    }
                    
                    .stock-form .form-input {
                        width: 100%;
                        padding: 1rem 5rem 1rem 3rem;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 1rem;
                        transition: all 0.2s ease;
                        background-color: white;
                        color: #1e293b;
                        text-align: center;
                        font-weight: 600;
                        box-sizing: border-box;
                    }
                    
                    .stock-form .form-input:focus {
                        outline: none;
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    }
                    
                    .stock-form .input-suffix {
                        position: absolute;
                        right: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #6b7280;
                        font-size: 0.875rem;
                        font-weight: 500;
                        pointer-events: none;
                        z-index: 2;
                    }
                    
                    .stock-actions {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                    }
                    
                    .btn-cancel,
                    .btn-confirm {
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 0.875rem;
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        min-width: 130px;
                        justify-content: center;
                    }
                    
                    .btn-cancel {
                        background: #f8fafc;
                        color: #6b7280;
                        border: 1px solid #e2e8f0;
                    }
                    
                    .btn-cancel:hover {
                        background: #f1f5f9;
                        color: #374151;
                        transform: translateY(-1px);
                    }
                    
                    .btn-confirm {
                        color: white;
                    }
                    
                    .btn-confirm:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes scaleIn {
                        from { transform: scale(0.95) translateY(20px); opacity: 0; }
                        to { transform: scale(1) translateY(0); opacity: 1; }
                    }
                    
                    @media (max-width: 640px) {
                        .stock-modal {
                            margin: 1rem;
                            max-width: calc(100vw - 2rem);
                        }
                        
                        .stock-actions {
                            flex-direction: column;
                        }
                        
                        .btn-cancel,
                        .btn-confirm {
                            width: 100%;
                        }
                    }
                `;
                document.head.appendChild(styleSheet);
            }
            
            // Insertar modal en el DOM
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Función global para resolver la promesa
            window.resolveStock = (value) => {
                const modal = document.getElementById('stock-modal');
                if (modal) {
                    modal.style.animation = 'fadeIn 0.2s ease-out reverse';
                    setTimeout(() => {
                        modal.remove();
                        delete window.resolveStock;
                        resolve(value);
                    }, 200);
                }
            };
            
            // Configurar eventos del formulario
            document.getElementById('stock-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const cantidad = document.getElementById('stock-cantidad').value;
                if (cantidad && !isNaN(cantidad) && parseInt(cantidad) > 0) {
                    window.resolveStock(cantidad);
                }
            });
            
            // Cerrar con ESC
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    window.resolveStock(null);
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
            
            // Cerrar al hacer clic fuera del modal
            document.getElementById('stock-modal').addEventListener('click', (e) => {
                if (e.target.classList.contains('stock-modal-overlay')) {
                    window.resolveStock(null);
                }
            });
            
            // Enfocar el input después de un breve delay
            setTimeout(() => {
                document.getElementById('stock-cantidad').focus();
            }, 100);
        });
    }

    function mostrarReporteInventario() {
        const reporte = {
            fecha: new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            hora: new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            totalProductos: productos.length,
            stockTotal: productos.reduce((sum, p) => sum + (p.stock || 0), 0),
            valorTotal: productos.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0),
            stockBajo: productos.filter(p => (p.stock || 0) <= (p.stockMinimo || 5)).length,
            agotados: productos.filter(p => (p.stock || 0) <= 0).length,
            productosDisponibles: productos.filter(p => (p.stock || 0) > 0).length,
            stockPromedio: productos.length > 0 ? Math.round(productos.reduce((sum, p) => sum + (p.stock || 0), 0) / productos.length) : 0
        };

        // Calcular productos por categoría
        const categorias = {};
        productos.forEach(p => {
            const cat = p.categoria || 'Sin categoría';
            if (!categorias[cat]) {
                categorias[cat] = { count: 0, stock: 0, valor: 0 };
            }
            categorias[cat].count++;
            categorias[cat].stock += p.stock || 0;
            categorias[cat].valor += (p.precio || 0) * (p.stock || 0);
        });

        // Crear y mostrar modal de reporte
        const modalHtml = `
            <div class="modal" id="reporte-modal">
                <div class="modal-content reporte-modal">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-chart-bar"></i>
                            Reporte de Inventario
                        </h2>
                        <button class="modal-close" onclick="cerrarModal('reporte-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="reporte-container">
                            <!-- Header del reporte -->
                            <div class="reporte-header">
                                <div class="reporte-date">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>${reporte.fecha}</span>
                                </div>
                                <div class="reporte-time">
                                    <i class="fas fa-clock"></i>
                                    <span>${reporte.hora}</span>
                                </div>
                            </div>

                            <!-- Resumen general -->
                            <div class="reporte-section">
                                <h3 class="section-title">
                                    <i class="fas fa-chart-pie"></i>
                                    Resumen General
                                </h3>
                                <div class="reporte-stats">
                                    <div class="reporte-stat">
                                        <div class="stat-icon blue">
                                            <i class="fas fa-boxes"></i>
                                        </div>
                                        <div class="stat-info">
                                            <span class="stat-number">${reporte.totalProductos}</span>
                                            <span class="stat-label">Total Productos</span>
                                        </div>
                                    </div>
                                    <div class="reporte-stat">
                                        <div class="stat-icon green">
                                            <i class="fas fa-warehouse"></i>
                                        </div>
                                        <div class="stat-info">
                                            <span class="stat-number">${reporte.stockTotal}</span>
                                            <span class="stat-label">Stock Total</span>
                                        </div>
                                    </div>
                                    <div class="reporte-stat">
                                        <div class="stat-icon purple">
                                            <i class="fas fa-dollar-sign"></i>
                                        </div>
                                        <div class="stat-info">
                                            <span class="stat-number">${formatCurrency(reporte.valorTotal)}</span>
                                            <span class="stat-label">Valor Total</span>
                                        </div>
                                    </div>
                                    <div class="reporte-stat">
                                        <div class="stat-icon orange">
                                            <i class="fas fa-chart-line"></i>
                                        </div>
                                        <div class="stat-info">
                                            <span class="stat-number">${reporte.stockPromedio}</span>
                                            <span class="stat-label">Stock Promedio</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Estado del inventario -->
                            <div class="reporte-section">
                                <h3 class="section-title">
                                    <i class="fas fa-thermometer-half"></i>
                                    Estado del Inventario
                                </h3>
                                <div class="estado-inventario">
                                    <div class="estado-item disponible">
                                        <div class="estado-icon">
                                            <i class="fas fa-check-circle"></i>
                                        </div>
                                        <div class="estado-info">
                                            <span class="estado-number">${reporte.productosDisponibles}</span>
                                            <span class="estado-label">Productos Disponibles</span>
                                        </div>
                                        <div class="estado-percentage">${Math.round((reporte.productosDisponibles / reporte.totalProductos) * 100) || 0}%</div>
                                    </div>
                                    <div class="estado-item bajo">
                                        <div class="estado-icon">
                                            <i class="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <div class="estado-info">
                                            <span class="estado-number">${reporte.stockBajo}</span>
                                            <span class="estado-label">Stock Bajo</span>
                                        </div>
                                        <div class="estado-percentage">${Math.round((reporte.stockBajo / reporte.totalProductos) * 100) || 0}%</div>
                                    </div>
                                    <div class="estado-item agotado">
                                        <div class="estado-icon">
                                            <i class="fas fa-times-circle"></i>
                                        </div>
                                        <div class="estado-info">
                                            <span class="estado-number">${reporte.agotados}</span>
                                            <span class="estado-label">Productos Agotados</span>
                                        </div>
                                        <div class="estado-percentage">${Math.round((reporte.agotados / reporte.totalProductos) * 100) || 0}%</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Análisis por categorías -->
                            <div class="reporte-section">
                                <h3 class="section-title">
                                    <i class="fas fa-tags"></i>
                                    Análisis por Categorías
                                </h3>
                                <div class="categorias-container">
                                    ${Object.entries(categorias).map(([categoria, data]) => `
                                        <div class="categoria-item">
                                            <div class="categoria-header">
                                                <h4 class="categoria-name">${categoria}</h4>
                                                <span class="categoria-count">${data.count} productos</span>
                                            </div>
                                            <div class="categoria-stats">
                                                <div class="categoria-stat">
                                                    <span class="categoria-label">Stock:</span>
                                                    <span class="categoria-value">${data.stock} unidades</span>
                                                </div>
                                                <div class="categoria-stat">
                                                    <span class="categoria-label">Valor:</span>
                                                    <span class="categoria-value">${formatCurrency(data.valor)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-buttons">
                        <button class="btn-form btn-primary" onclick="exportarReporte()">
                            <i class="fas fa-download"></i>
                            Exportar PDF
                        </button>
                        <button class="btn-form btn-secondary" onclick="cerrarModal('reporte-modal')">
                            <i class="fas fa-times"></i>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Agregar modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Mostrar modal
        setTimeout(() => {
            document.getElementById('reporte-modal').classList.add('show');
        }, 10);
    }

    // Función para exportar reporte (placeholder)
    function exportarReporte() {
        const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
        const nombreArchivo = `reporte-inventario-${fecha}.txt`;
        
        const reporte = {
            fecha: new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            hora: new Date().toLocaleTimeString('es-ES'),
            totalProductos: productos.length,
            stockTotal: productos.reduce((sum, p) => sum + (p.stock || 0), 0),
            valorTotal: productos.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0),
            stockBajo: productos.filter(p => (p.stock || 0) <= (p.stockMinimo || 5)).length,
            agotados: productos.filter(p => (p.stock || 0) <= 0).length
        };

        const contenido = `REPORTE DE INVENTARIO - SGPE
========================================

Fecha: ${reporte.fecha}
Hora: ${reporte.hora}

RESUMEN GENERAL:
- Total de Productos: ${reporte.totalProductos}
- Stock Total: ${reporte.stockTotal} unidades
- Valor Total del Inventario: ${formatCurrency(reporte.valorTotal)}
- Productos Disponibles: ${productos.filter(p => (p.stock || 0) > 0).length}
- Productos con Stock Bajo: ${reporte.stockBajo}
- Productos Agotados: ${reporte.agotados}

DETALLE POR PRODUCTOS:
${productos.map(p => `- ${p.nombre} (${p.codigo}): ${p.stock || 0} unidades - ${formatCurrency((p.precio || 0) * (p.stock || 0))}`).join('\n')}

========================================
Generado por SGPE - Sistema de Gestión de Productos y Equipos
`;

        // Crear y descargar archivo
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Mostrar mensaje de éxito
        mostrarMensaje('Reporte exportado exitosamente', 'success');
    }

    // Función para cerrar modal
    function cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // Hacer funciones globales
    window.exportarReporte = exportarReporte;
    window.cerrarModal = cerrarModal;

    function updateEstadisticas() {
        const totalProductos = productos.length;
        const stockTotal = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
        const stockBajo = productos.filter(p => (p.stock || 0) <= (p.stockMinimo || 5)).length;
        const valorInventario = productos.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0);

        // Actualizar tarjetas
        updateStatCard('total-productos', totalProductos);
        updateStatCard('stock-total', stockTotal);
        updateStatCard('stock-bajo', stockBajo);
        updateStatCard('valor-inventario', formatCurrency(valorInventario));
    }

    function updateStatCard(id, value) {
        const card = document.querySelector(`[data-stat="${id}"]`);
        if (card) {
            const valueElement = card.querySelector('.stat-value');
            if (valueElement) {
                valueElement.textContent = value;
            }
        }
    }
});
