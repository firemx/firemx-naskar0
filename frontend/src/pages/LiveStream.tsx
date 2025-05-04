import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import io from 'socket.io-client';

// Replace with your backend IP
const socket = io('http://107.152.35.103:5000');

const LiveStreamPage = () => {
  const [comments, setComments] = useState<{ user: string; text: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user] = useState('Viewer'); // Can come from auth later

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listen for comments in real-time
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to live stream chat');
    });

    socket.on('newComment', (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.off('newComment');
    };
  }, []);

  // Submit comment
  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      user,
      text: newComment,
    };

    // Broadcast via Socket.IO
    socket.emit('sendComment', comment);

    setNewComment('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Live Skating Event
      </Typography>

      {/* Video + Chat Side by Side (Responsive) */}
<Grid container spacing={3} sx={{ mb: 4 }}>
  {/* Video Section */}
  <Grid size={{ xs: 12, md: 8 }}>
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '56.25%', // 16:9 aspect ratio
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
        title="Live Stream"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      ></iframe>
    </Box>
  </Grid>

  {/* Live Chat Sidebar */}
  <Grid size={{ xs: 12, md: 4 }}>
    <Box
      sx={{
        borderLeft: isMobile ? 'none' : '1px solid #ccc',
        pl: isMobile ? 0 : 2,
        pt: isMobile ? 2 : 0,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Live Chat
      </Typography>

      {/* Chat Messages */}
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          border: '1px solid #ddd',
          p: 2,
          borderRadius: 1,
          mb: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        {comments.length > 0 ? (
          comments.map((msg, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography fontWeight="bold">{msg.user}</Typography>
              <Typography>{msg.text}</Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">No messages yet.</Typography>
        )}
      </Box>

      {/* Chat Input */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={1}>
        <TextField
          label="Chat Message"
          variant="outlined"
          fullWidth
          size="small"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
        />
        <Button variant="contained" onClick={handleSendComment} sx={{ mt: isMobile ? 1 : 0 }}>
          Send
        </Button>
      </Box>
    </Box>
  </Grid>
</Grid>

      {/* Comments Section */}
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      {/* Comment List */}
      <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography fontWeight="bold" color="primary">
                {comment.user}
              </Typography>
              <Typography>{comment.text}</Typography>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">No comments yet</Typography>
        )}
      </Box>

      {/* Add New Comment */}
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={1}>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          size="small"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
        />
        <Button variant="contained" onClick={handleSendComment} sx={{ mt: isMobile ? 1 : 0 }}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default LiveStreamPage;