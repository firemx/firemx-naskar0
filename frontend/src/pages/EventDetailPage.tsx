import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const EventDetailPage = () => {
  const { id } = useParams();

  // You can fetch real data here using axios
  return (
    <Container sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Event Details ({id})
        </Typography>
        <Typography variant="body1">
          This is where you'll show more info about the event.
        </Typography>
      </Box>
    </Container>
  );
};

export default EventDetailPage;