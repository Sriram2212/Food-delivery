const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/cancel', orderController.cancelOrder);
router.get('/', orderController.getAllOrders);

module.exports = router;
