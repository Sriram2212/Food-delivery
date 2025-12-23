const express = require('express');
const restaurantRoutes = require('./restaurant.routes');
const orderRoutes = require('./order.routes');
const deliveryRoutes = require('./delivery.routes');
const adminRoutes = require('./admin.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Gateway is running',
        timestamp: new Date().toISOString(),
    });
});

// Route mounting
router.use('/restaurants', restaurantRoutes);
router.use('/orders', orderRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes); // Mounted user routes

module.exports = router;
