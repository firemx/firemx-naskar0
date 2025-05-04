// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await axios.post('http://107.152.35.103:5000/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'spectator',
      });
  
      console.log('Success:', res.data);
      navigate('/login');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Registration failed';
  
      setError(errorMessage);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = 'http://107.152.35.103/api/auth/google';
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create an Account
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
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={formData.fullName}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
            Register
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleGoogleSignUp}
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Sign Up with Google
          </Button>
        </Box>

        <Typography align="center">
          Already have an account?{' '}
          <a href="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Login
          </a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;