require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5002,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/order-service',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
};
