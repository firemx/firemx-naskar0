import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
} from '@mui/material';

const AppFooter = () => {
  return (
    <Box component="footer" sx={{
      py: 6,
      px: 2,
      mt: 'auto',
      backgroundColor: '#1a1a1a',
      color: '#ccc'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom color="#fff">
              About
            </Typography>
            <Typography variant="body2">
              The Skating Event Platform helps skaters register, spectators buy tickets, and admins manage everything.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom color="#fff">
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              <li><MuiLink href="/login" color="inherit" underline="hover">Login</MuiLink></li>
              <li><MuiLink href="/dashboard" color="inherit" underline="hover">View Events</MuiLink></li>
              <li><MuiLink href="/leaderboard" color="inherit" underline="hover">Leaderboard</MuiLink></li>
              <li><MuiLink href="/live" color="inherit" underline="hover">Live Stream</MuiLink></li>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom color="#fff">
              Contact
            </Typography>
            <Typography variant="body2">
              Have questions? Reach out at:
            </Typography>
            <Typography variant="body2">
              Email: support@skatingplatform.com
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: '#555' }} />
        <Box textAlign="center">
          <Typography variant="body2">
            © {new Date().getFullYear()} Skating Event Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;