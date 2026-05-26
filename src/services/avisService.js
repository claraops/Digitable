// services/avisService.js
import api from './api';

export const avisService = {
  // Récupérer tous les avis
  getAll: async () => {
    try {
      // ✅ Supprimez '/api/v1' car déjà dans baseURL
      const response = await api.get('/avis');
      return response;
    } catch (error) {
      console.error('Erreur getAll avis:', error);
      return { data: [] };
    }
  },
  
  // Récupérer un avis par ID
  getById: async (id) => {
    return await api.get(`/avis/${id}`);
  },
  
  // Récupérer les avis par commande
  getByCommande: async (commandeId) => {
    return await api.get(`/avis/commande/${commandeId}`);
  },
  
  // Créer un avis
  create: async (avisData) => {
    return await api.post('/avis', avisData);
  },
  
  // Supprimer un avis
  delete: async (id) => {
    return await api.delete(`/avis/${id}`);
  }
};