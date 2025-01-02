const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
const auth = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

router.use(auth()); // Protect all routes below

// Get the cart for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id; // Use the ID from the authenticated user
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity == null) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  try {
    const userId = req.user._id; // Use the ID from the authenticated user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cartItemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (cartItemIndex > -1) {
      const newQuantity = cart.items[cartItemIndex].quantity + quantity;

      if (newQuantity > product.stock + cart.items[cartItemIndex].quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }

      // Update stock before changing the cart
      product.stock += cart.items[cartItemIndex].quantity - newQuantity;

      if (newQuantity <= 0) {
        cart.items.splice(cartItemIndex, 1);
      } else {
        cart.items[cartItemIndex].quantity = newQuantity;
      }
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      cart.items.push({ productId, quantity });
      product.stock -= quantity;
    }

    await product.save();
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ message: 'Error adding item to cart', error: err.message });
  }
});


router.delete('/remove/:productId', async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id; // Use the ID from the authenticated user

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      const product = await Product.findById(productId);
      if (product) {
        // Update the product stock
        product.stock += cart.items[itemIndex].quantity;
        await product.save();
      }
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).json({ message: 'Error removing item from cart', error: err.message });
  }
});


module.exports = router;
