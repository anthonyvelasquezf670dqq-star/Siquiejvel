import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../api/books';

function BookForm() {
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', publishedYear: '', totalCopies: 1, description: '', pdfFile: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'pdfFile') {
      setForm({ ...form, pdfFile: files[0] });
      return;
    }
    const fieldValue = name === 'totalCopies' ? Number(value) : value;
    setForm({ ...form, [name]: fieldValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('author', form.author);
      data.append('isbn', form.isbn);
      data.append('category', form.category);
      data.append('publishedYear', form.publishedYear);
      data.append('totalCopies', form.totalCopies);
      data.append('description', form.description);
      if (form.pdfFile) {
        data.append('pdf', form.pdfFile);
      }
      await createBook(data);
      setMessage('Libro creado con éxito');
      setError('');
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir el libro');
    }
  };

  return (
    <div className="page-content">
      <h1>Nuevo libro</h1>
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
          ISBN
          <input name="isbn" value={form.isbn} onChange={handleChange} />
        </label>
        <label>
          Categoría
          <input name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          Año
          <input type="number" name="publishedYear" value={form.publishedYear} onChange={handleChange} />
        </label>
        <label>
          Copias totales
          <input type="number" min="1" name="totalCopies" value={form.totalCopies} onChange={handleChange} required />
        </label>
        <label>
          Descripción
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <label>
          PDF del libro
          <input type="file" name="pdfFile" accept="application/pdf" onChange={handleChange} />
        </label>
        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
        <button className="button" type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default BookForm;
