# Craftify - MongoDB Setup Guide

This guide will help you connect your Craftify project to MongoDB.

## Prerequisites

- Node.js installed
- MongoDB installed locally or MongoDB Atlas account

## Setup Steps

### 1. Install Server Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
If you have MongoDB installed locally, make sure it's running:
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `server/.env` with your connection string

Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/craftify
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The server should start on port 5000.

### 4. Seed Initial Data

The first time you run the server, you may want to seed initial products. 
This is already included in the products route - it will auto-seed on first call.

Alternatively, you can use curl or Postman to call:
- `POST /api/products/seed` - Add sample products
- `POST /api/orders/seed` - Add sample orders

### 5. Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend should now be able to connect to the MongoDB backend.

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user by ID

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/seed` - Seed default products

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/user/:userId` - Get orders by user
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update production status
- `PUT /api/orders/:id/ship` - Mark order as shipped
- `DELETE /api/orders/:id` - Delete order
- `POST /api/orders/seed` - Seed sample orders

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access (for Atlas)

### CORS Errors
- The server is configured to allow all origins with `cors()`
- If you need specific origins, update `server/index.ts`

### TypeScript Errors in Server
- Run `npm install` in the server directory to install type definitions

