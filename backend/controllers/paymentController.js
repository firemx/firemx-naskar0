const { stkPush } = require('../services/mpesaService');
const { pool } = require('../config/db');

const initiatePayment = async (req, res) => {
  const { phoneNumber, amount, eventId } = req.body;
  const userId = req.user.id;

  try {
    const result = await stkPush(phoneNumber, amount, userId, eventId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

module.exports = { initiatePayment };