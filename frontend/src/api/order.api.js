import apiClient from './client';

export const orderAPI = {
    create: (data) => apiClient.post('/orders', data),
    getById: (id) => apiClient.get(`/orders/${id}`),
    getMyOrders: () => apiClient.get('/orders/user/my-orders'),
    updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
    cancel: (id) => apiClient.patch(`/orders/${id}/cancel`),
};

export default orderAPI;
