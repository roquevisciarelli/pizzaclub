const btnPagarMp = document.getElementById('btn-pagar-mp');
const inputNombre = document.getElementById('nombreCliente');

btnPagarMp.addEventListener('click', async () => {
    // 1. Validaciones locales
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert("Por favor, ingresa tu nombre para el retiro del pedido.");
        inputNombre.focus();
        return;
    }

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Deshabilitar botón durante proceso
    btnPagarMp.disabled = true;
    btnPagarMp.textContent = "Procesando...";

    try {
        // 2. Validar Horario
        const horarioRes = await fetch(`${API_BASE_URL}/checkout/validar-horario`);
        const horarioData = await horarioRes.json();

        if (!horarioData.abierto) {
            alert(`Lo sentimos: ${horarioData.mensaje}`);
            btnPagarMp.disabled = false;
            btnPagarMp.textContent = "Pagar con Mercado Pago";
            return;
        }

        // Guardar nombre en localStorage temporalmente para usarlo en el success
        localStorage.setItem('pizzaClubCliente', nombre);

        // 3. Crear DTO para el backend
        const pedidoDto = {
            items: carrito.map(item => ({
                titulo: item.nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            }))
        };

        // 4. Crear Preferencia en MP
        const mpRes = await fetch(`${API_BASE_URL}/checkout/crear-preferencia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoDto)
        });

        if (!mpRes.ok) {
            throw new Error(await mpRes.text());
        }

        const mpData = await mpRes.json();
        
        // 5. Redirigir a la pasarela (Utilizando la URL estándar de MP con el ID)
        // Alternativamente se podría abrir el SDK inyectado, pero la redirección directa es más robusta en mobile
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${mpData.preferenceId}`;

    } catch (error) {
        console.error("Error en checkout:", error);
        alert("Hubo un error al procesar el pago. Por favor intenta de nuevo.");
        btnPagarMp.disabled = false;
        btnPagarMp.textContent = "Pagar con Mercado Pago";
    }
});