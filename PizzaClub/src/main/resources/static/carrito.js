import { initCheckout } from './checkout.js';

let cart = [];

const cartModal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const floatingCartBtn = document.getElementById('floating-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSummary = document.getElementById('cart-summary');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.getElementById('cart-count');

function saveCart() {
    localStorage.setItem('pizzaClubCart', JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('pizzaClubCart')) || [];
    renderCart();
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
        cartSummary.classList.add('hidden');
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-title">${item.title}</p>
                    <p class="cart-item-price">$${item.unit_price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-qty" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty" data-id="${item.id}" data-action="increase">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        cartSummary.classList.remove('hidden');
    }
    updateCartSummary();
    initCheckout(cart);
}

function updateCartSummary() {
    const total = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = `(${totalItems})`;
}

function agregarAlCarrito(producto) {
    const existingItem = cart.find(item => item.id === producto.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(producto);
    }
    saveCart();
    renderCart();
}

function updateQuantity(productId, action) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    if (action === 'increase') {
        cart[itemIndex].quantity++;
    } else if (action === 'decrease') {
        cart[itemIndex].quantity--;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    saveCart();
    renderCart();
}

function initCart() {
    loadCart();

    floatingCartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-qty')) {
            const productId = e.target.dataset.id;
            const action = e.target.dataset.action;
            updateQuantity(productId, action);
        }
    });
}

// Exporta las funciones que necesitan ser usadas por otros módulos
export { initCart, renderCart, agregarAlCarrito };