import { mercadoPagoPublicKey } from './config.js';

const API_BASE_URL = '';

const mp = new MercadoPago(mercadoPagoPublicKey);

// RF08: martes cerrado (getDay: 0=Dom ... 6=Sáb)
const DIAS_CERRADO = [2];

function validarPedido() {
    const clientName = document.getElementById('client-name').value.trim();
    const horaRetiro = document.getElementById('horaRetiro').value;

    const radioEntrega = document.querySelector('input[name="metodo-entrega"]:checked');
    const entrega = radioEntrega ? radioEntrega.value : 'Retiro';
    const direccionInput = document.getElementById('client-direccion');
    const direccion = direccionInput ? direccionInput.value.trim() : '';

    if (!clientName) {
        alert('Por favor, ingresa tu nombre para poder identificarte.');
        return null;
    }

    if (entrega === 'Delivery' && !direccion) {
        alert('Seleccionaste Delivery. Por favor, ingresá tu dirección de entrega.');
        return null;
    }

    if (entrega === 'Delivery') {
        // Delivery: no requiere horario del cliente
        const horaDelivery = "A coordinar";
        return { clientName, horaRetiro: horaDelivery, entrega, direccion };
    }

    if (!horaRetiro) {
        alert('Por favor, selecciona un horario.');
        return null;
    }

    if (DIAS_CERRADO.includes(new Date().getDay())) {
        alert('Estamos cerrados los martes. Por favor, intentá otro día.');
        return null;
    }

    const [hora, minutos] = horaRetiro.split(':').map(Number);
    const fechaSeleccionada = new Date();
    fechaSeleccionada.setHours(hora, minutos, 0, 0);

    const horaMinima = new Date();
    horaMinima.setHours(10, 0, 0, 0);
    const horaMaxima = new Date();
    horaMaxima.setHours(23, 0, 0, 0);

    if (fechaSeleccionada < horaMinima || fechaSeleccionada > horaMaxima) {
        alert('El horario debe estar entre las 10:00 y las 23:00 hs.');
        return null;
    }

    return { clientName, horaRetiro, entrega, direccion };
}

// Toggle visual: muestra/oculta dirección y campo de horario
function initEntregaToggle() {
    const direccionField = document.getElementById('direccion-field');
    const horaField = document.getElementById('hora-field');
    const horaLabel = document.getElementById('hora-label');
    if (!direccionField || !horaField || !horaLabel) return;

    document.querySelectorAll('input[name="metodo-entrega"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (!radio.checked) return;
            if (radio.value === 'Delivery') {
                direccionField.classList.remove('hidden');
                horaField.classList.add('hidden');
            } else {
                direccionField.classList.add('hidden');
                horaField.classList.remove('hidden');
            }
        });
    });
}

function guardarDatosPedido(pedidoValido, metodo) {
    localStorage.setItem('pizzaClubClientName', pedidoValido.clientName);
    localStorage.setItem('pizzaClubHora', pedidoValido.horaRetiro);
    localStorage.setItem('pizzaClubMetodo', metodo);
    localStorage.setItem('pizzaClubEntrega', pedidoValido.entrega);
    if (pedidoValido.entrega === 'Delivery') {
        localStorage.setItem('pizzaClubDireccion', pedidoValido.direccion);
    } else {
        localStorage.removeItem('pizzaClubDireccion');
    }
}

async function initCheckout(cart) {
    const walletContainer = document.getElementById('wallet_container');
    if (!walletContainer) return;

    walletContainer.innerHTML = '';

    const btnPrepararPago = document.createElement('button');
    btnPrepararPago.textContent = 'Pagar con Mercado Pago';
    btnPrepararPago.className = 'btn-primary-mp';
    walletContainer.appendChild(btnPrepararPago);

    btnPrepararPago.addEventListener('click', async () => {
        const pedidoValido = validarPedido();
        if (!pedidoValido) return;

        if (!cart || cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        btnPrepararPago.disabled = true;
        btnPrepararPago.textContent = 'Cargando Mercado Pago...';

        guardarDatosPedido(pedidoValido, 'Mercado Pago');

        try {
            const response = await fetch(`${API_BASE_URL}/api/public/checkout/crear-preferencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const preference = await response.json();

            walletContainer.innerHTML = '';
            mp.bricks().create('wallet', 'wallet_container', {
                initialization: { preferenceId: preference.preferenceId },
                customization: { texts: { valueProp: 'smart_option' } },
            });

        } catch (error) {
            console.error('Error al crear la preferencia:', error);
            alert(error.message || 'Hubo un problema al conectar con Mercado Pago. Inténtalo de nuevo.');
            btnPrepararPago.disabled = false;
            btnPrepararPago.textContent = 'Pagar con Mercado Pago';
        }
    });

    // Botón Efectivo: se enlaza una sola vez (el nodo es estático)
    const btnPagarEfectivo = document.getElementById('btn-pagar-efectivo');
    if (btnPagarEfectivo && !btnPagarEfectivo.dataset.bound) {
        btnPagarEfectivo.dataset.bound = 'true';
        btnPagarEfectivo.addEventListener('click', () => {
            const pedidoValido = validarPedido();
            if (!pedidoValido) return;

            if (!cart || cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            guardarDatosPedido(pedidoValido, 'Efectivo');
            window.location.href = 'success.html';
        });
    }
}

// Los módulos son defer → DOM listo al ejecutarse
initEntregaToggle();

export { initCheckout, validarPedido };