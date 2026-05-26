const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://av-quint-innovations.vercel.app'
  })
);
app.use(express.json());

app.use((req, res, next) => {
  if ((req.path.startsWith('/api/auth') || req.path.startsWith('/api/tasks')) && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database unavailable. Start MongoDB or update MONGO_URI before using this endpoint.'
    });
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message || 'Server error'
  });
});

module.exports = app;
