const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./db');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/api/auth/google/callback',
		
		//clientID: 275244905240-q1dkacjarongig6k4dusmfolnkukbppc.apps.googleusercontent.com,
        //clientSecret: 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
		//callbackURL; 'http://naskar.kozow.com:5000/api/auth/google/callback',
		
        passReqToCallback: true,
      },
      async (req, token, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        let [rows] = await pool.query(
          'SELECT * FROM users WHERE google_id = ? OR email = ?',
          [id, email]
        );
        let user = rows[0];

        if (!user) {
          // Create new user
          const [result] = await pool.query(
            'INSERT INTO users (full_name, email, google_id, role) VALUES (?, ?, ?, ?)',
            [displayName, email, id, 'skater']
          );
          user = { id: result.insertId, role: 'skater' };
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

// Logs
console.log('Loading Google OAuth with client ID:', process.env.GOOGLE_CLIENT_ID);
		console.log('Callback URL:', '/api/auth/google/callback');