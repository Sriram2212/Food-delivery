const BaseProxy = require('./base.proxy');
const services = require('../config/services');

class DeliveryProxy extends BaseProxy {
    constructor() {
        super(services.delivery.url, services.delivery.timeout);
    }

    async assignDelivery(orderId) {
        return this.forwardRequest('post', '/api/delivery/assign', { orderId });
    }

    async getDeliveryStatus(orderId) {
        return this.forwardRequest('get', `/api/delivery/order/${orderId}`);
    }

    async updateDeliveryStatus(deliveryId, status) {
        return this.forwardRequest('patch', `/api/delivery/${deliveryId}/status`, { status });
    }

    async getDeliveryPartnerOrders(partnerId) {
        return this.forwardRequest('get', `/api/delivery/partner/${partnerId}`);
    }

    async getAllDeliveries(query) {
        return this.forwardRequest('get', `/api/delivery?${new URLSearchParams(query)}`);
    }
}

module.exports = new DeliveryProxy();
