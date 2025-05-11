// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

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

// Login route (optional local login)
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info.message || 'Invalid credentials');
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

module.exports = router;