import React from 'react';
import { Container, Typography } from '@mui/material';

const PreviousEventsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">Previous Events</Typography>
      <Typography>Check out past skating competitions here.</Typography>
    </Container>
  );
};

export default PreviousEventsPage;