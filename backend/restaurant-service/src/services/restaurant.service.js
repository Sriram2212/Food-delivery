const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const cacheUtil = require('../utils/cache.util');

class RestaurantService {
    async getAllRestaurants(filters = {}) {
        const { city, cuisine, minRating, search, page = 1, limit = 10 } = filters;

        const query = { isActive: true };

        if (city) query['address.city'] = new RegExp(city, 'i');
        if (cuisine) query.cuisine = cuisine;
        if (minRating) query.rating = { $gte: parseFloat(minRating) };
        if (search) query.$text = { $search: search };

        const skip = (page - 1) * limit;

        const restaurants = await Restaurant.find(query)
            .select('-menu')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ rating: -1 })
            .lean();

        const total = await Restaurant.countDocuments(query);

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

    async getRestaurantById(id) {
        const cacheKey = `restaurant:${id}`;
        const cached = await cacheUtil.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const restaurant = await Restaurant.findById(id).populate('menu').lean();

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        await cacheUtil.set(cacheKey, JSON.stringify(restaurant));
        return restaurant;
    }

    async createRestaurant(data) {
        const restaurant = new Restaurant(data);
        await restaurant.save();
        return restaurant;
    }

    async updateRestaurant(id, data) {
        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        // Invalidate cache
        await cacheUtil.del(`restaurant:${id}`);

        return restaurant;
    }

    async deleteRestaurant(id) {
        const restaurant = await Restaurant.findByIdAndDelete(id);

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        // Delete all menu items
        await MenuItem.deleteMany({ _id: { $in: restaurant.menu } });

        // Invalidate cache
        await cacheUtil.del(`restaurant:${id}`);

        return restaurant;
    }
}

module.exports = new RestaurantService();
