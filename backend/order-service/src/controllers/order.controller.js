const orderService = require('../services/order.service');

class OrderController {
    async createOrder(req, res, next) {
        console.log('📝 Create Order Request:', {
            body: req.body,
            typeOfNext: typeof next,
            isNextFunction: typeof next === 'function'
        });

        try {
            if (typeof next !== 'function') {
                console.error('CRITICAL: "next" is not a function!', next);
                return res.status(500).json({ success: false, message: 'Internal Server Error: Middleware issue' });
            }

            const order = await orderService.createOrder(req.body);
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order,
            });
        } catch (error) {
            console.error('❌ Order Creation Error:', error);
            if (typeof next === 'function') {
                next(error);
            } else {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    }

    async getOrderById(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            res.json({
                success: true,
                message: 'Order retrieved successfully',
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserOrders(req, res, next) {
        try {
            const orders = await orderService.getUserOrders(req.params.userId);
            res.json({
                success: true,
                message: 'User orders retrieved successfully',
                data: orders,
            });
        } catch (error) {
            next(error);
        }
    }

    async getRestaurantOrders(req, res, next) {
        try {
            const orders = await orderService.getRestaurantOrders(req.params.restaurantId);
            res.json({
                success: true,
                message: 'Restaurant orders retrieved successfully',
                data: orders,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
            res.json({
                success: true,
                message: 'Order status updated successfully',
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const order = await orderService.cancelOrder(req.params.id);
            res.json({
                success: true,
                message: 'Order cancelled successfully',
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllOrders(req, res, next) {
        try {
            const result = await orderService.getAllOrders(req.query);
            res.json({
                success: true,
                message: 'Orders retrieved successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
