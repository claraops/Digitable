import api from './api';

export const commandeService = {
  getAll: () => api.get('/commandes'),
  getById: (id) => api.get(`/commandes/${id}`),
  getByStatut: (statut) => api.get(`/commandes/statut/${statut}`),
  updateStatut: (id, statut) => api.patch(`/commandes/${id}/statut?statut=${statut}`),
  annuler: (id) => api.post(`/commandes/${id}/annuler`),
  getHistorique: (userId) => api.get(`/commandes/utilisateur/${userId}`),
  create: (data) => api.post('/commandes', data),
};