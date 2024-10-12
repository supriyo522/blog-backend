module.exports = (razorpay) => {
    const express = require('express');
    const router = express.Router();
  
    // Create an order
    router.post('/create-order', async (req, res) => {
      const { amount, currency, receipt } = req.body;
      try {
        const order = await razorpay.orders.create({ amount, currency, receipt });
        res.json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  
    // Verify payment
    router.post('/verify', (req, res) => {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const crypto = require('crypto');
  
      const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
  
      if (generated_signature === razorpay_signature) {
        res.json({ status: 'success' });
      } else {
        res.status(400).json({ error: 'Payment verification failed' });
      }
    });
  
    return router;
  };
  