// frontend/src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Material UI Components
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button as MuiButton,
  Box,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Chart.js for Graphs
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    price: '',
    imageUrl: ''
  });
  const [currentEvent, setCurrentEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // For mobile/right drawer
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isSuspendAction, setIsSuspendAction] = useState<boolean>(true); // true = suspend, false = unsuspend

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://107.152.35.103:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userRes.data);

        const eventRes = await axios.get('http://107.152.35.103:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(eventRes.data);

        const leaderRes = await axios.get('http://107.152.35.103:5000/api/leaderboard/1', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(leaderRes.data);
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const socket = io('http://107.152.35.103:5000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      console.log('Connected to real-time updates');
    });

    socket.on('eventCreated', (createdEvent) => {
      setEvents((prevEvents) => [createdEvent, ...prevEvents]);
    });

    socket.on('eventUpdated', (updatedEvent) => {
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    });

    socket.on('eventDeleted', ({ id }) => {
      setEvents(events.filter((e) => e.id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, [events]);

  // Handle input changes – Create Event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Submit new event
  const handleSubmitEvent = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You are not logged in');
      return;
    }

    if (
      !newEvent.title ||
      !newEvent.startDate ||
      !newEvent.endDate ||
      !newEvent.location ||
      !newEvent.price
    ) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await axios.post(
        'http://107.152.35.103:5000/api/events/register',
        newEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdEvent = res.data.event || res.data;

      // Broadcast via WebSocket
      const socket = io('http://107.152.35.103:5000');
      socket.emit('eventCreated', createdEvent);

      // Reset form and close modal
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        price: '',
        imageUrl: ''
      });
      setOpenModal(false);
    } catch (error) {
      console.error('Failed to create event', error.response?.data || error.message);
      alert(`Failed to create event: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle edit click
  const handleEditClick = (event) => {
    setCurrentEvent(event);
    setEditModalOpen(true);
  };

  // Handle update event
  const handleUpdateEvent = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `http://107.152.35.103:5000/api/events/${currentEvent.id}`,
        currentEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const socket = io('http://107.152.35.103:5000');
      socket.emit('eventUpdated', currentEvent);

      // Refresh events
      const res = await axios.get('http://107.152.35.103:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(res.data);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update event', error);
      alert('Failed to update event');
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://107.152.35.103:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const socket = io('http://107.152.35.103:5000');
      socket.emit('eventDeleted', { id: eventId });

      setEvents(events.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event', error);
      alert('Failed to delete event');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://107.152.35.103:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user');
    }
  };

  // Chart Data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [12, 19, 3, 5, 2],
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Ticket Sales' },
    },
  };

  const suspendUserToggle = async (userId, isCurrentlySuspended) => {
    const token = localStorage.getItem('token');
    try {
      const endpoint = isCurrentlySuspended
        ? 'http://107.152.35.103:5000/api/admin/users/${userId}/unsuspend'
        : 'http://107.152.35.103:5000/api/admin/users/${userId}/suspend';
  
      await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Notify user via email
      await axios.post(
        'http://107.152.35.103:5000/api/email/send',
        {
          userId,
          subject: isCurrentlySuspended ? 'Your Account Has Been Unsuspended' : 'Your Account Has Been Suspended',
          message: isCurrentlySuspended
            ? 'Good news! Your account has been reactivated.'
            : 'Your account has been suspended.',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, suspended: !isCurrentlySuspended } : u));
    } catch (error) {
      console.error('Failed to update suspension status', error);
      alert(`Failed to ${isCurrentlySuspended ? 'unsuspend' : 'suspend'} user`);
    }
  };

  return (
    <>
      {/* Admin Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Logo on Left */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Skating Admin
          </Typography>

          {/* Hamburger Menu Icon on Right */}
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer Menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: 250,
            padding: 2,
            backgroundColor: '#fff',
            height: '100%',
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {['Add Event', 'Users', 'Payments', 'Log Out'].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (text === 'Log Out') {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    } else if (text === 'Add Event') {
                      setOpenModal(true);
                    }
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 8, pt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Users Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">Users</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Suspended</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.suspended ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <MuiButton
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsSuspendAction(!user.suspended);
                            setConfirmOpen(true);
                          }}
                          color={user.suspended ? 'success' : 'warning'}
                          size="small"
                          variant="contained"
                          sx={{ mr: 1 }}
                        >
                          {user.suspended ? 'Unsuspend' : 'Suspend'}
                        </MuiButton>
                        <MuiButton
                          onClick={() => deleteUser(user.id)}
                          color="error"
                          size="small"
                          variant="contained"
                        >
                          Delete
                        </MuiButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Events Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Events</Typography>
              <MuiButton onClick={() => setOpenModal(true)} variant="contained">
                Add New Event
              </MuiButton>
            </Box>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {events.length > 0 ? (
                events.map((event) => (
                  <Grid item xs={12} key={event.id}>
                    <Card elevation={3}>
                      <Grid container>
                        {/* Left side: Image Placeholder */}
                        <Grid item xs={12} md={4}>
                          <Box
                            component="img"
                            src={event.imageUrl || 'https://via.placeholder.com/400x200?text=Event+Image'}
                            alt={event.title}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Grid>
                        {/* Right side: Event Info */}
                        <Grid item xs={12} md={8}>
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              {event.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              📅{' '}
                              {new Date(event.start_date).toLocaleDateString()} |{' '}
                              {new Date(event.start_date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              💰 KES {event.price}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              👥 Registered: {event.registeredCount || 0}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <MuiButton
                                href={`/event/${event.id}`}
                                variant="outlined"
                                color="primary"
                                sx={{ mr: 1 }}
                              >
                                More Details
                              </MuiButton>
                              <MuiButton
                                onClick={() => handleEditClick(event)}
                                variant="contained"
                                color="primary"
                                sx={{ mr: 1 }}
                              >
                                Edit
                              </MuiButton>
                              <MuiButton
                                onClick={() => handleDeleteEvent(event.id)}
                                variant="outlined"
                                color="error"
                              >
                                Delete
                              </MuiButton>
                            </Box>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center">No events found</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Live Leaderboard */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">Live Leaderboard</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Skater</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Votes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow key={entry.skater_id}>
                      <TableCell>{entry.full_name}</TableCell>
                      <TableCell align="right">{entry.score}</TableCell>
                      <TableCell align="right">{entry.votes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Ticket Sales Chart */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">Ticket Sales Overview</Typography>
            <Box height={300}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>

        {/* Event Creation Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              type="text"
              fullWidth
              variant="outlined"
              name="title"
              onChange={handleInputChange}
              value={newEvent.title}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              name="description"
              onChange={handleInputChange}
              value={newEvent.description}
            />
            <TextField
              margin="dense"
              label="Start Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              name="startDate"
              InputLabelProps={{ shrink: true }}
              onChange={handleInputChange}
              value={newEvent.startDate}
            />
            <TextField
              margin="dense"
              label="End Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              name="endDate"
              InputLabelProps={{ shrink: true }}
              onChange={handleInputChange}
              value={newEvent.endDate}
            />
            <TextField
              margin="dense"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              name="location"
              onChange={handleInputChange}
              value={newEvent.location}
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              name="price"
              onChange={handleInputChange}
              value={newEvent.price}
            />
            <TextField
              margin="dense"
              label="Upload Image"
              type="file"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setNewEvent({ ...newEvent, imageUrl: e.target?.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setOpenModal(false)}>Cancel</MuiButton>
            <MuiButton onClick={handleSubmitEvent} variant="contained">
              Create Event
            </MuiButton>
          </DialogActions>
        </Dialog>

        {/* Event Edit Modal */}
        {currentEvent && (
          <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Event Title"
                type="text"
                fullWidth
                variant="outlined"
                name="title"
                defaultValue={currentEvent.title}
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    title: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                name="description"
                defaultValue={currentEvent.description}
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Start Date"
                type="datetime-local"
                fullWidth
                variant="outlined"
                name="startDate"
                InputLabelProps={{ shrink: true }}
                defaultValue={
                  new Date(currentEvent.start_date).toISOString().slice(0, 16)
                }
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    start_date: e.target.value + ':00Z',
                  })
                }
              />
              <TextField
                margin="dense"
                label="End Date"
                type="datetime-local"
                fullWidth
                variant="outlined"
                name="endDate"
                InputLabelProps={{ shrink: true }}
                defaultValue={
                  new Date(currentEvent.end_date).toISOString().slice(0, 16)
                }
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    end_date: e.target.value + ':00Z',
                  })
                }
              />
              <TextField
                margin="dense"
                label="Location"
                type="text"
                fullWidth
                variant="outlined"
                name="location"
                defaultValue={currentEvent.location}
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    location: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                name="price"
                defaultValue={currentEvent.price}
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    price: e.target.value,
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={() => setEditModalOpen(false)}>Cancel</MuiButton>
              <MuiButton onClick={handleUpdateEvent} variant="contained">
                Save Changes
              </MuiButton>
            </DialogActions>
          </Dialog>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>{isSuspendAction ? 'Suspend User' : 'Unsuspend User'}</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to {isSuspendAction ? 'suspend' : 'unsuspend'} this user?
    </Typography>
  </DialogContent>
  <DialogActions>
    <MuiButton onClick={() => setConfirmOpen(false)} color="primary">
      Cancel
    </MuiButton>
    <MuiButton
      onClick={() => {
        if (selectedUserId !== null) {
          suspendUserToggle(selectedUserId, isSuspendAction);
        }
        setConfirmOpen(true);
      }}
      color="error"
      variant="contained"
    >
      Confirm
    </MuiButton>
  </DialogActions>
</Dialog>
      </Container>
    </>
  );
};

export default AdminDashboard;