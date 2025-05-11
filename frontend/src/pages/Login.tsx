// frontend/src/pages/Login.tsx
import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://107.152.35.103:5000/api/auth/google';
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In with Google
        </Typography>

        <Box component="form" noValidate sx={{ mt: 4 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Sign In with Google
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Typography align="center" variant="body2">
          You must sign in with Google to access the platform.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;