import api from './api';

export const avisService = {
    create: (data) => api.post('/avis', data),
    getByCommande: (id) => api.get(`/avis/commande/${id}`),
};
