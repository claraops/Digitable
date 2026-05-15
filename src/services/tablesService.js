import api from './api';

export const tablesService = {
  getAll: () => api.get('/tables'),
  getById: (id) => api.get(`/tables/${id}`),
  getDisponibles: () => api.get('/tables/disponibles'),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
  changerStatut: (id, statut) => api.patch(`/tables/${id}/statut?statut=${statut}`),
  getStatistiques: () => api.get('/tables/statistiques'),
};