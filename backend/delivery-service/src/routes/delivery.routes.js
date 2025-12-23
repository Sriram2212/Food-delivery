const express = require('express');
const deliveryService = require('../services/delivery.service');

const router = express.Router();

router.post('/assign', async (req, res, next) => {
    try {
        const delivery = await deliveryService.assignDelivery(req.body.orderId);
        res.status(201).json({
            success: true,
            message: 'Delivery assigned successfully',
            data: delivery,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/order/:orderId', async (req, res, next) => {
    try {
        const delivery = await deliveryService.getDeliveryStatus(req.params.orderId);
        res.json({
            success: true,
            message: 'Delivery status retrieved successfully',
            data: delivery,
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/:deliveryId/status', async (req, res, next) => {
    try {
        const delivery = await deliveryService.updateDeliveryStatus(
            req.params.deliveryId,
            req.body.status
        );
        res.json({
            success: true,
            message: 'Delivery status updated successfully',
            data: delivery,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/partner/:partnerId', async (req, res, next) => {
    try {
        const deliveries = await deliveryService.getDeliveryPartnerOrders(req.params.partnerId);
        res.json({
            success: true,
            message: 'Partner deliveries retrieved successfully',
            data: deliveries,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const deliveries = await deliveryService.getAllDeliveries();
        res.json({
            success: true,
            message: 'All deliveries retrieved successfully',
            data: deliveries,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
