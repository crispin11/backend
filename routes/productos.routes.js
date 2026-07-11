const express = require('express');
const router = express.Router();
const controller = require('../controllers/productos.controller');

// ==========================================
// ENDPOINT: LISTAR PRODUCTOS
// ==========================================
router.get('/', controller.listar);
router.post('/', controller.crear);

module.exports = router;
