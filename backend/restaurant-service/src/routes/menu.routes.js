const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');

const router = express.Router();

// Menu-specific routes
router.get('/:restaurantId', restaurantController.getMenu);
router.post('/:restaurantId', restaurantController.addMenuItem);
router.put('/:restaurantId/:itemId', restaurantController.updateMenuItem);
router.delete('/:restaurantId/:itemId', restaurantController.deleteMenuItem);

module.exports = router;
