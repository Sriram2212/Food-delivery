const express = require('express');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Restaurant Service is running',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;
