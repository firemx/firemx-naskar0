// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetailPage from './pages/EventDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetailPage />} />

        {/* Authenticated Users Only */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Admin Users Only */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;