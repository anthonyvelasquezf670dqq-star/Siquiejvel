import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('email', data.user.email);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <div className="error-box">{error}</div>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
