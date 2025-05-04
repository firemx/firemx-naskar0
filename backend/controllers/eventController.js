// backend/controllers/eventController.js
const { pool } = require('../config/db');
const { createEvent, getAllEvents } = require('../models/Event');

/**
 * Create a new event
 */
const createNewEvent = async (req, res) => {
  const { title, description, startDate, endDate, location, price } = req.body;
  const userId = req.user.id;

  try {
    const eventId = await createEvent(title, description, startDate, endDate, location, price, userId);

    const io = require('../utils/socket').getIO();

    // Broadcast new event to all connected clients
    io.emit('eventCreated', {
      id: eventId,
      title,
      start_date: startDate,
      end_date: endDate,
      location,
      price
    });

    res.status(201).json({
      message: 'Event created',
      event: {
        id: eventId,
        title,
        start_date: startDate,
        end_date: endDate,
        location,
        price
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

/**
 * List all events
 */
const listAllEvents = async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

/**
 * Get single event by ID
 */
const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event' });
  }
};

/**
 * Update an existing event
 */
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, location, price } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, location = ?, price = ? WHERE id = ?',
      [title, description, startDate, endDate, location, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Broadcast updated event
    const io = require('../utils/socket').getIO();
    io.emit('eventUpdated', {
      id,
      title,
      start_date: startDate,
      end_date: endDate,
      location,
      price
    });

    res.json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

/**
 * Delete an event
 */
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Broadcast deletion
    const io = require('../utils/socket').getIO();
    io.emit('eventDeleted', { id });

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

/**
 * ✅ New Function: Get Upcoming Events
 */
const getUpcomingEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE start_date > NOW() ORDER BY start_date ASC'
    );
    res.json({ events: rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching upcoming events' });
  }
};

// ✅ Export All Functions
module.exports = {
  createNewEvent,
  listAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents, // 👈 Added here
};