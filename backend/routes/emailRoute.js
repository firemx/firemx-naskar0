const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendEmail } = require('../controllers/emailController');

const router = express.Router();

router.post('/email/send', protect, sendEmail);

module.exports = router;