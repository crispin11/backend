const service = require('../services/usuarios.service');

// =========================
// GUARDAR USUARIO
// =========================
exports.guardar = async (req, res) => {
    try {
        const result = await service.guardar(req.body);
        res.json({ mensaje: 'Usuario guardado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
// LISTAR USUARIOS
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
// LOGIN
// =========================
exports.login = async (req, res) => {
    try {
        const usuario = await service.login(req.body);
        res.json({ mensaje: 'Login correcto', usuario: usuario });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

exports.buscarPorId = async (req, res) => {
    try {
        const result = await service.buscarPorId(req.params.id);
        res.json(result[0] || null); // Dependiendo si devuelve un array
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const result = await service.actualizar(req.params.id, req.body);
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const result = await service.eliminar(req.params.id);
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};