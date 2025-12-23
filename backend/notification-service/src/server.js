require('dotenv').config();
const orderSubscriber = require('./subscribers/order.subscriber');

const PORT = process.env.PORT || 5004;

const mongoose = require('mongoose');

async function startService() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_db');
        console.log('✅ Connected to MongoDB');

        // Subscribe to events
        await orderSubscriber.subscribe();

        console.log(`
    ╔════════════════════════════════════════╗
    ║   🔔 Notification Service Started     ║
    ╠════════════════════════════════════════╣
    ║  Port: ${PORT}                        ║
    ║  Status: Listening for events...     ║
    ╚════════════════════════════════════════╝
    `);
    } catch (error) {
        console.error('❌ Failed to start notification service:', error);
        process.exit(1);
    }
}

startService();

process.on('SIGTERM', () => {
    console.log('Shutting down notification service...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Shutting down notification service...');
    process.exit(0);
});
