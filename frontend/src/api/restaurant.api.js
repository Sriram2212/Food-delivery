import apiClient from './client';

export const restaurantAPI = {
    getAll: (params = {}) => apiClient.get('/restaurants', { params }),
    getById: (id) => apiClient.get(`/restaurants/${id}`),
    getMenu: (id) => apiClient.get(`/restaurants/${id}/menu`),
    create: (data) => apiClient.post('/restaurants', data),
    update: (id, data) => apiClient.put(`/restaurants/${id}`, data),
    delete: (id) => apiClient.delete(`/restaurants/${id}`),
};

export default restaurantAPI;
