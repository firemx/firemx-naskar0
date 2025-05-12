// backend/config/passport.js
//const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./db');

passport.use(new GoogleStrategy({
  clientID: `275244905240-q1dkacjarongig6k4dusmfolnkukbppc.apps.googleusercontent.com`,
  clientSecret: `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`,
  callbackURL: 'http://naskar.kozow.com:5000/api/auth/google/callback'
  },
  async (token, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      // Determine role based on email (optional admin setup)
      const role = email === process.env.ADMIN_EMAIL
        ? 'admin'
        : 'user';

      let [existingUser] = await pool.query(
        'SELECT * FROM users WHERE google_id = ? OR email = ?',
        [profile.id, email]
      );

      if (existingUser.length > 0) {
        return done(null, existingUser[0]);
      }

      // Insert new user
      await pool.query(
        'INSERT INTO users (google_id, full_name, email, role) VALUES (?, ?, ?, ?)',
        [profile.id, profile.displayName, email, role]
      );

      // Now select and return the user
      let [freshUser] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      return done(null, freshUser[0]);

    } catch (err) {
      console.error('Google OAuth Error:', err.message);

      if (err.code === 'ER_TRUNCATED_WRONG_VALUE' || err.message.includes('Data truncated')) {
        return done(null, false, {
          message: 'Role value too long – please contact support'
        });
      }

      return done(err, false);
    }
  }
));