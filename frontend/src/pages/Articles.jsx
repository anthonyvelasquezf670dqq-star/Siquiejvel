import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles, deleteArticle } from '../api/articles';

function Articles() {
  const [articles, setArticles] = useState([]);

  const loadArticles = async () => {
    const { data } = await fetchArticles();
    setArticles(data);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este artículo?')) {
      await deleteArticle(id);
      loadArticles();
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Artículos</h1>
        <Link className="button" to="/articles/new">
          Nuevo artículo
        </Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Publicado en</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td>{article.author}</td>
              <td>{article.publishedIn}</td>
              <td>{article.category}</td>
              <td>
                <button onClick={() => handleDelete(article._id)} className="button button--danger">
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

export default Articles;
