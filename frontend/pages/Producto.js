// Product data
const products = [
  {
    id: 1,
    name: "Smartphone Galaxy Pro",
    category: "Electrónicos",
    price: 899.99,
    originalPrice: 1099.99,
    rating: 4.5,
    reviews: 128,
    image: "https://plazavea.vteximg.com.br/arquivos/ids/30458039-418-418/imageUrl_3.jpg",
    badge: "Oferta",
    inStock: true,
  },
  {
    id: 2,
    name: "Laptop Gaming RGB",
    category: "Electrónicos",
    price: 1299.99,
    rating: 4.8,
    reviews: 89,
    image: "https://ss628.liverpool.com.mx/sm/1158337971.jpg",
    badge: "Nuevo",
    inStock: true,
  },
  {
    id: 3,
    name: "Auriculares Inalámbricos",
    category: "Audio",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.3,
    reviews: 256,
    image: "https://www.globatecrd.com/wp-content/uploads/2025/01/P9-PRO-MAX.jpg",
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: 4,
    name: "Camiseta Premium Cotton",
    category: "Ropa",
    price: 29.99,
    rating: 4.2,
    reviews: 45,
    image: "https://sc01.alicdn.com/kf/HTB1oASOdFmWBuNjSspdq6zugXXaK/222593608/HTB1oASOdFmWBuNjSspdq6zugXXaK.jpg",
    inStock: true,
  },
  {
    id: 5,
    name: "Cafetera Automática",
    category: "Hogar",
    price: 349.99,
    rating: 4.6,
    reviews: 78,
    image: "https://thumb.pccomponentes.com/w-530-530/articles/1067/10672300/2816-cecotec-power-matic-ccino-8000-touch-serie-bianca-s-cafetera-superautomatica-con-deposito-de-leche-comprar.jpg",
    badge: "Recomendado",
    inStock: false,
  },
  {
    id: 6,
    name: "Reloj Inteligente Sport",
    category: "Electrónicos",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.4,
    reviews: 167,
    image: "https://portatilshoprd.com/wp-content/uploads/2020/07/Reloj-inteligente-XS8-Max-para-hombre-y-mujer-Smartwatch-con-llamadas-Bluetooth-asistente-de-voz-Ser.png",
    badge: "Oferta",
    inStock: true,
  },
  {
    id: 7,
    name: "Mochila Ejecutiva",
    category: "Accesorios",
    price: 79.99,
    rating: 4.1,
    reviews: 34,
    image: "https://http2.mlstatic.com/D_Q_NP_2X_729575-MCO74805255897_022024-T.webp",
    inStock: true,
  },
  {
    id: 8,
    name: "Altavoz Bluetooth Portátil",
    category: "Audio",
    price: 89.99,
    rating: 4.7,
    reviews: 203,
    image: "https://img4.dhresource.com/webp/m/0x0/f3/albu/jc/h/17/788a9f0f-cc39-496f-a210-36a95a03e6d7.jpg",
    badge: "Bestseller",
    inStock: true,
  },
]

// State management
let currentView = "grid"
const currentFilters = {
  search: "",
  category: "Todos",
  sort: "featured",
  inStockOnly: false,
}
const cart = []

// DOM elements
const searchInput = document.getElementById("search-input")
const categoryFilter = document.getElementById("category-filter")
const sortFilter = document.getElementById("sort-filter")
const stockFilter = document.getElementById("stock-filter")
const filtersBtn = document.getElementById("filters-btn")
const filtersDropdown = document.getElementById("filters-dropdown")
const gridViewBtn = document.getElementById("grid-view")
const listViewBtn = document.getElementById("list-view")
const productsContainer = document.getElementById("products-container")
const emptyState = document.getElementById("empty-state")
const resultsCount = document.getElementById("results-count")
const cartCount = document.getElementById("cart-count")

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  renderProducts()
  updateCartCount()
})

