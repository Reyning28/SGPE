
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }


  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove("active")
      }
    }
  })


  const navLinks = document.querySelectorAll(".nav-link")
  const breadcrumbCurrent = document.querySelector(".breadcrumb-item.current")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

     
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active")
      })

      
      this.parentElement.classList.add("active")

   
      const linkText = this.querySelector("span").textContent
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = linkText
      }

     
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active")
      }

      
      showLoadingState()

      // Simulate page load
      setTimeout(() => {
        hideLoadingState()
      }, 800)
    })
  })

 
  const chartBars = document.querySelectorAll(".bar")
  chartBars.forEach((bar) => {
    bar.addEventListener("mouseenter", function () {
      this.style.transform = "scaleY(1.05)"
    })

    bar.addEventListener("mouseleave", function () {
      this.style.transform = "scaleY(1)"
    })
  })


  const actionBtns = document.querySelectorAll(".action-btn")
  actionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const icon = this.querySelector("i").className
      handleActionClick(icon)
    })
  })


  const userMenu = document.querySelector(".user-menu")
  if (userMenu) {
    userMenu.addEventListener("click", () => {
      showUserMenu()
    })
  }


  const timeBtns = document.querySelectorAll(".time-btn")
  timeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      timeBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      updateChartData(this.textContent)
    })
  })

 
  const tableRows = document.querySelectorAll(".table-row")
  tableRows.forEach((row) => {
    row.addEventListener("click", function () {
      const orderId = this.querySelector(".order-id").textContent
      showOrderDetails(orderId)
    })
  })


  const productItems = document.querySelectorAll(".product-item")
  productItems.forEach((item) => {
    item.addEventListener("click", function () {
      const productName = this.querySelector("h4").textContent
      showProductDetails(productName)
    })
  })


  const actionCards = document.querySelectorAll(".action-card")
  actionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const actionTitle = this.querySelector("h4").textContent
      handleActionCard(actionTitle)
    })
  })


  const statMenus = document.querySelectorAll(".stat-menu")
  statMenus.forEach((menu) => {
    menu.addEventListener("click", function (e) {
      e.stopPropagation()
      showStatMenu(this)
    })
  })


  const chartMenus = document.querySelectorAll(".chart-menu")
  chartMenus.forEach((menu) => {
    menu.addEventListener("click", function (e) {
      e.stopPropagation()
      showChartMenu(this)
    })
  })


  initializeCharts()


  setInterval(refreshDashboardData, 30000)


  initializeTooltips()

  // Animate stats on load
  animateStatsOnLoad()
})

// Functions
function showLoadingState() {
  const dashboardContainer = document.querySelector(".dashboard-container")
  if (dashboardContainer) {
    dashboardContainer.classList.add("loading")
  }
}

function hideLoadingState() {
  const dashboardContainer = document.querySelector(".dashboard-container")
  if (dashboardContainer) {
    dashboardContainer.classList.remove("loading")
  }
}

function performSearch(searchTerm) {
  console.log("Searching for:", searchTerm)
  // Simulate search
  showNotification(`Buscando: "${searchTerm}"`, "info")

  // Clear search after showing result
  setTimeout(() => {
    document.querySelector(".search-box input").value = ""
  }, 2000)
}

function handleActionClick(iconClass) {
  let message = ""

  if (iconClass.includes("bell")) {
    message =
      "Tienes 3 notificaciones nuevas:\n• Stock bajo en 5 productos\n• 2 nuevos pedidos\n• Factura #001 generada"
  } else if (iconClass.includes("envelope")) {
    message = "Mensajes recientes:\n• Cliente pregunta por envío\n• Proveedor confirma entrega\n• Recordatorio de pago"
  } else if (iconClass.includes("cog")) {
    message = "Configuración del sistema"
  }

  if (message) {
    showNotification(message, "info")
  }
}

function showUserMenu() {
  const options = ["Mi Perfil", "Configuración de Cuenta", "Preferencias", "Ayuda y Soporte", "Cerrar Sesión"]

  showNotification(`Menú de usuario:\n${options.map((opt) => `• ${opt}`).join("\n")}`, "info")
}

