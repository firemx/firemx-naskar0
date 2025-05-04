import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Sample images for carousel
const images = [
  'https://source.unsplash.com/featured/?skate,competition&sig=1',
  'https://source.unsplash.com/featured/?skater,jump&sig=2',
  'https://source.unsplash.com/featured/?ramp,ice&sig=3'
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1
        }
      }}
    >
      {/* Content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          Skating Event Platform
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Register for events, buy tickets, watch live, or manage competitions as an admin.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button
            component={RouterLink}
            to="/login"
            size="large"
            variant="contained"
            color="primary"
          >
            Sign In / Register
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard"
            size="large"
            variant="outlined"
            color="secondary"
          >
            View Events
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;