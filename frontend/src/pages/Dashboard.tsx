import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';

const Dashboard = () => {
  // Sample static events
  const sampleEvents = [
    {
      id: 1,
      title: 'Winter Skating Championship',
      start_date: '2025-01-15T10:00:00Z',
      location: 'Downtown Arena'
    },
    {
      id: 2,
      title: 'Spring Speed Skating Cup',
      start_date: '2025-03-20T12:00:00Z',
      location: 'City Ice Rink'
    },
    {
      id: 3,
      title: 'National Freestyle Skating',
      start_date: '2025-05-10T09:00:00Z',
      location: 'Skate Park Stadium'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>

      <Grid container spacing={3}>
        {sampleEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {new Date(event.start_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  Location: {event.location}
                </Typography>
                <Button
                  component="a"
                  href={`/event/${event.id}`}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;