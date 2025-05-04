import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            fontWeight: 700,
            color: '#fff'
          }}
        >
          Skating Platform
        </Typography>
        <Box>
          <Button
            component={RouterLink}
            to="/events"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Events
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Skater Login
          </Button>
          <Button
            component={RouterLink}
            to="/previous-events"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Previous Events
          </Button>
          <Button
            component={RouterLink}
            to="/live"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Watch Live
          </Button>
          <Button
            component={RouterLink}
            to="/media-pr"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Media & PR
          </Button>
          <Button
            component={RouterLink}
            to="/admin"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Admin
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;