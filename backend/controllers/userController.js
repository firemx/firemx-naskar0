// controllers/userController.js
const { pool } = require('../config/db');

const getMe = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query('SELECT id, full_name, email, role FROM users WHERE id = ?', [userId]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(rows[0]);
};

module.exports = { getMe };