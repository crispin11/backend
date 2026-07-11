const db = require('../config/db');

// ==========================================
// LISTAR TODOS LOS PRODUCTOS
// ==========================================
exports.listar = async () => {
  const sql = `
    SELECT * FROM productos
    ORDER BY nombre ASC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

// ==========================================
// CREAR PRODUCTO
// ==========================================
exports.crear = async (producto) => {
  const sql = `
    INSERT INTO productos (nombre, descripcion, precio, stock)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    producto.nombre, 
    producto.descripcion || null, 
    producto.precio || 0, 
    producto.stock || 0
  ];
  const [result] = await db.query(sql, params);
  return result;
};
