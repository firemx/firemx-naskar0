const { pool } = require('../config/db');

const createNotification = async (senderId, receiverId, message) => {
  await pool.query(
    'INSERT INTO notifications (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [senderId, receiverId, message]
  );
};

const getNotificationsByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE receiver_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
};