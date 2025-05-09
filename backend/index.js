const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
const possiblePaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(process.cwd(), '.env'),
];
let loaded = false;

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`✅ Loaded .env from: ${p}`);
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.error('❌ No .env file found!');
  process.exit(1);
}

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('DB_USER:', process.env.DB_USER);

// Setup Express
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const debugRoutes = require('./routes/debugRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api', mpesaRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api', commentRoutes);
app.use('/api', require('./routes/emailRoute'));

// DB Connection
const { connectDB } = require('./config/db');
connectDB();

// Start HTTP Server
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// Set Socket.IO instance globally
const socketUtils = require('./utils/socket');
socketUtils.setIO(io);
// socketIo.setIO(server);

// Socket connection handler
io.on('connection', (socket) => {
  console.log('WebSocket: Client connected');

  socket.on('disconnect', () => {
    console.log('WebSocket: Client disconnected');
  });
});

// Start Listening
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

