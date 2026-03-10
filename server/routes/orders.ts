import express from 'express';
import Order from '../models/Order';

const router = express.Router();

// Get all orders (for sellers/admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get orders by user ID (for buyers)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { userId, customerName, email, shape, size, glazeColor, engraving, price, notes } = req.body;

    const order = new Order({
      userId,
      customerName,
      email,
      shape,
      size,
      glazeColor,
      engraving: engraving || '',
      price,
      notes: notes || '',
      orderDate: new Date(),
      status: 'In Production',
      productionStatus: 'Shaping',
      trackingSteps: {
        confirmed: true,
        shaping: false,
        firing: false,
        glazing: false,
        shipped: false,
      },
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (for sellers)
router.put('/:id/status', async (req, res) => {
  try {
    const { productionStatus } = req.body;

    // Update tracking steps based on production status
    const trackingUpdates: Record<string, boolean> = {
      Shaping: { confirmed: true, shaping: true, firing: false, glazing: false, shipped: false },
      Firing: { confirmed: true, shaping: true, firing: true, glazing: false, shipped: false },
      Glazing: { confirmed: true, shaping: true, firing: true, glazing: true, shipped: false },
      Ready: { confirmed: true, shaping: true, firing: true, glazing: true, shipped: false },
    };

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        productionStatus,
        trackingSteps: trackingUpdates[productionStatus] || trackingUpdates['Shaping'],
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Mark order as shipped
router.put('/:id/ship', async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Shipped',
        productionStatus: 'Ready',
        trackingSteps: {
          confirmed: true,
          shaping: true,
          firing: true,
          glazing: true,
          shipped: true,
        },
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Ship order error:', error);
    res.status(500).json({ error: 'Failed to ship order' });
  }
});

// Update order (general)
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Seed sample orders (for demo)
router.post('/seed', async (req, res) => {
  try {
    const sampleOrders = [
      {
        userId: '507f1f77bcf86cd799439011',
        customerName: 'John Smith',
        email: 'john@example.com',
        shape: 'Classic',
        size: 'L',
        glazeColor: '#87A878',
        engraving: 'Om',
        price: 1050,
        orderDate: new Date('2024-01-15'),
        status: 'In Production',
        productionStatus: 'Firing',
        trackingSteps: {
          confirmed: true,
          shaping: true,
          firing: true,
          glazing: false,
          shipped: false,
        },
        notes: 'Gift for anniversary',
      },
      {
        userId: '507f1f77bcf86cd799439011',
        customerName: 'Sarah Johnson',
        email: 'sarah@example.com',
        shape: 'Fluted',
        size: 'M',
        glazeColor: '#4A7C94',
        engraving: 'Shanti',
        price: 950,
        orderDate: new Date('2024-01-10'),
        status: 'Shipped',
        productionStatus: 'Ready',
        trackingSteps: {
          confirmed: true,
          shaping: true,
          firing: true,
          glazing: true,
          shipped: true,
        },
        notes: 'Handle with care',
      },
      {
        userId: '507f1f77bcf86cd799439012',
        customerName: 'Mike Davis',
        email: 'mike@example.com',
        shape: 'Tapered',
        size: 'S',
        glazeColor: '#E2725B',
        engraving: 'Namaste',
        price: 900,
        orderDate: new Date('2024-01-18'),
        status: 'In Production',
        productionStatus: 'Shaping',
        trackingSteps: {
          confirmed: true,
          shaping: false,
          firing: false,
          glazing: false,
          shipped: false,
        },
        notes: 'First custom order',
      },
    ];

    await Order.deleteMany({});
    await Order.insertMany(sampleOrders);

    res.json({ message: 'Orders seeded successfully', count: sampleOrders.length });
  } catch (error) {
    console.error('Seed orders error:', error);
    res.status(500).json({ error: 'Failed to seed orders' });
  }
});

export default router;

