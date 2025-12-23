const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const requestLogger = require('./middlewares/requestLogger.middleware');
const rateLimitMiddleware = require('./middlewares/rateLimit.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLogger);

// Rate limiting
app.use(rateLimitMiddleware);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        statusCode: 404,
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
