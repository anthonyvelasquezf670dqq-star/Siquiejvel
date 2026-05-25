const express = require('express');
const cors = require('cors');
const path = require('path');
const expressAsyncErrors = require('express-async-errors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const articleRoutes = require('./routes/article.routes');
const loanRoutes = require('./routes/loan.routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/loans', loanRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ownlibrary-backend' });
});

app.use(errorMiddleware);

module.exports = app;
