# Restaurant Service

Microservice responsible for managing restaurants and their menus in the food delivery system.

## Features

- Restaurant CRUD operations
- Menu management
- Search and filtering
- Redis caching for performance
- MongoDB for data persistence

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/restaurant-service
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Service

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Menu
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants/:id/menu` - Add menu item
- `PUT /api/restaurants/:id/menu/:itemId` - Update menu item
- `DELETE /api/restaurants/:id/menu/:itemId` - Delete menu item

## Technologies

- Express.js
- MongoDB with Mongoose
- Redis for caching
- Node.js
