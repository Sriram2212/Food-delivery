const axios = require('axios');

class HttpClient {
    constructor(baseURL, timeout = 5000) {
        this.client = axios.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response) {
                    console.error(`❌ Error ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    console.error('❌ No response received from service');
                } else {
                    console.error('❌ Request setup error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    async get(url, config = {}) {
        return this.client.get(url, config);
    }

    async post(url, data, config = {}) {
        return this.client.post(url, data, config);
    }

    async put(url, data, config = {}) {
        return this.client.put(url, data, config);
    }

    async patch(url, data, config = {}) {
        return this.client.patch(url, data, config);
    }

    async delete(url, config = {}) {
        return this.client.delete(url, config);
    }
}

module.exports = HttpClient;
