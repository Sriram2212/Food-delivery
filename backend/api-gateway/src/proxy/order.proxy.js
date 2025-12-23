const BaseProxy = require('./base.proxy');
const services = require('../config/services');

class OrderProxy extends BaseProxy {
    constructor() {
        super(services.order.url, services.order.timeout);
    }

    async createOrder(data, userId) {
        return this.forwardRequest('post', '/api/orders', { ...data, userId });
    }

    async getOrderById(id) {
        return this.forwardRequest('get', `/api/orders/${id}`);
    }

    async getUserOrders(userId) {
        return this.forwardRequest('get', `/api/orders/user/${userId}`);
    }

    async getRestaurantOrders(restaurantId) {
        return this.forwardRequest('get', `/api/orders/restaurant/${restaurantId}`);
    }

    async updateOrderStatus(id, status) {
        return this.forwardRequest('patch', `/api/orders/${id}/status`, { status });
    }

    async cancelOrder(id) {
        return this.forwardRequest('patch', `/api/orders/${id}/cancel`);
    }

    async getAllOrders(query) {
        return this.forwardRequest('get', `/api/orders?${new URLSearchParams(query)}`);
    }
}

module.exports = new OrderProxy();
