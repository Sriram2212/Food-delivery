# API Gateway

The API Gateway serves as the single entry point for all client requests in the food delivery system. It handles routing, authentication, rate limiting, and forwards requests to appropriate microservices.

## Features

- **Request Routing**: Routes requests to appropriate microservices
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Prevents API abuse
- **Request Logging**: Comprehensive request/response logging
- **Error Handling**: Centralized error handling
- **Service Discovery**: Manages service URLs and timeouts

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key

RESTAURANT_SERVICE_URL=http://localhost:5001
ORDER_SERVICE_URL=http://localhost:5002
DELIVERY_SERVICE_URL=http://localhost:5003

REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Service

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check service health

### Restaurants
- `GET /api/restaurants` - List all restaurants (public)
- `GET /api/restaurants/:id` - Get restaurant details (public)
- `GET /api/restaurants/:id/menu` - Get restaurant menu (public)
- `POST /api/restaurants` - Create restaurant (restaurant/admin)
- `PUT /api/restaurants/:id` - Update restaurant (restaurant/admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin)

### Orders
- `POST /api/orders` - Create order (user)
- `GET /api/orders/:id` - Get order details (authenticated)
- `GET /api/orders/user/my-orders` - Get user's orders (user)
- `GET /api/orders/restaurant/:restaurantId` - Get restaurant orders (restaurant/admin)
- `PATCH /api/orders/:id/status` - Update order status (restaurant/admin)
- `PATCH /api/orders/:id/cancel` - Cancel order (user/admin)

### Delivery
- `POST /api/delivery/assign` - Assign delivery (admin)
- `GET /api/delivery/order/:orderId` - Get delivery status (authenticated)
- `PATCH /api/delivery/:deliveryId/status` - Update delivery status (delivery/admin)
- `GET /api/delivery/partner/:partnerId` - Get partner deliveries (delivery/admin)

### Admin
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/restaurants` - Get all restaurants (admin)
- `GET /api/admin/deliveries` - Get all deliveries (admin)
- `GET /api/admin/metrics` - Get system metrics (admin)

## Architecture

```
api-gateway/
├── src/
│   ├── config/          # Configuration files
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # Route definitions
│   ├── proxy/           # Service proxies
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
```

## Technologies

- **Express.js**: Web framework
- **JWT**: Authentication
- **Redis**: Caching and session management
- **Axios**: HTTP client for service communication
- **Helmet**: Security headers
- **Morgan**: Request logging
- **Express Rate Limit**: Rate limiting
