const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (req, res) => {
  const { userId, subject, message } = req.body;
  try {
    const [rows] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
    const userEmail = rows[0]?.email;

    if (!userEmail) {
      return res.status(404).json({ message: 'User not found' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      text: message,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

module.exports = { sendEmail };