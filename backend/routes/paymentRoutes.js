const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { initiatePayment } = require('../controllers/paymentController');

const router = express.Router();

router.use(protect);

router.post('/pay', initiatePayment);

module.exports = router;