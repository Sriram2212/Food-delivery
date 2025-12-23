const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

const PORT = config.PORT;

connectDB();

const server = app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║     📦 Order Service Started          ║
  ╠════════════════════════════════════════╣
  ║  Port: ${PORT}                        ║
  ║  Environment: ${config.NODE_ENV}      ║
  ╚════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    server.close(() => process.exit(0));
});

module.exports = server;
