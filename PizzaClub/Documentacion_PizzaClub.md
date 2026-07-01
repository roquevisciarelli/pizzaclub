1\. Documento de Requisitos Funcionales (RF)

RF01: El sistema debe mostrar un catálogo de productos agrupados por categorías.



RF02: El sistema debe permitir a los clientes invitados agregar productos a un carrito de compras.



RF03: El sistema debe calcular el total del pedido de forma dinámica.



RF04: El sistema debe requerir que el cliente seleccione explícitamente la opción "Retiro por el local".



RF05: El sistema debe integrar la pasarela de Mercado Pago para procesar cobros en línea.



RF06: Tras un pago exitoso en Mercado Pago, el sistema debe redirigir al cliente a una URL de éxito que dispare automáticamente un mensaje a un número de WhatsApp estándar.



RF07: El mensaje de WhatsApp debe contener: Nombre, Pedido detallado, Total, Método de pago, y la frase de contingencia: "Aguarde confirmación del local para acercarse a retirar".



RF08: El sistema debe bloquear la posibilidad de realizar pedidos fuera del horario comercial (Miércoles a Lunes de 10 a 23 hs).



RF09: El sistema debe contar con un panel de administración protegido por login.



RF10: El administrador debe poder crear, editar y eliminar productos y categorías.



2\. Documento de Requisitos No Funcionales (RNF)

RNF01 (Tecnología): Backend en Java 21, Spring Boot (Web, Data JPA, Security), Lombok. Frontend en HTML, CSS, JS puro.



RNF02 (Base de Datos): MySQL.



RNF03 (Seguridad): Autenticación mediante JWT para los endpoints de administración. Contraseñas encriptadas con BCrypt.



RNF04 (Rendimiento): Almacenamiento de imágenes mediante Cloudinary (o similar) para optimizar la carga.



RNF05 (Diseño): Paleta de colores estricta: Verde (#005C34), Dorado (#FDD27C), Crema (#FFF1C4), Rojo (#ED3237).



RNF06 (Usabilidad): Diseño Mobile First, menú en formato de lista vertical.



3\. Historias de Usuario

HU01: Como cliente, quiero ver el menú organizado por categorías haciendo scroll vertical para encontrar lo que busco rápidamente.



HU02: Como cliente, quiero poder pagar mi pedido con Mercado Pago desde la web para no tener que transferir dinero manualmente.



HU03: Como cliente, quiero que al finalizar mi compra se abra mi WhatsApp con el pedido redactado para enviarlo al local sin tener que escribirlo yo.



HU04: Como administrador, quiero acceder a un panel privado para cargar nuevos productos y fotos, manteniendo el menú actualizado.



4\. Casos de Uso Principales

CU01 - Realizar Pedido: El cliente selecciona productos -> Va al carrito -> Ingresa su nombre -> Paga en Mercado Pago -> Retorna a la web -> Se abre WhatsApp.



CU02 - Gestión de Menú: Admin inicia sesión -> Va al dashboard -> Selecciona "Nuevo Producto" -> Ingresa datos y foto -> Guarda (se actualiza la BDD y la vista del cliente).



5\. Modelo de Datos y Diagrama de Entidades

Los identificadores principales de todas las tablas se definirán con el tipo de dato Integer para mantener la consistencia y optimización del modelo.



Entidad Admin: Integer id, String username, String password\_hash.



Entidad Categoria: Integer id, String nombre, Boolean activo.



Entidad Producto: Integer id, String nombre, String descripcion, Double precio, String imagen\_url, Integer categoria\_id, Boolean disponible.



6\. Arquitectura del Sistema

Frontend: Aplicación estática (HTML/CSS/JS) consumiendo APIs RESTful. Alojada en Vercel.



Backend: Spring Boot proveyendo APIs RESTful. Empaquetado como .jar. Alojado en Render o Railway.



Capa de Datos: Spring Data JPA conectándose a base de datos MySQL alojada en Aiven.



Servicios Externos: API de Mercado Pago (Checkout Pro), WhatsApp (Deep linking mediante wa.me).



7\. Flujo de Pantallas y Wireframes Descriptivos

Pantalla Inicio/Menú: Logo "Pizza Club" en la cabecera. Fondo crema. Lista vertical de categorías (Café, Pizzas, Promos). Cada ítem con foto a la izquierda, título en rojo, descripción y botón verde "+" a la derecha.



Modal/Pantalla Carrito: Resumen de ítems. Subtotal. Input para "Nombre del cliente". Texto estático: "Modalidad: Retiro por el local". Botón dorado: "Pagar con Mercado Pago".



Pantalla de Redirección (Éxito): Pantalla verde transitoria con el mensaje "¡Pago exitoso! Redirigiendo a WhatsApp...".



Pantalla Login Admin: Formulario simple centrado.



Dashboard Admin: Tabla de productos con botones (Editar/Eliminar) y botón general "Agregar Producto".



8\. Planes de Integración, Seguridad y Despliegue

Plan Mercado Pago: Se utilizará la API de Checkout Pro. El backend generará un preference\_id. El frontend usará este ID para redirigir al checkout. Se configurarán las back\_urls para que un pago "success" retorne a la web.



Plan WhatsApp: No requiere API oficial de Meta. Se armará una URL codificada: \[https://wa.me/NUMERO?text=MENSAJE\_ENCODEADO](https://wa.me/NUMERO?text=MENSAJE\_ENCODEADO).



Plan Seguridad: El backend validará el JWT en cada petición tipo POST/PUT/DELETE. Las rutas GET del menú serán públicas.



Plan Despliegue:



Desplegar BDD MySQL.



Configurar variables de entorno en Render y desplegar Backend.



Conectar Vercel al repositorio del Frontend.



9\. Roadmap de Desarrollo (Fases Secuenciales)

Fase 1: Configuración Core y BDD. Setup de Spring Boot, configuración de MySQL, creación de Entidades y Repositorios JPA.



Fase 2: Seguridad y Backend Admin. Implementación de Spring Security, JWT, endpoints CRUD de categorías y productos, integración de Cloudinary.



Fase 3: API Pública y Lógica de Negocio. Endpoints GET para el menú, lógica de validación de horarios comerciales.



Fase 4: Pasarela de Pago. Integración SDK Mercado Pago en Spring Boot, generación de preferencias.



Fase 5: Frontend Interfaz de Usuario. Maquetado HTML/CSS aplicando el manual de marca, consumo del catálogo de productos vía fetch.



Fase 6: Carrito y Flujo Final. Lógica en JS del carrito, redirección a MP, manejo de back\_urls y formateo del string para WhatsApp.



Fase 7: Despliegue.

