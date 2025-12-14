const Payment = require('../models/Payment.js');
const Stripe = require('stripe');

// Initialize Stripe with secret key from env. Ensure you set STRIPE_SECRET_KEY in .env
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
let stripe = null;
if (stripeSecret) {
  stripe = Stripe(stripeSecret);
} else {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe payment endpoints will return an error until configured.');
}

// Create a Stripe PaymentIntent and local Payment record
const createStripePayment = async (req, res) => {
  try {
    const { amount, currency = 'usd', meta } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    if (!stripe) return res.status(500).json({ success: false, message: 'Stripe not configured on server' });

    // Save local payment record
    const payment = new Payment({
      user: req.user._id,
      amount,
      method: 'stripe',
      status: 'pending',
      meta: meta || {},
    });
    await payment.save();

    // Create PaymentIntent on Stripe (amount in smallest currency unit)
    const amountInt = Math.round(Number(amount) * 100); // e.g., $1.23 -> 123
    const pi = await stripe.paymentIntents.create({
      amount: amountInt,
      currency,
      metadata: { paymentId: payment._id.toString(), ...((meta && meta.orderId) ? { orderId: meta.orderId } : {}) },
    });

    // Persist Stripe PaymentIntent id
    payment.meta = { ...(payment.meta || {}), stripePaymentIntentId: pi.id };
    await payment.save();

    return res.status(201).json({
      success: true,
      message: 'Stripe PaymentIntent created',
      paymentId: payment._id,
      clientSecret: pi.client_secret,
      stripePaymentIntentId: pi.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    });
  } catch (error) {
    console.error('createStripePayment error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify Stripe payment status by PaymentIntent id or local paymentId
const verifyStripePayment = async (req, res) => {
  try {
    const { paymentId, stripePaymentIntentId } = req.body;
    if (!paymentId && !stripePaymentIntentId) {
      return res.status(400).json({ success: false, message: 'paymentId or stripePaymentIntentId required' });
    }

    const payment = paymentId ? await Payment.findById(paymentId) : await Payment.findOne({ 'meta.stripePaymentIntentId': stripePaymentIntentId });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    const piId = stripePaymentIntentId || (payment.meta && payment.meta.stripePaymentIntentId);
    if (!piId) return res.status(400).json({ success: false, message: 'No Stripe PaymentIntent ID available' });

    // Retrieve PaymentIntent from Stripe
    const pi = await stripe.paymentIntents.retrieve(piId);

    if (pi.status === 'succeeded') {
      payment.status = 'success';
      payment.transactionId = pi.id;
      await payment.save();
      return res.json({ success: true, message: 'Payment succeeded', payment });
    }

    // Map other statuses
    if (pi.status === 'requires_payment_method' || pi.status === 'requires_confirmation' || pi.status === 'requires_action' || pi.status === 'processing') {
      payment.status = 'pending';
      await payment.save();
      return res.json({ success: true, message: 'Payment pending', status: pi.status, payment });
    }

    payment.status = 'failed';
    await payment.save();
    return res.status(400).json({ success: false, message: 'Payment failed', status: pi.status });
  } catch (error) {
    console.error('verifyStripePayment error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get payment status (user or admin can fetch)
const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    // Only allow owner or admin to view
    if (String(payment.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this payment' });
    }

    return res.json({ success: true, payment });
  } catch (error) {
    console.error('getPaymentStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createStripePayment,
  verifyStripePayment,
  getPaymentStatus,
};
