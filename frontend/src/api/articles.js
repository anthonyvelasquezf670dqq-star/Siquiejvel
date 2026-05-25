import api from './api';

export const fetchArticles = () => api.get('/articles');
export const createArticle = (article) => api.post('/articles', article);
export const updateArticle = (id, article) => api.put(`/articles/${id}`, article);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);
