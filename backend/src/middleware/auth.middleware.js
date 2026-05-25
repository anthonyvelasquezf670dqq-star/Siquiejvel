const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

const permit = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autorizado' });
  if (allowedRoles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Permiso denegado' });
};

module.exports = { authenticate, permit };
