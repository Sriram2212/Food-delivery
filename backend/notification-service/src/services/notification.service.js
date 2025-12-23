const Notification = require('../models/Notification');

class NotificationService {
    async sendNotification(type, recipient, message, data = {}) {
        try {
            // Save to Database
            if (recipient && recipient !== 'admin') {
                await Notification.create({
                    userId: recipient,
                    title: 'Order Update',
                    message: message,
                    type: 'ORDER_UPDATE',
                    relatedId: data.orderId
                });
            }
        } catch (err) {
            console.error('Failed to save notification', err);
        }

        // Mock notification sending
        console.log(`
    ╔════════════════════════════════════════╗
    ║         📧 NOTIFICATION SENT          ║
    ╠════════════════════════════════════════╣
    ║  Type: ${type.padEnd(30)}║
    ║  To: ${recipient.padEnd(32)}║
    ║  Message: ${message.substring(0, 26).padEnd(26)}║
    ╚════════════════════════════════════════╝
    `);

        // ... (rest of logic)
        return {
            success: true,
            type,
            recipient,
            message,
            sentAt: new Date(),
        };
    }

    async sendOrderCreatedNotification(order) {
        await this.sendNotification(
            'EMAIL',
            order.userId,
            `Your order #${order._id} has been created successfully!`,
            { orderId: order._id, totalAmount: order.totalAmount }
        );
    }

    async sendOrderConfirmedNotification(order) {
        await this.sendNotification(
            'EMAIL',
            order.userId,
            `Your order #${order._id} has been confirmed by the restaurant!`,
            { orderId: order._id }
        );
    }

    async sendOrderPreparingNotification(order) {
        await this.sendNotification(
            'PUSH',
            order.userId,
            `Your order #${order._id} is being prepared!`,
            { orderId: order._id }
        );
    }

    async sendOrderOutForDeliveryNotification(order) {
        await this.sendNotification(
            'PUSH',
            order.userId,
            `Your order #${order._id} is out for delivery!`,
            { orderId: order._id }
        );
    }

    async sendOrderDeliveredNotification(order) {
        await this.sendNotification(
            'EMAIL',
            order.userId,
            `Your order #${order._id} has been delivered! Enjoy your meal!`,
            { orderId: order._id }
        );
    }

    async sendOrderCancelledNotification(order) {
        await this.sendNotification(
            'EMAIL',
            order.userId,
            `Your order #${order._id} has been cancelled.`,
            { orderId: order._id }
        );
    }
}

module.exports = new NotificationService();
