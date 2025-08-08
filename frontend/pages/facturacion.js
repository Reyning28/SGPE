// ===== facturacion.js =====

// Helper function para manejar fechas de manera segura
function formatearFecha(fechaString, formato = 'corto') {
  if (!fechaString || fechaString === null || fechaString === undefined) return 'No especificada';
  
  try {
    let fecha;
    
    // Manejar diferentes tipos de entrada
    if (fechaString instanceof Date) {
      fecha = fechaString;
    } else if (typeof fechaString === 'string') {
      // Si ya tiene formato de fecha completa, usar directamente
      if (fechaString.includes('T') || fechaString.includes(' ')) {
        fecha = new Date(fechaString);
      } else if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Formato YYYY-MM-DD, agregar tiempo para evitar problemas de zona horaria
        fecha = new Date(fechaString + 'T12:00:00');
      } else {
        fecha = new Date(fechaString);
      }
    } else {
      fecha = new Date(fechaString);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      console.warn('Fecha inválida recibida:', fechaString);
      return 'Fecha inválida';
    }
    
    const opciones = formato === 'largo' ? {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    } : {};
    
    return fecha.toLocaleDateString('es-ES', opciones);
  } catch (error) {
    console.error('Error al formatear fecha:', error, 'Input:', fechaString);
    return 'Fecha inválida';
  }
}

