const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    onlineUsers[socket.id] = username;
    io.emit('onlineUsers', Object.values(onlineUsers));
    io.emit('message', { user: 'System', text: `${username} joined the chat`, timestamp: new Date() });
  });

  socket.on('sendMessage', (msg) => {
    io.emit('message', msg);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit('onlineUsers', Object.values(onlineUsers));
    io.emit('message', { user: 'System', text: `${username} left the chat`, timestamp: new Date() });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
