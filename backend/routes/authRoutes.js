// /backend/routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser
} = require('../controllers/authController');

const { getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// 👇 Add this line
const passport = require('passport');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', protect, getMe);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.token || 'fallback_token';
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

module.exports = router;