const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./config/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});