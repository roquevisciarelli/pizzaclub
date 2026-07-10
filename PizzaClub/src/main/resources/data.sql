-- 1. LIMPIAR TABLAS (Por si había datos de prueba. Respeta las restricciones de clave foránea)
TRUNCATE TABLE productos CASCADE;
TRUNCATE TABLE categorias CASCADE;

-- 2. REINICIAR LOS CONTADORES DE ID (Secuencias en PostgreSQL)
ALTER SEQUENCE categorias_id_seq RESTART WITH 1;
ALTER SEQUENCE productos_id_seq RESTART WITH 1;

-- 3. INSERTAR CATEGORÍAS (IDs del 1 al 7)
INSERT INTO categorias (nombre, activo) VALUES
                                            ('Café', true),                   -- ID 1
                                            ('Café Frío', true),              -- ID 2
                                            ('Acompañamientos', true),        -- ID 3
                                            ('Sandwichs Calentitos', true),   -- ID 4
                                            ('Bebidas', true),                -- ID 5
                                            ('Postres', true),                -- ID 6
                                            ('Promos Cafetería', true),       -- ID 7
                                            ('Promos Pizzería', true),        -- ID 8
                                            ('Empanadas', true);              -- ID 9

-- 4. INSERTAR PRODUCTOS
-- ---------------------------------------------------------

-- CAFÉ (Categoría ID 1)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Espresso', null, 3800, 1, true),
                                                                                  ('Americano', null, 3800, 1, true),
                                                                                  ('Lágrima', null, 3800, 1, true),
                                                                                  ('Cortado', null, 3800, 1, true),
                                                                                  ('Macchiato', null, 4400, 1, true),
                                                                                  ('Café con Leche', null, 4400, 1, true),
                                                                                  ('Flat White', null, 4400, 1, true),
                                                                                  ('Cortado Doble', null, 4400, 1, true),
                                                                                  ('Latte', null, 4400, 1, true),
                                                                                  ('Capuccino', null, 4800, 1, true),
                                                                                  ('Submarino', null, 4800, 1, true),
                                                                                  ('Café con Licor', null, 4800, 1, true),
                                                                                  ('Té', 'Negro / Manzanilla / Verde / Hierbas', 3800, 1, true),
                                                                                  ('Té con Leche', null, 3900, 1, true),
                                                                                  ('Té con Limón', null, 3900, 1, true);

-- CAFÉ FRÍO (Categoría ID 2)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Frappucino Frutos del Bosque', 'Doble espresso, leche, salsa F. del Bosque', 7800, 2, true),
                                                                                  ('Frappucino Dulce de Leche', 'Doble espresso, leche, dulce de leche', 7800, 2, true),
                                                                                  ('Iced Latte', 'Café con leche frío', 7800, 2, true),
                                                                                  ('Iced Latte Pistacho', 'Doble espresso, leche, pasta de pistacho', 7800, 2, true),
                                                                                  ('Iced Latte Dulce de Leche', 'Doble espresso, leche, dulce de leche', 7800, 2, true);

-- ACOMPAÑAMIENTOS (Categoría ID 3)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Porción de Budín', 'Naranja / Limón / Banana', 4000, 3, true),
                                                                                  ('Cuadrado de Pastafrola', null, 4000, 3, true),
                                                                                  ('Cuadrado de Coco', null, 4800, 3, true),
                                                                                  ('Cuadrado de Brownie', null, 4800, 3, true),
                                                                                  ('Medialunas', null, 1000, 3, true),
                                                                                  ('Medialunas Rellenas Dulces', 'Pastelera, dulce de leche, nutella, pistacho, frutos rojos', 1800, 3, true),
                                                                                  ('Medialunas Rellenas Saladas', 'Con jamón y queso', 1800, 3, true),
                                                                                  ('Tostadas de Campo', 'Pan blanco/multicereal con queso crema y mermelada/dulce de leche', 4400, 3, true),
                                                                                  ('Tostón de Palta', 'Pan blanco/multicereal con queso crema y palta', 4400, 3, true),
                                                                                  ('Tostón de Huevo', 'Pan blanco/multicereal con queso crema y huevo', 4800, 3, true),
                                                                                  ('Tostón de Palta y Huevo', 'Pan blanco/multicereal con queso crema, palta y huevos revueltos', 4800, 3, true),
                                                                                  ('Sandwich de Miga', 'Jamón y Queso', 2000, 3, true);

-- SANDWICHS CALENTITOS (Categoría ID 4)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Panini Jamón Cocido y Queso', null, 6500, 4, true),
                                                                                  ('Panini Lomo Ahumado y Cheddar', null, 7500, 4, true),
                                                                                  ('Panini Jamón Crudo y Queso', null, 8500, 4, true),
                                                                                  ('Avocado Club', 'J, Q, palta y huevo', 8000, 4, true),
                                                                                  ('Tostado de Miga', '2 triangulitos', 6000, 4, true);

