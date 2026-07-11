-- =========================================================================
-- SCRIPT DE MIGRACIÓN AVANZADA: MÓDULO OPERACIONAL Y AUDITORÍA DE ESTADOS
-- =========================================================================
-- Ejecuta este script en tu servidor MySQL para actualizar la estructura
-- de la base de datos 'sisweb' y habilitar KPIs y auditorías de estados.
-- =========================================================================

USE sisweb;

-- 1. AGREGAR COLUMNA 'tienda' A LA TABLA DE PEDIDOS
-- Permite discriminar la procedencia de ventas (ej. 'Loox Store', 'Techbox').
ALTER TABLE pedidos
ADD COLUMN tienda VARCHAR(100) DEFAULT 'Loox Store' AFTER envio;


-- 2. CREAR TABLA DE AUDITORÍA HISTÓRICA DE CAMBIOS DE ESTADO
-- Registra de manera automatizada quién, cuándo y a qué estado cambió cada pedido.
CREATE TABLE IF NOT EXISTS historial_estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
);
