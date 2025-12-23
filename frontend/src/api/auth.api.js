import apiClient from './client';

const authAPI = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (name, email, password, phoneNumber) => {
        const response = await apiClient.post('/auth/register', { name, email, password, phoneNumber });
        return response.data;
    },

    getProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        // apiClient interceptor adds token automatically if in localStorage, 
        // but explicit header also fine to override if needed. 
        // We'll rely on interceptor or pass explicit if not yet set in storage?
        // Actually getProfile usually happens when token IS in storage.
        const response = await apiClient.get('/auth/profile');
        return response.data;
    }
};

export default authAPI;
