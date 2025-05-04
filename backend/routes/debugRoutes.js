const express = require('express');
const router = express.Router();
const { getIO } = require('../utils/socket');

router.get('/test-event', (req, res) => {
  const io = getIO(); // This will now work!

  io.emit('eventCreated', {
    id: Date.now(),
    title: 'Test Event',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 3600000).toISOString(),
    location: 'Test Arena',
    price: '10'
  });

  res.json({ message: 'Test event emitted' });
});

module.exports = router;