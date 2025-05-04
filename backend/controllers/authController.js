// controllers/authController.js
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { pool } = require('../config/db');

// controllers/userController.js
// const { pool } = require('../config/db');

const getMe = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query('SELECT id, full_name, email, role FROM users WHERE id = ?', [userId]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(rows[0]);
};

module.exports = { getMe };

// @desc    Register a new user (Skater or Spectator)
const registerUser = async (req, res) => {
  const { fullName, email, password, role, phone } = req.body;

  const validRoles = ['skater', 'spectator'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role for registration' });
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    return res.status(400).json({ message: 'Email already taken' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
    [fullName, email, hashedPassword, role, phone]
  );

  const token = generateToken(result.insertId, role);

  res.status(201).json({
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
    token,
    role,
    userId: result.insertId,
  });
};

// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (rows.length === 0) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user.id, user.role);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
};