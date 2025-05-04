// frontend/src/pages/Events.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote'; // Placeholder for TikTok
import TwitterIcon from '@mui/icons-material/Twitter';

interface Event {
  id: number;
  title: string;
  start_date: string;
  location: string;
  price: number;
  description: string;
  imageUrl?: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events/upcoming');
        setEvents(res.data.events || []);
      } catch (err) {
        console.error('Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = (eventId: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Not logged in → redirect to Google login with return URL
      const redirectUrl = encodeURIComponent(`http://107.152.35.103:5173/event/${eventId}/register`);
      window.location.href = `http://107.152.35.103/api/auth/google?redirect=${redirectUrl}`;
      return;
    }

    // Logged in → go directly to payment
    navigate(`/event/${eventId}/register`);
  };

  const shareEvent = (eventId: number) => {
    const url = encodeURIComponent(`http://107.152.35.103:5173/event/${eventId}`);
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: `https://www.instagram.com/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20event!`,
      tiktok: `https://www.tiktok.com/share?url=${url}`,
    };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Upcoming Skating Events
      </Typography>
      <Typography variant="body1" paragraph align="center" color="textSecondary">
        Browse the latest skating competitions and register to participate!
      </Typography>

      {loading ? (
        <Typography>Loading events...</Typography>
      ) : events.length === 0 ? (
        <Typography align="center">No upcoming events found.</Typography>
      ) : (
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} key={event.id}>
              <Card elevation={3}>
                <Grid container>
                  <Grid item xs={12} md={5}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={event.imageUrl || 'https://via.placeholder.com/600x400?text=Skating+Event'}
                      alt={event.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {new Date(event.start_date).toLocaleDateString()} | {event.location}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {event.description.substring(0, 150)}...
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Fee: KES {event.price}
                      </Typography>

                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          variant="outlined"
                          href={`/event/${event.id}`}
                          size="small"
                        >
                          More Details
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register & Pay
                        </Button>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="textSecondary">
                          Share this event:
                        </Typography>
                        <Box>
                          <IconButton
                            component="a"
                            href={shareEvent(event.id).facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            <FacebookIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            component="a"
                            href={shareEvent(event.id).instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            <InstagramIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            component="a"
                            href={shareEvent(event.id).tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            <TikTokIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            component="a"
                            href={shareEvent(event.id).twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            <TwitterIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EventsPage;