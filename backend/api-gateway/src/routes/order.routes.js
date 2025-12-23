const express = require('express');
const orderProxy = require('../proxy/order.proxy');
const { protect } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');
const { successResponse } = require('../utils/responseFormatter');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Create order - Users only
router.post('/', roleMiddleware(ROLES.USER), async (req, res, next) => {
    try {
        const result = await orderProxy.createOrder(req.body, req.user.userId);
        res.status(201).json(successResponse(result.data, result.message, 201));
    } catch (error) {
        next(error);
    }
});

// Get order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const result = await orderProxy.getOrderById(req.params.id);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Get user's orders
router.get('/user/my-orders', roleMiddleware(ROLES.USER), async (req, res, next) => {
    try {
        const result = await orderProxy.getUserOrders(req.user.userId);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Get restaurant orders
router.get('/restaurant/:restaurantId', roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await orderProxy.getRestaurantOrders(req.params.restaurantId);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Update order status - Restaurant or Admin
router.patch('/:id/status', roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await orderProxy.updateOrderStatus(req.params.id, req.body.status);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Cancel order - User or Admin
router.patch('/:id/cancel', roleMiddleware(ROLES.USER, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await orderProxy.cancelOrder(req.params.id);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
