import { mercadoPagoPublicKey } from './config.js';

const mp = new MercadoPago(mercadoPagoPublicKey);

// Función de validación reutilizable
function validarPedido() {
    const clientName = document.getElementById('client-name').value.trim();
    const horaRetiroInput = document.getElementById('horaRetiro');
    const horaRetiro = horaRetiroInput.value;

    if (!clientName) {
        alert('Por favor, ingresa tu nombre para poder identificarte.');
        return null;
    }

    if (!horaRetiro) {
        alert('Por favor, selecciona un horario de retiro.');
        return null;
    }

    const [hora, minutos] = horaRetiro.split(':').map(Number);
    const fechaSeleccionada = new Date();
    fechaSeleccionada.setHours(hora, minutos, 0, 0);

    const horaMinima = new Date();
    horaMinima.setHours(10, 0, 0, 0); // 10:00 AM

    const horaMaxima = new Date();
    horaMaxima.setHours(22, 30, 0, 0); // 22:30 PM

    if (fechaSeleccionada < horaMinima || fechaSeleccionada > horaMaxima) {
        alert('El horario de retiro debe ser entre las 10:00 AM y las 22:30 PM.');
        return null;
    }

    // Si todo es válido, devuelve los datos
    return { clientName, horaRetiro };
}

async function initCheckout(cart) {
    const walletContainer = document.getElementById('wallet_container');
    if (!walletContainer) return;

    // Limpiamos el contenedor por si había botones previos
    walletContainer.innerHTML = '';

    // Creamos nuestro propio botón previo para validar antes de llamar a MP
    const btnPrepararPago = document.createElement('button');
    btnPrepararPago.textContent = 'Pagar con Mercado Pago';
    btnPrepararPago.className = 'btn-primary-mp';
    walletContainer.appendChild(btnPrepararPago);

    btnPrepararPago.addEventListener('click', async () => {
        const pedidoValido = validarPedido();
        if (!pedidoValido) {
            return; // Se detiene aquí, el alert ya se mostró en validarPedido
        }

        // Si es válido, deshabilitamos el botón y mostramos "cargando"
        btnPrepararPago.disabled = true;
        btnPrepararPago.textContent = 'Cargando Mercado Pago...';

        localStorage.setItem('pizzaClubClientName', pedidoValido.clientName);
        localStorage.setItem('pizzaClubHora', pedidoValido.horaRetiro);
        localStorage.setItem('pizzaClubMetodo', 'Mercado Pago');

        try {
            const response = await fetch('https://pizzaclub-rjeq.onrender.com/api/public/checkout/crear-preferencia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const preference = await response.json();

            // Limpiamos nuestro botón temporal y renderizamos el Brick real de Mercado Pago
            walletContainer.innerHTML = '';

            mp.bricks().create("wallet", "wallet_container", {
                initialization: {
                    // BUG CORREGIDO: El backend devuelve 'preferenceId', no 'id'
                    preferenceId: preference.preferenceId,
                },
                customization: {
                    texts: {
                        valueProp: 'smart_option',
                    },
                },
            });

        } catch (error) {
            console.error('Error al crear la preferencia:', error);
            alert('Hubo un problema al conectar con Mercado Pago. Inténtalo de nuevo.');

            // Si falla, restauramos el botón
            btnPrepararPago.disabled = false;
            btnPrepararPago.textContent = 'Pagar con Mercado Pago';
        }
    });
}

// Event Listener para el botón de Pagar en Efectivo
const btnPagarEfectivo = document.getElementById('btn-pagar-efectivo');
if (btnPagarEfectivo) {
    btnPagarEfectivo.addEventListener('click', () => {
        const pedidoValido = validarPedido();

        if (pedidoValido) {
            // Si la validación es exitosa, guardamos los datos
            localStorage.setItem('pizzaClubClientName', pedidoValido.clientName);
            localStorage.setItem('pizzaClubHora', pedidoValido.horaRetiro);
            localStorage.setItem('pizzaClubMetodo', 'Efectivo'); // Guardamos el método

            // Guardamos el carrito actual antes de redirigir
            const currentCart = JSON.parse(localStorage.getItem('pizzaClubCart') || '[]');
            if (currentCart.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            // Redirigimos directamente a la página de éxito
            window.location.href = 'success.html';
        }
    });
}

export { initCheckout };