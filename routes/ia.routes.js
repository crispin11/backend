const express = require('express');
const router = express.Router();
const iaController = require('../controllers/ia.controller');

router.post('/chat', iaController.chat);
router.post('/producto/sugerir', iaController.sugerirProducto);
router.post('/analisis', iaController.analizarVentas);

module.exports = router;
