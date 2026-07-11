const service = require('../services/pedidos.service');

// =========================
// CREAR PEDIDO
// =========================
exports.crearPedido = async (req, res) => {
  try {
    const result = await service.crearPedido(req.body);
    res.json({ mensaje: 'Pedido guardado', id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =========================
// LISTAR PEDIDOS
// =========================
exports.listar = async (req, res) => {
  try {
    const results = await service.listar();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// BUSCAR PEDIDO POR ID
// =========================
exports.buscarPorId = async (req, res) => {
  try {
    const result = await service.buscarPorId(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// ACTUALIZAR PEDIDO
// =========================
exports.actualizarPedido = async (req, res) => {
  try {
    const result = await service.actualizarPedido(req.params.id, req.body);
    res.json({ mensaje: 'Pedido actualizado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =========================
// ELIMINAR PEDIDO
// =========================
exports.eliminarPedido = async (req, res) => {
  try {
    const result = await service.eliminarPedido(req.params.id);
    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// OBTENER HISTORIAL ESTADOS
// =========================
exports.obtenerHistorialEstados = async (req, res) => {
  try {
    const result = await service.obtenerHistorialEstados(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// CONFIRMAR PAGO EXPRESS
// =========================
exports.confirmarPagoPedido = async (req, res) => {
  try {
    const usuarioId = req.body.usuarioId || null;
    const result = await service.confirmarPagoPedido(req.params.id, usuarioId);
    res.json({ mensaje: 'Pago confirmado, pedido actualizado a PAGADO' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};