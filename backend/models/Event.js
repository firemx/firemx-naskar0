// /backend/models/Event.js
const { pool } = require('../config/db');

const createEvent = async (title, description, startDate, endDate, location, price, createdBy) => {
  const [result] = await pool.query(
    'INSERT INTO events (title, description, start_date, end_date, location, price, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, startDate, endDate, location, price, createdBy]
  );
  return result.insertId;
};

const getAllEvents = async () => {
  const [rows] = await pool.query('SELECT * FROM events');
  return rows;
};

module.exports = {
  createEvent,
  getAllEvents
};