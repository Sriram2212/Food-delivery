const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

const PORT = config.PORT;

// Connect to MongoDB
connectDB();

const server = app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║   🍽️  Restaurant Service Started      ║
  ╠════════════════════════════════════════╣
  ║  Port: ${PORT}                        ║
  ║  Environment: ${config.NODE_ENV}      ║
  ║  Time: ${new Date().toLocaleString()} ║
  ╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = server;
