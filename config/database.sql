-- =========================================================================
-- SCRIPT COMPLETO DE BASE DE DATOS: SISWEB (ESTRUCTURA Y DATOS INICIALES)
-- =========================================================================
-- Este archivo contiene la estructura unificada y actualizada de la base
-- de datos 'sisweb', incluyendo las tablas de auditoría, tiendas, 
-- códigos personalizados y todos los campos requeridos por el sistema.
-- =========================================================================

CREATE DATABASE IF NOT EXISTS sisweb;
USE sisweb;

-- =========================================================================
-- 1. TABLA ROLES
-- =========================================================================
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- ROLES INICIALES
INSERT INTO roles (nombre)
VALUES
('Administrador'),
('Vendedor'),
('Operador')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);


-- =========================================================================
-- 2. TABLA USUARIOS
-- =========================================================================
CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NULL, -- Código de usuario (ej. U0001)
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol INT NOT NULL,
    usuario_creador VARCHAR(100) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol) REFERENCES roles(id)
);

-- USUARIO ADMINISTRADOR INICIAL
INSERT INTO usuario (
    codigo,
    dni,
    nombre,
    apellido,
    correo,
    contrasena,
    rol,
    usuario_creador
)
VALUES (
    'U0001',
    '74242857',
    'Edison',
    'Ruiz',
    'admin@gmail.com',
    '123456',
    1,
    'Sistema'
)
ON DUPLICATE KEY UPDATE dni=VALUES(dni);


-- =========================================================================
-- 3. TABLA PRODUCTOS
-- =========================================================================
CREATE TABLE IF NOT EXISTS productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTOS INICIALES
INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES
('Reloj Casio', 'Reloj clásico', 120.00, 20),
('Reloj Smart', 'Smartwatch deportivo', 250.00, 15),
('Reloj Elegante', 'Reloj premium', 300.00, 10)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);


-- =========================================================================
-- 4. TABLA PEDIDOS
-- =========================================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NULL, -- Código de pedido (ej. P0001)
    cliente VARCHAR(150) NOT NULL,
    dni VARCHAR(20) NULL,
    celular VARCHAR(20) NULL,
    canalVenta VARCHAR(100) NULL, -- Canal de venta (ej. Whatsapp, Instagram)
    destino VARCHAR(150) NULL, -- Destino completo concatenado
    envio VARCHAR(100) NULL, -- Tipo de envío (ej. Shalom, Olva)
    tienda VARCHAR(100) DEFAULT 'Loox Store', -- Tienda (Loox Store / Techbox)
    
    -- Dirección desagregada para mockups
    region VARCHAR(100) NULL,
    provincia VARCHAR(100) NULL,
    distrito VARCHAR(100) NULL,
    direccion VARCHAR(255) NULL,
    
    total DECIMAL(10,2) DEFAULT 0.00,
    adelanto DECIMAL(10,2) DEFAULT 0.00, -- Cancelado
    saldo DECIMAL(10,2) DEFAULT 0.00, -- Por pagar
    
    estado VARCHAR(50) DEFAULT 'REGISTRADO', -- Estado tracking
    estadoPago VARCHAR(50) DEFAULT 'Pendiente', -- Estado pago
    
    fechaPago DATE NULL,
    fechaEnvio DATE NULL,
    fechaVenta DATE DEFAULT (CURRENT_DATE),
    usuario_id INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);


-- =========================================================================
-- 5. DETALLE PEDIDOS
-- =========================================================================
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);


-- =========================================================================
-- 6. TABLA HISTORIAL ESTADOS (AUDITORÍA AUDITABLE)
-- =========================================================================
CREATE TABLE IF NOT EXISTS historial_estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);
