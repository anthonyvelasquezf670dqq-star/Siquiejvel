import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../api/articles';

function ArticleForm() {
  const [form, setForm] = useState({ title: '', author: '', publishedIn: '', category: '', publishedDate: '', summary: '' });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createArticle(form);
    navigate('/articles');
  };

  return (
    <div className="page-content">
      <h1>Nuevo artículo</h1>
      <form className="glass-card" onSubmit={handleSubmit}>
        <label>
          Título
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Autor
          <input name="author" value={form.author} onChange={handleChange} required />
        </label>
        <label>
          Publicado en
          <input name="publishedIn" value={form.publishedIn} onChange={handleChange} />
        </label>
        <label>
          Categoría
          <input name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          Fecha de publicación
          <input type="date" name="publishedDate" value={form.publishedDate} onChange={handleChange} />
        </label>
        <label>
          Resumen
          <textarea name="summary" value={form.summary} onChange={handleChange} />
        </label>
        <button className="button" type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default ArticleForm;
