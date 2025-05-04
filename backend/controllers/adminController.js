const { pool } = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
  const [rows] = await pool.query('SELECT id, full_name, email, role, suspended FROM users');
  res.json(rows);
};

// Suspend user
const suspendUser = async (req, res) => {
  const { userId } = req.params;
  await pool.query('UPDATE users SET suspended = TRUE WHERE id = ?', [userId]);
  res.json({ message: 'User suspended' });
};

// Unsuspend user
const unsuspendUser = async (req, res) => {
  const { userId } = req.params;
  await pool.query('UPDATE users SET suspended = FALSE WHERE id = ?', [userId]);
  res.json({ message: 'User unsuspended' });
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  await pool.query('DELETE FROM users WHERE id = ?', [userId]);
  res.json({ message: 'User deleted' });
};

module.exports = {
  getAllUsers,
  suspendUser,
  unsuspendUser,
  deleteUser,
};