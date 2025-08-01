
document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("clientTableBody");
  const modal = document.getElementById("clientModal");
  const newClientBtn = document.getElementById("newClientBtn");
  const cancelModalBtn = document.getElementById("cancelModal");
  const clientForm = document.getElementById("clientForm");
  const searchInput = document.getElementById("searchInput");

  let clients = [];
  let filteredClients = [];

  // Función para mostrar mensajes de estado
  function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      border-radius: 5px;
      color: white;
      z-index: 1000;
      ${type === 'success' ? 'background-color: #4CAF50;' : 
        type === 'error' ? 'background-color: #f44336;' : 
        'background-color: #2196F3;'}
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
  }

  // Función para renderizar clientes
  function renderClients(list) {
    tableBody.innerHTML = "";
    list.forEach(c => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.correo}</td>
        <td>${c.telefono || 'N/A'}</td>
        <td>
          <button class="edit" onclick="editClient(${c.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete" onclick="deleteClient(${c.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Función para cargar clientes desde la API
  async function loadClients() {
    try {
      showMessage('Cargando clientes...', 'info');
      clients = await ApiService.ClienteService.getAll();
      filteredClients = [...clients];
      renderClients(filteredClients);
      showMessage(`${clients.length} clientes cargados`, 'success');
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      showMessage('Error al cargar clientes', 'error');
    }
  }

  // Función para crear cliente
  async function createClient(clienteData) {
    try {
      const nuevoCliente = await ApiService.ClienteService.create(clienteData);
      clients.push(nuevoCliente);
      filteredClients = [...clients];
      renderClients(filteredClients);
      showMessage('Cliente creado exitosamente', 'success');
      return nuevoCliente;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      showMessage(error.message || 'Error al crear cliente', 'error');
      throw error;
    }
  }

  // Función para editar cliente
  window.editClient = async (id) => {
    const cliente = clients.find(c => c.id === id);
    if (!cliente) return;

    // Llenar el formulario con los datos del cliente
    document.getElementById("nombre").value = cliente.nombre;
    document.getElementById("correo").value = cliente.correo;
    document.getElementById("telefono").value = cliente.telefono || '';

    // Cambiar el comportamiento del formulario para actualizar
    clientForm.dataset.editMode = 'true';
    clientForm.dataset.editId = id;
    
    modal.classList.remove("hidden");
  };

  // Función para eliminar cliente
  window.deleteClient = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      await ApiService.ClienteService.delete(id);
      clients = clients.filter(c => c.id !== id);
      filteredClients = filteredClients.filter(c => c.id !== id);
      renderClients(filteredClients);
      showMessage('Cliente eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      showMessage('Error al eliminar cliente', 'error');
    }
  };

  // Event listeners
  newClientBtn.onclick = () => {
    clientForm.reset();
    delete clientForm.dataset.editMode;
    delete clientForm.dataset.editId;
    modal.classList.remove("hidden");
  };

  cancelModalBtn.onclick = () => modal.classList.add("hidden");

  clientForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const clienteData = {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      telefono: document.getElementById("telefono").value,
    };

    try {
      if (clientForm.dataset.editMode === 'true') {
        // Modo edición
        const id = parseInt(clientForm.dataset.editId);
        await ApiService.ClienteService.update(id, clienteData);
        
        // Actualizar en la lista local
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
          clients[index] = { ...clients[index], ...clienteData };
          filteredClients = [...clients];
          renderClients(filteredClients);
        }
        
        showMessage('Cliente actualizado exitosamente', 'success');
        delete clientForm.dataset.editMode;
        delete clientForm.dataset.editId;
      } else {
        // Modo creación
        await createClient(clienteData);
      }
      
      clientForm.reset();
      modal.classList.add("hidden");
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    filteredClients = clients.filter(c => 
      c.nombre.toLowerCase().includes(term) ||
      c.correo.toLowerCase().includes(term) ||
      (c.telefono && c.telefono.includes(term))
    );
    renderClients(filteredClients);
  });

  // Cargar clientes al iniciar
  await loadClients();
});
