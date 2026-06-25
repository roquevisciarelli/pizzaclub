document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://pizzaclub-rjeq.onrender.com';

    // Elementos del DOM
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const categoriesTableBody = document.getElementById('categories-table-body');
    const productsTableBody = document.getElementById('products-table-body');

    // Modales y formularios
    const categoryModal = document.getElementById('category-modal');
    const productModal = document.getElementById('product-modal');
    const categoryForm = document.getElementById('category-form');
    const productForm = document.getElementById('product-form');

    const addCategoryBtn = document.getElementById('add-category-btn');
    const addProductBtn = document.getElementById('add-product-btn');

    // --- AUTENTICACIÓN ---

    const getToken = () => localStorage.getItem('jwt_token');
    const setToken = (token) => localStorage.setItem('jwt_token', token);
    const removeToken = () => localStorage.removeItem('jwt_token');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginError.textContent = '';

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Usuario o contraseña incorrectos.');
            }

            const data = await response.json();
            setToken(data.token);
            showDashboard();
        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    logoutBtn.addEventListener('click', () => {
        removeToken();
        showLogin();
    });

    async function checkAuth() {
        const token = getToken();
        if (!token) {
            showLogin();
            return;
        }
        // Intenta cargar datos para validar el token
        try {
            await fetchWithAuth('/api/admin/categorias');
            showDashboard();
        } catch (error) {
            console.error('Token inválido o expirado.', error);
            removeToken();
            showLogin();
        }
    }

    function showLogin() {
        loginContainer.style.display = 'block';
        dashboardContainer.style.display = 'none';
    }

    function showDashboard() {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        loadInitialData();
    }

    // --- LÓGICA DEL DASHBOARD ---

    function loadInitialData() {
        loadCategories();
        loadProducts();
    }

    // Pestañas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
        });
    });

    // Helper para peticiones autenticadas
    async function fetchWithAuth(endpoint, options = {}) {
        const token = getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
            throw new Error('Acceso no autorizado. Por favor, inicie sesión de nuevo.');
        }
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error en la petición: ${errorData}`);
        }
        
        // Si no hay contenido (ej. en un DELETE), no intentes parsear JSON
        if (response.status === 204) {
            return null;
        }
        
        return response.json();
    }

    // --- GESTIÓN DE CATEGORÍAS ---

    async function loadCategories() {
        try {
            const categories = await fetchWithAuth('/api/admin/categorias');
            categoriesTableBody.innerHTML = '';
            categories.forEach(cat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cat.id}</td>
                    <td>${cat.nombre}</td>
                    <td>${cat.activo ? 'Sí' : 'No'}</td>
                    <td><button class="btn-edit" data-id="${cat.id}">Editar</button></td>
                `;
                categoriesTableBody.appendChild(row);
            });
            // Añadir listeners a los nuevos botones de editar
            document.querySelectorAll('#categories-table-body .btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => handleEditCategory(e.target.dataset.id));
            });
        } catch (error) {
            alert(`Error al cargar categorías: ${error.message}`);
        }
    }

    addCategoryBtn.addEventListener('click', () => {
        categoryForm.reset();
        document.getElementById('category-id').value = '';
        document.getElementById('category-modal-title').textContent = 'Nueva Categoría';
        categoryModal.style.display = 'block';
    });

    async function handleEditCategory(id) {
        const category = (await fetchWithAuth('/api/admin/categorias')).find(c => c.id == id);
        if (category) {
            document.getElementById('category-id').value = category.id;
            document.getElementById('category-name').value = category.nombre;
            document.getElementById('category-active').checked = category.activo;
            document.getElementById('category-modal-title').textContent = 'Editar Categoría';
            categoryModal.style.display = 'block';
        }
    }

    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('category-id').value;
        const data = {
            nombre: document.getElementById('category-name').value,
            activo: document.getElementById('category-active').checked,
        };

        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `/api/admin/categorias/${id}` : '/api/admin/categorias';

        try {
            await fetchWithAuth(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            closeModal(categoryModal);
            loadCategories();
        } catch (error) {
            alert(`Error al guardar categoría: ${error.message}`);
        }
    });

    // --- GESTIÓN DE PRODUCTOS ---

    async function loadProducts() {
        try {
            const products = await fetchWithAuth('/api/admin/productos');
            productsTableBody.innerHTML = '';
            products.forEach(prod => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prod.id}</td>
                    <td><img src="${prod.imagenUrl}" alt="${prod.nombre}" width="50"></td>
                    <td>${prod.nombre}</td>
                    <td>$${prod.precio.toFixed(2)}</td>
                    <td>${prod.categoriaNombre || 'N/A'}</td>
                    <td>${prod.disponible ? 'Sí' : 'No'}</td>
                    <td><button class="btn-edit" data-id="${prod.id}">Editar</button></td>
                `;
                productsTableBody.appendChild(row);
            });
            // Añadir listeners a los nuevos botones de editar
            document.querySelectorAll('#products-table-body .btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => handleEditProduct(e.target.dataset.id));
            });
        } catch (error) {
            alert(`Error al cargar productos: ${error.message}`);
        }
    }
    
    async function populateCategoryDropdown() {
        const categories = await fetchWithAuth('/api/public/menu/categorias');
        const select = document.getElementById('product-category');
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        categories.filter(c => c.activo).forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });
    }

    addProductBtn.addEventListener('click', async () => {
        productForm.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('product-modal-title').textContent = 'Nuevo Producto';
        await populateCategoryDropdown();
        productModal.style.display = 'block';
    });

    async function handleEditProduct(id) {
        const product = (await fetchWithAuth('/api/admin/productos')).find(p => p.id == id);
        if (product) {
            await populateCategoryDropdown();
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.nombre;
            document.getElementById('product-description').value = product.descripcion;
            document.getElementById('product-price').value = product.precio;
            document.getElementById('product-category').value = product.categoriaId;
            document.getElementById('product-available').checked = product.disponible;
            document.getElementById('product-modal-title').textContent = 'Editar Producto';
            productModal.style.display = 'block';
        }
    }

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        
        // CRÍTICO: Usar FormData para multipart/form-data
        const formData = new FormData();
        formData.append('nombre', document.getElementById('product-name').value);
        formData.append('descripcion', document.getElementById('product-description').value);
        formData.append('precio', parseFloat(document.getElementById('product-price').value));
        formData.append('categoriaId', parseInt(document.getElementById('product-category').value));
        formData.append('disponible', document.getElementById('product-available').checked);
        
        const imageFile = document.getElementById('product-image').files[0];
        if (imageFile) {
            formData.append('imagen', imageFile);
        }

        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `/api/admin/productos/${id}` : '/api/admin/productos';

        try {
            // Para FormData, no se establece el 'Content-Type'. El navegador lo hace.
            await fetchWithAuth(endpoint, {
                method,
                body: formData,
            });
            closeModal(productModal);
            loadProducts();
        } catch (error) {
            alert(`Error al guardar producto: ${error.message}`);
        }
    });

    // --- LÓGICA DE MODALES ---
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    document.querySelectorAll('.modal .close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // --- INICIALIZACIÓN ---
    checkAuth();
});