// src/services/commandeService.js
import api from './api';

export const commandeService = {
    create: (data) => api.post('/commandes', data),
    getById: (id) => api.get(`/commandes/${id}`),
    getByStatut: (statut) => api.get(`/commandes/statut/${statut}`),
    updateStatut: (id, statut) => api.patch(`/commandes/${id}/statut?statut=${statut}`),
    annuler: (id) => api.post(`/commandes/${id}/annuler`),
    getHistorique: (userId) => api.get(`/commandes/utilisateur/${userId}`),
    
    // Admin - URL CORRIGÉE
    getAll: () => api.get('/admin/commandes'),  // ✅ Plus de double /commandes
    getAllByStatut: (statut) => api.get(`/admin/commandes/statut/${statut}`),
};