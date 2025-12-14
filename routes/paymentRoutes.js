const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware.js');
const {
  createStripePayment,
  verifyStripePayment,
  getPaymentStatus,
} = require('../controllers/paymentController.js');

// Create a Stripe PaymentIntent
router.post('/stripe/create', protect, createStripePayment);

// Verify a Stripe payment (checks PaymentIntent status)
router.post('/stripe/verify', protect, verifyStripePayment);

// Get payment status
router.get('/:id', protect, getPaymentStatus);

module.exports = router;