function updateChartData(period) {
  console.log("Updating chart data for period:", period)
  showNotification(`Actualizando datos para: ${period}`, "success")

  // Simulate chart update
  const charts = document.querySelectorAll("canvas")
  charts.forEach((chart) => {
    chart.style.opacity = "0.5"
    setTimeout(() => {
      chart.style.opacity = "1"
    }, 500)
  })
}

function showOrderDetails(orderId) {
  showNotification(`Ver detalles del pedido ${orderId}`, "info")
}

function showProductDetails(productName) {
  showNotification(`Ver detalles del producto: ${productName}`, "info")
}

function handleActionCard(actionTitle) {
  const actions = {
    "Agregar Producto": "Abriendo formulario para agregar producto...",
    "Nuevo Cliente": "Abriendo formulario de registro de cliente...",
    "Crear Factura": "Abriendo generador de facturas...",
    "Ver Reportes": "Cargando módulo de reportes...",
  }

  const message = actions[actionTitle] || `Ejecutando: ${actionTitle}`
  showNotification(message, "success")
}

function showStatMenu(menuElement) {
  const options = ["Ver detalles", "Exportar datos", "Configurar alertas"]
  showNotification(`Opciones:\n${options.map((opt) => `• ${opt}`).join("\n")}`, "info")
}

function showChartMenu(menuElement) {
  const options = ["Exportar gráfico", "Cambiar tipo", "Configurar"]
  showNotification(`Opciones del gráfico:\n${options.map((opt) => `• ${opt}`).join("\n")}`, "info")
}

function initializeCharts() {
  // Simulate chart initialization
  console.log("Initializing charts...")

  // Add some visual feedback for chart areas
  const chartContainers = document.querySelectorAll(".main-chart-container, .donut-chart-wrapper")
  chartContainers.forEach((container) => {
    container.style.background = "linear-gradient(45deg, #f8fafc, #e2e8f0)"
    container.style.borderRadius = "8px"
    container.style.display = "flex"
    container.style.alignItems = "center"
    container.style.justifyContent = "center"
    container.style.color = "#64748b"
    container.style.fontSize = "14px"
    container.style.fontWeight = "500"

    if (container.classList.contains("main-chart-container")) {
      container.textContent = "Gráfico de Ventas - Datos en tiempo real"
    } else {
      container.textContent = "Gráfico de Categorías"
    }
  })
}

function refreshDashboardData() {
  console.log("Refreshing dashboard data...")

  // Animate stat values
  const statValues = document.querySelectorAll(".stat-content h3")
  statValues.forEach((stat) => {
    stat.style.transform = "scale(1.05)"
    stat.style.color = "#3b82f6"

    setTimeout(() => {
      stat.style.transform = "scale(1)"
      stat.style.color = ""
    }, 300)
  })
}

function initializeTooltips() {
  // Add tooltips to action buttons
  const actionBtns = document.querySelectorAll(".action-btn")
  actionBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      const title = this.getAttribute("title")
      if (title) {
        showTooltip(this, title)
      }
    })

    btn.addEventListener("mouseleave", () => {
      hideTooltip()
    })
  })
}

function showTooltip(element, text) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = text
  tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `

  document.body.appendChild(tooltip)

  const rect = element.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px"

  setTimeout(() => {
    tooltip.style.opacity = "1"
  }, 10)

  window.currentTooltip = tooltip
}

function hideTooltip() {
  if (window.currentTooltip) {
    window.currentTooltip.remove()
    window.currentTooltip = null
  }
}

function animateStatsOnLoad() {
  const statCards = document.querySelectorAll(".stat-card")
  statCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"

    setTimeout(() => {
      card.style.transition = "all 0.5s ease"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 100)
  })
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        white-space: pre-line;
    `

  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 10)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 4000)
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export for global access
window.SGPE = {
  formatCurrency,
  formatDate,
  showNotification,
  refreshDashboardData,
}
