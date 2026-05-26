import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBooks, deleteBook } from '../api/books';

function Books() {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const { data } = await fetchBooks();
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este libro?')) {
      await deleteBook(id);
      loadBooks();
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Libros</h1>
        <Link className="button" to="/books/new">
          Nuevo libro
        </Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Contenido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.availableCopies}</td>
              <td>
                {book.pdfUrl ? (
                  <Link className="button button--small" to={`/books/${book._id}`}>
                    Ver contenido
                  </Link>
                ) : (
                  'Sin contenido'
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(book._id)} className="button button--danger">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
