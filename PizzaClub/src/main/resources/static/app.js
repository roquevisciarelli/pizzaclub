import { initCart, renderCart, agregarAlCarrito } from './carrito.js';

const API_BASE_URL = '';
const menuContainer = document.getElementById('menu-container');

// Función para renderizar los productos y asignar eventos
function renderMenu(productos) {
    menuContainer.innerHTML = ''; // Limpiar estado de carga

    const categorias = {};
    productos.forEach(p => {
        if (!categorias[p.categoriaNombre]) {
            categorias[p.categoriaNombre] = [];
        }
        categorias[p.categoriaNombre].push(p);
    });

    for (const categoria in categorias) {
        const section = document.createElement('section');
        section.className = 'categoria-section';

        const titulo = document.createElement('h2');
        titulo.className = 'categoria-titulo';
        titulo.textContent = categoria;
        section.appendChild(titulo);

        categorias[categoria].forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            const descHtml = producto.descripcion
                ? `<p class="producto-desc">${producto.descripcion}</p>`
                : '';

            card.innerHTML = `
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    ${descHtml}
                    <p class="producto-precio">$${producto.precio.toFixed(2)}</p>
                </div>
                <div class="producto-accion">
                    <button class="btn-agregar" 
                            data-id="${producto.id}" 
                            data-nombre="${producto.nombre}" 
                            data-precio="${producto.precio}">+</button>
                </div>
            `;
            section.appendChild(card);
        });
        menuContainer.appendChild(section);
    }
}

// Función principal para cargar y mostrar el menú
async function loadMenu() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/public/menu/productos`);
        if (!response.ok) throw new Error('Error al cargar los productos.');
        
        const productos = await response.json();
        renderMenu(productos);

    } catch (error) {
        menuContainer.innerHTML = `<div class="error-state">${error.message}</div>`;
        console.error(error);
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    initCart(); // Inicializa la lógica del carrito (botones de modal, etc.)

    // DELEGACIÓN DE EVENTOS: Escuchar clics en un contenedor padre
    menuContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-agregar')) {
            const boton = event.target;
            const producto = {
                id: boton.dataset.id,
                title: boton.dataset.nombre,
                unit_price: parseFloat(boton.dataset.precio),
                quantity: 1,
            };
            agregarAlCarrito(producto);
        }
    });
});