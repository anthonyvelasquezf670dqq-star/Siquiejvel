const Article = require('../models/article.model');
const { validateArticlePayload } = require('../utils/validation');

exports.createArticle = async (req, res) => {
  try {
    validateArticlePayload({ title: req.body.title, author: req.body.author });
  } catch (error) {
    error.status = 400;
    throw error;
  }

  const article = await Article.create(req.body);
  res.status(201).json(article);
};

exports.listArticles = async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.json(articles);
};

exports.getArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Artículo no encontrado' });
  res.json(article);
};

exports.updateArticle = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) return res.status(404).json({ message: 'Artículo no encontrado' });
  res.json(article);
};

exports.deleteArticle = async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) return res.status(404).json({ message: 'Artículo no encontrado' });
  res.json({ message: 'Artículo eliminado' });
};
