const express = require('express');
const restaurantProxy = require('../proxy/restaurant.proxy');
const { protect } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');
const { successResponse } = require('../utils/responseFormatter');

const router = express.Router();

// Public routes
router.get('/', async (req, res, next) => {
    try {
        const result = await restaurantProxy.getAllRestaurants(req.query);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await restaurantProxy.getRestaurantById(req.params.id);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

router.get('/:id/menu', async (req, res, next) => {
    try {
        const result = await restaurantProxy.getMenu(req.params.id);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Protected routes - Restaurant owner
router.post('/', protect, roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await restaurantProxy.createRestaurant(req.body);
        res.status(201).json(successResponse(result.data, result.message, 201));
    } catch (error) {
        next(error);
    }
});

router.put('/:id', protect, roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await restaurantProxy.updateRestaurant(req.params.id, req.body);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', protect, roleMiddleware(ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await restaurantProxy.deleteRestaurant(req.params.id);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Menu item routes
router.post('/:id/menu', protect, roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await restaurantProxy.addMenuItem(req.params.id, req.body);
        res.status(201).json(successResponse(result.data, result.message, 201));
    } catch (error) {
        next(error);
    }
});

router.put('/:id/menu/:itemId', protect, roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await restaurantProxy.updateMenuItem(req.params.id, req.params.itemId, req.body);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

router.delete('/:id/menu/:itemId', protect, roleMiddleware(ROLES.RESTAURANT, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await restaurantProxy.deleteMenuItem(req.params.id, req.params.itemId);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
