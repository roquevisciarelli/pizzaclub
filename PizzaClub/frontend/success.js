document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status-message');
    const spinner = document.querySelector('.spinner');
    const successIcon = document.getElementById('success-icon');
    const clientNameElement = document.getElementById('client-name-display');
    const orderDetailsElement = document.getElementById('order-details');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    // Leer datos del localStorage
    const cart = JSON.parse(localStorage.getItem('pizzaClubCart') || '[]');
    const clientName = localStorage.getItem('pizzaClubClientName') || 'Cliente';
    
    // NUEVO: Leer método de pago y horario
    const metodoPago = localStorage.getItem('pizzaClubMetodo') || 'Mercado Pago'; // Default a MP
    const horaRetiro = localStorage.getItem('pizzaClubHora') || 'No especificado';

    if (cart.length === 0 && metodoPago === 'Mercado Pago') {
        statusElement.textContent = 'No se encontró información del pedido. Es posible que hayas refrescado la página.';
        spinner.classList.add('hidden');
        return;
    }

    // Mostrar nombre y detalles
    if(spinner) spinner.classList.add('hidden');
    if(successIcon) successIcon.classList.remove('hidden');
    if(statusElement) statusElement.textContent = `¡Gracias por tu pedido, ${clientName}!`;
    if(clientNameElement) clientNameElement.textContent = 'Confirma tu pedido por WhatsApp para que empecemos a prepararlo.';

    let total = 0;
    let orderSummary = '<ul>';
    cart.forEach(item => {
        orderSummary += `<li>${item.quantity}x ${item.title} - $${(item.unit_price * item.quantity).toFixed(2)}</li>`;
        total += item.unit_price * item.quantity;
    });
    orderSummary += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
    if(orderDetailsElement) orderDetailsElement.innerHTML = orderSummary;

    // Construir el mensaje de WhatsApp
    let mensaje = `¡Hola! Soy ${clientName} y acabo de hacer un pedido en Pizza Club:\n\n`;
    cart.forEach(item => {
        mensaje += `- ${item.quantity}x ${item.title}\n`;
    });
    mensaje += `\n*Total: $${total.toFixed(2)}*`;
    
    // NUEVO: Añadir método de pago y horario al mensaje
    mensaje += `\n\n*Pago:* ${metodoPago}`;
    mensaje += `\n*Horario de retiro:* ${horaRetiro}`;
    mensaje += `\n\n_Aguarde confirmación del local para acercarse a retirar._`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5492235523600&text=${encodeURIComponent(mensaje)}`;
    if(whatsappBtn) {
        whatsappBtn.href = whatsappUrl;
        whatsappBtn.classList.remove('hidden');
    }

    // Limpiar localStorage después de armar el mensaje
    localStorage.removeItem('pizzaClubCart');
    localStorage.removeItem('pizzaClubClientName');
    localStorage.removeItem('pizzaClubMetodo');
    localStorage.removeItem('pizzaClubHora');
});