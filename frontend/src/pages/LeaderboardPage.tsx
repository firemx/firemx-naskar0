import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const eventId = 1; // Replace with dynamic ID

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://107.152.35.103:5000/api/leaderboard/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(res.data);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const castVote = async (skaterId: number) => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://107.152.35.103:5000/api/vote',
      { skaterId, eventId: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Vote submitted!');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Live Leaderboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Skater</th>
              <th>Score</th>
              <th>Votes</th>
              <th>Vote</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.skater_id}>
                <td>{entry.full_name}</td>
                <td>{entry.score}</td>
                <td>{entry.votes}</td>
                <td>
                  <button onClick={() => castVote(entry.skater_id)}>Vote</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardPage;