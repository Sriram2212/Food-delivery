const redisClient = require('../config/redis');
const ORDER_TOPICS = require('./topics');

class EventPublisher {
    async publishOrderEvent(topic, orderData) {
        try {
            const message = JSON.stringify({
                topic,
                data: orderData,
                timestamp: new Date().toISOString(),
            });

            await redisClient.publish(topic, message);
            console.log(`📢 Event published: ${topic}`);
        } catch (error) {
            console.error('❌ Error publishing event:', error);
        }
    }

    async publishOrderCreated(order) {
        await this.publishOrderEvent(ORDER_TOPICS.ORDER_CREATED, order);
    }

    async publishOrderConfirmed(order) {
        await this.publishOrderEvent(ORDER_TOPICS.ORDER_CONFIRMED, order);
    }

    async publishOrderPreparing(order) {
        await this.publishOrderEvent(ORDER_TOPICS.ORDER_PREPARING, order);
    }

    async publishOrderOutForDelivery(order) {
        await this.publishOrderEvent(ORDER_TOPICS.ORDER_OUT_FOR_DELIVERY, order);
    }

    async publishOrderDelivered(order) {
        await this.publishOrderEvent(ORDER_TOPICS.ORDER_DELIVERED, order);
    }

    async publishOrderCancelled(order) {
        await this.publishOrderEvent(ORDER_TOPICS.ORDER_CANCELLED, order);
    }
}

module.exports = new EventPublisher();
