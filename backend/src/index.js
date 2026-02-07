require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const LobbyManager = require('./managers/LobbyManager');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const lobbyManager = new LobbyManager(io);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmic-spin';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/scores', require('./routes/scores'));

// Socket Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    lobbyManager.leaveRoom(socket);
  });

  socket.on('create_room', (settings, callback) => {
    const roomId = lobbyManager.createRoom(socket, settings);
    callback({ success: true, roomId });
  });

  socket.on('join_room', (roomId, callback) => {
    const result = lobbyManager.joinRoom(socket, roomId);
    callback(result);
  });

  socket.on('leave_room', () => {
    lobbyManager.leaveRoom(socket);
  });

  socket.on('get_public_rooms', (callback) => {
    callback(lobbyManager.getPublicRooms());
  });

  socket.on('player_update', (data) => {
    // Relay to room
    if (data.roomId) {
      socket.to(data.roomId).emit('player_update', { id: socket.id, ...data });
    }
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Cosmic Spin Server Running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