document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const tbody = document.querySelector("tbody");
    const searchInput = document.querySelector('input[placeholder*="Buscar factura"]');
    const estadoFilter = document.querySelector('select');
    const exportBtn = document.querySelector('.btn-export');
    const nuevaFacturaBtn = document.querySelector('.btn-primary');
    const diagnosticoBtn = document.querySelector('.btn-secondary');
    const searchResults = document.getElementById('search-results');
    const clearSearchBtn = document.querySelector('.clear-search');
   
    // Variables de estado
    let facturas = [];
    let todasLasFacturas = []; // Backup para búsqueda local
    let currentPage = 1;
    let totalPages = 1;
    let isLoading = false;
    let currentSearchTerm = ''; // Para mantener el término de búsqueda actual
   
    // Inicialización
    init();
   
    async function init() {
      await loadFacturas();
      setupEventListeners();
      // Las estadísticas se actualizan automáticamente en loadFacturas()
    }
   
    // Configurar event listeners
    function setupEventListeners() {
      // Búsqueda
      if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 150)); // Reducir debounce
      }
   
      // Filtro de estado
      if (estadoFilter) {
        estadoFilter.addEventListener('change', handleEstadoFilter);
      }
   
      // Botones de acción
      if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
      }
   
      if (nuevaFacturaBtn) {
        nuevaFacturaBtn.addEventListener('click', handleNuevaFactura);
      }
   
      if (diagnosticoBtn) {
        diagnosticoBtn.addEventListener('click', handleDiagnostico);
      }
   
      // Delegación de eventos para botones de acción en la tabla
      tbody.addEventListener('click', handleTableActions);
      
      // Botón para limpiar búsqueda
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
      }
    }
   
    // Cargar facturas desde la API
    async function loadFacturas(params = {}) {
      if (isLoading) return;
     
      isLoading = true;
      // Remover showLoading para evitar parpadeo durante búsquedas
   
      try {
        // Verificar que el servicio existe
        if (!window.ApiService || !window.ApiService.FacturacionService) {
          throw new Error('El servicio de facturación no está disponible. Verifique que api.js está cargado correctamente.');
        }
        
        const FacturacionService = window.ApiService.FacturacionService;
        const response = await FacturacionService.getAll(params);
       
        if (response && response.success) {
          facturas = response.data || [];
          todasLasFacturas = [...facturas]; // Guardar copia para búsqueda local
          totalPages = response.totalPages || 1;
          renderFacturas();
          // Solo usar estadísticas locales para evitar conflictos
          updateEstadisticasLocal();
        } else {
          console.error('Error al cargar facturas:', response?.message || 'Respuesta inválida');
          showNotification('Error al cargar las facturas: ' + (response?.message || 'Respuesta inválida'), 'error');
        }
      } catch (error) {
        console.error('Error cargando facturas:', error);
        showNotification('Error al cargar las facturas: ' + (error.message || 'Error desconocido'), 'error');
      } finally {
        isLoading = false;
        // No mostrar loading para búsquedas suaves
      }
    }
   
    // Renderizar facturas en la tabla
    function renderFacturas() {
      if (!tbody) return;
   
      // Crear un fragmento para evitar múltiples reflows
      const fragment = document.createDocumentFragment();
     
      if (facturas.length === 0) {
        const mensaje = currentSearchTerm 
          ? `No se encontraron facturas que coincidan con "${currentSearchTerm}"`
          : 'No se encontraron facturas';
          
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" class="text-center">${mensaje}</td>`;
        fragment.appendChild(tr);
      } else {
        facturas.forEach(factura => {
          const tr = document.createElement("tr");
          const estadoColor = getEstadoColor(factura.estado);
          const fecha = new Date(factura.fecha).toLocaleDateString('es-ES');
          
          // Resaltar si es una búsqueda específica
          const isExactMatch = currentSearchTerm && (
            factura.numero?.toLowerCase() === currentSearchTerm.toLowerCase() ||
            factura.cliente?.nombre?.toLowerCase() === currentSearchTerm.toLowerCase()
          );
          
          if (isExactMatch) {
            tr.classList.add('highlighted-row');
          }
         
          tr.innerHTML = `
            <td>${resaltarTexto(factura.numero, currentSearchTerm)}</td>
            <td>${resaltarTexto(factura.cliente?.nombre || 'Cliente no encontrado', currentSearchTerm)}</td>
            <td>${fecha}</td>
            <td>${formatCurrency(factura.total)}</td>
            <td>
              <select class="estado-select" data-id="${factura.id}" data-estado-actual="${factura.estado}">
                <option value="pendiente" ${factura.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="pagada" ${factura.estado === 'pagada' ? 'selected' : ''}>Pagada</option>
                <option value="cancelada" ${factura.estado === 'cancelada' ? 'selected' : ''}>Cancelada</option>
              </select>
            </td>
            <td class="acciones">
              <button class="btn-action btn-view" data-id="${factura.id}" title="Ver factura">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-action btn-delete" data-id="${factura.id}" title="Eliminar factura">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          `;
          fragment.appendChild(tr);
        });
      }

      // Limpiar y agregar todo de una vez para evitar parpadeo
      tbody.innerHTML = "";
      tbody.appendChild(fragment);

      // Agregar event listeners para los selectores de estado
      const estadoSelects = tbody.querySelectorAll('.estado-select');
      estadoSelects.forEach(select => {
        select.addEventListener('change', handleEstadoChange);
      });
    }
   
    // Manejar acciones de la tabla
    function handleTableActions(event) {
      const target = event.target.closest('.btn-action');
      if (!target) return;
   
      const facturaId = target.dataset.id;
     
      if (target.classList.contains('btn-view')) {
        verFactura(facturaId);
      } else if (target.classList.contains('btn-delete')) {
        eliminarFactura(facturaId);
      }
    }

    // Manejar cambio de estado de facturas
    async function handleEstadoChange(event) {
      const select = event.target;
      const facturaId = select.dataset.id;
      const estadoAnterior = select.dataset.estadoActual;
      const nuevoEstado = select.value;

      if (estadoAnterior === nuevoEstado) return;

      const confirmacion = confirm(
        `¿Estás seguro de cambiar el estado de la factura a "${nuevoEstado}"?`
      );

      if (!confirmacion) {
        select.value = estadoAnterior;
        return;
      }

      try {
        showLoading(true);
        
        if (!window.ApiService || !window.ApiService.FacturacionService) {
          throw new Error('El servicio de facturación no está disponible.');
        }
        
        const FacturacionService = window.ApiService.FacturacionService;
        const response = await FacturacionService.updateEstado(facturaId, nuevoEstado);
       
        if (response.success) {
          // Actualizar el estado anterior para futuras comparaciones
          select.dataset.estadoActual = nuevoEstado;
          
          // Actualizar la factura en el array local
          const facturaIndex = facturas.findIndex(f => f.id == facturaId);
          if (facturaIndex !== -1) {
            facturas[facturaIndex].estado = nuevoEstado;
          }
          
          // Actualizar solo estadísticas locales (más rápido y confiable)
          console.log('Actualizando estadísticas locales después del cambio de estado...');
          updateEstadisticasLocal();
          
          showNotification(`Estado actualizado a "${nuevoEstado}" exitosamente`, 'success');
        } else {
          select.value = estadoAnterior;
          showNotification(response.message || 'Error al actualizar el estado', 'error');
        }
      } catch (error) {
        console.error('Error actualizando estado:', error);
        select.value = estadoAnterior;
        showNotification('Error al actualizar el estado de la factura', 'error');
      } finally {
        showLoading(false);
      }
    }
   
    // Ver detalles de una factura
    async function verFactura(facturaId) {
      try {
        showLoading(true);
        
        // Verificar que el servicio existe antes de usarlo
        if (!window.ApiService || !window.ApiService.FacturacionService) {
          throw new Error('El servicio de facturación no está disponible. Verifique que api.js está cargado correctamente.');
        }
        
        const FacturacionService = window.ApiService.FacturacionService;
        const response = await FacturacionService.getById(facturaId);
       
        if (response.success) {
          mostrarDetallesFactura(response.data);
        } else {
          showNotification('Error obteniendo detalles de la factura', 'error');
        }
      } catch (error) {
        console.error('Error obteniendo factura:', error);
        showNotification('Error obteniendo detalles de la factura', 'error');
      } finally {
        showLoading(false);
      }
    }
   
    // Mostrar modal con detalles de la factura
    function mostrarDetallesFactura(factura) {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
     
      const fecha = formatearFecha(factura.fecha);
      const fechaVencimiento = formatearFecha(factura.fechaVencimiento);
   
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>Factura ${factura.numero}</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="factura-info">
              <div class="info-row">
                <strong>Cliente:</strong> ${factura.cliente?.nombre || 'No especificado'}
              </div>
              <div class="info-row">
                <strong>Fecha:</strong> ${fecha}
              </div>
              <div class="info-row">
                <strong>Fecha de Vencimiento:</strong> ${fechaVencimiento}
              </div>
              <div class="info-row">
                <strong>Estado:</strong> <span class="estado-badge ${factura.estado}">${factura.estado}</span>
              </div>
              <div class="info-row">
                <strong>Método de Pago:</strong> ${factura.metodoPago || 'No especificado'}
              </div>
            </div>
           
            <div class="detalles-factura">
              <h3>Detalles de la Factura</h3>
              <table class="detalles-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${factura.detalles?.map(detalle => `
                    <tr>
                      <td>${detalle.producto?.nombre || 'Producto no encontrado'}</td>
                      <td>${detalle.cantidad}</td>
                      <td>${formatCurrency(detalle.precioUnitario)}</td>
                      <td>${formatCurrency(detalle.subtotal)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="4">No hay detalles</td></tr>'}
                </tbody>
              </table>
            </div>
           
            <div class="factura-totales">
              <div class="total-row">
                <strong>Subtotal:</strong> ${formatCurrency(factura.subtotal)}
              </div>
              <div class="total-row">
                <strong>ITBIS (18%):</strong> ${formatCurrency(factura.impuesto)}
              </div>
              <div class="total-row total-final">
                <strong>Total:</strong> ${formatCurrency(factura.total)}
              </div>
            </div>
           
            ${factura.notas ? `
              <div class="factura-notas">
                <h3>Notas</h3>
                <p>${factura.notas}</p>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
            <button class="btn-primary" onclick="imprimirFactura(${factura.id})">
              <i class="fas fa-print"></i> Imprimir
            </button>
          </div>
        </div>
      `;
   
      document.body.appendChild(modal);
   
      // Cerrar modal
      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
      });
   
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
   
    // Eliminar factura
    async function eliminarFactura(facturaId) {
      const factura = facturas.find(f => f.id == facturaId);
      if (!factura) return;
   
      if (factura.estado !== 'pendiente') {
        showNotification('Solo se pueden eliminar facturas pendientes', 'warning');
        return;
      }
   
      const confirmacion = confirm(`¿Estás seguro de que quieres eliminar la factura ${factura.numero}?`);
      if (!confirmacion) return;
   
      try {
        showLoading(true);
        
        // Verificar que el servicio existe antes de usarlo
        if (!window.ApiService || !window.ApiService.FacturacionService) {
          throw new Error('El servicio de facturación no está disponible. Verifique que api.js está cargado correctamente.');
        }
        
        const FacturacionService = window.ApiService.FacturacionService;
        const response = await FacturacionService.delete(facturaId);
       
        if (response.success) {
          showNotification('Factura eliminada exitosamente', 'success');
          await loadFacturas(); // Recargar la lista
        } else {
          showNotification(response.message || 'Error al eliminar la factura', 'error');
        }
      } catch (error) {
        console.error('Error eliminando factura:', error);
        showNotification('Error al eliminar la factura', 'error');
      } finally {
        showLoading(false);
      }
    }
   
    // Actualizar estadísticas (DESHABILITADO - usando solo estadísticas locales)
    async function updateEstadisticas() {
      console.log('updateEstadisticas() llamado pero usando solo estadísticas locales');
      // Comentado para evitar conflictos con estadísticas locales
      /*
      try {
        // Verificar que el servicio existe antes de usarlo
        if (!window.ApiService || !window.ApiService.FacturacionService) {
          throw new Error('El servicio de facturación no está disponible. Verifique que api.js está cargado correctamente.');
        }
        
        const FacturacionService = window.ApiService.FacturacionService;
        const response = await FacturacionService.getEstadisticas();
       
        if (response.success) {
          const stats = response.data;
          
          console.log('Estadísticas recibidas:', stats); // Para debug
         
          // Actualizar las tarjetas de estadísticas
          updateStatCard('total-facturas', stats.totalFacturas || 0);
          updateStatCard('total-ventas', formatCurrency(stats.totalVentas || 0));
          updateStatCard('pendientes', stats.pendientes || 0);
          updateStatCard('pagadas', stats.pagadas || 0);
          
          // También agregar canceladas si existe la tarjeta
          if (document.querySelector('[data-stat="canceladas"]')) {
            updateStatCard('canceladas', stats.canceladas || 0);
          }
        } else {
          console.error('Error en respuesta de estadísticas:', response.message);
          // Si falla la API, calcular estadísticas localmente
          updateEstadisticasLocal();
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
        // Si falla la API, calcular estadísticas localmente
        updateEstadisticasLocal();
      }
      */
      // Usar solo estadísticas locales
      updateEstadisticasLocal();
    }

    // Actualizar estadísticas usando datos locales como fallback
    function updateEstadisticasLocal() {
      console.log('Iniciando actualización de estadísticas locales...');
      console.log('Facturas disponibles:', facturas?.length || 0);
      
      if (!facturas || facturas.length === 0) {
        console.log('No hay facturas disponibles para calcular estadísticas');
        // Actualizar con ceros si no hay facturas
        updateStatCard('total-facturas', 0);
        updateStatCard('total-ventas', formatCurrency(0));
        updateStatCard('pendientes', 0);
        updateStatCard('pagadas', 0);
        updateStatCard('canceladas', 0);
        return;
      }
      
      let totalVentas = 0;
      let pendientes = 0;
      let pagadas = 0;
      let canceladas = 0;
      
      facturas.forEach(factura => {
        const total = parseFloat(factura.total || 0);
        totalVentas += total;
        
        console.log(`Factura ${factura.numero}: Estado=${factura.estado}, Total=${total}`);
        
        switch(factura.estado?.toLowerCase()) {
          case 'pendiente':
            pendientes++;
            break;
          case 'pagada':
            pagadas++;
            break;
          case 'cancelada':
            canceladas++;
            break;
        }
      });
      
      const estadisticasCalculadas = {
        totalFacturas: facturas.length,
        totalVentas,
        pendientes,
        pagadas,
        canceladas
      };
      
      console.log('Estadísticas calculadas:', estadisticasCalculadas);
      
      // Actualizar las tarjetas inmediatamente
      updateStatCard('total-facturas', facturas.length);
      updateStatCard('total-ventas', formatCurrency(totalVentas));
      updateStatCard('pendientes', pendientes);
      updateStatCard('pagadas', pagadas);
      updateStatCard('canceladas', canceladas);
      
      console.log('Estadísticas actualizadas en las tarjetas');
    }
   
    // Actualizar tarjeta de estadística
    function updateStatCard(id, value) {
      const card = document.querySelector(`[data-stat="${id}"]`);
      if (card) {
        const valueElement = card.querySelector('.stat-value');
        if (valueElement) {
          valueElement.textContent = value;
        }
      }
    }
   
    // Handlers para filtros y búsqueda
    async function handleSearch(event) {
      const searchTerm = event.target.value.trim();
      currentSearchTerm = searchTerm;
      
      console.log('Buscando:', searchTerm);
      
      // Evitar múltiples búsquedas simultáneas
      if (isLoading) return;
      
      if (!searchTerm) {
        // Si no hay término de búsqueda, mostrar todas las facturas sin recargar del servidor
        facturas = [...todasLasFacturas];
        renderFacturas();
        updateEstadisticasLocal();
        updateSearchResults('', facturas.length);
        return;
      }
      
      // Hacer búsqueda local inmediatamente para respuesta rápida
      buscarLocalmenteRapido(searchTerm);
      
      // Luego intentar búsqueda en servidor en segundo plano (opcional)
      // try {
      //   const params = { search: searchTerm };
      //   await loadFacturas(params);
      //   updateSearchResults(searchTerm, facturas.length);
      // } catch (error) {
      //   console.log('Error en búsqueda del servidor, manteniendo búsqueda local');
      // }
    }
    
    // Búsqueda local rápida sin parpadeo
    function buscarLocalmenteRapido(searchTerm) {
      const termino = searchTerm.toLowerCase();
      
      // Primero buscar coincidencias exactas
      let resultadosExactos = todasLasFacturas.filter(factura => {
        return (
          factura.numero?.toLowerCase() === termino ||
          factura.cliente?.nombre?.toLowerCase() === termino
        );
      });
      
      // Si hay coincidencias exactas, mostrar solo esas
      if (resultadosExactos.length > 0) {
        facturas = resultadosExactos;
      } else {
        // Si no hay coincidencias exactas, buscar coincidencias parciales
        facturas = todasLasFacturas.filter(factura => {
          return (
            factura.numero?.toLowerCase().includes(termino) ||
            factura.cliente?.nombre?.toLowerCase().includes(termino)
          );
        });
      }
      
      // Renderizar inmediatamente
      renderFacturas();
      updateEstadisticasLocal();
      updateSearchResults(searchTerm, facturas.length);
    }
    
    // Función de búsqueda local como fallback
    function buscarLocalmente(searchTerm) {
      console.log('Realizando búsqueda local con término:', searchTerm);
      
      if (!searchTerm) {
        facturas = [...todasLasFacturas];
      } else {
        const termino = searchTerm.toLowerCase();
        
        // Primero buscar coincidencias exactas
        let resultadosExactos = todasLasFacturas.filter(factura => {
          return (
            factura.numero?.toLowerCase() === termino ||
            factura.cliente?.nombre?.toLowerCase() === termino
          );
        });
        
        // Si hay coincidencias exactas, mostrar solo esas
        if (resultadosExactos.length > 0) {
          facturas = resultadosExactos;
          console.log(`Encontrada coincidencia exacta: ${resultadosExactos.length} factura(s)`);
        } else {
          // Si no hay coincidencias exactas, buscar coincidencias parciales
          facturas = todasLasFacturas.filter(factura => {
            return (
              factura.numero?.toLowerCase().includes(termino) ||
              factura.cliente?.nombre?.toLowerCase().includes(termino)
            );
          });
          console.log(`Encontradas coincidencias parciales: ${facturas.length} factura(s)`);
        }
      }
      
      console.log(`Total de facturas mostradas: ${facturas.length}`);
      renderFacturas();
      updateEstadisticasLocal();
      updateSearchResults(searchTerm, facturas.length);
    }
    
    // Actualizar indicador de resultados de búsqueda
    function updateSearchResults(searchTerm, count) {
      if (!searchResults) return;
      
      if (searchTerm) {
        const resultsText = searchResults.querySelector('.results-text');
        if (resultsText) {
          if (count === 1) {
            // Para una sola coincidencia, mostrar mensaje más específico
            const factura = facturas[0];
            if (factura && (factura.numero?.toLowerCase() === searchTerm.toLowerCase() || 
                           factura.cliente?.nombre?.toLowerCase() === searchTerm.toLowerCase())) {
              resultsText.textContent = `Encontrado: ${factura.numero} - ${factura.cliente?.nombre || 'Cliente'}`;
            } else {
              resultsText.textContent = `1 resultado para "${searchTerm}"`;
            }
          } else {
            resultsText.textContent = `${count} resultado${count !== 1 ? 's' : ''} para "${searchTerm}"`;
          }
        }
        searchResults.classList.add('show');
      } else {
        searchResults.classList.remove('show');
      }
    }
    
    // Limpiar búsqueda
    async function clearSearch() {
      if (searchInput) {
        searchInput.value = '';
        currentSearchTerm = '';
      }
      
      if (searchResults) {
        searchResults.classList.remove('show');
      }
      
      // Recargar todas las facturas
      await loadFacturas();
    }
   
    async function handleEstadoFilter(event) {
      const estado = event.target.value;
      console.log('Filtrando por estado:', estado);
      
      try {
        // Combinar filtro de estado con búsqueda actual
        const params = {};
        if (estado) params.estado = estado;
        if (currentSearchTerm) params.search = currentSearchTerm;
        
        await loadFacturas(params);
      } catch (error) {
        console.log('Error en filtro del servidor, usando filtro local:', error);
        // Si falla el servidor, hacer filtro local
        filtrarLocalmente(estado);
      }
    }
    
    // Función de filtro local
    function filtrarLocalmente(estado) {
      console.log('Realizando filtro local por estado:', estado);
      
      let facturasFiltradas = [...todasLasFacturas];
      
      // Aplicar búsqueda si existe
      if (currentSearchTerm) {
        const termino = currentSearchTerm.toLowerCase();
        
        // Primero buscar coincidencias exactas
        let resultadosExactos = facturasFiltradas.filter(factura => {
          return (
            factura.numero?.toLowerCase() === termino ||
            factura.cliente?.nombre?.toLowerCase() === termino
          );
        });
        
        // Si hay coincidencias exactas, usar solo esas
        if (resultadosExactos.length > 0) {
          facturasFiltradas = resultadosExactos;
        } else {
          // Si no hay coincidencias exactas, buscar coincidencias parciales
          facturasFiltradas = facturasFiltradas.filter(factura => {
            return (
              factura.numero?.toLowerCase().includes(termino) ||
              factura.cliente?.nombre?.toLowerCase().includes(termino)
            );
          });
        }
      }
      
      // Aplicar filtro de estado si existe
      if (estado) {
        facturasFiltradas = facturasFiltradas.filter(factura => 
          factura.estado === estado
        );
      }
      
      facturas = facturasFiltradas;
      console.log(`Filtradas ${facturas.length} facturas`);
      renderFacturas();
      updateEstadisticasLocal();
    }
   
    function handleExport() {
      showNotification('Funcionalidad de exportación en desarrollo', 'info');
    }
   
    function handleNuevaFactura() {
      mostrarModalNuevaFactura();
    }
   
    function handleDiagnostico() {
      mostrarModalDiagnostico();
    }
   
    // Resaltar texto en búsquedas
    function resaltarTexto(texto, termino) {
      if (!termino || !texto) return texto;
      
      const regex = new RegExp(`(${termino})`, 'gi');
      return texto.replace(regex, '<mark>$1</mark>');
    }
    
    // Funciones auxiliares
    function getEstadoColor(estado) {
      const colores = {
        'pendiente': 'orange',
        'pagada': 'green',
        'cancelada': 'red'
      };
      return colores[estado] || 'gray';
    }
   
    function formatCurrency(amount) {
      return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP'
      }).format(amount);
    }
   
    function showLoading(show) {
      const loadingElement = document.querySelector('.loading');
      if (show) {
        if (!loadingElement) {
          const loading = document.createElement('div');
          loading.className = 'loading';
          loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
          document.body.appendChild(loading);
        }
      } else {
        if (loadingElement) {
          loadingElement.remove();
        }
      }
    }
   
    function showNotification(message, type = 'info') {
      // Crear notificación
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      `;
   
      document.body.appendChild(notification);
   
      // Auto-remover después de 5 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);
   
      // Cerrar manualmente
      notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
      });
    }
   
    function getNotificationIcon(type) {
      const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
      };
      return icons[type] || 'info-circle';
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
   
    // Mostrar modal para crear nueva factura
    async function mostrarModalNuevaFactura() {
      try {
        showLoading(true);
        console.log('Iniciando carga de clientes y productos...');
        
        // Cargar clientes y productos para los selectores
        let clientesResponse, productosResponse;
        
        try {
          // Verificar que los servicios existen antes de usarlos
          if (!window.ApiService || !window.ApiService.ClienteService || !window.ApiService.ProductoService) {
            throw new Error('Los servicios de API no están disponibles. Verifique que api.js está cargado correctamente.');
          }
          
          const ClienteService = window.ApiService.ClienteService;
          const ProductoService = window.ApiService.ProductoService;
          
          // Intentar cargar clientes y productos en paralelo
          [clientesResponse, productosResponse] = await Promise.all([
            ClienteService.getAll(),
            ProductoService.getAll()
          ]);
        } catch (error) {
          console.error('Error en la carga de datos:', error);
          showNotification('Error al cargar clientes: ' + (error.message || 'Error desconocido'), 'error');
          showLoading(false);
          return;
        }
   
        // Verificar respuesta de clientes
        if (!clientesResponse) {
          console.error('Error al cargar clientes: Respuesta vacía');
          showNotification('Error al cargar clientes: No se recibió respuesta del servidor', 'error');
          showLoading(false);
          return;
        }
        
        // Verificar respuesta de productos
        if (!productosResponse) {
          console.error('Error al cargar productos: Respuesta vacía');
          showNotification('Error al cargar productos: No se recibió respuesta del servidor', 'error');
          showLoading(false);
          return;
        }
        
        // Extraer datos de las respuestas (manejar diferentes formatos de respuesta)
        let clientes = [];
        if (Array.isArray(clientesResponse)) {
          clientes = clientesResponse;
        } else if (clientesResponse.data && Array.isArray(clientesResponse.data)) {
          clientes = clientesResponse.data;
        } else if (clientesResponse.success === false) {
          console.error('Error al cargar clientes:', clientesResponse.message || 'Error desconocido');
          showNotification('Error al cargar clientes: ' + (clientesResponse.message || 'Error desconocido'), 'error');
          showLoading(false);
          return;
        }
        
        let productos = [];
        if (Array.isArray(productosResponse)) {
          productos = productosResponse;
        } else if (productosResponse.data && Array.isArray(productosResponse.data)) {
          productos = productosResponse.data;
        } else if (productosResponse.success === false) {
          console.error('Error al cargar productos:', productosResponse.message || 'Error desconocido');
          showNotification('Error al cargar productos: ' + (productosResponse.message || 'Error desconocido'), 'error');
          showLoading(false);
          return;
        }
        
        console.log('Clientes cargados:', clientes.length);
        console.log('Productos cargados:', productos.length);
        
        // Verificar si hay clientes disponibles
        if (!clientes || clientes.length === 0) {
          console.error('No se encontraron clientes en la base de datos');
          showNotification('No hay clientes disponibles. Por favor, cree un cliente primero.', 'warning');
          showLoading(false);
          return; // Detener la creación del modal si no hay clientes
        }
        
        // Verificar si hay productos disponibles
        if (!productos || productos.length === 0) {
          console.error('No se encontraron productos en la base de datos');
          showNotification('No hay productos disponibles. Por favor, cree un producto primero.', 'warning');
          showLoading(false);
          return; // Detener la creación del modal si no hay productos
        }
   
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
       
        modal.innerHTML = `
          <div class="modal-content nueva-factura-modal">
            <div class="modal-header">
              <h2><i class="fas fa-file-circle-plus"></i> Nueva Factura</h2>
              <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
              <form id="nuevaFacturaForm">
                <!-- Información del cliente -->
                <div class="form-section">
                  <h3>Información del Cliente</h3>
                  <div class="form-group">
                    <label for="clienteSelect">Cliente *</label>
                    <select id="clienteSelect" required>
                      <option value="">Seleccionar cliente...</option>
                      ${clientes.map(cliente => `
                        <option value="${cliente.id}">${cliente.nombre} - ${cliente.correo}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>
   
                <!-- Productos -->
                <div class="form-section">
                  <h3>Productos</h3>
                  <div id="productosContainer">
                    <div class="producto-row">
                      <div class="form-group">
                        <label>Producto *</label>
                        <select class="producto-select" required>
                          <option value="">Seleccionar producto...</option>
                          ${productos.map(producto => `
                            <option value="${producto.id}" data-precio="${producto.precio}" data-stock="${producto.stock}">
                              ${producto.nombre} - ${producto.codigo} (Stock: ${producto.stock})
                            </option>
                          `).join('')}
                        </select>
                      </div>
                      <div class="form-group">
                        <label>Cantidad *</label>
                        <input type="number" class="cantidad-input" min="1" required>
                      </div>
                      <div class="form-group">
                        <label>Precio Unit.</label>
                        <input type="number" class="precio-input" readonly>
                      </div>
                      <div class="form-group">
                        <label>Subtotal</label>
                        <input type="number" class="subtotal-input" readonly>
                      </div>
                      <button type="button" class="btn-remove-producto">
                <i class="fas fa-trash"></i>
              </button>
                    </div>
                  </div>
                  <button type="button" class="btn-add-producto" id="btn-add-producto">
                    <i class="fas fa-plus"></i> Agregar Producto
                  </button>
                </div>
   
                <!-- Totales -->
                <div class="form-section">
                  <h3>Totales</h3>
                  <div class="totales-container">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span id="subtotalTotal">0.00 DOP</span>
                    </div>
                    <div class="total-row">
                      <span>ITBIS (18%):</span>
                      <span id="itbisTotal">0.00 DOP</span>
                    </div>
                    <div class="total-row total-final">
                      <span>Total:</span>
                      <span id="totalFinal">0.00 DOP</span>
                    </div>
                  </div>
                </div>
   
                <!-- Información adicional -->
                <div class="form-section">
                  <h3>Información Adicional</h3>
                  <div class="form-group">
                    <label for="metodoPago">Método de Pago</label>
                    <select id="metodoPago">
                      <option value="">Seleccionar método...</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="fechaVencimiento">Fecha de Vencimiento</label>
                    <input type="date" id="fechaVencimiento">
                  </div>
                  <div class="form-group">
                    <label for="notas">Notas</label>
                    <textarea id="notas" rows="3" placeholder="Notas adicionales..."></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" id="btn-cancelar">Cancelar</button>
              <button class="btn-primary" id="btn-crear-factura">
                <i class="fas fa-save"></i> Crear Factura
              </button>
            </div>
          </div>
        `;
   
        document.body.appendChild(modal);
   
        // Configurar event listeners
        setupNuevaFacturaEventListeners(modal);
        
        // Asignar event listeners a los botones de eliminar producto
        const btnRemoveProductos = modal.querySelectorAll('.btn-remove-producto');
        btnRemoveProductos.forEach(btn => {
          btn.addEventListener('click', function() {
            removeProducto(this);
          });
        });
   
        // Cerrar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
          modal.remove();
        });
   
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.remove();
          }
        });
   
      } catch (error) {
        console.error('Error cargando datos para nueva factura:', error);
        showNotification('Error al cargar datos para nueva factura: ' + (error.message || 'Error desconocido'), 'error');
      } finally {
        showLoading(false);
      }
    }
   
    // Configurar event listeners para nueva factura
    function setupNuevaFacturaEventListeners(modal) {
      // Verificar que el modal existe
      if (!modal) {
        console.error('Error: Modal no encontrado');
        showNotification('Error al configurar el formulario de factura', 'error');
        return;
      }
      
      // Event listeners para productos
      const productosContainer = modal.querySelector('#productosContainer');
      
      if (!productosContainer) {
        console.error('Error: Contenedor de productos no encontrado');
        showNotification('Error al configurar el formulario de productos', 'error');
        return;
      }
      
      // Configurar event listeners para el contenedor de productos
      productosContainer.addEventListener('change', (e) => {
        // Verificar que e.target existe y tiene la propiedad classList
        if (!e.target) return;
        if (typeof e.target.classList === 'undefined') return;
        
        if (e.target.classList.contains('producto-select')) {
          updatePrecioProducto(e.target);
        }
      });
   
      productosContainer.addEventListener('input', (e) => {
        // Verificar que e.target existe y tiene la propiedad classList
        if (!e.target) return;
        if (typeof e.target.classList === 'undefined') return;
        
        if (e.target.classList.contains('cantidad-input')) {
          updateSubtotalProducto(e.target);
        }
      });
   
      // Event listeners para cliente
      const clienteSelect = modal.querySelector('#clienteSelect');
      if (!clienteSelect) {
        console.error('Error: Selector de clientes no encontrado');
        showNotification('Error al configurar el selector de clientes', 'error');
        return;
      }
      
      clienteSelect.addEventListener('change', () => {
        validateForm();
      });
      
      // Asignar funciones a botones
      const btnCrearFactura = modal.querySelector('#btn-crear-factura');
      if (!btnCrearFactura) {
        console.error('Error: Botón de crear factura no encontrado');
        showNotification('Error al configurar los botones de acción', 'error');
        return;
      }
      
      btnCrearFactura.addEventListener('click', crearFactura);
      
      // Botón cancelar
      const btnCancelar = modal.querySelector('#btn-cancelar');
      if (!btnCancelar) {
        console.error('Error: Botón de cancelar no encontrado');
        showNotification('Error al configurar el botón de cancelar', 'warning');
        // No retornamos aquí porque no es crítico
      } else {
        btnCancelar.addEventListener('click', () => {
          modal.remove();
        });
      }
      
      // Botón para agregar producto
      const btnAddProducto = modal.querySelector('#btn-add-producto');
      if (!btnAddProducto) {
        console.error('Error: Botón de agregar producto no encontrado');
        showNotification('Error al configurar el botón de agregar producto', 'warning');
        // No retornamos aquí porque no es crítico
      } else {
        btnAddProducto.addEventListener('click', addProducto);
      }
    }
   
    // Agregar producto - función local, no global
    function addProducto() {
      const container = document.querySelector('#productosContainer');
      
      if (!container) {
        console.error('Error: No se encontró el contenedor de productos');
        return;
      }
      
      const productoSelect = document.querySelector('.producto-select');
      if (!productoSelect) {
        console.error('Error: No se encontró el selector de productos');
        return;
      }
      
      const productoOptions = Array.from(productoSelect.options).slice(1).map(option => option.outerHTML).join('');
     
      const productoRow = document.createElement('div');
      productoRow.className = 'producto-row';
      productoRow.innerHTML = `
        <div class="form-group">
          <label>Producto *</label>
          <select class="producto-select" required>
            <option value="">Seleccionar producto...</option>
            ${productoOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Cantidad *</label>
          <input type="number" class="cantidad-input" min="1" required>
        </div>
        <div class="form-group">
          <label>Precio Unit.</label>
          <input type="number" class="precio-input" readonly>
        </div>
        <div class="form-group">
          <label>Subtotal</label>
          <input type="number" class="subtotal-input" readonly>
        </div>
        <button type="button" class="btn-remove-producto">
          <i class="fas fa-trash"></i>
        </button>
      `;
     
      container.appendChild(productoRow);
      
      // Agregar event listener al botón de eliminar
      const btnRemove = productoRow.querySelector('.btn-remove-producto');
      if (btnRemove) {
        btnRemove.addEventListener('click', function() {
          removeProducto(this);
        });
      }
    }
   
    // Remover producto - función local, no global
    function removeProducto(button) {
      const productoRow = button.closest('.producto-row');
      if (!productoRow) return;
      
      if (document.querySelectorAll('.producto-row').length > 1) {
        productoRow.remove();
        updateTotales();
      } else {
        showNotification('Debe tener al menos un producto', 'warning');
      }
    }
   
    // Actualizar precio del producto
    function updatePrecioProducto(select) {
      const row = select.closest('.producto-row');
      const precioInput = row.querySelector('.precio-input');
      const cantidadInput = row.querySelector('.cantidad-input');
     
      const selectedOption = select.options[select.selectedIndex];
      if (selectedOption && selectedOption.dataset.precio) {
        precioInput.value = selectedOption.dataset.precio;
        if (cantidadInput.value) {
          updateSubtotalProducto(cantidadInput);
        }
      } else {
        precioInput.value = '';
      }
    }
   
    // Actualizar subtotal del producto
    function updateSubtotalProducto(cantidadInput) {
      const row = cantidadInput.closest('.producto-row');
      const precioInput = row.querySelector('.precio-input');
      const subtotalInput = row.querySelector('.subtotal-input');
     
      const precio = parseFloat(precioInput.value) || 0;
      const cantidad = parseFloat(cantidadInput.value) || 0;
      const subtotal = precio * cantidad;
     
      subtotalInput.value = subtotal.toFixed(2);
      updateTotales();
    }
   
    // Actualizar totales
    function updateTotales() {
      const subtotales = Array.from(document.querySelectorAll('.subtotal-input'))
        .map(input => parseFloat(input.value) || 0);
     
      const subtotal = subtotales.reduce((sum, val) => sum + val, 0);
      const itbis = subtotal * 0.18;
      const total = subtotal + itbis;
     
      document.getElementById('subtotalTotal').textContent = formatCurrency(subtotal);
      document.getElementById('itbisTotal').textContent = formatCurrency(itbis);
      document.getElementById('totalFinal').textContent = formatCurrency(total);
    }
   
    // Validar formulario
    function validateForm() {
      let isValid = true;
      
      // Verificar existencia del selector de clientes
      const clienteSelect = document.getElementById('clienteSelect');
      if (!clienteSelect) {
        console.error('Error: No se encontró el selector de clientes');
        showNotification('Error al validar el formulario: No se encontró el selector de clientes', 'error');
        return false;
      }
      
      // Verificar que se haya seleccionado un cliente
      if (!clienteSelect.value || clienteSelect.value.trim() === '') {
        console.log('Valor del selector de clientes:', clienteSelect.value);
        showNotification('Debe seleccionar un cliente', 'warning');
        isValid = false;
      }
     
      // Verificar productos
      const productos = document.querySelectorAll('.producto-select');
      const cantidades = document.querySelectorAll('.cantidad-input');
      
      if (!productos || productos.length === 0) {
        console.error('Error: No se encontraron selectores de productos');
        showNotification('Debe agregar al menos un producto', 'warning');
        isValid = false;
      } else {
        // Verificar que cada producto tenga un valor seleccionado y una cantidad
        let productosIncompletos = false;
        
        productos.forEach((producto, index) => {
          // Verificar que el producto existe y tiene un valor seleccionado
          if (!producto || !producto.value || producto.value.trim() === '') {
            productosIncompletos = true;
            console.error('Error: Producto sin seleccionar en índice', index);
          }
          
          // Verificar que existe la cantidad correspondiente y tiene un valor
          if (!cantidades || index >= cantidades.length || !cantidades[index] || 
              !cantidades[index].value || cantidades[index].value <= 0) {
            productosIncompletos = true;
            console.error('Error: Cantidad inválida en índice', index);
          }
        });
        
        if (productosIncompletos) {
          showNotification('Todos los productos deben tener un producto seleccionado y una cantidad válida', 'warning');
          isValid = false;
        }
      }
     
      return isValid;
    }
   
    // Crear factura
    async function crearFactura() {
      // Validar el formulario antes de proceder
      if (!validateForm()) {
        console.log('Validación del formulario fallida');
        return;
      }
     
      try {
        showLoading(true);
       
        // Verificar existencia del selector de clientes
        const clienteSelect = document.getElementById('clienteSelect');
        if (!clienteSelect) {
          console.error('Error: No se encontró el selector de clientes');
          showNotification('Error: No se encontró el selector de clientes', 'error');
          showLoading(false);
          return;
        }
        
        // Verificar que se haya seleccionado un cliente
        const clienteId = clienteSelect.value;
        if (!clienteId || clienteId.trim() === '') {
          console.error('Error: No se ha seleccionado un cliente');
          showNotification('Debe seleccionar un cliente', 'warning');
          showLoading(false);
          return;
        }
        
        // Obtener información adicional
        const metodoPago = document.getElementById('metodoPago')?.value;
        const fechaVencimiento = document.getElementById('fechaVencimiento')?.value;
        const notas = document.getElementById('notas')?.value;
       
        // Recopilar productos
        const detalles = [];
        const productoRows = document.querySelectorAll('.producto-row');
        
        // Verificar que existan filas de productos
        if (!productoRows || productoRows.length === 0) {
          console.error('Error: No se encontraron productos');
          showNotification('Debe agregar al menos un producto', 'warning');
          showLoading(false);
          return;
        }
       
        // Procesar cada fila de producto
        let productosValidos = true;
        
        productoRows.forEach(row => {
          const productoSelect = row.querySelector('.producto-select');
          const cantidadInput = row.querySelector('.cantidad-input');
          const precioInput = row.querySelector('.precio-input');
          const subtotalInput = row.querySelector('.subtotal-input');
          
          // Verificar que todos los elementos necesarios existen
          if (!productoSelect || !cantidadInput || !precioInput || !subtotalInput) {
            console.error('Error: Faltan elementos en la fila de producto');
            productosValidos = false;
            return;
          }
          
          // Verificar que se ha seleccionado un producto y tiene una cantidad válida
          if (!productoSelect.value || productoSelect.value.trim() === '') {
            console.error('Error: Producto no seleccionado');
            productosValidos = false;
            return;
          }
          
          if (!cantidadInput.value || parseInt(cantidadInput.value) <= 0) {
            console.error('Error: Cantidad inválida');
            productosValidos = false;
            return;
          }
          
          const productoId = productoSelect.value;
          const cantidad = parseInt(cantidadInput.value);
          const precioUnitario = parseFloat(precioInput.value);
          const subtotal = parseFloat(subtotalInput.value);
         
          detalles.push({
            productoId: parseInt(productoId),
            cantidad,
            precioUnitario,
            subtotal
          });
        });
        
        // Verificar si todos los productos son válidos
        if (!productosValidos) {
          showNotification('Hay productos incompletos o con información inválida', 'warning');
          showLoading(false);
          return;
        }
        
        // Verificar que haya al menos un detalle
        if (detalles.length === 0) {
          showNotification('Debe agregar al menos un producto válido', 'warning');
          showLoading(false);
          return;
        }
       
        const facturaData = {
          clienteId: parseInt(clienteId),
          detalles,
          metodoPago: metodoPago || null,
          fechaVencimiento: fechaVencimiento || null,
          notas: notas || null
        };
       
        // Verificar que el servicio existe antes de usarlo
        if (!window.ApiService || !window.ApiService.FacturacionService) {
          throw new Error('El servicio de facturación no está disponible. Verifique que api.js está cargado correctamente.');
        }
        
        const FacturacionService = window.ApiService.FacturacionService;
        const response = await FacturacionService.create(facturaData);
       
        if (response.success) {
          showNotification('Factura creada exitosamente', 'success');
          document.querySelector('.modal-overlay').remove();
          await loadFacturas(); // Recargar la lista
        } else {
          showNotification(response.message || 'Error al crear la factura', 'error');
        }
       
      } catch (error) {
        console.error('Error creando factura:', error);
        showNotification('Error al crear la factura', 'error');
      } finally {
        showLoading(false);
      }
    };
   
    // Función global para imprimir factura
    window.imprimirFactura = async function(facturaId) {
        try {
            showLoading(true);
            
            // Verificar que el servicio existe antes de usarlo
            if (!window.ApiService || !window.ApiService.FacturacionService) {
                throw new Error('El servicio de facturación no está disponible.');
            }
            
            const FacturacionService = window.ApiService.FacturacionService;
            const response = await FacturacionService.getById(facturaId);
           
            if (response.success) {
                const factura = response.data;
                generarVistaImpresion(factura);
            } else {
                showNotification('Error obteniendo datos de la factura para imprimir', 'error');
            }
        } catch (error) {
            console.error('Error preparando impresión:', error);
            showNotification('Error preparando la impresión', 'error');
        } finally {
            showLoading(false);
        }
    };

    // Generar vista optimizada para impresión
    function generarVistaImpresion(factura) {
        const fecha = formatearFecha(factura.fecha, 'largo');
        const fechaVencimiento = formatearFecha(factura.fechaVencimiento, 'largo');

        // Crear ventana de impresión
        const ventanaImpresion = window.open('', '_blank', 'width=800,height=900');
        
        const contenidoHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Factura ${factura.numero} - SGPE</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: white;
                    padding: 20px;
                    font-size: 14px;
                }
                
                .factura-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .factura-header {
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .empresa-logo {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                    letter-spacing: 2px;
                }
                
                .empresa-info {
                    font-size: 1rem;
                    opacity: 0.9;
                }
                
                .factura-numero {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .factura-body {
                    padding: 30px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 30px;
                }
                
                .info-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                
                .info-title {
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: #1e40af;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #2563eb;
                    padding-bottom: 8px;
                }
                
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    padding: 5px 0;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #374151;
                }
                
                .info-value {
                    color: #111827;
                }
                
                .estado-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .estado-badge.pendiente {
                    background: #fef3c7;
                    color: #92400e;
                    border: 1px solid #f59e0b;
                }
                
                .estado-badge.pagada {
                    background: #d1fae5;
                    color: #065f46;
                    border: 1px solid #10b981;
                }
                
                .estado-badge.vencida {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #ef4444;
                }
                
                .estado-badge.cancelada {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #6b7280;
                }
                
                .detalles-section {
                    margin: 30px 0;
                }
                
                .section-title {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #1e40af;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e2e8f0;
                }
                
                .detalles-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .detalles-table th {
                    background: #1e40af;
                    color: white;
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: bold;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .detalles-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    vertical-align: middle;
                }
                
                .detalles-table tbody tr:nth-child(even) {
                    background: #f9fafb;
                }
                
                .detalles-table tbody tr:hover {
                    background: #f3f4f6;
                }
                
                .text-right {
                    text-align: right;
                }
                
                .text-center {
                    text-align: center;
                }
                
                .totales-section {
                    background: #f8fafc;
                    padding: 25px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    margin-top: 20px;
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 1rem;
                }
                
                .total-final {
                    border-top: 2px solid #2563eb;
                    margin-top: 15px;
                    padding-top: 15px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #1e40af;
                }
                
                .notas-section {
                    margin-top: 30px;
                    padding: 20px;
                    background: #fffbeb;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                }
                
                .notas-title {
                    font-weight: bold;
                    color: #92400e;
                    margin-bottom: 10px;
                }
                
                .footer-info {
                    margin-top: 40px;
                    padding: 20px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    text-align: center;
                    color: #64748b;
                    font-size: 0.9rem;
                }
                
                .fecha-impresion {
                    text-align: right;
                    color: #6b7280;
                    font-size: 0.85rem;
                    margin-top: 20px;
                    font-style: italic;
                }
                
                /* Estilos para impresión */
                @media print {
                    body {
                        padding: 0;
                        font-size: 12px;
                    }
                    
                    .factura-container {
                        border: none;
                        box-shadow: none;
                        max-width: none;
                    }
                    
                    .factura-header {
                        background: #2563eb !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    .detalles-table th {
                        background: #1e40af !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    .info-section,
                    .totales-section,
                    .notas-section,
                    .footer-info {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
                
                @page {
                    margin: 1cm;
                    size: A4;
                }
            </style>
        </head>
        <body>
            <div class="factura-container">
                <!-- Header de la factura -->
                <div class="factura-header">
                    <div class="empresa-logo">SGPE</div>
                    <div class="empresa-info">Sistema de Gestión de Productos y Equipos</div>
                    <div class="factura-numero">
                        <h2>FACTURA ${factura.numero}</h2>
                    </div>
                </div>
                
                <!-- Cuerpo de la factura -->
                <div class="factura-body">
                    <!-- Información del cliente y factura -->
                    <div class="info-grid">
                        <div class="info-section">
                            <div class="info-title">Información del Cliente</div>
                            <div class="info-row">
                                <span class="info-label">Cliente:</span>
                                <span class="info-value">${factura.cliente?.nombre || 'No especificado'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${factura.cliente?.email || 'No especificado'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Teléfono:</span>
                                <span class="info-value">${factura.cliente?.telefono || 'No especificado'}</span>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <div class="info-title">Detalles de la Factura</div>
                            <div class="info-row">
                                <span class="info-label">Fecha:</span>
                                <span class="info-value">${fecha}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Vencimiento:</span>
                                <span class="info-value">${fechaVencimiento}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Estado:</span>
                                <span class="estado-badge ${factura.estado}">${factura.estado}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Método de Pago:</span>
                                <span class="info-value">${factura.metodoPago || 'No especificado'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detalles de productos -->
                    <div class="detalles-section">
                        <div class="section-title">Detalles de la Factura</div>
                        <table class="detalles-table">
                            <thead>
                                <tr>
                                    <th style="width: 40%">Producto</th>
                                    <th style="width: 15%" class="text-center">Cantidad</th>
                                    <th style="width: 20%" class="text-right">Precio Unitario</th>
                                    <th style="width: 25%" class="text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${factura.detalles?.map(detalle => `
                                    <tr>
                                        <td><strong>${detalle.producto?.nombre || 'Producto no encontrado'}</strong></td>
                                        <td class="text-center">${detalle.cantidad}</td>
                                        <td class="text-right">${formatCurrency(detalle.precioUnitario)}</td>
                                        <td class="text-right"><strong>${formatCurrency(detalle.subtotal)}</strong></td>
                                    </tr>
                                `).join('') || '<tr><td colspan="4" class="text-center">No hay detalles disponibles</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Totales -->
                    <div class="totales-section">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>${formatCurrency(factura.subtotal)}</span>
                        </div>
                        <div class="total-row">
                            <span>ITBIS (18%):</span>
                            <span>${formatCurrency(factura.impuesto)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>TOTAL:</span>
                            <span>${formatCurrency(factura.total)}</span>
                        </div>
                    </div>
                    
                    ${factura.notas ? `
                        <div class="notas-section">
                            <div class="notas-title">Notas adicionales:</div>
                            <p>${factura.notas}</p>
                        </div>
                    ` : ''}
                    
                    <!-- Footer -->
                    <div class="footer-info">
                        <p><strong>SGPE - Sistema de Gestión de Productos y Equipos</strong></p>
                        <p>Gracias por su preferencia</p>
                    </div>
                    
                    <div class="fecha-impresion">
                        Impreso el: ${new Date().toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            </div>
            
            <script>
                // Auto-imprimir después de cargar
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                });
                
                // Cerrar ventana después de imprimir o cancelar
                window.addEventListener('afterprint', function() {
                    window.close();
                });
            </script>
        </body>
        </html>
        `;
        
        ventanaImpresion.document.write(contenidoHTML);
        ventanaImpresion.document.close();
        
        showNotification('Vista de impresión generada correctamente', 'success');
    }
   
    // ===== FUNCIONES DE PRUEBA =====
   
    // Mostrar modal de diagnóstico
    function mostrarModalDiagnostico() {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
     
      modal.innerHTML = `
        <div class="modal-content diagnostico-modal">
          <div class="modal-header">
            <h2><i class="fas fa-stethoscope"></i> Diagnóstico del Sistema</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="diagnostico-section">
              <h3>Pruebas de Funcionalidad</h3>
              <p>Ejecuta las siguientes pruebas para verificar que el sistema funciona correctamente:</p>
             
              <div class="test-buttons">
                <button class="btn-test" onclick="ejecutarPruebaFacturacion()">
                  <i class="fas fa-file-invoice"></i> Prueba Facturación
                </button>
                <button class="btn-test" onclick="ejecutarPruebaNuevaFactura()">
                  <i class="fas fa-plus-circle"></i> Prueba Nueva Factura
                </button>
                <button class="btn-test" onclick="ejecutarPruebaCompleta()">
                  <i class="fas fa-play-circle"></i> Prueba Completa
                </button>
              </div>
            </div>
           
            <div class="diagnostico-section">
              <h3>Resultados de las Pruebas</h3>
              <div id="resultadosPruebas" class="resultados-pruebas">
                <p class="no-resultados">No se han ejecutado pruebas aún</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
          </div>
        </div>
      `;
   
      document.body.appendChild(modal);
   
      // Cerrar modal
      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
      });
   
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
   
    // Función para mostrar resultados de pruebas
    function mostrarResultadoPrueba(mensaje, tipo = 'info') {
      const resultadosDiv = document.getElementById('resultadosPruebas');
      if (!resultadosDiv) return;
   
      const resultado = document.createElement('div');
      resultado.className = `resultado-prueba resultado-${tipo}`;
      resultado.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
      `;
   
      // Limpiar mensaje de "no resultados" si existe
      const noResultados = resultadosDiv.querySelector('.no-resultados');
      if (noResultados) {
        noResultados.remove();
      }
   
      resultadosDiv.appendChild(resultado);
     
      // Auto-scroll al final
      resultadosDiv.scrollTop = resultadosDiv.scrollHeight;
    }
   
    // Prueba de funcionalidad de facturación
    window.ejecutarPruebaFacturacion = async function() {
      try {
        mostrarResultadoPrueba('🧪 Iniciando prueba de facturación...', 'info');
        
        // Verificar que los servicios existen antes de usarlos
        if (!window.ApiService || !window.ApiService.AuthService || !window.ApiService.FacturacionService) {
          throw new Error('Los servicios de API no están disponibles. Verifique que api.js está cargado correctamente.');
        }
        
        const AuthService = window.ApiService.AuthService;
        const FacturacionService = window.ApiService.FacturacionService;
       
        // 1. Probar login
        mostrarResultadoPrueba('1. Probando login...', 'info');
        const loginResponse = await AuthService.login({
          email: 'admin@sgpe.com',
          password: 'admin123'
        });
       
        if (loginResponse.success) {
          AuthService.setToken(loginResponse.token);
          mostrarResultadoPrueba('✅ Login exitoso', 'success');
        } else {
          mostrarResultadoPrueba('❌ Error en login: ' + loginResponse.message, 'error');
          return;
        }
   
        // 2. Probar obtener facturas
        mostrarResultadoPrueba('2. Probando obtener facturas...', 'info');
        const facturasResponse = await FacturacionService.getAll();
       
        if (facturasResponse.success) {
          mostrarResultadoPrueba(`✅ Facturas obtenidas: ${facturasResponse.data.length} facturas`, 'success');
        } else {
          mostrarResultadoPrueba('❌ Error obteniendo facturas: ' + facturasResponse.message, 'error');
          return;
        }
   
        // 3. Probar estadísticas
        mostrarResultadoPrueba('3. Probando estadísticas...', 'info');
        const statsResponse = await FacturacionService.getEstadisticas();
       
        if (statsResponse.success) {
          mostrarResultadoPrueba('✅ Estadísticas obtenidas correctamente', 'success');
          mostrarResultadoPrueba(`📊 Total facturas: ${statsResponse.data.totalFacturas}`, 'info');
          mostrarResultadoPrueba(`💰 Total ventas: ${formatCurrency(statsResponse.data.totalVentas)}`, 'info');
        } else {
          mostrarResultadoPrueba('❌ Error obteniendo estadísticas: ' + statsResponse.message, 'error');
          return;
        }
   
        // 4. Si hay facturas, probar obtener una por ID
        if (facturasResponse.data.length > 0) {
          const primeraFactura = facturasResponse.data[0];
          mostrarResultadoPrueba(`4. Probando obtener factura por ID (${primeraFactura.id})...`, 'info');
         
          const facturaResponse = await FacturacionService.getById(primeraFactura.id);
         
          if (facturaResponse.success) {
            mostrarResultadoPrueba('✅ Factura obtenida por ID correctamente', 'success');
            mostrarResultadoPrueba(`📄 Número: ${facturaResponse.data.numero}`, 'info');
            mostrarResultadoPrueba(`👤 Cliente: ${facturaResponse.data.cliente?.nombre}`, 'info');
          } else {
            mostrarResultadoPrueba('❌ Error obteniendo factura por ID: ' + facturaResponse.message, 'error');
          }
        }
   
        mostrarResultadoPrueba(' Prueba de facturación completada exitosamente!', 'success');
   
      } catch (error) {
        console.error('Error en prueba de facturación:', error);
        mostrarResultadoPrueba('❌ Error en las pruebas: ' + error.message, 'error');
      }
    };
   
    // Prueba de crear nueva factura
    window.ejecutarPruebaNuevaFactura = async function() {
      try {
        mostrarResultadoPrueba(' Iniciando prueba de nueva factura...', 'info');
        
        // Verificar que los servicios existen antes de usarlos
        if (!window.ApiService || !window.ApiService.AuthService || !window.ApiService.ClienteService || 
            !window.ApiService.ProductoService || !window.ApiService.FacturacionService) {
          throw new Error('Los servicios de API no están disponibles. Verifique que api.js está cargado correctamente.');
        }
        
        const AuthService = window.ApiService.AuthService;
        const ClienteService = window.ApiService.ClienteService;
        const ProductoService = window.ApiService.ProductoService;
        const FacturacionService = window.ApiService.FacturacionService;
       
        // 1. Probar login
        mostrarResultadoPrueba('1. Probando login...', 'info');
        const loginResponse = await AuthService.login({
          email: 'admin@sgpe.com',
          password: 'admin123'
        });
       
        if (loginResponse.success) {
          AuthService.setToken(loginResponse.token);
          mostrarResultadoPrueba('✅ Login exitoso', 'success');
        } else {
          mostrarResultadoPrueba('❌ Error en login: ' + loginResponse.message, 'error');
          return;
        }
   
        // 2. Obtener clientes disponibles
        mostrarResultadoPrueba('2. Obteniendo clientes...', 'info');
        const clientesResponse = await ClienteService.getAll();
       
        if (!clientesResponse.success) {
          mostrarResultadoPrueba('❌ Error obteniendo clientes: ' + clientesResponse.message, 'error');
          return;
        }
       
        const clientes = clientesResponse.data;
        mostrarResultadoPrueba(`✅ Clientes obtenidos: ${clientes.length} clientes`, 'success');
       
        if (clientes.length === 0) {
          mostrarResultadoPrueba('❌ No hay clientes disponibles para crear factura', 'error');
          return;
        }
   
        // 3. Obtener productos disponibles
        mostrarResultadoPrueba('3. Obteniendo productos...', 'info');
        const productosResponse = await ProductoService.getAll();
       
        if (!productosResponse.success) {
          mostrarResultadoPrueba('❌ Error obteniendo productos: ' + productosResponse.message, 'error');
          return;
        }
       
        const productos = productosResponse.data;
        mostrarResultadoPrueba(`✅ Productos obtenidos: ${productos.length} productos`, 'success');
       
        if (productos.length === 0) {
          mostrarResultadoPrueba('❌ No hay productos disponibles para crear factura', 'error');
          return;
        }
   
        // 4. Crear una nueva factura
        mostrarResultadoPrueba('4. Creando nueva factura...', 'info');
        const facturaData = {
          clienteId: clientes[0].id,
          detalles: [
            {
              productoId: productos[0].id,
              cantidad: 2,
              precioUnitario: productos[0].precio,
              subtotal: productos[0].precio * 2
            }
          ],
          metodoPago: 'efectivo',
          notas: 'Factura de prueba creada automáticamente'
        };
   
        const createResponse = await FacturacionService.create(facturaData);
       
        if (createResponse.success) {
          mostrarResultadoPrueba('✅ Factura creada exitosamente', 'success');
          mostrarResultadoPrueba(`📄 Número: ${createResponse.data.factura.numero}`, 'info');
          mostrarResultadoPrueba(`👤 Cliente: ${clientes[0].nombre}`, 'info');
          mostrarResultadoPrueba(`💰 Total: ${formatCurrency(createResponse.data.factura.total)}`, 'info');
        } else {
          mostrarResultadoPrueba('❌ Error creando factura: ' + createResponse.message, 'error');
          return;
        }
   
        // 5. Verificar que la factura aparece en la lista
        mostrarResultadoPrueba('5. Verificando que la factura aparece en la lista...', 'info');
        const facturasResponse = await FacturacionService.getAll();
       
        if (facturasResponse.success) {
          const facturas = facturasResponse.data;
          const nuevaFactura = facturas.find(f => f.numero === createResponse.data.factura.numero);
         
          if (nuevaFactura) {
            mostrarResultadoPrueba('✅ Nueva factura encontrada en la lista', 'success');
          } else {
            mostrarResultadoPrueba('❌ Nueva factura no encontrada en la lista', 'error');
          }
        }
   
        // 6. Obtener detalles de la factura creada
        mostrarResultadoPrueba('6. Obteniendo detalles de la factura creada...', 'info');
        const detalleResponse = await FacturacionService.getById(createResponse.data.factura.id);
       
        if (detalleResponse.success) {
          mostrarResultadoPrueba('✅ Detalles de factura obtenidos correctamente', 'success');
          mostrarResultadoPrueba(`📋 Detalles: ${detalleResponse.data.detalles?.length || 0} productos`, 'info');
        } else {
          mostrarResultadoPrueba('❌ Error obteniendo detalles: ' + detalleResponse.message, 'error');
        }
   
        mostrarResultadoPrueba('🎉 Prueba de nueva factura completada exitosamente!', 'success');
   
      } catch (error) {
        console.error('Error en prueba de nueva factura:', error);
        mostrarResultadoPrueba('❌ Error en las pruebas: ' + error.message, 'error');
      }
    };
   
    // Prueba completa (ambas pruebas)
    window.ejecutarPruebaCompleta = async function() {
      try {
        mostrarResultadoPrueba('🧪 Iniciando prueba completa del sistema...', 'info');
       
        // Ejecutar prueba de facturación
        await ejecutarPruebaFacturacion();
       
        // Esperar un momento
        await new Promise(resolve => setTimeout(resolve, 1000));
       
        // Ejecutar prueba de nueva factura
        await ejecutarPruebaNuevaFactura();
       
        mostrarResultadoPrueba('🎉 Prueba completa finalizada exitosamente!', 'success');
       
      } catch (error) {
        console.error('Error en prueba completa:', error);
        mostrarResultadoPrueba('❌ Error en la prueba completa: ' + error.message, 'error');
      }
    };
  });