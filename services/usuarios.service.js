const repo = require('../repositories/usuarios.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'sistemaweb_secret_jwt_key_2026';

// =========================
// GUARDAR USUARIO
// =========================
exports.guardar = async (usuario) => {
    if (!usuario.nombre) {
        throw new Error('Nombre requerido');
    }

    // VALIDAR DNI DUPLICADO
    const results = await repo.buscarPorDni(usuario.dni);
    if (results.length > 0) {
        throw new Error('El DNI ya existe');
    }

    // Hashear contraseña antes de guardar
    if (usuario.contrasena) {
        usuario.contrasena = bcrypt.hashSync(String(usuario.contrasena).trim(), 10);
    }

    // GUARDAR
    return await repo.guardar(usuario);
};

// =========================
// LISTAR USUARIOS
// =========================
exports.listar = async () => {
    return await repo.listar();
};

// =========================
// LOGIN
// =========================
exports.login = async (datos) => {
    const results = await repo.buscarCorreo(datos.correo);
    
    // NO EXISTE
    if (results.length === 0) {
        throw new Error('Usuario no existe');
    }

    const usuario = results[0];

    // VALIDAR PASSWORD (admite texto plano heredado o hash bcrypt)
    let passwordValida = false;
    const inputPass = String(datos.contrasena).trim();
    const dbPass = String(usuario.contrasena).trim();

    if (dbPass.startsWith('$2a$') || dbPass.startsWith('$2b$')) {
        passwordValida = bcrypt.compareSync(inputPass, dbPass);
    } else {
        passwordValida = inputPass === dbPass;
    }

    if (!passwordValida) {
        throw new Error('Contraseña incorrecta');
    }

    // Generar Token JWT
    const token = jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        },
        SECRET_KEY,
        { expiresIn: '24h' }
    );

    // Devolver respuesta con token
    return {
        id: usuario.id,
        codigo: usuario.codigo,
        dni: usuario.dni,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
        token: token
    };
};

exports.buscarPorId = async (id) => {
    return await repo.buscarPorId(id);
};

exports.actualizar = async (id, usuario) => {
    // Hashear contraseña si se envía para actualización
    if (usuario.contrasena) {
        usuario.contrasena = bcrypt.hashSync(String(usuario.contrasena).trim(), 10);
    }
    return await repo.actualizar(id, usuario);
};

exports.eliminar = async (id) => {
    if (!id) {
        throw new Error('ID de usuario requerido');
    }
    return await repo.eliminar(id);
};