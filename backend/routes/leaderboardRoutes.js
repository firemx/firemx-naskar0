const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  submitScore,
  getLeaderboard,
  castVote
} = require('../controllers/leaderboardController');

const router = express.Router();

router.use(protect);

// Admin submits score
router.post('/scores', authorizeRoles('admin'), submitScore);

// Anyone can view leaderboard
router.get('/leaderboard/:eventId', getLeaderboard);

// Spectators vote
router.post('/vote', castVote);

module.exports = router;