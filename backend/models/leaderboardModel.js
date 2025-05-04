const { pool } = require('../config/db');

const updateLeaderboard = async (skaterId, eventId, score, votes = 0) => {
  await pool.query(
    `INSERT INTO leaderboard (skater_id, event_id, score, votes)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE score = ?, votes = ?`,
    [skaterId, eventId, score, votes, score, votes]
  );
};

const getLeaderboardForEvent = async (eventId) => {
  const [rows] = await pool.query(
    `SELECT u.full_name, l.score, l.votes
     FROM leaderboard l
     JOIN users u ON u.id = l.skater_id
     WHERE l.event_id = ?
     ORDER BY l.score DESC`,
    [eventId]
  );

  return rows;
};

module.exports = {
  updateLeaderboard,
  getLeaderboardForEvent
};