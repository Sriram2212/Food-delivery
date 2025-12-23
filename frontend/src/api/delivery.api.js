import apiClient from './client';

export const deliveryAPI = {
    assign: (orderId) => apiClient.post('/delivery/assign', { orderId }),
    getStatus: (orderId) => apiClient.get(`/delivery/order/${orderId}`),
    updateStatus: (deliveryId, status) => apiClient.patch(`/delivery/${deliveryId}/status`, { status }),
};

export default deliveryAPI;
