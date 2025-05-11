// backend/config/passport-config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./db');

// Only keep Google Strategy
passport.use(new GoogleStrategy({
    clientID: `275244905240-q1dkacjarongig6k4dusmfolnkukbppc.apps.googleusercontent.com`,
    clientSecret: `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`,
    callbackURL: 'http://naskar.kozow.com:5000/api/auth/google/callback'
  },
  async (token, refreshToken, profile, done) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);

      if (rows.length > 0) {
        return done(null, rows[0]);
      }

      const [newUser] = await pool.query(
        'INSERT INTO users (google_id, full_name, email, role) VALUES (?, ?, ?, ?) RETURNING *',
        [profile.id, profile.displayName, profile.emails[0].value, 'user']
      );

      return done(null, newUser[0]);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize/Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});