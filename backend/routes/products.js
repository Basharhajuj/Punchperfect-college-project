const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add a new product
router.post('/', upload.single('image'), async (req, res) => {
  const { name, price, description, stock, category } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  const product = new Product({
    name,
    price,
    description,
    stock,
    category,
    imageUrl
  });

  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch products by category
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Edit a product
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, category } = req.body;

  const updateData = {
    name,
    price,
    description,
    stock,
    category
  };

  if (req.file) {
    updateData.imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Increment product count
router.post('/increment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.count += 1;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get the product with the highest count
router.get('/highest-count', async (req, res) => {
  try {
    const product = await Product.findOne().sort('-count').exec();
    if (!product) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
