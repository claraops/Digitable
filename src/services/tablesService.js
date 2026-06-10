// services/tablesService.js
import api from './api';

export const tablesService = {
    getAll: () => api.get('/tables'),
    getById: (id) => api.get(`/tables/${id}`),
    create: (data) => api.post('/tables', data),
    update: (id, data) => api.put(`/tables/${id}`, data),
    delete: (id) => api.delete(`/tables/${id}`),
    changerStatut: (id, statut) => api.patch(`/tables/${id}/statut?statut=${statut}`),
    getDisponibles: () => api.get('/tables/disponibles'),
    getByStatut: (statut) => api.get(`/tables/statut/${statut}`),
    getLibres: () => api.get('/tables/libres'),
};