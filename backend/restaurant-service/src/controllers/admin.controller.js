const adminService = require('../services/admin.service');

class AdminController {
    async getAllRestaurants(req, res, next) {
        try {
            const result = await adminService.getAllRestaurants(req.query);
            res.json({
                success: true,
                message: 'All restaurants retrieved successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getRestaurantStats(req, res, next) {
        try {
            const stats = await adminService.getRestaurantStats();
            res.json({
                success: true,
                message: 'Restaurant statistics retrieved successfully',
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleRestaurantStatus(req, res, next) {
        try {
            const restaurant = await adminService.toggleRestaurantStatus(req.params.id);
            res.json({
                success: true,
                message: 'Restaurant status updated successfully',
                data: restaurant,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
