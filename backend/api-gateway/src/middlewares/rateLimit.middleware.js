const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const rateLimitMiddleware = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = rateLimitMiddleware;