// Event listeners
function setupEventListeners() {
  searchInput.addEventListener("input", handleSearch)
  categoryFilter.addEventListener("change", handleCategoryChange)
  sortFilter.addEventListener("change", handleSortChange)
  stockFilter.addEventListener("change", handleStockFilter)
  filtersBtn.addEventListener("click", toggleFiltersDropdown)
  gridViewBtn.addEventListener("click", () => setView("grid"))
  listViewBtn.addEventListener("click", () => setView("list"))

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!filtersBtn.contains(event.target) && !filtersDropdown.contains(event.target)) {
      filtersDropdown.classList.remove("show")
    }
  })
}

// Filter and search functions
function handleSearch(event) {
  currentFilters.search = event.target.value.toLowerCase()
  renderProducts()
}

function handleCategoryChange(event) {
  currentFilters.category = event.target.value
  renderProducts()
}

function handleSortChange(event) {
  currentFilters.sort = event.target.value
  renderProducts()
}

function handleStockFilter(event) {
  currentFilters.inStockOnly = event.target.checked
  renderProducts()
}

function toggleFiltersDropdown() {
  filtersDropdown.classList.toggle("show")
}

function setView(view) {
  currentView = view

  // Update button states
  gridViewBtn.classList.toggle("active", view === "grid")
  listViewBtn.classList.toggle("active", view === "list")

  // Update container class
  productsContainer.className = view === "grid" ? "products-grid" : "products-list"
}

// Product filtering and sorting
function getFilteredProducts() {
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(currentFilters.search)
    const matchesCategory = currentFilters.category === "Todos" || product.category === currentFilters.category
    const matchesStock = !currentFilters.inStockOnly || product.inStock

    return matchesSearch && matchesCategory && matchesStock
  })

  // Sort products
  filtered.sort((a, b) => {
    switch (currentFilters.sort) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return filtered
}

// Render functions
function renderProducts() {
  const filteredProducts = getFilteredProducts()

  // Update results count
  resultsCount.textContent = `Mostrando ${filteredProducts.length} de ${products.length} productos`

  // Show/hide empty state
  if (filteredProducts.length === 0) {
    productsContainer.style.display = "none"
    emptyState.style.display = "block"
    return
  } else {
    productsContainer.style.display = "grid"
    emptyState.style.display = "none"
  }

  // Render product cards
  productsContainer.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")

  // Add event listeners to new buttons
  addProductEventListeners()
}

function createProductCard(product) {
  const badgeClass = getBadgeClass(product.badge)
  const stars = createStarsHTML(product.rating)

  return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ""}
                <button class="favorite-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
                ${!product.inStock ? '<div class="out-of-stock-overlay">Agotado</div>' : ""}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}" ${!product.inStock ? "disabled" : ""}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? "Agregar al Carrito" : "Agotado"}
                </button>
            </div>
        </div>
    `
}

function getBadgeClass(badge) {
  switch (badge) {
    case "Oferta":
      return "badge-offer"
    case "Nuevo":
      return "badge-new"
    case "Bestseller":
      return "badge-bestseller"
    case "Recomendado":
      return "badge-recommended"
    default:
      return ""
  }
}

function createStarsHTML(rating) {
  let starsHTML = ""
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating)
    starsHTML += `<i class="fas fa-star star ${filled ? "filled" : ""}"></i>`
  }
  return starsHTML
}

function addProductEventListeners() {
  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      addToCart(productId)
    })
  })

  // Favorite buttons
  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      toggleFavorite(productId)
    })
  })
}

// Cart functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (product && product.inStock) {
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    updateCartCount()

    // Show feedback
    showNotification(`${product.name} agregado al carrito`)
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

function toggleFavorite(productId) {
  const button = document.querySelector(`[data-product-id="${productId}"].favorite-btn`)
  const icon = button.querySelector("i")

  if (icon.classList.contains("far")) {
    icon.classList.remove("far")
    icon.classList.add("fas")
    showNotification("Producto agregado a favoritos")
  } else {
    icon.classList.remove("fas")
    icon.classList.add("far")
    showNotification("Producto removido de favoritos")
  }
}

// Utility functions
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `
  notification.textContent = message

  // Add animation styles
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `
  document.head.appendChild(style)

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove()
    style.remove()
  }, 3000)
}
