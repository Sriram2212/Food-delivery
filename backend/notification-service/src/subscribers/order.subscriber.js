const subscriber = require('../redis');
const notificationService = require('../services/notification.service');

const ORDER_TOPICS = {
    ORDER_CREATED: 'order.created',
    ORDER_CONFIRMED: 'order.confirmed',
    ORDER_PREPARING: 'order.preparing',
    ORDER_OUT_FOR_DELIVERY: 'order.out_for_delivery',
    ORDER_DELIVERED: 'order.delivered',
    ORDER_CANCELLED: 'order.cancelled',
};

class OrderSubscriber {
    async subscribe() {
        // Subscribe to all order topics
        await subscriber.subscribe(
            ORDER_TOPICS.ORDER_CREATED,
            ORDER_TOPICS.ORDER_CONFIRMED,
            ORDER_TOPICS.ORDER_PREPARING,
            ORDER_TOPICS.ORDER_OUT_FOR_DELIVERY,
            ORDER_TOPICS.ORDER_DELIVERED,
            ORDER_TOPICS.ORDER_CANCELLED
        );

        console.log('📡 Subscribed to order events');

        // Handle messages
        subscriber.on('message', async (channel, message) => {
            try {
                const event = JSON.parse(message);
                console.log(`📨 Received event: ${channel}`);

                switch (channel) {
                    case ORDER_TOPICS.ORDER_CREATED:
                        await notificationService.sendOrderCreatedNotification(event.data);
                        break;
                    case ORDER_TOPICS.ORDER_CONFIRMED:
                        await notificationService.sendOrderConfirmedNotification(event.data);
                        break;
                    case ORDER_TOPICS.ORDER_PREPARING:
                        await notificationService.sendOrderPreparingNotification(event.data);
                        break;
                    case ORDER_TOPICS.ORDER_OUT_FOR_DELIVERY:
                        await notificationService.sendOrderOutForDeliveryNotification(event.data);
                        break;
                    case ORDER_TOPICS.ORDER_DELIVERED:
                        await notificationService.sendOrderDeliveredNotification(event.data);
                        break;
                    case ORDER_TOPICS.ORDER_CANCELLED:
                        await notificationService.sendOrderCancelledNotification(event.data);
                        break;
                }
            } catch (error) {
                console.error('❌ Error processing event:', error);
            }
        });
    }
}

module.exports = new OrderSubscriber();
