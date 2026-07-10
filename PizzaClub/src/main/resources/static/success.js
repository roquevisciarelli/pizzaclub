document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status-message');
    const spinner = document.querySelector('.spinner');
    const successIcon = document.getElementById('success-icon');
    const clientNameElement = document.getElementById('client-name-display');
    const orderDetailsElement = document.getElementById('order-details');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    const cart = JSON.parse(localStorage.getItem('pizzaClubCart') || '[]');
    const clientName = localStorage.getItem('pizzaClubClientName') || 'Cliente';
    const metodoPago = localStorage.getItem('pizzaClubMetodo') || 'Mercado Pago';
    const horaRetiro = localStorage.getItem('pizzaClubHora') || 'No especificado';
    const entrega = localStorage.getItem('pizzaClubEntrega') || 'Retiro';
    const direccion = localStorage.getItem('pizzaClubDireccion') || '';

    if (cart.length === 0 && metodoPago === 'Mercado Pago') {
        statusElement.textContent = 'No se encontró información del pedido. Es posible que hayas refrescado la página.';
        spinner.classList.add('hidden');
        return;
    }

    if (spinner) spinner.classList.add('hidden');
    if (successIcon) successIcon.classList.remove('hidden');
    if (statusElement) statusElement.textContent = `¡Gracias por tu pedido, ${clientName}!`;
    if (clientNameElement) clientNameElement.textContent = 'Confirma tu pedido por WhatsApp para que empecemos a prepararlo.';

    // Construcción segura del resumen (sin innerHTML con datos externos → evita XSS)
    let total = 0;
    const ul = document.createElement('ul');
    cart.forEach(item => {
        const li = document.createElement('li');
        const subtotal = item.unit_price * item.quantity;
        li.textContent = `${item.quantity}x ${item.title} - $${subtotal.toFixed(2)}`;
        ul.appendChild(li);
        total += subtotal;
    });

    if (orderDetailsElement) {
        orderDetailsElement.innerHTML = '';
        orderDetailsElement.appendChild(ul);
        const totalP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `Total: $${total.toFixed(2)}`;
        totalP.appendChild(strong);
        orderDetailsElement.appendChild(totalP);
    }

    // Mensaje de WhatsApp
    let mensaje = `¡Hola! Soy ${clientName} y acabo de hacer un pedido en Pizza Club:\n\n`;
    cart.forEach(item => {
        mensaje += `- ${item.quantity}x ${item.title}\n`;
    });
    mensaje += `\n*Total: $${total.toFixed(2)}*`;
    mensaje += `\n\n*Pago:* ${metodoPago}`;

    if (entrega === 'Delivery') {
        mensaje += `\n*Entrega:* Delivery`;
        mensaje += `\n*Dirección:* ${direccion || 'No especificada'}`;
        mensaje += `\n*Horario de entrega:* ${horaRetiro}`;
    } else {
        mensaje += `\n*Entrega:* Retiro por el local`;
        mensaje += `\n*Horario de retiro:* ${horaRetiro}`;
    }

    // Frase de contingencia obligatoria (RF07)
    mensaje += `\n\n_Aguarde confirmación del local para acercarse a retirar._`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5492235523600&text=${encodeURIComponent(mensaje)}`;
    if (whatsappBtn) {
        whatsappBtn.href = whatsappUrl;
        whatsappBtn.classList.remove('hidden');
    }

    // Limpieza
    localStorage.removeItem('pizzaClubCart');
    localStorage.removeItem('pizzaClubClientName');
    localStorage.removeItem('pizzaClubMetodo');
    localStorage.removeItem('pizzaClubHora');
    localStorage.removeItem('pizzaClubEntrega');
    localStorage.removeItem('pizzaClubDireccion');
});