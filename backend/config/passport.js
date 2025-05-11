// backend/config/passport-config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');

// Local Strategy – Email/Password Login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length === 0) {
        return done(null, false, { message: 'User not found' });
      }

      const user = rows[0];

      // Compare passwords – replace with bcrypt later
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

// Google OAuth Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});