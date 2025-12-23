const Restaurant = require('../models/Restaurant');

class AdminService {
    async getAllRestaurants(filters = {}) {
        const { page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;

        const restaurants = await Restaurant.find()
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();

        const total = await Restaurant.countDocuments();

        return {
            restaurants,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getRestaurantStats() {
        const total = await Restaurant.countDocuments();
        const active = await Restaurant.countDocuments({ isActive: true });
        const inactive = total - active;

        const avgRating = await Restaurant.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ]);

        return {
            total,
            active,
            inactive,
            averageRating: avgRating[0]?.avgRating || 0,
        };
    }

    async toggleRestaurantStatus(id) {
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        restaurant.isActive = !restaurant.isActive;
        await restaurant.save();

        return restaurant;
    }
}

module.exports = new AdminService();
