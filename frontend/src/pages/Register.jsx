import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const { data } = await register({
        name: form.name,
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('email', data.user.email);
      setSuccess('Registro completado. Redirigiendo al panel...');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo completar el registro');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Confirmar contraseña
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </label>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
