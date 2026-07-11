const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'sistemaweb_secret_jwt_key_2026';

module.exports = (req, res, next) => {
  // Obtener cabecera Authorization
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  // El formato debe ser Bearer <token>
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Acceso denegado: Token mal formado' });
  }

  const token = partes[1];

  try {
    const verificado = jwt.verify(token, SECRET_KEY);
    req.usuarioLogueado = verificado; // Adjuntar datos decodificados al request
    next(); // Continuar al controlador
  } catch (err) {
    return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
  }
};
