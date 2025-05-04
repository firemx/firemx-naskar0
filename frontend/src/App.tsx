import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveStream from './pages/LiveStream';
import AdminDashboard from './pages/AdminDashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import PreviousEventsPage from './pages/PreviousEventsPage';
import MediaPRPage from './pages/MediaPRPage';
import EventDetailPage from './pages/EventDetailPage';
import Register from './pages/Register';
import Events from './pages/Events'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live" element={<LiveStream />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/previous-events" element={<PreviousEventsPage />} />
        <Route path="/media-pr" element={<MediaPRPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Events" element={<Events />} />
      </Routes>
    </Router>
  );
}

export default App;