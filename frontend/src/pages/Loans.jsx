import React from 'react';
import { useEffect, useState } from 'react';
import { fetchLoans, createLoan, returnLoan } from '../api/loans';

function Loans() {
  const [loans, setLoans] = useState([]);
  const [borrowData, setBorrowData] = useState({ bookId: '', dueDate: '' });

  const loadLoans = async () => {
    const { data } = await fetchLoans();
    setLoans(data);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleChange = (event) => {
    setBorrowData({ ...borrowData, [event.target.name]: event.target.value });
  };

  const handleBorrow = async (event) => {
    event.preventDefault();
    await createLoan(borrowData);
    setBorrowData({ bookId: '', dueDate: '' });
    loadLoans();
  };

  const handleReturn = async (id) => {
    await returnLoan(id);
    loadLoans();
  };

  return (
    <div className="page-content">
      <h1>Préstamos</h1>
      <form className="glass-card" onSubmit={handleBorrow}>
        <label>
          ID del libro
          <input name="bookId" value={borrowData.bookId} onChange={handleChange} required />
        </label>
        <label>
          Fecha de devolución
          <input name="dueDate" type="date" value={borrowData.dueDate} onChange={handleChange} />
        </label>
        <button type="submit" className="button">Registrar préstamo</button>
      </form>
      <table className="data-table">
        <thead>
          <tr>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Devuelto</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.book?.title || 'N/A'}</td>
              <td>{loan.user?.name || 'N/A'}</td>
              <td>{loan.status}</td>
              <td>{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : '-'}</td>
              <td>
                {!loan.returnedAt && (
                  <button onClick={() => handleReturn(loan._id)} className="button button--danger">
                    Devolver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Loans;
