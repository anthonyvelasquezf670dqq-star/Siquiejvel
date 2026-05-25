const Book = require('../models/book.model');
const { validateBookPayload } = require('../utils/validation');

exports.createBook = async (req, res) => {
  const { title, author, isbn, category, publishedYear, totalCopies, description } = req.body;

  try {
    validateBookPayload({ title, author, totalCopies });
  } catch (error) {
    error.status = 400;
    throw error;
  }

  const pdfUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const book = await Book.create({
    title,
    author,
    isbn,
    category,
    publishedYear,
    totalCopies: totalCopies || 1,
    availableCopies: totalCopies || 1,
    description,
    pdfUrl
  });
  res.status(201).json(book);
};

exports.listBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

exports.getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
  res.json(book);
};

exports.updateBook = async (req, res) => {
  const updates = { ...req.body };
  if (req.file) {
    updates.pdfUrl = `/uploads/${req.file.filename}`;
  }
  if (updates.totalCopies != null) {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
    const delivered = book.totalCopies - book.availableCopies;
    updates.availableCopies = Math.max(0, updates.totalCopies - delivered);
  }
  const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
  res.json({ message: 'Libro eliminado' });
};
