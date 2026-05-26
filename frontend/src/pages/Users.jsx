import React from 'react';
import { useEffect, useState } from 'react';
import { createUser, fetchUsers, updateUser, deleteUser } from '../api/users';

function Users() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    const { data } = await fetchUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateChange = (event) => {
    setCreateForm({ ...createForm, [event.target.name]: event.target.value });
  };

  const handleEditChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await createUser(createForm);
      setCreateForm({ name: '', email: '', password: '', role: 'member' });
      setMessage('Usuario creado correctamente');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear el usuario');
    }
  };

  const startEdit = (user) => {
    setEditing(user._id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const handleSave = async (id) => {
    const payload = { name: form.name, email: form.email, role: form.role };
    if (form.password) {
      payload.password = form.password;
    }

    await updateUser(id, payload);
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'member' });
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div className="page-content">
      <h1>Usuarios</h1>

      <section className="glass-card">
        <h2>Crear usuario</h2>
        <form onSubmit={handleCreate}>
          <label>
            Nombre
            <input name="name" value={createForm.name} onChange={handleCreateChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={createForm.email} onChange={handleCreateChange} required />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" value={createForm.password} onChange={handleCreateChange} required />
          </label>
          <label>
            Rol
            <select name="role" value={createForm.role} onChange={handleCreateChange}>
              <option value="member">member</option>
              <option value="librarian">librarian</option>
              <option value="admin">admin</option>
            </select>
          </label>
          {message && <div className="success-box">{message}</div>}
          {error && <div className="error-box">{error}</div>}
          <button className="button" type="submit">Crear usuario</button>
        </form>
      </section>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {editing === user._id ? (
                  <input name="name" value={form.name} onChange={handleEditChange} />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editing === user._id ? (
                  <input name="email" type="email" value={form.email} onChange={handleEditChange} />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editing === user._id ? (
                  <select name="role" value={form.role} onChange={handleEditChange}>
                    <option value="member">member</option>
                    <option value="librarian">librarian</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editing === user._id ? (
                  <>
                    <input name="password" type="password" value={form.password} onChange={handleEditChange} placeholder="Nueva contraseña" />
                    <button onClick={() => handleSave(user._id)} className="button">
                      Guardar
                    </button>
                  </>
                ) : (
                  <button onClick={() => startEdit(user)} className="button">
                    Editar
                  </button>
                )}
                <button onClick={() => handleDelete(user._id)} className="button button--danger">
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

export default Users;
