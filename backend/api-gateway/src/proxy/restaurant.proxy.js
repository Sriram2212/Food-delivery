const BaseProxy = require('./base.proxy');
const services = require('../config/services');

class RestaurantProxy extends BaseProxy {
    constructor() {
        super(services.restaurant.url, services.restaurant.timeout);
    }

    async getAllRestaurants(query) {
        return this.forwardRequest('get', `/api/restaurants?${new URLSearchParams(query)}`);
    }

    async getRestaurantById(id) {
        return this.forwardRequest('get', `/api/restaurants/${id}`);
    }

    async createRestaurant(data) {
        return this.forwardRequest('post', '/api/restaurants', data);
    }

    async updateRestaurant(id, data) {
        return this.forwardRequest('put', `/api/restaurants/${id}`, data);
    }

    async deleteRestaurant(id) {
        return this.forwardRequest('delete', `/api/restaurants/${id}`);
    }

    async getMenu(restaurantId) {
        return this.forwardRequest('get', `/api/restaurants/${restaurantId}/menu`);
    }

    async addMenuItem(restaurantId, data) {
        return this.forwardRequest('post', `/api/restaurants/${restaurantId}/menu`, data);
    }

    async updateMenuItem(restaurantId, itemId, data) {
        return this.forwardRequest('put', `/api/restaurants/${restaurantId}/menu/${itemId}`, data);
    }

    async deleteMenuItem(restaurantId, itemId) {
        return this.forwardRequest('delete', `/api/restaurants/${restaurantId}/menu/${itemId}`);
    }
}

module.exports = new RestaurantProxy();
