// services/menuService.js
import api from './api';

export const menuService = {
  getAll: () => api.get('/menus'),
  getActifs: () => api.get('/menus/actifs'),
  getById: (id) => api.get(`/menus/${id}`),
  getPlatsDuMenu: (id) => api.get(`/menus/${id}/plats`),
  
  // Admin
  create: (data) => api.post('/admin/menus', data),
  update: (id, data) => api.put(`/admin/menus/${id}`, data),
  delete: (id) => api.delete(`/admin/menus/${id}`),
  
  // ✅ CORRECTION : L'URL doit être '/admin/menus/{menuId}/plats/{platId}'
  addPlat: (menuId, platId) => api.post(`/admin/menus/${menuId}/plats/${platId}`),
  removePlat: (menuId, platId) => api.delete(`/admin/menus/${menuId}/plats/${platId}`),
};