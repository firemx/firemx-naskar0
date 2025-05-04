const {
  updateLeaderboard,
  getLeaderboardForEvent
} = require('../models/leaderboardModel');

const submitScore = async (req, res) => {
  const { skaterId, eventId, score } = req.body;

  try {
    await updateLeaderboard(skaterId, eventId, score);
    res.json({ message: 'Score submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit score', error });
  }
};

const getLeaderboard = async (req, res) => {
  const { eventId } = req.params;

  try {
    const leaderboard = await getLeaderboardForEvent(eventId);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load leaderboard', error });
  }
};

const castVote = async (req, res) => {
  const { skaterId, eventId } = req.body;

  try {
    await pool.query(
      'UPDATE leaderboard SET votes = votes + 1 WHERE skater_id = ? AND event_id = ?',
      [skaterId, eventId]
    );

    const [updatedRow] = await pool.query(
      'SELECT votes FROM leaderboard WHERE skater_id = ? AND event_id = ?',
      [skaterId, eventId]
    );

    res.json({
      message: 'Vote counted!',
      votes: updatedRow[0].votes
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cast vote', error });
  }
};

module.exports = {
  submitScore,
  getLeaderboard,
  castVote
};