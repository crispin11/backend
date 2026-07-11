const db = require('../config/db');

// =========================================================================
// REGISTRAR PEDIDO CON DETALLES, TIENDA Y AUDITORÍA DE ESTADO (TRANSACCIÓN)
// =========================================================================
exports.crearPedido = async (pedido) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const sqlBuscarUsuario = `SELECT id FROM usuario WHERE nombre = ? LIMIT 1`;
    const [usuariosResult] = await connection.query(sqlBuscarUsuario, [pedido.vendedora || '']);
    const usuario_id = usuariosResult.length > 0 ? usuariosResult[0].id : null;

    const fullDestino = [
      pedido.region,
      pedido.provincia,
      pedido.distrito,
      pedido.direccion
    ].filter(Boolean).join(', ') || pedido.destino || null;

    const sqlPedido = `
      INSERT INTO pedidos (
        codigo, cliente, dni, celular, canalVenta, destino, envio, tienda,
        region, provincia, distrito, direccion,
        total, adelanto, saldo, estado, estadoPago,
        fechaPago, fechaEnvio, fechaVenta, usuario_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [resultPedido] = await connection.query(sqlPedido, [
      pedido.codigo || null, pedido.cliente, pedido.dni || null, pedido.celular || null,
      pedido.canalVenta || null, fullDestino, pedido.envio || null, pedido.tienda || 'Loox Store',
      pedido.region || null, pedido.provincia || null, pedido.distrito || null, pedido.direccion || null,
      pedido.total || 0, pedido.adelanto || 0, pedido.saldo || 0, pedido.estado || 'REGISTRADO',
      pedido.estadoPago || 'Pendiente', pedido.fechaPago || null, pedido.fechaEnvio || null,
      pedido.fechaVenta || null, usuario_id
    ]);

    const pedidoId = resultPedido.insertId;

    const sqlHistorial = `
      INSERT INTO historial_estados (pedido_id, estado, usuario_id)
      VALUES (?, ?, ?)
    `;
    await connection.query(sqlHistorial, [pedidoId, pedido.estado || 'REGISTRADO', usuario_id]);

    const detalles = pedido.detalles || [];

    for (const item of detalles) {
      const prodNombre = item.producto.nombre;
      const prodPrecio = item.producto.precio || 0;
      const cantidad = item.cantidad || 1;

      const sqlBuscarProd = `SELECT id, stock FROM productos WHERE nombre = ? LIMIT 1`;
      const [prodResult] = await connection.query(sqlBuscarProd, [prodNombre]);

      let productoId;

      if (prodResult.length > 0) {
        productoId = prodResult[0].id;
        const sqlUpdateStock = `UPDATE productos SET stock = stock - ? WHERE id = ?`;
        await connection.query(sqlUpdateStock, [cantidad, productoId]);
      } else {
        const stockInicial = Math.max(0, 50 - cantidad);
        const sqlInsertProd = `
          INSERT INTO productos (nombre, descripcion, precio, stock)
          VALUES (?, ?, ?, ?)
        `;
        const [newProdResult] = await connection.query(sqlInsertProd, [
          prodNombre, 'Producto creado automáticamente al registrar pedido', prodPrecio, stockInicial
        ]);
        productoId = newProdResult.insertId;
      }

      const subtotal = prodPrecio * cantidad;
      const sqlInsertDetalle = `
        INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.query(sqlInsertDetalle, [pedidoId, productoId, cantidad, prodPrecio, subtotal]);
    }

    await connection.commit();
    connection.release();
    return { insertId: pedidoId };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

