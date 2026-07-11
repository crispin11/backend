-- =========================================================================
-- SCRIPT DE MIGRACIÓN: EXPANSIÓN PARA NUEVOS MOCKUPS DE SISWEB
-- =========================================================================
-- Ejecuta este script en tu servidor MySQL para actualizar la estructura
-- de la base de datos 'sisweb'.
-- =========================================================================

USE sisweb;

-- 1. AGREGAR COLUMNA 'codigo' EN LA TABLA DE USUARIOS
-- Permite almacenar códigos personalizados para cada usuario (ej. 'P0001', 'U0001').
-- Usamos 'AFTER id' para mantener el orden lógico de las columnas.
ALTER TABLE usuario 
ADD COLUMN codigo VARCHAR(50) UNIQUE AFTER id;


-- 2. AGREGAR COLUMNAS PARA EL DETALLE AVANZADO DE PEDIDOS
-- Añadimos código de pedido, canal de venta, campos de dirección de destino desagregados,
-- estado del pedido, fecha de pago, fecha de envío y fecha de venta.
ALTER TABLE pedidos
ADD COLUMN codigo VARCHAR(50) UNIQUE AFTER id,
ADD COLUMN canalVenta VARCHAR(100) AFTER celular,
ADD COLUMN region VARCHAR(100) AFTER envio,
ADD COLUMN provincia VARCHAR(100) AFTER region,
ADD COLUMN distrito VARCHAR(100) AFTER provincia,
ADD COLUMN direccion VARCHAR(255) AFTER distrito,
ADD COLUMN estado VARCHAR(50) DEFAULT 'REGISTRADO' AFTER saldo,
ADD COLUMN fechaPago DATE AFTER estadoPago,
ADD COLUMN fechaEnvio DATE AFTER fechaPago,
ADD COLUMN fechaVenta DATE DEFAULT (CURRENT_DATE) AFTER fechaEnvio;
