const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');

const router = express.Router();

// Restaurant routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

// Menu routes
router.get('/:id/menu', restaurantController.getMenu);
router.post('/:id/menu', restaurantController.addMenuItem);
router.put('/:id/menu/:itemId', restaurantController.updateMenuItem);
router.delete('/:id/menu/:itemId', restaurantController.deleteMenuItem);

module.exports = router;
