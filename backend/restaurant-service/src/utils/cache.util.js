const redisClient = require('../config/redis');
const config = require('../config/env');

class CacheUtil {
    async get(key) {
        try {
            return await redisClient.get(key);
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set(key, value, ttl = config.CACHE_TTL) {
        try {
            await redisClient.setex(key, ttl, value);
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async del(key) {
        try {
            await redisClient.del(key);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    }

    async delPattern(pattern) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
            }
        } catch (error) {
            console.error('Cache delete pattern error:', error);
        }
    }
}

module.exports = new CacheUtil();
