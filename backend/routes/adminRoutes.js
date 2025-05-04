const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  suspendUser,
  unsuspendUser,
  deleteUser,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.put('/users/:userId/suspend', suspendUser);
router.put('/users/:userId/unsuspend', unsuspendUser);
router.delete('/users/:userId', deleteUser);

module.exports = router;