//const { pool } = require('../config/db');

//const handleCallback = async (req, res) => {
//  const callbackData = req.body;

//  console.log('M-Pesa Callback Received:', callbackData);

//  try {
 //   if (callbackData.Body && callbackData.Body.stkCallback) {
 //     const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = callbackData.Body.stkCallback;

 //     await pool.query(
 //       'INSERT INTO transactions (mpesa_receipt_number, amount, phone_number, user_id, event_id, payment_for, status, raw_response) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
 //       [CheckoutRequestID, 0, '', null, null, 'registration', ResultCode === 0 ? 'success' : 'failed', JSON.stringify(callbackData)]
//      );
 //   }

//    res.status(200).json({}); // Required by M-Pesa
//  } catch (error) {
//    console.error('Error handling callback:', error);
//    res.status(500).send('Internal Server Error');
//  }
//};

//module.exports = { handleCallback };

// /backend/routes/mpesaRoutes.js
const express = require('express');
const { handleCallback } = require('../controllers/mpesaCallbackController');

const router = express.Router();

router.post('/mpesa/callback', handleCallback);

module.exports = router; // ✅ Must export the router object