import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBook } from '../api/books';

function BookView() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBook = async () => {
      try {
        const { data } = await fetchBook(id);
        setBook(data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el libro');
      }
    };
    loadBook();
  }, [id]);

  if (error) {
    return (
      <div className="page-content">
        <h1>Ver libro</h1>
        <p className="error-box">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page-content">
        <h1>Ver libro</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverBase = apiBaseUrl.replace(/\/api\/?$/, '');
  const readerUrl = book.pdfUrl ? (book.pdfUrl.startsWith('http') ? book.pdfUrl : `${serverBase}${book.pdfUrl}`) : null;
  const isPdf = readerUrl ? /\.pdf(?:\?|#|$)/i.test(readerUrl) : false;
  const translateUrl = readerUrl && !isPdf
    ? `https://translate.google.com/translate?hl=es&sl=auto&tl=es&u=${encodeURIComponent(readerUrl)}`
    : null;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>{book.title}</h1>
        <Link className="button" to="/books">
          Volver a la librería
        </Link>
      </div>
      <div className="book-details">
        <p><strong>Autor:</strong> {book.author}</p>
        <p><strong>Categoría:</strong> {book.category}</p>
        <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
        <p><strong>Año:</strong> {book.publishedYear || 'N/A'}</p>
        <p><strong>Copias disponibles:</strong> {book.availableCopies}</p>
        <p><strong>Descripción:</strong> {book.description || 'Sin descripción'}</p>
      </div>
      {readerUrl ? (
        <>
          <div className="pdf-actions">
            <a className="button" href={readerUrl} target="_blank" rel="noreferrer">
              {isPdf ? 'Abrir PDF en nueva pestaña' : 'Abrir libro en nueva pestaña'}
            </a>
            {!isPdf && translateUrl && (
              <a className="button button--secondary" href={translateUrl} target="_blank" rel="noreferrer">
                Traducir a español
              </a>
            )}
            {isPdf && (
              <a className="button button--secondary" href={readerUrl} download>
                Descargar PDF
              </a>
            )}
          </div>
          <div className="pdf-viewer">
            {isPdf ? (
              <embed
                title="Vista PDF"
                src={readerUrl}
                type="application/pdf"
                width="100%"
                height="800px"
              />
            ) : (
              <iframe
                title="Lectura online"
                src={readerUrl}
                width="100%"
                height="800px"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
            <p className="helper-text">
              {isPdf
                ? 'Si el visor no muestra el PDF, usa “Abrir PDF en nueva pestaña” o “Descargar PDF”.'
                : 'Si el visor no muestra el contenido, usa “Abrir libro en nueva pestaña” o “Traducir a español”.'}
            </p>
          </div>
        </>
      ) : (
        <div className="error-box">Este libro no tiene contenido asociado.</div>
      )}
    </div>
  );
}

export default BookView;
