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
                // Crear productos de prueba si no hay API
                productos = createTestProducts();
                todosLosProductos = [...productos];
                renderProductos();
                updateEstadisticas();
                return;
            }

            if (!window.ApiService.ProductoService) {
                console.error('ProductoService no está disponible');
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
                // Usar productos de prueba como fallback
                productos = createTestProducts();
                todosLosProductos = [...productos];
                renderProductos();
                updateEstadisticas();
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
            showNotification('Error al cargar los productos: ' + (error.message || 'Error desconocido'), 'error');
            // Usar productos de prueba como fallback
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
            alert(`Producto: ${producto.nombre}\nCódigo: ${producto.codigo}\nPrecio: ${formatCurrency(producto.precio)}\nStock: ${producto.stock}`);
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
        const cantidad = prompt(action === 'add' ? 'Cantidad a agregar:' : 'Cantidad a reducir:', '1');
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
        // Por ahora usar prompt simple
        const nuevoNombre = prompt('Nuevo nombre:', producto.nombre);
        const nuevoPrecio = prompt('Nuevo precio:', producto.precio);
        
        if (nuevoNombre && nuevoPrecio && !isNaN(nuevoPrecio)) {
            producto.nombre = nuevoNombre;
            producto.precio = parseFloat(nuevoPrecio);
            renderProductos();
            updateEstadisticas();
            showNotification('Producto actualizado correctamente', 'success');
        }
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
