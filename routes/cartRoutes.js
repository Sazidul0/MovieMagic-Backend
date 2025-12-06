const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
  clearCart,
} = require('../controllers/cartController.js');

// Cart routes
router.post('/add', protect, addToCart); // Add item to cart
router.get('/', protect, getCart); // Get user's cart
router.put('/update/:itemId', protect, updateCartItem); // Update cart item
router.delete('/remove/:itemId', protect, removeFromCart); // Remove item from cart
router.post('/checkout', protect, checkoutCart); // Checkout selected items
router.delete('/clear', protect, clearCart); // Clear entire cart

module.exports = router;