// =========================================================================
// LISTAR PEDIDOS CON CÁLCULO DE DÍAS TRANSCURRIDOS Y TIENDA
// =========================================================================
exports.listar = async () => {
  const sql = `
    SELECT 
      p.*, 
      IFNULL(u.nombre, 'Sistema') AS vendedora,
      DATEDIFF(CURRENT_DATE, IFNULL(p.fechaVenta, p.fecha_creacion)) AS dias
    FROM pedidos p
    LEFT JOIN usuario u ON p.usuario_id = u.id
    ORDER BY p.id DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

// =========================================================================
// BUSCAR PEDIDO POR ID CON DETALLES
// =========================================================================
exports.buscarPorId = async (id) => {
  const sqlPedido = `
    SELECT 
      p.*, 
      IFNULL(u.nombre, 'Sistema') AS vendedora,
      DATEDIFF(CURRENT_DATE, IFNULL(p.fechaVenta, p.fecha_creacion)) AS dias
    FROM pedidos p
    LEFT JOIN usuario u ON p.usuario_id = u.id
    WHERE p.id = ?
  `;

  const [results] = await db.query(sqlPedido, [id]);
  if (results.length === 0) return null;

  const pedido = results[0];

  const sqlDetalles = `
    SELECT d.producto_id, d.cantidad, d.precio, prod.nombre
    FROM detalle_pedidos d
    INNER JOIN productos prod ON d.producto_id = prod.id
    WHERE d.pedido_id = ?
  `;

  const [detallesResults] = await db.query(sqlDetalles, [id]);

  pedido.detalles = detallesResults.map(d => ({
    producto: {
      id: d.producto_id,
      nombre: d.nombre,
      precio: Number(d.precio)
    },
    cantidad: d.cantidad
  }));

  return pedido;
};

// =========================================================================
// ACTUALIZAR PEDIDO Y REGISTRAR AUDITORÍA DE CAMBIO DE ESTADO
// =========================================================================
exports.actualizar = async (id, pedido) => {
  const sqlVerificarEstado = `SELECT estado, usuario_id FROM pedidos WHERE id = ?`;
  const [resultVerificacion] = await db.query(sqlVerificarEstado, [id]);

  const estadoAnterior = resultVerificacion.length > 0 ? resultVerificacion[0].estado : null;
  const usuario_id = resultVerificacion.length > 0 ? resultVerificacion[0].usuario_id : null;
  const nuevoEstado = pedido.estado || 'REGISTRADO';

  if (estadoAnterior !== nuevoEstado) {
    const sqlHistorial = `
      INSERT INTO historial_estados (pedido_id, estado, usuario_id)
      VALUES (?, ?, ?)
    `;
    try {
      await db.query(sqlHistorial, [id, nuevoEstado, usuario_id]);
    } catch (err) {
      console.error('Error al registrar auditoría de estado:', err);
    }
  }

  const fullDestino = [
    pedido.region,
    pedido.provincia,
    pedido.distrito,
    pedido.direccion
  ].filter(Boolean).join(', ') || pedido.destino || null;

  const sql = `
    UPDATE pedidos
    SET 
      codigo = ?,
      cliente = ?,
      dni = ?,
      celular = ?,
      canalVenta = ?,
      destino = ?,
      envio = ?,
      tienda = ?,
      region = ?,
      provincia = ?,
      distrito = ?,
      direccion = ?,
      total = ?,
      adelanto = ?,
      saldo = ?,
      estado = ?,
      estadoPago = ?,
      fechaPago = ?,
      fechaEnvio = ?,
      fechaVenta = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [
    pedido.codigo || null,
    pedido.cliente,
    pedido.dni || null,
    pedido.celular || null,
    pedido.canalVenta || null,
    fullDestino,
    pedido.envio || null,
    pedido.tienda || 'Loox Store',
    pedido.region || null,
    pedido.provincia || null,
    pedido.distrito || null,
    pedido.direccion || null,
    pedido.total || 0,
    pedido.adelanto || 0,
    pedido.saldo || 0,
    nuevoEstado,
    pedido.estadoPago || 'Pendiente',
    pedido.fechaPago || null,
    pedido.fechaEnvio || null,
    pedido.fechaVenta || null,
    id
  ]);
  return result;
};

// =========================================================================
// ELIMINAR PEDIDO (DETALLES E HISTORIAL SE BORRAN POR CASCADE EN LA DB)
// =========================================================================
exports.eliminar = async (id) => {
  const sql = `DELETE FROM pedidos WHERE id = ?`;
  const [result] = await db.query(sql, [id]);
  return result;
};

// =========================================================================
// OBTENER HISTORIAL DE CAMBIOS DE ESTADO CON DETALLE DEL USUARIO
// =========================================================================
exports.obtenerHistorialEstados = async (pedidoId) => {
  const sql = `
    SELECT h.*, IFNULL(u.nombre, 'Sistema') AS usuario_nombre
    FROM historial_estados h
    LEFT JOIN usuario u ON h.usuario_id = u.id
    WHERE h.pedido_id = ?
    ORDER BY h.fecha ASC
  `;
  const [rows] = await db.query(sql, [pedidoId]);
  return rows;
};

// =========================================================================
// CONFIRMAR PAGO RÁPIDO (ADMIN)
// =========================================================================
exports.confirmarPagoPedido = async (id, usuarioId) => {
  const sqlHistorial = `
    INSERT INTO historial_estados (pedido_id, estado, usuario_id)
    VALUES (?, 'PAGADO', ?)
  `;
  
  try {
    await db.query(sqlHistorial, [id, usuarioId]);
  } catch (err) {
    console.error('Error al registrar auditoría de confirmación de pago:', err);
  }

  const sqlUpdate = `
    UPDATE pedidos
    SET estado = 'PAGADO', estadoPago = 'Pagado', saldo = 0, fechaPago = CURRENT_DATE
    WHERE id = ?
  `;
  const [result] = await db.query(sqlUpdate, [id]);
  return result;
};