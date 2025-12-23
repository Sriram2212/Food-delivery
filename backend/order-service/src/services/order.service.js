const Order = require('../models/Order');
const eventPublisher = require('../events/publisher');

class OrderService {
    async createOrder(orderData) {
        const order = new Order(orderData);

        // Calculate estimated delivery time (30-45 minutes from now)
        const estimatedMinutes = 30 + Math.floor(Math.random() * 15);
        order.estimatedDeliveryTime = new Date(Date.now() + estimatedMinutes * 60000);

        await order.save();

        // Publish event safely
        try {
            if (eventPublisher && typeof eventPublisher.publishOrderCreated === 'function') {
                await eventPublisher.publishOrderCreated(order);
            }
        } catch (evtError) {
            console.warn('⚠️ Event publishing failed (non-critical):', evtError.message);
        }

        console.log('✅ Order created successfully:', order._id);

        return order;
    }

    async getOrderById(orderId) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw { statusCode: 404, message: 'Order not found' };
        }
        return order;
    }

    async getUserOrders(userId) {
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .lean();
        return orders;
    }

    async getRestaurantOrders(restaurantId) {
        const orders = await Order.find({
            restaurantId,
            status: { $in: ['CREATED', 'CONFIRMED', 'PREPARING'] }
        })
            .sort({ createdAt: -1 })
            .lean();
        return orders;
    }

    async updateOrderStatus(orderId, newStatus) {
        const order = await Order.findById(orderId);

        if (!order) {
            throw { statusCode: 404, message: 'Order not found' };
        }

        // Validate status transition
        const validTransitions = {
            CREATED: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['PREPARING', 'CANCELLED'],
            PREPARING: ['OUT_FOR_DELIVERY', 'CANCELLED'],
            OUT_FOR_DELIVERY: ['DELIVERED'],
            DELIVERED: [],
            CANCELLED: [],
        };

        /* Strict validation disabled for Admin Demo freedom
        if (!validTransitions[order.status].includes(newStatus)) {
            throw {
                statusCode: 400,
                message: `Cannot transition from ${order.status} to ${newStatus}`
            };
        }
        */

        order.status = newStatus;

        if (newStatus === 'DELIVERED') {
            order.actualDeliveryTime = new Date();
        }

        await order.save();

        // Publish appropriate event
        const eventMap = {
            CONFIRMED: eventPublisher.publishOrderConfirmed,
            PREPARING: eventPublisher.publishOrderPreparing,
            OUT_FOR_DELIVERY: eventPublisher.publishOrderOutForDelivery,
            DELIVERED: eventPublisher.publishOrderDelivered,
            CANCELLED: eventPublisher.publishOrderCancelled,
        };

        if (eventMap[newStatus]) {
            await eventMap[newStatus].call(eventPublisher, order);
        }

        return order;
    }

    async cancelOrder(orderId) {
        const order = await Order.findById(orderId);

        if (!order) {
            throw { statusCode: 404, message: 'Order not found' };
        }

        if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
            throw { statusCode: 400, message: 'Cannot cancel this order' };
        }

        order.status = 'CANCELLED';
        await order.save();

        await eventPublisher.publishOrderCancelled(order);

        return order;
    }

    async getAllOrders(filters = {}) {
        const { page = 1, limit = 20, status } = filters;
        const query = {};

        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();

        const total = await Order.countDocuments(query);

        return {
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
}

module.exports = new OrderService();
