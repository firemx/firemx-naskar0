const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/live/comment', protect, (req, res) => {
  res.json({ message: 'Comment received' });
});

module.exports = router;