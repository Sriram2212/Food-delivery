const HttpClient = require('../utils/httpClient');

class BaseProxy {
    constructor(serviceUrl, timeout = 5000) {
        // Support Load Balancing with comma-separated URLs
        this.instances = serviceUrl.split(',').map(url => url.trim());
        this.currentIndex = 0;
        this.timeout = timeout;

        // Initialize clients for each instance (Connection Pooling)
        this.clients = this.instances.map(url => new HttpClient(url, timeout));
    }

    /**
     * Get next instance using Round Robin algorithm
     */
    getNextClient() {
        if (this.instances.length === 1) return this.clients[0];

        const client = this.clients[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.clients.length;

        // Log rotation if multiple instances
        if (this.instances.length > 1) {
            console.log(`⚖️ Load Balancer: Routing to Instance ${this.currentIndex + 1}/${this.instances.length}`);
        }

        return client;
    }

    async forwardRequest(method, path, data = null, headers = {}) {
        try {
            const client = this.getNextClient();
            let response;
            const config = { headers };

            switch (method.toLowerCase()) {
                case 'get':
                    response = await client.get(path, config);
                    break;
                case 'post':
                    response = await client.post(path, data, config);
                    break;
                case 'put':
                    response = await client.put(path, data, config);
                    break;
                case 'patch':
                    response = await client.patch(path, data, config);
                    break;
                case 'delete':
                    response = await client.delete(path, config);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }

            return response.data;
        } catch (error) {
            // Basic Circuit Breaker logic could be added here
            if (error.response) {
                throw {
                    statusCode: error.response.status,
                    message: error.response.data?.message || 'Service error',
                    errors: error.response.data?.errors || null,
                };
            } else if (error.request) {
                // If instance failed, we could retry next instance (Failover)
                throw {
                    statusCode: 503,
                    message: 'Service unavailable',
                };
            } else {
                throw {
                    statusCode: 500,
                    message: error.message || 'Internal server error',
                };
            }
        }
    }
}

module.exports = BaseProxy;
