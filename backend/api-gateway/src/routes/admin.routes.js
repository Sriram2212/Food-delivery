const express = require('express');
const orderProxy = require('../proxy/order.proxy');
const restaurantProxy = require('../proxy/restaurant.proxy');
const deliveryProxy = require('../proxy/delivery.proxy');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');
const { successResponse } = require('../utils/responseFormatter');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(roleMiddleware(ROLES.ADMIN));

// Get all orders
router.get('/orders', async (req, res, next) => {
    try {
        const result = await orderProxy.getAllOrders(req.query);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Get all restaurants
router.get('/restaurants', async (req, res, next) => {
    try {
        const result = await restaurantProxy.getAllRestaurants(req.query);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Get all deliveries
router.get('/deliveries', async (req, res, next) => {
    try {
        const result = await deliveryProxy.getAllDeliveries(req.query);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// System metrics endpoint
router.get('/metrics', async (req, res, next) => {
    try {
        // This would aggregate data from multiple services
        const metrics = {
            totalOrders: 0,
            totalRestaurants: 0,
            activeDeliveries: 0,
            // Add more metrics as needed
        };
        res.json(successResponse(metrics, 'System metrics retrieved'));
    } catch (error) {
        next(error);
    }
});

// Get all users
router.get('/users', authController.getAllUsers);

module.exports = router;
