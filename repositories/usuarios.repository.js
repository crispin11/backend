const db = require('../config/db');

// ==========================================
// GUARDAR USUARIO (CON CÓDIGO PERSONALIZADO)
// ==========================================
exports.guardar = async (usuario) => {
    const sql = `
        INSERT INTO usuario (
            codigo,
            dni,
            nombre,
            apellido,
            correo,
            contrasena,
            rol,
            usuario_creador
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        usuario.codigo || null,
        usuario.dni,
        usuario.nombre,
        usuario.apellido,
        usuario.correo,
        usuario.contrasena,
        usuario.rol_id || usuario.rol,
        usuario.usuario_creador || null
    ]);
    return result;
};

// ==========================================
// BUSCAR USUARIO POR DNI
// ==========================================
exports.buscarPorDni = async (dni) => {
    const sql = `
        SELECT * FROM usuario
        WHERE dni = ?
    `;
    const [rows] = await db.query(sql, [dni]);
    return rows;
};

// ==========================================
// LISTAR USUARIOS (INCLUYENDO CÓDIGO Y ROL)
// ==========================================
exports.listar = async () => {
    const sql = `
        SELECT
            u.id,
            u.codigo,
            u.fecha_creacion,
            u.dni,
            u.nombre,
            u.apellido,
            u.correo,
            r.nombre AS rol
        FROM usuario u
        INNER JOIN roles r ON u.rol = r.id
        ORDER BY u.id DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
};

// ==========================================
// BUSCAR USUARIO POR CORREO
// ==========================================
exports.buscarCorreo = async (correo) => {
    const sql = `
        SELECT * FROM usuario
        WHERE correo = ?
    `;
    const [rows] = await db.query(sql, [correo]);
    return rows;
};

// ==========================================
// BUSCAR USUARIO POR ID
// ==========================================
exports.buscarPorId = async (id) => {
    const sql = `
        SELECT * FROM usuario
        WHERE id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows;
};

// ==========================================
// ACTUALIZAR USUARIO (CON CÓDIGO Y CONTRASEÑA OPCIONAL)
// ==========================================
exports.actualizar = async (id, usuario) => {
    let sql;
    let params;

    if (usuario.contrasena) {
        sql = `
            UPDATE usuario
            SET
                codigo = ?,
                dni = ?,
                nombre = ?,
                apellido = ?,
                correo = ?,
                contrasena = ?,
                rol = ?
            WHERE id = ?
        `;
        params = [
            usuario.codigo || null,
            usuario.dni,
            usuario.nombre,
            usuario.apellido,
            usuario.correo,
            usuario.contrasena,
            usuario.rol || usuario.rol_id,
            id
        ];
    } else {
        sql = `
            UPDATE usuario
            SET
                codigo = ?,
                dni = ?,
                nombre = ?,
                apellido = ?,
                correo = ?,
                rol = ?
            WHERE id = ?
        `;
        params = [
            usuario.codigo || null,
            usuario.dni,
            usuario.nombre,
            usuario.apellido,
            usuario.correo,
            usuario.rol || usuario.rol_id,
            id
        ];
    }

    const [result] = await db.query(sql, params);
    return result;
};

// ==========================================
// ELIMINAR USUARIO POR ID
// ==========================================
exports.eliminar = async (id) => {
    const sql = `
        DELETE FROM usuario
        WHERE id = ?
    `;
    const [result] = await db.query(sql, [id]);
    return result;
};