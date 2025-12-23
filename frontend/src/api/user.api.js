import apiClient from './client';

const userAPI = {
    toggleFavorite: async (restaurantId) => {
        const response = await apiClient.post('/users/favorites', { restaurantId });
        return response.data;
    },
    getFavorites: async () => {
        const response = await apiClient.get('/users/favorites');
        return response.data;
    },
    getNotifications: async () => {
        const response = await apiClient.get('/users/notifications');
        return response.data;
    },
    markNotificationsRead: async () => {
        const response = await apiClient.put('/users/notifications/read');
        return response.data;
    }
};

export default userAPI;
