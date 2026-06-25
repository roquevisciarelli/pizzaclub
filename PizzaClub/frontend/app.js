const API_BASE_URL = 'https://pizzaclub-rjeq.onrender.com/api/public';
const menuContainer = document.getElementById('menu-container');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
});

// Funciones de obtención de datos
async function cargarMenu() {
    try {
        // Ejecutar ambas peticiones en paralelo
        const [categoriasRes, productosRes] = await Promise.all([
            fetch(`${API_BASE_URL}/menu/categorias`),
            fetch(`${API_BASE_URL}/menu/productos`)
        ]);

        if (!categoriasRes.ok || !productosRes.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const categorias = await categoriasRes.json();
        const productos = await productosRes.json();

        renderizarMenu(categorias, productos);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
        mostrarError('No se pudo cargar el menú. Por favor, intenta nuevamente más tarde.');
    }
}

// Funciones de renderizado
function renderizarMenu(categorias, productos) {
    if (categorias.length === 0 || productos.length === 0) {
        menuContainer.innerHTML = '<div class="loading-state">El menú no está disponible en este momento.</div>';
        return;
    }

    menuContainer.innerHTML = ''; // Limpiar estado de carga

    categorias.forEach(categoria => {
        // Filtrar productos que pertenecen a esta categoría
        const productosCategoria = productos.filter(p => p.categoriaId === categoria.id);
        
        // Si la categoría no tiene productos disponibles, no la mostramos
        if (productosCategoria.length === 0) return;

        // Crear contenedor de sección para la categoría
        const sectionHTML = `
            <section class="categoria-section" id="categoria-${categoria.id}">
                <h2 class="categoria-titulo">${categoria.nombre}</h2>
                <div class="productos-lista">
                    ${productosCategoria.map(prod => generarProductoHTML(prod)).join('')}
                </div>
            </section>
        `;

        menuContainer.insertAdjacentHTML('beforeend', sectionHTML);
    });

    // Agregar event listeners a los botones generados
    asignarEventosAgregar();
}

function generarProductoHTML(producto) {
    // Formatear precio (ej: 1500.5 -> $1.500,50)
    const precioFormateado = new Intl.NumberFormat('es-AR', { 
        style: 'currency', 
        currency: 'ARS' 
    }).format(producto.precio);

    // Determinar si hay imagen o poner placeholder
    const imagenHTML = producto.imagenUrl 
        ? `<img src="${producto.imagenUrl}" alt="${producto.nombre}" class="producto-img" loading="lazy">`
        : `<div class="img-placeholder">Sin foto</div>`;

    return `
        <article class="producto-card" data-id="${producto.id}">
            <div class="producto-img-container">
                ${imagenHTML}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-desc">${producto.descripcion || ''}</p>
                <span class="producto-precio">${precioFormateado}</span>
            </div>
            <div class="producto-accion">
                <button class="btn-agregar" aria-label="Agregar ${producto.nombre}">+</button>
            </div>
        </article>
    `;
}

function mostrarError(mensaje) {
    menuContainer.innerHTML = `<div class="error-state">❌ ${mensaje}</div>`;
}

function asignarEventosAgregar() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const articulo = e.currentTarget.closest('.producto-card');
            
            // Llamar a la función del carrito.js
            window.agregarAlCarrito(articulo);
            
            // Efecto visual
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓';
            btn.style.backgroundColor = 'var(--color-rojo)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = 'var(--color-verde)';
            }, 500);
        });
    });
}