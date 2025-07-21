// ===== facturacion.js =====
document.addEventListener("DOMContentLoaded", () => {
  const facturas = [
    {
      numero: "F-00123",
      cliente: "Juan Pérez",
      fecha: "2025-07-21",
      total: "$5,200.00",
      estado: "Pagada"
    },
    {
      numero: "F-00124",
      cliente: "Ana Gómez",
      fecha: "2025-07-20",
      total: "$3,100.00",
      estado: "Pendiente"
    }
  ];

  const tbody = document.querySelector("tbody");

  function renderFacturas() {
    tbody.innerHTML = "";
    facturas.forEach(f => {
      const tr = document.createElement("tr");
      const estadoColor = f.estado === "Pagada" ? "green" : "orange";
      tr.innerHTML = `
        <td>${f.numero}</td>
        <td>${f.cliente}</td>
        <td>${f.fecha}</td>
        <td>${f.total}</td>
        <td><span style="color:${estadoColor};font-weight:bold">${f.estado}</span></td>
        <td>
          <button class="edit"><i class="fas fa-eye"></i></button>
          <button class="delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderFacturas();
});
