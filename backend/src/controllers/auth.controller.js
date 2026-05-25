const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validateAuthPayload } = require('../utils/validation');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'supersecret',
    { expiresIn: '8h' }
  );
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    validateAuthPayload({ name, email, password });
  } catch (error) {
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role: 'member' });
  const token = signToken(user);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('El email y la contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = signToken(user);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};
