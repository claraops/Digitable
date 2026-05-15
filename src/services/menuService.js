import api from './api';

export const menuService = {
  getAll: () => api.get('/menus'),
  getActifs: () => api.get('/menus/actifs'),
  getById: (id) => api.get(`/menus/${id}`),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
  addPlat: (menuId, platId) => api.post(`/menus/${menuId}/plats/${platId}`),
  removePlat: (menuId, platId) => api.delete(`/menus/${menuId}/plats/${platId}`),
  getPlatsDuMenu: (id) => api.get(`/menus/${id}/plats`),
};