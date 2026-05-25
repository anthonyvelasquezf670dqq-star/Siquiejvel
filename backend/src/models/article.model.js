const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publishedIn: { type: String, trim: true },
    publishedDate: { type: Date },
    category: { type: String, trim: true },
    summary: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
