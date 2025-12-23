const Redis = require('ioredis');
require('dotenv').config();

const subscriber = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
});

subscriber.on('connect', () => {
    console.log('✅ Redis subscriber connected');
});

subscriber.on('error', (err) => {
    console.error('❌ Redis subscriber error:', err.message);
});

module.exports = subscriber;
