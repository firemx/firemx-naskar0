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

// 🔓 Public route: Allow anyone to view an event
router.get('/:id', getEventById); // 👈 Moved before global protect middleware

// 🔐 All other routes are protected
router.use(protect);

// CRUD Routes (Admin only)
router.post('/register', authorizeRoles('admin'), createNewEvent);
router.get('/', listAllEvents);
router.put('/:id', authorizeRoles('admin'), updateEvent);
router.delete('/:id', authorizeRoles('admin'), deleteEvent);

// ✅ New Route: Get Upcoming Events
router.get('/upcoming', getUpcomingEvents);

module.exports = router;