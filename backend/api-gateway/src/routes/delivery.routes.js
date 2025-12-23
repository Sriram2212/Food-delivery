const express = require('express');
const deliveryProxy = require('../proxy/delivery.proxy');
const { protect } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');
const { successResponse } = require('../utils/responseFormatter');

const router = express.Router();

// All delivery routes require authentication
router.use(protect);

// Assign delivery - Admin or System
router.post('/assign', roleMiddleware(ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await deliveryProxy.assignDelivery(req.body.orderId);
        res.status(201).json(successResponse(result.data, result.message, 201));
    } catch (error) {
        next(error);
    }
});

// Get delivery status by order ID
router.get('/order/:orderId', async (req, res, next) => {
    try {
        const result = await deliveryProxy.getDeliveryStatus(req.params.orderId);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Update delivery status - Delivery partner or Admin
router.patch('/:deliveryId/status', roleMiddleware(ROLES.DELIVERY, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await deliveryProxy.updateDeliveryStatus(req.params.deliveryId, req.body.status);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

// Get delivery partner's orders
router.get('/partner/:partnerId', roleMiddleware(ROLES.DELIVERY, ROLES.ADMIN), async (req, res, next) => {
    try {
        const result = await deliveryProxy.getDeliveryPartnerOrders(req.params.partnerId);
        res.json(successResponse(result.data, result.message));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
