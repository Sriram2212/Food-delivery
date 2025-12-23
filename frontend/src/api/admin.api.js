import apiClient from './client';

const adminAPI = {
    getStats: () => apiClient.get('/admin/metrics'),
    getRestaurants: () => apiClient.get('/admin/restaurants'),
    getOrders: () => apiClient.get('/admin/orders'),
    getUsers: () => apiClient.get('/admin/users'),
    updateOrderStatus: (id, status) => apiClient.patch(`/admin/orders/${id}/status`, { status }),
};

export default adminAPI;
