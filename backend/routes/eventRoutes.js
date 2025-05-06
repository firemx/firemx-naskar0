// backend/routes/eventRoute.js
const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createNewEvent,
  listAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
} = require('../controllers/eventController');

const router = express.Router();

// ✅ Public routes - No authentication needed
router.get('/:id', getEventById);            // View single event
router.get('/', listAllEvents);              // List all events
router.get('/upcoming', getUpcomingEvents);  // Upcoming events list

// 🔐 Admin-only routes
router.use(protect); // All remaining routes are protected

router.post('/register', authorizeRoles('admin'), createNewEvent);
router.put('/:id', authorizeRoles('admin'), updateEvent);
router.delete('/:id', authorizeRoles('admin'), deleteEvent);

module.exports = router;