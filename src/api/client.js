import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour ajouter l'authentification Basic depuis le backend Spring Boot
api.interceptors.request.use((config) => {
  const basicAuth = localStorage.getItem('basicAuth');
  if (basicAuth) config.headers.Authorization = `Basic ${basicAuth}`;
  return config;
});

export default api;