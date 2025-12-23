const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/restaurants', adminController.getAllRestaurants);
router.get('/restaurants/stats', adminController.getRestaurantStats);
router.patch('/restaurants/:id/toggle-status', adminController.toggleRestaurantStatus);

module.exports = router;
