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
      full_name: req.user.full_name,
      google_id: req.user.google_id
    };

    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Redirect to frontend with token
    res.redirect(`http://107.152.35.103:5173/admin?token=${token}`);
  }
);

// Logout – Optional
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;