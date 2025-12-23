require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║     🚚 Delivery Service Started       ║
  ╠════════════════════════════════════════╣
  ║  Port: ${PORT}                        ║
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
