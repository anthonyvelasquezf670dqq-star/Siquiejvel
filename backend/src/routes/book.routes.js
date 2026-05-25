const express = require('express');
const path = require('path');
const multer = require('multer');
const {
  createBook,
  listBooks,
  getBook,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');
const { authenticate, permit } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });
const router = express.Router();

router.use(authenticate);
router.post('/', permit('admin', 'librarian'), upload.single('pdf'), createBook);
router.get('/', listBooks);
router.get('/:id', getBook);
router.put('/:id', permit('admin', 'librarian'), upload.single('pdf'), updateBook);
router.delete('/:id', permit('admin'), deleteBook);

module.exports = router;
