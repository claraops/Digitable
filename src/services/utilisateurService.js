import api from './api';

export const utilisateurService = {
    getAll: () => api.get('/utilisateurs'),
    getById: (id) => api.get(`/utilisateurs/${id}`),
    getByEmail: (email) => api.get(`/utilisateurs/email/${email}`),
    create: (data) => api.post('/utilisateurs', data),
    update: (id, data) => api.put(`/utilisateurs/${id}`, data),
    delete: (id) => api.delete(`/utilisateurs/${id}`),
};