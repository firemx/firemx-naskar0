//const { pool } = require('../config/db');

//const registerForEvent = async (req, res) => {
//  const { eventId } = req.body;
//  const userId = req.user.id;

//  try {
//    const [result] = await pool.query(
//      'INSERT INTO registrations (user_id, event_id, payment_status) VALUES (?, ?, ?)',
//      [userId, eventId, 'paid']
 //   );

 //   res.json({ message: 'Successfully registered for event', registrationId: result.insertId });
//  } catch (error) {
 //   res.status(500).json({ message: 'Registration failed', error });
 // }
//};

//module.exports = { registerForEvent };

const { pool } = require('../config/db');
const { generateTicketPDF } = require('../services/pdfService');
const { sendTicketEmail } = require('../services/emailService');

const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    // Get event and user details
    const [eventRows] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    const event = eventRows[0];
    const user = userRows[0];

    if (!event || !user) {
      return res.status(404).json({ message: 'Event or User not found' });
    }

    // Generate PDF ticket
    const pdfBuffer = generateTicketPDF(event, user);

    // Save registration
    await pool.query(
      'INSERT INTO registrations (user_id, event_id, payment_status, ticket_pdf_url) VALUES (?, ?, ?, ?)',
      [userId, eventId, 'paid', 'generated-ticket-url-placeholder']
    );

    // Send email with attachment
    await sendTicketEmail(
      user.email,
      `Your Ticket for ${event.title}`,
      `Thank you for registering for ${event.title}! Your ticket is attached.`,
      [{
        filename: `ticket-${eventId}.pdf`,
        content: pdfBuffer.toString('base64'),
        encoding: 'base64'
      }]
    );

    res.json({ message: 'Successfully registered and ticket sent via email!' });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

module.exports = { registerForEvent };