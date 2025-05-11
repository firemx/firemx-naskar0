// backend/controllers/userController.js
const { pool } = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📋 Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, full_name, email, role, suspended FROM users');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(rows); // Sends back all users
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔒 Admin: Suspend User
const suspendUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot suspend an admin' });
    }

    // Update user status
    await pool.query('UPDATE users SET suspended = ? WHERE id = ?', [true, id]);

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Account Has Been Suspended',
      text: 'Your account has been suspended. Please contact support for more info.',
    });

    res.json({ message: 'User suspended successfully' });
  } catch (err) {
    console.error('Error suspending user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔓 Admin: Unsuspend User
const unsuspendUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status
    await pool.query('UPDATE users SET suspended = ? WHERE id = ?', [false, id]);

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Account Has Been Unsuspended',
      text: 'Good news! Your account has been reactivated.',
    });

    res.json({ message: 'User unsuspended successfully' });
  } catch (err) {
    console.error('Error unsuspending user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,   // ✅ Exported here
  suspendUser,
  unsuspendUser,
};