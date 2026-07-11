const repo = require('../repositories/pedidos.repository');

// =========================
// CREAR PEDIDO
// =========================
exports.crearPedido = async (pedido) => {
  // Validación básica
  if (!pedido.cliente) {
    throw new Error('El nombre del cliente es requerido');
  }

  // Recalcular saldo aritméticamente por seguridad
  pedido.total = Number(pedido.total) || 0;
  pedido.adelanto = Number(pedido.adelanto) || 0;
  pedido.saldo = pedido.total - pedido.adelanto;

  // Asignar estado por defecto si no viene provisto
  if (!pedido.estado) {
    pedido.estado = 'REGISTRADO';
  }

  return await repo.crearPedido(pedido);
};

// =========================
// LISTAR PEDIDOS
// =========================
exports.listar = async () => {
  return await repo.listar();
};

// =========================
// BUSCAR PEDIDO POR ID
// =========================
exports.buscarPorId = async (id) => {
  if (!id) {
    throw new Error('ID de pedido requerido');
  }
  return await repo.buscarPorId(id);
};

// =========================
// ACTUALIZAR PEDIDO
// =========================
exports.actualizarPedido = async (id, pedido) => {
  if (!id) {
    throw new Error('ID de pedido requerido para actualizar');
  }
  if (!pedido.cliente) {
    throw new Error('El nombre del cliente es requerido para actualizar');
  }

  // Recalcular saldo aritméticamente por seguridad
  pedido.total = Number(pedido.total) || 0;
  pedido.adelanto = Number(pedido.adelanto) || 0;
  pedido.saldo = pedido.total - pedido.adelanto;

  return await repo.actualizar(id, pedido);
};

// =========================
// ELIMINAR PEDIDO
// =========================
exports.eliminarPedido = async (id) => {
  if (!id) {
    throw new Error('ID de pedido requerido para eliminar');
  }
  return await repo.eliminar(id);
};

// =========================
// OBTENER HISTORIAL ESTADOS
// =========================
exports.obtenerHistorialEstados = async (id) => {
  if (!id) {
    throw new Error('ID de pedido requerido');
  }
  return await repo.obtenerHistorialEstados(id);
};

// =========================
// CONFIRMAR PAGO EXPRESS
// =========================
exports.confirmarPagoPedido = async (id, usuarioId) => {
  if (!id) {
    throw new Error('ID de pedido requerido');
  }
  return await repo.confirmarPagoPedido(id, usuarioId);
};
