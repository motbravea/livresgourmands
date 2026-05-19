import axios from 'axios';

export const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lg_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Une erreur est survenue.';
    return Promise.reject(new Error(msg));
  }
);

/* ---------- Auth ---------- */
export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
};

/* ---------- Ouvrages ---------- */
export const ouvragesApi = {
  list: () => api.get('/ouvrages').then((r) => r.data),
  get: (id) => api.get(`/ouvrages/${id}`).then((r) => r.data),
  create: (payload) => api.post('/ouvrages', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/ouvrages/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/ouvrages/${id}`).then((r) => r.data),
};

/* ---------- Categories ---------- */
export const categoriesApi = {
  list: () => api.get('/categories').then((r) => r.data),
  get: (id) => api.get(`/categories/${id}`).then((r) => r.data),
  create: (payload) => api.post('/categories', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export default api;
