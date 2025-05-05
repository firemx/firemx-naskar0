// frontend/src/pages/EventDetailPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  price: number;
  distance: string;
  registered_count: number;
  imageUrl?: string;
}

const EventDetailPage = ({ id }: { id: number }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://107.152.35.103:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading || !event) {
    return <Typography>Loading event...</Typography>;
  }

  const handleRegister = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to Google login with redirect URL to payment
      const redirectUrl = encodeURIComponent(`http://107.152.35.103:5173/event/${id}/register`);
      window.location.href = `http://107.152.35.103:5000/api/auth/google?redirect=${redirectUrl}`;
      return;
    }

    window.location.href = `/event/${id}/register`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3}>
        <Grid container>
          {/* Left Side: Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={event.imageUrl || 'https://via.placeholder.com/600x400?text=Event+Image'}
              alt={event.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Grid>

          {/* Right Side: Info */}
          <Grid item xs={12} md={6}>
            <CardContent>
              <Chip label="Skating Event" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                {event.title}
              </Typography>

              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                📅 Date & Time
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {new Date(event.start_date).toLocaleString()} – {new Date(event.end_date).toLocaleString()}
              </Typography>

              <Typography variant="h6" gutterBottom>
                📍 Location
              </Typography>
              <Typography variant="body2" paragraph>
                {event.location}
              </Typography>

              <Typography variant="h6" gutterBottom>
                🏁 Distance
              </Typography>
              <Typography variant="body2" paragraph>
                {event.distance || 'Not specified'}
              </Typography>

              <Typography variant="h6" gutterBottom>
                👥 Registered Skaters
              </Typography>
              <Typography variant="body2" paragraph>
                {event.registered_count || 0} skaters have registered so far.
              </Typography>

              <Typography variant="h6" gutterBottom>
                💰 Registration Fee
              </Typography>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                KES {event.price}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
                sx={{ mt: 2 }}
              >
                Register & Pay
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Map Placeholder */}
      <Box sx={{ mt: 4, height: '400px', border: '1px solid #ccc' }}>
        <Typography align="center" sx={{ pt: 2 }}>
          🗺️ Map of event location coming soon
        </Typography>
        {/* Replace this later with actual map */}
      </Box>
    </Container>
  );
};

export default EventDetailPage;