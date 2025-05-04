// frontend/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import axios from 'axios';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface Event {
  id: number;
  title: string;
  start_date: string;
  location: string;
  fee: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        // Fetch user
        const userRes = await axios.get('/api/users/me');
        setUser(userRes.data.user);

        // Fetch events
        const eventRes = await axios.get('/api/events/upcoming');

        // Safely extract events or fallback to empty array
        setEvents(eventRes.data.events || []);
      } catch (err) {
        console.error('Failed to load data', err);
        setEvents([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEvents();
  }, []);

  const handleRegisterEvent = (eventId: number) => {
    window.location.href = `/event/${eventId}/register`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Message */}
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        {user && (
          <>
            <Avatar sx={{ width: 64, height: 64 }}>{user.fullName.charAt(0)}</Avatar>
            <div>
              <Typography variant="h5">Welcome back, {user.fullName}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              <Typography variant="body2" color="textSecondary">
                Role: {user.role}
              </Typography>
            </div>
          </>
        )}
      </Box>

      {/* Events List */}
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>

      {loading ? (
        <Typography>Loading events...</Typography>
      ) : events.length === 0 ? (
        <Typography>No upcoming events found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {new Date(event.start_date).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Location: {event.location}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Fee: KES {event.fee}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleRegisterEvent(event.id)}
                  >
                    Register & Pay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;