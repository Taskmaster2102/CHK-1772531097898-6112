import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Create new product (admin)
router.post('/', async (req, res) => {
  try {
    const { id, name, description, price, image, category, inStock } = req.body;

    // Check if product with same ID exists
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this ID already exists' });
    }

    const product = new Product({
      id,
      name,
      description,
      price,
      image,
      category: category || 'pottery',
      inStock: inStock !== false,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Seed initial products
router.post('/seed', async (req, res) => {
  try {
    const defaultProducts = [
      {
        id: 1,
        name: 'Classic Terracotta Pot',
        description: 'Handcrafted traditional clay pot with authentic finish',
        price: 850,
        image: '🏺',
        category: 'pottery',
        inStock: true,
      },
      {
        id: 2,
        name: 'Fluted Artisanal Vessel',
        description: 'Elegant fluted design with natural glazing',
        price: 950,
        image: '🫖',
        category: 'pottery',
        inStock: true,
      },
      {
        id: 3,
        name: 'Tapered Earthen Jar',
        description: 'Modern tapered shape for contemporary spaces',
        price: 900,
        image: '🫙',
        category: 'pottery',
        inStock: true,
      },
      {
        id: 4,
        name: 'Bottle Grace',
        description: 'Sleek bottle form perfect for dried arrangements',
        price: 780,
        image: '🍾',
        category: 'pottery',
        inStock: true,
      },
      {
        id: 5,
        name: 'Rustic Bowl',
        description: 'Wide-rimmed bowl ideal for centerpiece displays',
        price: 650,
        image: '🥣',
        category: 'pottery',
        inStock: true,
      },
      {
        id: 6,
        name: 'Vase Statement',
        description: 'Tall vase statement piece for dramatic floral displays',
        price: 1100,
        image: '🏜️',
        category: 'pottery',
        inStock: true,
      },
    ];

    // Clear existing products and insert new ones
    await Product.deleteMany({});
    await Product.insertMany(defaultProducts);

    res.json({ message: 'Products seeded successfully', count: defaultProducts.length });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

export default router;

