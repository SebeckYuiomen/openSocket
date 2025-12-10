const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
// Express handles routes

// Create ONE server instance that both use
const mainServer = http.createServer(app); 

// Attach Socket.IO to the same server instance
const socketIo = io(mainServer);

// Handle Socket.IO connections
socketIo.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data.message);
    console.log("Broadcasting message to " + data.targetChannel)
    // Broadcast the message to all connected clients
    socketIo.emit(data.targetChannel, data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start listening for traffic
mainServer.listen(3000, () => {
  console.log('Server running on port 3000');
});

