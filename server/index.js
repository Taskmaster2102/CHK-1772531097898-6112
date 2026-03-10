const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection - User's MongoDB Atlas
const MONGO_URI = 'mongodb+srv://craftify:A%40123@cluster0.sk5bfi4.mongodb.net/';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('📝 To fix: Create a free MongoDB Atlas account at https://www.mongodb.com/atlas');
    console.log('   Then update the MONGO_URI in server/index.js with your connection string');
    process.exit(1);
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// ==================== MODELS ====================

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Product Model
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, default: 'pottery' },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  shape: { type: String, enum: ['Classic', 'Tapered', 'Fluted'], required: true },
  size: { type: String, enum: ['S', 'M', 'L'], required: true },
  glazeColor: { type: String, required: true },
  engraving: { type: String, default: '' },
  price: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['In Production', 'Shipped', 'Delivered'], default: 'In Production' },
  productionStatus: { type: String, enum: ['Shaping', 'Firing', 'Glazing', 'Ready'], default: 'Shaping' },
  trackingSteps: {
    confirmed: { type: Boolean, default: true },
    shaping: { type: Boolean, default: false },
    firing: { type: Boolean, default: false },
    glazing: { type: Boolean, default: false },
    shipped: { type: Boolean, default: false },
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Craftify API is running' });
});

// User Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const user = new User({ email, password, name, role: role || 'buyer' });
    await user.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
});

app.post('/api/products/seed', async (req, res) => {
  try {
    const defaultProducts = [
      { id: 1, name: 'Classic Terracotta Pot', description: 'Handcrafted traditional clay pot with authentic finish', price: 850, image: '🏺', category: 'pottery', inStock: true },
      { id: 2, name: 'Fluted Artisanal Vessel', description: 'Elegant fluted design with natural glazing', price: 950, image: '🫖', category: 'pottery', inStock: true },
      { id: 3, name: 'Tapered Earthen Jar', description: 'Modern tapered shape for contemporary spaces', price: 900, image: '🫙', category: 'pottery', inStock: true },
      { id: 4, name: 'Bottle Grace', description: 'Sleek bottle form perfect for dried arrangements', price: 780, image: '🍾', category: 'pottery', inStock: true },
      { id: 5, name: 'Rustic Bowl', description: 'Wide-rimmed bowl ideal for centerpiece displays', price: 650, image: '🥣', category: 'pottery', inStock: true },
      { id: 6, name: 'Vase Statement', description: 'Tall vase statement piece for dramatic floral displays', price: 1100, image: '🏜️', category: 'pottery', inStock: true },
    ];
    await Product.deleteMany({});
    await Product.insertMany(defaultProducts);
    res.json({ message: 'Products seeded successfully', count: defaultProducts.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, customerName, email, shape, size, glazeColor, engraving, price, notes } = req.body;
    const order = new Order({
      userId, customerName, email, shape, size, glazeColor,
      engraving: engraving || '', price, notes: notes || '',
      orderDate: new Date(), status: 'In Production', productionStatus: 'Shaping',
      trackingSteps: { confirmed: true, shaping: false, firing: false, glazing: false, shipped: false },
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { productionStatus } = req.body;
    const trackingUpdates = {
      'Shaping': { confirmed: true, shaping: true, firing: false, glazing: false, shipped: false },
      'Firing': { confirmed: true, shaping: true, firing: true, glazing: false, shipped: false },
      'Glazing': { confirmed: true, shaping: true, firing: true, glazing: true, shipped: false },
      'Ready': { confirmed: true, shaping: true, firing: true, glazing: true, shipped: false },
    };
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { productionStatus, trackingSteps: trackingUpdates[productionStatus] },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Craftify server running on port ${PORT}`);
    console.log(`📚 API available at http://localhost:${PORT}/api`);
  });
});

