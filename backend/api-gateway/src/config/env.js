require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

  // Service URLs
  RESTAURANT_SERVICE_URL: process.env.RESTAURANT_SERVICE_URL || 'http://127.0.0.1:5001',
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://127.0.0.1:5002',
  DELIVERY_SERVICE_URL: process.env.DELIVERY_SERVICE_URL || 'http://127.0.0.1:5003',
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:5004',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
};
