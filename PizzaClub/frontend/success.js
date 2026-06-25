document.addEventListener('DOMContentLoaded', () => {
    // 1. Recuperar datos
    const carrito = JSON.parse(localStorage.getItem('pizzaClubCarrito')) || [];
    const nombreCliente = localStorage.getItem('pizzaClubCliente') || 'Cliente';

    // Si por alguna razón llegan acá sin carrito, redirigir al index
    if (carrito.length === 0) {
        window.location.href = "index.html";
        return;
    }

    // 2. Calcular total
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // 3. Formatear mensaje
    let mensaje = `Hola, quiero realizar el siguiente pedido:\n`;
    carrito.forEach(item => {
        mensaje += `${item.cantidad}x ${item.nombre}\n`;
    });
    mensaje += `Total: $${total}\n`;
    mensaje += `Pago: Confirmado vía Mercado Pago\n`;
    mensaje += `Nombre: ${nombreCliente}\n`;
    mensaje += `Aguarde confirmación del local para acercarse a retirar`;

    // 4. Limpiar LocalStorage (ya no necesitamos el carrito ni el nombre)
    localStorage.removeItem('pizzaClubCarrito');
    localStorage.removeItem('pizzaClubCliente');

    // 5. Redirección a WhatsApp (Numero genérico temporal de prueba)
    const numeroWhatsApp = "5492235523600";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Esperar 2 segundos para que el usuario lea "Pago exitoso" y luego redirigir
    setTimeout(() => {
        window.location.href = url;
    }, 2000);
});