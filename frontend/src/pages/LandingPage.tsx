import React from 'react';
import HeroSection from '../components/HeroSection';
import AppFooter from '../components/AppFooter';
import AppNavbar from '../components/AppNavbar'; // ✅ Import navbar

import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';

const LandingPage = () => {
  return (
    <>
      {/* Navbar */}
      <AppNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>Skaters</Typography>
              <Typography>
                Register for upcoming skating events, pay online, and compete in style.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>Spectators</Typography>
              <Typography>
                Buy tickets online, receive printable PDFs, and stream live events.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>Admins & Moderators</Typography>
              <Typography>
                Manage events, users, payments, and send real-time updates.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Ready to get started?
          </Typography>
          <Typography variant="body1" paragraph>
            Join now and start registering for events or managing competitions!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/login"
              size="large"
              variant="contained"
              color="primary"
              sx={{ minWidth: '150px' }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/admin"
              size="large"
              variant="outlined"
              color="primary"
              sx={{ minWidth: '150px' }}
            >
              Go to Admin Dashboard
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box mt="auto">
        <AppFooter />
      </Box>
    </>
  );
};

export default LandingPage;