const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const cacheUtil = require('../utils/cache.util');

class MenuService {
    async getMenu(restaurantId) {
        const cacheKey = `menu:${restaurantId}`;
        const cached = await cacheUtil.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const restaurant = await Restaurant.findById(restaurantId).populate('menu');

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        await cacheUtil.set(cacheKey, JSON.stringify(restaurant.menu));
        return restaurant.menu;
    }

    async addMenuItem(restaurantId, itemData) {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        const menuItem = new MenuItem(itemData);
        await menuItem.save();

        restaurant.menu.push(menuItem._id);
        await restaurant.save();

        // Invalidate caches
        await cacheUtil.del(`menu:${restaurantId}`);
        await cacheUtil.del(`restaurant:${restaurantId}`);

        return menuItem;
    }

    async updateMenuItem(restaurantId, itemId, itemData) {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        if (!restaurant.menu.includes(itemId)) {
            throw { statusCode: 404, message: 'Menu item not found in this restaurant' };
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            itemId,
            { $set: itemData },
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            throw { statusCode: 404, message: 'Menu item not found' };
        }

        // Invalidate caches
        await cacheUtil.del(`menu:${restaurantId}`);
        await cacheUtil.del(`restaurant:${restaurantId}`);

        return menuItem;
    }

    async deleteMenuItem(restaurantId, itemId) {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            throw { statusCode: 404, message: 'Restaurant not found' };
        }

        const menuItem = await MenuItem.findByIdAndDelete(itemId);

        if (!menuItem) {
            throw { statusCode: 404, message: 'Menu item not found' };
        }

        restaurant.menu = restaurant.menu.filter(id => id.toString() !== itemId);
        await restaurant.save();

        // Invalidate caches
        await cacheUtil.del(`menu:${restaurantId}`);
        await cacheUtil.del(`restaurant:${restaurantId}`);

        return menuItem;
    }
}

module.exports = new MenuService();
