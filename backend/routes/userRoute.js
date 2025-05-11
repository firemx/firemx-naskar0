// backend/routes/userRoute.js
const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllUsers,      // ✅ Importing here
  suspendUser,
  unsuspendUser,
} = require('../controllers/userController');

const router = express.Router();

// Admin-only routes
router.use(protect);
router.use(authorizeRoles('admin'));

// List all users
router.get('/', getAllUsers); // ✅ Now properly defined

// Suspend/Unsuspend user
router.put('/:id/suspend', suspendUser);
router.put('/:id/unsuspend', unsuspendUser);

module.exports = router;