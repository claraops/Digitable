import api from './api';

export const platService = {
  getAll: () => api.get('/plats'),
  getDisponibles: () => api.get('/plats/disponibles'),
  getById: (id) => api.get(`/plats/${id}`),
  create: (data) => api.post('/plats', data),
  update: (id, data) => api.put(`/plats/${id}`, data),
  delete: (id) => api.delete(`/plats/${id}`),
};