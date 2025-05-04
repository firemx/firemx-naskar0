// backend/routes/eventRoute.js
const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createNewEvent,
  listAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents, // ✅ Import added
} = require('../controllers/eventController');

const router = express.Router();

// 🔐 All routes are protected
router.use(protect);

// CRUD Routes (Admin only)
router.post('/register', authorizeRoles('admin'), createNewEvent);
router.get('/', listAllEvents);
router.get('/:id', getEventById);
router.put('/:id', authorizeRoles('admin'), updateEvent);
router.delete('/:id', authorizeRoles('admin'), deleteEvent);

// ✅ New Route: Get Upcoming Events (Accessible to all authenticated users)
router.get('/upcoming', getUpcomingEvents); // URL: GET /api/events/upcoming

module.exports = router;