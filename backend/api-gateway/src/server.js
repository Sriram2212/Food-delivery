const app = require('./app');
const config = require('./config/env');
const redisClient = require('./config/redis');
const mongoose = require('mongoose');

const PORT = config.PORT;

const startServer = async () => {
    try {
        // Connect to Redis (assuming redisClient handles its own connection or is already exported connected/connecting)
        // If redisClient needs explicit connect, verify that. Usually ioredis connects automatically.
        // But we can ping to be safe if desired, or skip.

        // Connect to MongoDB (Authentication & Identity)
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB (Identity Database)');

        const server = app.listen(PORT, () => {
            console.log(`
  ╔════════════════════════════════════════╗
  ║     🚀 API Gateway Server Started     ║
  ╠════════════════════════════════════════╣
  ║  Port: ${PORT}                        ║
  ║  Environment: ${config.NODE_ENV}      ║
  ║  Time: ${new Date().toLocaleString()} ║
  ╚════════════════════════════════════════╝
            `);
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            console.log('Signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                await mongoose.connection.close();
                redisClient.quit();
                process.exit(0);
            });
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
