const config = require('./env');

const services = {
    restaurant: {
        url: config.RESTAURANT_SERVICE_URL,
        timeout: 5000,
    },
    order: {
        url: config.ORDER_SERVICE_URL,
        timeout: 5000,
    },
    delivery: {
        url: config.DELIVERY_SERVICE_URL,
        timeout: 5000,
    },
};

module.exports = services;
