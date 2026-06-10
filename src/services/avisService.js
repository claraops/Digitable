import api from './api';

export const avisService = {
  getAll: async () => {
    try {
      const response = await api.get('/avis');
      return response;
    } catch (error) {
      console.error('Erreur getAll avis:', error);
      return { data: [] };
    }
  },

  getById: async (id) => {
    return await api.get(`/avis/${id}`);
  },

  getByCommande: async (commandeId) => {
    try {
      const response = await api.get('/avis');
      const avis = (Array.isArray(response.data) ? response.data : [])
        .find(a => (a.commande?.idCommande || a._ID_COMMANDE) === commandeId);
      return { data: avis || null };
    } catch (error) {
      console.error('Erreur getByCommande:', error);
      return { data: null };
    }
  },

  getByPlatId: async (platId) => {
    try {
      const response = await api.get(`/avis/plat/${platId}`);
      return response;
    } catch (error) {
      console.error('Erreur getByPlatId:', error);
      return { data: [] };
    }
  },

  create: async (avisData) => {
    return await api.post('/avis', avisData);
  },

  delete: async (id) => {
    return await api.delete(`/avis/${id}`);
  }
};