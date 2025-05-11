// frontend/src/pages/Login.tsx
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError('Please enter email and password');
    return;
  }

  try {
    const res = await fetch('http://107.152.35.103:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Invalid credentials');
      return;
    }

    // Save token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }

  } catch (err) {
    setError('Something went wrong. Please try again.');
  }
};