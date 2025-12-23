const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Order Service is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/orders', orderRoutes);

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
