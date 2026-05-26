import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/api';
import { createBook } from '../api/books';

function Dashboard() {
  const [stats, setStats] = useState({ books: 0, articles: 0, loans: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', category: '', publishedYear: '', totalCopies: 1, description: '', pdfFile: null });
  const [bookMessage, setBookMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, articles, loans] = await Promise.all([
          api.get('/books'),
          api.get('/articles'),
          api.get('/loans')
        ]);

        setStats({ books: books.data.length, articles: articles.data.length, loans: loans.data.length });
        setRecentBooks(books.data.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'pdfFile') {
      setBookForm((prev) => ({ ...prev, pdfFile: files[0] }));
      return;
    }
    setBookForm((prev) => ({
      ...prev,
      [name]: name === 'totalCopies' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', bookForm.title);
      formData.append('author', bookForm.author);
      formData.append('isbn', bookForm.isbn);
      formData.append('category', bookForm.category);
      formData.append('publishedYear', bookForm.publishedYear);
      formData.append('totalCopies', bookForm.totalCopies);
      formData.append('description', bookForm.description);
      if (bookForm.pdfFile) {
        formData.append('pdf', bookForm.pdfFile);
      }
      await createBook(formData);
      setBookMessage('Libro añadido correctamente.');
      setErrorMessage('');
      setBookForm({ title: '', author: '', isbn: '', category: '', publishedYear: '', totalCopies: 1, description: '', pdfFile: null });
      const { data: books } = await api.get('/books');
      setStats((prev) => ({ ...prev, books: books.length }));
      setRecentBooks(books.slice(0, 5));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al añadir el libro');
      setBookMessage('');
    }
  };

  return (
    <div className="dashboard">
      <h1>Panel de control</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Libros</h2>
          <p>{stats.books}</p>
        </div>
        <div className="stat-card">
          <h2>Artículos</h2>
          <p>{stats.articles}</p>
        </div>
        <div className="stat-card">
          <h2>Préstamos</h2>
          <p>{stats.loans}</p>
        </div>
      </div>
      {isAdmin && (
        <section className="admin-book-upload-section">
          <div className="section-header">
            <h2>Subir libro</h2>
            <Link className="button" to="/books/new">
              Formulario completo
            </Link>
          </div>
          <form className="glass-card" onSubmit={handleSubmit}>
            <label>
              Título
              <input name="title" value={bookForm.title} onChange={handleChange} required />
            </label>
            <label>
              Autor
              <input name="author" value={bookForm.author} onChange={handleChange} required />
            </label>
            <label>
              ISBN
              <input name="isbn" value={bookForm.isbn} onChange={handleChange} />
            </label>
            <label>
              Categoría
              <input name="category" value={bookForm.category} onChange={handleChange} />
            </label>
            <label>
              Año de publicación
              <input type="number" name="publishedYear" value={bookForm.publishedYear} onChange={handleChange} />
            </label>
            <label>
              Copias totales
              <input type="number" min="1" name="totalCopies" value={bookForm.totalCopies} onChange={handleChange} required />
            </label>
            <label>
              Descripción
              <textarea name="description" value={bookForm.description} onChange={handleChange} />
            </label>
            <label>
              PDF del libro
              <input type="file" name="pdfFile" accept="application/pdf" onChange={handleChange} />
            </label>
            {bookMessage && <div className="success-box">{bookMessage}</div>}
            {errorMessage && <div className="error-box">{errorMessage}</div>}
            <button className="button" type="submit">
              Añadir libro
            </button>
          </form>
        </section>
      )}
      <section className="recent-books-section">
        <div className="section-header">
          <h2>Libros añadidos</h2>
          <Link className="button" to="/books">
            Ver todos
          </Link>
        </div>
        {recentBooks.length ? (
          <ul className="recent-books-list">
            {recentBooks.map((book) => (
              <li key={book._id}>
                <strong>{book.title}</strong> — {book.author}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay libros añadidos aún.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
