const { spawn } = require('child_process');
const path = require('path');

const services = [
    { name: 'Gateway', path: 'backend/api-gateway', color: '\x1b[36m' }, // Cyan
    { name: 'Restaurant', path: 'backend/restaurant-service', color: '\x1b[32m' }, // Green
    { name: 'Order', path: 'backend/order-service', color: '\x1b[33m' }, // Yellow
    { name: 'Delivery', path: 'backend/delivery-service', color: '\x1b[35m' }, // Magenta
    { name: 'Notification', path: 'backend/notification-service', color: '\x1b[34m' }, // Blue
    { name: 'Frontend', path: 'frontend', color: '\x1b[37m' } // White
];

console.log('\x1b[1m\x1b[32m%s\x1b[0m', '🚀 Starting Food Delivery System - All Services...');

services.forEach(service => {
    const proc = spawn('npm', ['start'], {
        cwd: path.join(__dirname, service.path),
        shell: true
    });

    proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.log(`${service.color}[${service.name}]\x1b[0m ${line}`);
            }
        });
    });

    proc.stderr.on('data', (data) => {
        console.error(`${service.color}[${service.name} Error]\x1b[0m ${data}`);
    });

    proc.on('close', (code) => {
        console.log(`${service.color}[${service.name}]\x1b[0m process exited with code ${code}`);
    });
});
