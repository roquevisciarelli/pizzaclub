// Estado global del carrito
let carrito = JSON.parse(localStorage.getItem('pizzaClubCarrito')) || [];

// Elementos DOM
const cartModal = document.getElementById('cart-modal');
const floatingBtn = document.getElementById('floating-cart-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSummary = document.getElementById('cart-summary');
const cartTotalPrice = document.getElementById('cart-total-price');

// Formateador de moneda
const formatoMoneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorBtn();
    
    // Eventos del modal
    floatingBtn.addEventListener('click', () => {
        renderizarCarrito();
        cartModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    // Cerrar clickeando afuera
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.add('hidden');
    });
});

// Funciones Core
function guardarCarrito() {
    localStorage.setItem('pizzaClubCarrito', JSON.stringify(carrito));
    actualizarContadorBtn();
}

function actualizarContadorBtn() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.textContent = `(${totalItems})`;
}

// Exportada para ser usada por app.js
window.agregarAlCarrito = function(productoDom) {
    const id = parseInt(productoDom.dataset.id);
    const nombre = productoDom.querySelector('.producto-nombre').textContent;
    // Extraer número limpio (ej: "$1.500,50" -> 1500.50)
    const precioTexto = productoDom.querySelector('.producto-precio').textContent;
    const precio = parseFloat(precioTexto.replace(/[^0-9,-]+/g,"").replace(",", "."));

    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    guardarCarrito();
}

function cambiarCantidad(id, delta) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(i => i.id !== id);
    }
    
    guardarCarrito();
    renderizarCarrito();
}

function calcularTotal() {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

function renderizarCarrito() {
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">El carrito está vacío</div>';
        cartSummary.classList.add('hidden');
        return;
    }

    cartSummary.classList.remove('hidden');
    
    // Render items
    cartItemsContainer.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.nombre}</div>
                <div class="cart-item-price">${formatoMoneda.format(item.precio)} c/u</div>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    // Update total
    cartTotalPrice.textContent = formatoMoneda.format(calcularTotal());
}