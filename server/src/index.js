// ──────────────────────────────────────────────
// Express Application Entry Point
// ──────────────────────────────────────────────
// Mounts all routes, middleware, and serves the
// React client build in production.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const memberRoutes = require('./routes/members');
const { projectTasksRouter, taskRouter } = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');

// Middleware imports
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Global Middleware ─────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── API Routes ────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:id/members', memberRoutes);
app.use('/api/projects/:projectId/tasks', projectTasksRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/dashboard', dashboardRoutes);

// ── Health check ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Serve React Client in Production ──────────
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  // All non-API routes serve the React app (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// ── Centralized Error Handler ─────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
