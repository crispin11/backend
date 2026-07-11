const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidos.controller');
const authMiddleware = require('../config/auth.middleware');

// Aplicar middleware de autenticación JWT
router.use(authMiddleware);

// =========================
// RUTAS DE PEDIDOS
// =========================
router.post('/', controller.crearPedido);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.actualizarPedido);
router.delete('/:id', controller.eliminarPedido);
router.get('/:id/historial', controller.obtenerHistorialEstados);
router.put('/:id/confirmar-pago', controller.confirmarPagoPedido);

module.exports = router;