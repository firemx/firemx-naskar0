// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys'); // Or define in .env

// Existing routes...
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    res.redirect(`http://107.152.35.103:5173/admin?token=${token}`);
  }
);

// Google Auth Routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google Auth Callback – Must include req, res handler
router.get('/google/callback',
  passport.authenticate('google', { 
    successRedirect: '/api/auth/success',
    failureRedirect: '/login'
  })
);

// Success route after Google login
router.get('/success', (req, res) => {
  const user = req.user;
  res.json({
    message: 'Logged in successfully!',
    user
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.json({ message: 'Logout successful' });
  });
});

router.post('/login',
  passport.authenticate('local', {
    session: false,
    failureMessage: true
  }),
  (req, res) => {
    const payload = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: req.user
    });
  }
);

module.exports = router;