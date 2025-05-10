// frontend/src/pages/AdminUsersPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Button as MuiButton,
  Stack,
} from '@mui/material';

import axios from 'axios';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  suspended: boolean;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://107.152.35.103:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1); // Reset to first page after filtering
  }, [searchTerm, users]);

  // Handle checkbox selection
  const handleSelect = (userId: number) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((user) => user.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (userId: number) => selected.includes(userId);

  // Batch Actions
  const handleSuspendSelected = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://107.152.35.103:5000/api/admin/users/suspend-multiple',
        { userIds: selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFilteredUsers(
        filteredUsers.map((user) =>
          selected.includes(user.id) ? { ...user, suspended: true } : user
        )
      );
      setSelected([]); // Clear selection
    } catch (error) {
      console.error('Failed to suspend users', error);
      alert('Failed to suspend some users');
    }
  };

  const handleUnsuspendSelected = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://107.152.35.103:5000/api/admin/users/unsuspend-multiple',
        { userIds: selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFilteredUsers(
        filteredUsers.map((user) =>
          selected.includes(user.id) ? { ...user, suspended: false } : user
        )
      );
      setSelected([]); // Clear selection
    } catch (error) {
      console.error('Failed to unsuspend users', error);
      alert('Failed to unsuspend some users');
    }
  };

  const handleDeleteSelected = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://107.152.35.103:5000/api/admin/users/delete-multiple', {
        data: { userIds: selected },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFilteredUsers(filteredUsers.filter((user) => !selected.includes(user.id)));
      setSelected([]); // Clear selection
    } catch (error) {
      console.error('Failed to delete users', error);
      alert('Failed to delete some users');
    }
  };

  // Pagination logic
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const displayedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      {/* Search */}
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Batch Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <MuiButton
          variant="contained"
          color="warning"
          onClick={handleSuspendSelected}
          disabled={selected.length === 0}
        >
          Suspend Selected
        </MuiButton>
        <MuiButton
          variant="contained"
          color="success"
          onClick={handleUnsuspendSelected}
          disabled={selected.length === 0}
        >
          Unsuspend Selected
        </MuiButton>
        <MuiButton
          variant="outlined"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
        >
          Delete Selected
        </MuiButton>
      </Stack>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredUsers.length}
                  checked={filteredUsers.length > 0 && selected.length === filteredUsers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Suspended</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user) => {
              const isItemSelected = isSelected(user.id);
              return (
                <TableRow
                  key={user.id}
                  selected={isItemSelected}
                  hover
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onClick={() => handleSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.suspended ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <MuiButton
                        size="small"
                        variant="contained"
                        color={user.suspended ? 'success' : 'warning'}
                        onClick={() =>
                          suspendUserToggle(user.id, user.suspended)
                        }
                      >
                        {user.suspended ? 'Unsuspend' : 'Suspend'}
                      </MuiButton>
                      <MuiButton
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </MuiButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {Array.from(
            { length: Math.ceil(filteredUsers.length / rowsPerPage) },
            (_, i) => (
              <MuiButton
                key={i + 1}
                onClick={() => handleChangePage(i + 1)}
                variant={page === i + 1 ? 'contained' : 'outlined'}
                size="small"
              >
                {i + 1}
              </MuiButton>
            )
          )}
        </Stack>
      </Box>
    </Container>
  );
};

// Reusable functions from AdminDashboard
const suspendUserToggle = async (userId: number, isCurrentlySuspended: boolean) => {
  const token = localStorage.getItem('token');
  try {
    const endpoint = isCurrentlySuspended
      ? `http://107.152.35.103:5000/api/admin/users/${userId}/unsuspend`
      : `http://107.152.35.103:5000/api/admin/users/${userId}/suspend`;

    await axios.put(endpoint, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(isCurrentlySuspended ? 'User has been unsuspended!' : 'User has been suspended!');
    
    window.location.reload(); // Refresh to reflect changes
  } catch (error) {
    console.error('Failed to update suspension status', error);
    alert(`Failed to ${isCurrentlySuspended ? 'unsuspend' : 'suspend'} user`);
  }
};

const deleteUser = async (userId: number) => {
  const token = localStorage.getItem('token');
  if (!window.confirm('Are you sure you want to delete this user?')) return;

  try {
    await axios.delete(`http://107.152.35.103:5000/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('User deleted successfully');
    window.location.reload();
  } catch (error) {
    console.error('Failed to delete user', error);
    alert('Failed to delete user');
  }
};

export default AdminUsersPage;