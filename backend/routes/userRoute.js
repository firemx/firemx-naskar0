// backend/routes/userRoute.js
const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  suspendUser,
  unsuspendUser,
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

// Suspend User
router.put('/:id/suspend', suspendUser);

// Unsuspend User
router.put('/:id/unsuspend', unsuspendUser);

module.exports = router;