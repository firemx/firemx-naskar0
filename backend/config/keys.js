// backend/config/keys.js
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key'
};