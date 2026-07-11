const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const authMiddleware = require('../config/auth.middleware');

// =========================
// LOGIN (PÚBLICO)
// =========================
router.post('/login', controller.login);

// Aplicar middleware de autenticación a partir de aquí
router.use(authMiddleware);

// =========================
// GUARDAR USUARIO
// =========================
router.post('/', controller.guardar);

// =========================
// LISTAR USUARIOS
// =========================
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;