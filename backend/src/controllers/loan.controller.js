const Loan = require('../models/loan.model');
const Book = require('../models/book.model');

exports.createLoan = async (req, res) => {
  const { bookId, dueDate } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
  if (book.availableCopies < 1) return res.status(400).json({ message: 'No hay copias disponibles' });

  book.availableCopies -= 1;
  await book.save();

  const loan = await Loan.create({
    book: book._id,
    user: req.user.id,
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  });
  res.status(201).json(loan);
};

exports.listLoans = async (req, res) => {
  const filter = req.user.role === 'member' ? { user: req.user.id } : {};

  const loans = await Loan.find(filter)
    .populate('user', 'name email role')
    .populate('book', 'title author isbn')
    .sort({ createdAt: -1 });

  res.json(loans);
};

exports.getLoan = async (req, res) => {
  const filter = req.user.role === 'member' ? { _id: req.params.id, user: req.user.id } : { _id: req.params.id };

  const loan = await Loan.findOne(filter)
    .populate('user', 'name email role')
    .populate('book', 'title author isbn');

  if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });
  res.json(loan);
};

exports.returnLoan = async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).json({ message: 'Préstamo no encontrado' });
  if (loan.returnedAt) return res.status(400).json({ message: 'Préstamo ya devuelto' });

  loan.returnedAt = new Date();
  loan.status = loan.dueDate < new Date() ? 'overdue' : 'returned';
  await loan.save();

  const book = await Book.findById(loan.book);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  res.json(loan);
};
