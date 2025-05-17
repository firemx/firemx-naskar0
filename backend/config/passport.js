// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./db');

// Only after importing passport!
passport.use(new GoogleStrategy({
  clientID: '275244905240-q1dkacjarongig6k4dusmfolnkukbppc.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/api/auth/google/callback'
}, async (token, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    // Check if user exists
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE google_id = ? OR email = ?',
      [profile.id, email]
    );

    if (rows.length > 0) {
      return done(null, rows[0]);
    }

    // Create new user
    const [newUser] = await pool.query(
      'INSERT INTO users (google_id, full_name, email, role) VALUES (?, ?, ?, ?)',
      [profile.id, profile.displayName, email, 'user']
    );

    const [freshUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?', 
      [newUser.insertId]
    );

    return done(null, freshUser[0]);
  } catch (err) {
    return done(err, false);
  }
}));

// Serialize/Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});