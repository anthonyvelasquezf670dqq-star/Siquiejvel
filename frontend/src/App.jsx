import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookForm from './pages/BookForm';
import BookView from './pages/BookView';
import Articles from './pages/Articles';
import ArticleForm from './pages/ArticleForm';
import Users from './pages/Users';
import Loans from './pages/Loans';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute>{token ? <Dashboard /> : <Navigate to="/login" />}</ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/books/new" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookView /></ProtectedRoute>} />
          <Route path="/articles" element={<ProtectedRoute><Articles /></ProtectedRoute>} />
          <Route path="/articles/new" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={token ? '/' : '/login'} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
