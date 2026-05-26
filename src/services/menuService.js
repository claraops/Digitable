import api from './api';

export const menuService = {
  // ✅ GET - doit être la bonne méthode
  getAll: () => api.get('/menus'),
  getActifs: () => api.get('/menus/actifs'),
  getById: (id) => api.get(`/menus/${id}`),
  getPlatsDuMenu: (id) => api.get(`/menus/${id}/plats`),
  
  // Admin
  create: (data) => api.post('/admin/menus', data),
  update: (id, data) => api.put(`/admin/menus/${id}`, data),
  delete: (id) => api.delete(`/admin/menus/${id}`),
  addPlat: (menuId, platId) => api.post(`/admin/menus/${menuId}/plats/${platId}`),
  removePlat: (menuId, platId) => api.delete(`/admin/menus/${menuId}/plats/${platId}`),
};