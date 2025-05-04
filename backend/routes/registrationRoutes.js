const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerForEvent } = require('../controllers/eventRegistrationController');

const router = express.Router();

router.use(protect);

router.post('/register', registerForEvent);

module.exports = router;