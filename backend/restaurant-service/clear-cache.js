require('dotenv').config();
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
});

async function clearCache() {
    try {
        console.log('🧹 Clearing Redis Cache...');
        await redis.flushall();
        console.log('✅ Redis Cache Cleared Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
        process.exit(1);
    }
}

clearCache();