-- BEBIDAS (Categoría ID 5)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Jugo de Naranja', null, 4000, 5, true),
                                                                                  ('Limonada', 'Limón, jengibre y menta', 4500, 5, true),
                                                                                  ('Licuado', 'Agua/Leche, Banana/Frutilla', 5000, 5, true),
                                                                                  ('Gaseosas 500ml', null, 3800, 5, true),
                                                                                  ('Agua Saborizada', null, 3500, 5, true),
                                                                                  ('Agua con o sin gas', null, 3000, 5, true),
                                                                                  ('Cerveza Pinta 600ml Amstel', null, 4800, 5, true),
                                                                                  ('Cerveza 1/2 Pinta 380ml Amstel', null, 3800, 5, true),
                                                                                  ('Cerveza 473cc Amstel', null, 4000, 5, true),
                                                                                  ('Cerveza 473cc Imperial', null, 4800, 5, true),
                                                                                  ('Cerveza 473cc Heineken', null, 5500, 5, true),
                                                                                  ('Fernet Branca con Coca', null, 6000, 5, true),
                                                                                  ('Vermouth Carpano', null, 6000, 5, true);

-- POSTRES (Categoría ID 6)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Pizza de Nutella', 'Nutella, banana, salsa de chocolate', 8500, 6, true),
                                                                                  ('Pizza de Pistacho', 'Pasta de pistacho, salsa de chocolate con pistachos', 9500, 6, true),
                                                                                  ('Almendrado', null, 7000, 6, true),
                                                                                  ('Almendrado con Salsa de Pistacho', null, 9000, 6, true),
                                                                                  ('Flan Casero', null, 8000, 6, true),
                                                                                  ('Flan Casero con Dulce de Leche', null, 9000, 6, true);

-- PROMOS CAFETERÍA (Categoría ID 7)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Promo Tradicional', 'Café c/leche + 2 medialunas', 5500, 7, true),
                                                                                  ('Promo De Campo', 'Infusión + tostada de pan blanco/multicereal con queso blanco y mermelada ó dce. de leche + shot de jugo de naranja', 8500, 7, true),
                                                                                  ('Promo Clásico Dulce', 'Capuchino + porción de budín', 7500, 7, true),
                                                                                  ('Promo Clásico Tostado', 'Infusión + Tostado de Miga (2 Triangulitos)', 8000, 7, true),
                                                                                  ('Promo Rellenitas Dulce', 'Café c/leche + 2 medialunas rellenas', 7000, 7, true),
                                                                                  ('Promo Panini', 'Panini de J&Q + Gaseosa o Cerveza Amstel', 9000, 7, true);

-- PROMOS PIZZERÍA (Categoría ID 8)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Pizza Muzzarella - Superporción', null, 6900, 8, true),
                                                                                  ('Pizza Muzzarella - Grande', null, 12900, 8, true),
                                                                                  ('Pizza Napolitana - Superporción', null, 8900, 8, true),
                                                                                  ('Pizza Napolitana - Grande', null, 16900, 8, true),
                                                                                  ('Pizza Jamón y Morrón - Superporción', null, 11900, 8, true),
                                                                                  ('Pizza Jamón y Morrón - Grande', null, 21900, 8, true),
                                                                                  ('Pizza Peperoni - Superporción', null, 11900, 8, true),
                                                                                  ('Pizza Peperoni - Grande', null, 21900, 8, true),
                                                                                  ('Pizza Cebolla & Muzzarella - Superporción', null, 9900, 8, true),
                                                                                  ('Pizza Cebolla & Muzzarella - Grande', null, 18900, 8, true),
                                                                                  ('Pizza con Mortadela - Superporción', null, 9900, 8, true),
                                                                                  ('Pizza con Mortadela - Grande', null, 18900, 8, true);

-- EMPANADAS Y PROMOS BEBIDAS (Categoría ID 9)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible) VALUES
                                                                                  ('Empanada (Carne, Pollo, Q. y Cebolla, Jamón y Muzzarella, Capresse)', 'Precio por unidad', 2500, 9, true),
                                                                                  ('Promo 2 Empanadas + 1/2 Pinta Amstel', null, 6900, 9, true),
                                                                                  ('Promo 3 Empanadas + 1 Pinta Amstel', null, 9900, 9, true);

-- 5. CREAR UN ADMINISTRADOR (Contraseña: admin123)
-- El hash bcrypt corresponde a 'admin123'
INSERT INTO admins (username, password_hash) VALUES
    ('admin', '$2a$10$Xo.L0r3D5.5/X/7p.I1HzeUeD.3R1.4M0E5xM3/N0oY2h74sZ4L3G');