const Redis = require('ioredis');
const config = require('./env');

const redisClient = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

module.exports = redisClient;
