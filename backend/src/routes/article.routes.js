const express = require('express');
const {
  createArticle,
  listArticles,
  getArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/article.controller');
const { authenticate, permit } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(authenticate);
router.post('/', permit('admin', 'librarian'), createArticle);
router.get('/', listArticles);
router.get('/:id', getArticle);
router.put('/:id', permit('admin', 'librarian'), updateArticle);
router.delete('/:id', permit('admin'), deleteArticle);

module.exports = router;
