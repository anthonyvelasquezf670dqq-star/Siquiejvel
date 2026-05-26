import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  const publicBase = import.meta.env.PROD ? '/Siquiejvel' : '';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    window.location.assign(`${publicBase}/login`);
  };

  return (
    <nav className="nav-bar">
      <div className="brand">OwnLibrary</div>
      {token ? (
        <>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/books">Librería</Link>
            <Link to="/articles">Artículos</Link>
            <Link to="/loans">Préstamos</Link>
            {(role === 'admin' || role === 'librarian') && <Link to="/users">Usuarios</Link>}
          </div>
          <div className="nav-actions">
            <span>{email}</span>
            <button onClick={logout}>Cerrar sesión</button>
          </div>
        </>
      ) : (
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Registrarse</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
