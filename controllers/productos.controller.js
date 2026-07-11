const repo = require('../repositories/productos.repository');

// ==========================================
// LISTAR PRODUCTOS
// ==========================================
exports.listar = async (req, res) => {
  try {
    const results = await repo.listar();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// CREAR PRODUCTO
// ==========================================
exports.crear = async (req, res) => {
  const producto = req.body;
  if (!producto.nombre || !producto.precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }

  try {
    const result = await repo.crear(producto);
    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
