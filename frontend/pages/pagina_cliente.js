
document.addEventListener("DOMContentLoaded", () => {
  const clients = [
    { nombre: "david liranzo", correo: "david@empresa.com", telefono: "809-639-4567" },
    { nombre: "reyning perdomo", correo: "reyning@empresa.com", telefono: "809-987-6543" },
    { nombre: "elier moreta", correo: "elier@empresa.com", telefono: "809-456-7890" },
  ];

  const tableBody = document.getElementById("clientTableBody");
  const modal = document.getElementById("clientModal");
  const newClientBtn = document.getElementById("newClientBtn");
  const cancelModalBtn = document.getElementById("cancelModal");
  const clientForm = document.getElementById("clientForm");
  const searchInput = document.getElementById("searchInput");

  function renderClients(list) {
    tableBody.innerHTML = "";
    list.forEach(c => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.correo}</td>
        <td>${c.telefono}</td>
        <td>
          <button class="edit"><i class="fas fa-edit"></i></button>
          <button class="delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  newClientBtn.onclick = () => modal.classList.remove("hidden");
  cancelModalBtn.onclick = () => modal.classList.add("hidden");

  clientForm.onsubmit = e => {
    e.preventDefault();
    const nuevo = {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      telefono: document.getElementById("telefono").value,
    };
    clients.push(nuevo);
    renderClients(clients);
    clientForm.reset();
    modal.classList.add("hidden");
  };

  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = clients.filter(c => c.nombre.toLowerCase().includes(term));
    renderClients(filtered);
  });

  renderClients(clients);
});
