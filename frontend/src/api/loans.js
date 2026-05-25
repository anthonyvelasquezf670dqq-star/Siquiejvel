import api from './api';

export const fetchLoans = () => api.get('/loans');
export const createLoan = (loan) => api.post('/loans', loan);
export const returnLoan = (id) => api.patch(`/loans/${id}/return`);
