import api from './api';

export const platService = {
    getAll: () => api.get('/plats'),
    getDisponibles: () => api.get('/plats/disponibles'),
    getById: (id) => api.get(`/plats/${id}`),
    
    // ✅ Admin - URL correcte
    create: (data) => api.post('/admin/plats', data),
    update: (id, data) => api.put(`/admin/plats/${id}`, data),
    delete: (id) => api.delete(`/admin/plats/${id}`),
    toggleDisponibilite: (id) => api.patch(`/admin/plats/${id}/disponibilite`),
};