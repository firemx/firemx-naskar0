// backend/routes/eventRoute.js
const express = require('express');
const {
  getEventById,
  listAllEvents,
  createNewEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
} = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/:id', getEventById); // 👈 Public route
router.get('/', listAllEvents);
router.get('/upcoming', getUpcomingEvents);

// Protected routes
router.use(protect);

router.post('/register', createNewEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;