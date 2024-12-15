const express = require('express');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = app.listen(5000, () => {
  console.log('Server running on port 5000');
});

const io = socketIo(server);

// Simulate sending an alert to Twitter and Instagram (webhooks)
const sendToSocialMedia = async (alert) => {
  try {
    // Example for Twitter webhook (replace with actual API endpoint)
    await axios.post('https://api.twitter.com/2/tweets', {
      status: `ALERT: ${alert.message} - Severity: ${alert.severity}`,
    });

    // Example for Instagram webhook (replace with actual API endpoint)
    await axios.post('https://api.instagram.com/v1/media', {
      caption: `ALERT: ${alert.message} - Severity: ${alert.severity}`,
    });

    console.log('Alert shared on social media');
  } catch (error) {
    console.error('Error sharing on social media:', error);
  }
};

// Listen for new alerts from client
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('shareAlert', (alert) => {
    // Send alert to social media platforms via webhooks
    sendToSocialMedia(alert);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
