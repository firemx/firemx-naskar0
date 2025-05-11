const express = require('express');
const {
  registerUser,
  loginUser
} = require('../controllers/authController');
const { getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
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
    // Ensure req.user exists and has a token
    if (!req.user || !req.user.token) {
      return res.redirect('/login?error=no_token');
    }
    const token = req.user.token;
    // Redirect to frontend (Vite uses port 5173 by default)
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

module.exports = router;