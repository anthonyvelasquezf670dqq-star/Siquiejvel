const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { validateUserPayload } = require('../utils/validation');

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    validateUserPayload({ name, email, password, role });
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
  const user = await User.create({ name, email, password: hashedPassword, role });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

exports.listUsers = async (req, res) => {
  const users = await User.find({}, '-password').sort({ createdAt: -1 });
  res.json(users);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id, '-password');
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const updates = { ...req.body };

  if (updates.role && !['admin', 'librarian', 'member'].includes(updates.role)) {
    const error = new Error('El rol debe ser admin, librarian o member');
    error.status = 400;
    throw error;
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, select: '-password' });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ message: 'Usuario eliminado' });
};
