import { mercadoPagoPublicKey } from './config.js';

const mp = new MercadoPago(mercadoPagoPublicKey);
let preferenceId = null;

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
    // Limpia la preferencia anterior si existe
    if (preferenceId) {
        const walletContainer = document.getElementById('wallet_container');
        if (walletContainer) {
            walletContainer.innerHTML = '';
        }
        preferenceId = null;
    }

    // Lógica para crear la preferencia de Mercado Pago
    const onReady = () => {
        // Valida el pedido ANTES de crear la preferencia
        const pedidoValido = validarPedido();
        if (!pedidoValido) {
            // Si la validación falla, no hacemos nada. El alert ya se mostró.
            // Recargamos el botón para que el usuario pueda reintentar.
            initCheckout(cart); 
            return;
        }
        
        // Si la validación es exitosa, guardamos los datos y procedemos
        localStorage.setItem('pizzaClubClientName', pedidoValido.clientName);
        localStorage.setItem('pizzaClubHora', pedidoValido.horaRetiro);
        localStorage.setItem('pizzaClubMetodo', 'Mercado Pago'); // Guardamos el método

        // Llama a tu backend para crear la preferencia
        fetch('https://pizzaclub-rjeq.onrender.com/api/public/checkout/crear-preferencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart }),
        })
        .then(response => response.json())
        .then(preference => {
            preferenceId = preference.id;
            // Renderiza el botón de pago
            mp.bricks().create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
                customization: {
                    texts: {
                        valueProp: 'smart_option',
                    },
                },
            });
        })
        .catch(error => {
            console.error('Error al crear la preferencia:', error);
            alert('Hubo un problema al conectar con Mercado Pago. Inténtalo de nuevo.');
        });
    };

    // Renderiza el botón de Mercado Pago con el callback onReady
    const walletContainer = document.getElementById('wallet_container');
    if (walletContainer) {
        mp.bricks().create("wallet", "wallet_container", {
            initialization: {
                preferenceId: '__PREFERENCE_ID__', // Placeholder inicial
            },
            callbacks: {
                onReady: onReady
            }
        });
    }
}

// NUEVO: Event Listener para el botón de Pagar en Efectivo
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
        // Si la validación falla, el alert ya se mostró en la función validarPedido.
    });
}

export { initCheckout };