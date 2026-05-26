import api from './api';

export const tablesService = {
    getAll: () => api.get('/tables'),
    getById: (id) => api.get(`/tables/${id}`),
    getDisponibles: () => api.get('/tables/disponibles'),
    getByStatut: (statut) => api.get(`/tables/statut/${statut}`),
    getLibres: () => api.get('/tables/libres'),
    getStatistiques: () => api.get('/tables/statistiques'),
    create: (data) => api.post('/tables', data),
    update: (id, data) => api.put(`/tables/${id}`, data),
    delete: (id) => api.delete(`/tables/${id}`),
    changerStatut: (id, statut) => api.patch(`/tables/${id}/statut?statut=${statut}`),
    occuper: (id) => api.post(`/tables/${id}/occuper`),
    liberer: (id) => api.post(`/tables/${id}/liberer`),
    reserver: (id) => api.post(`/tables/${id}/reserver`),
    nettoyer: (id) => api.post(`/tables/${id}/nettoyer`),
};