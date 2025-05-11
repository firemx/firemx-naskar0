// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
  
    try {
      const res = await axios.post('http://107.152.35.103:5000/api/auth/login', {
        email,
        password
      });
  
      const data = res.data;
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
  
      if (data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
  
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', err.response?.data || err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://107.152.35.103/api/auth/google';
  };

  //await axios.post('http://107.152.35.103:5000/api/auth/login', {
  //  email,
  //  password
  //});

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Skating Platform
        </Typography>

        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
            Login
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Sign In with Google
          </Button>
        </Box>

        <Typography align="center">
          Don't have an account?{' '}
          <a href="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Register
          </a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;