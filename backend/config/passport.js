// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./db');

passport.use(new GoogleStrategy({
  clientID: `275244905240-q1dkacjarongig6k4dusmfolnkukbppc.apps.googleusercontent.com`,
  clientSecret: `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`,
  callbackURL: 'http://naskar.kozow.com:5000/api/auth/google/callback'
  },
  async (token, refreshToken, profile, done) => {
    try {
      // Check if user exists
      const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);

      if (rows.length > 0) {
        return done(null, rows[0]);
      }

      // Create new user
      await pool.query(
        'INSERT INTO users (google_id, full_name, email, role) VALUES (?, ?, ?, ?)',
        [profile.id, profile.displayName, profile.emails[0].value, 'user']
      );

      // Fetch the newly created user
      const [newUserRows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);

      return done(null, newUserRows[0]);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }
));