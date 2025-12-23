const restaurantService = require('../services/restaurant.service');
const menuService = require('../services/menu.service');

class RestaurantController {
    async getAllRestaurants(req, res, next) {
        try {
            const result = await restaurantService.getAllRestaurants(req.query);
            res.json({
                success: true,
                message: 'Restaurants retrieved successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getRestaurantById(req, res, next) {
        try {
            const restaurant = await restaurantService.getRestaurantById(req.params.id);
            res.json({
                success: true,
                message: 'Restaurant retrieved successfully',
                data: restaurant,
            });
        } catch (error) {
            next(error);
        }
    }

    async createRestaurant(req, res, next) {
        try {
            const restaurant = await restaurantService.createRestaurant(req.body);
            res.status(201).json({
                success: true,
                message: 'Restaurant created successfully',
                data: restaurant,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateRestaurant(req, res, next) {
        try {
            const restaurant = await restaurantService.updateRestaurant(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Restaurant updated successfully',
                data: restaurant,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteRestaurant(req, res, next) {
        try {
            await restaurantService.deleteRestaurant(req.params.id);
            res.json({
                success: true,
                message: 'Restaurant deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async getMenu(req, res, next) {
        try {
            const menu = await menuService.getMenu(req.params.id);
            res.json({
                success: true,
                message: 'Menu retrieved successfully',
                data: menu,
            });
        } catch (error) {
            next(error);
        }
    }

    async addMenuItem(req, res, next) {
        try {
            const menuItem = await menuService.addMenuItem(req.params.id, req.body);
            res.status(201).json({
                success: true,
                message: 'Menu item added successfully',
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMenuItem(req, res, next) {
        try {
            const menuItem = await menuService.updateMenuItem(
                req.params.id,
                req.params.itemId,
                req.body
            );
            res.json({
                success: true,
                message: 'Menu item updated successfully',
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMenuItem(req, res, next) {
        try {
            await menuService.deleteMenuItem(req.params.id, req.params.itemId);
            res.json({
                success: true,
                message: 'Menu item deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RestaurantController();
