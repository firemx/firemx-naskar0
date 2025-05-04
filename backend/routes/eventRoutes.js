const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createNewEvent,
  listAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

router.use(protect);

// CRUD Routes
router.post('/register', authorizeRoles('admin'), createNewEvent);
router.get('/', listAllEvents);
router.get('/:id', getEventById);
router.put('/:id', authorizeRoles('admin'), updateEvent);
router.delete('/:id', authorizeRoles('admin'), deleteEvent);

module.exports = router;