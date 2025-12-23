const express = require('express');
const cors = require('cors');
const deliveryRoutes = require('./routes/delivery.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Delivery Service is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/delivery', deliveryRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
