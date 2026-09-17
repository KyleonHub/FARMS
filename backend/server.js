/**
 * FARMS - Faculty Availability & Room Management System
 * Modular Express REST API Server with Real-Time SSE Stream
 */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const requestRoutes = require('./routes/requestRoutes');
const logRoutes = require('./routes/logRoutes');
const events = require('./utils/events');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// High-Performance Compression Middleware (Gzip/Brotli)
app.use(compression({
  threshold: 1024, // Compress responses above 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Standard Security & Body Parsing
app.use(cors());
app.use(express.json());

// API Cache Control: Dynamic API responses must never be cached by intermediaries
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'FARMS Modular API',
    version: '2.5.0',
    sseClients: events.getClientCount(),
    timestamp: new Date().toISOString()
  });
});

// Real-Time Server-Sent Events (SSE) Stream
app.get('/api/events', events.handleSSE);

// Serve static frontend assets with HTTP Cache-Control and ETags
const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // HTML files: short cache or revalidate to avoid stale app shell
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (filePath.match(/\.(css|js|woff2|woff|ttf|svg|webp|png|jpg|jpeg|ico)$/)) {
      // Static assets: cache for 1 day with stale-while-revalidate
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }
  }
}));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/logs', logRoutes);

// System Reset API Endpoint (Resets facilities & requests, preserves audit logs)
app.post('/api/system/reset', (req, res) => {
  const preserveLogs = req.body.preserveLogs !== false;
  const result = db.resetSystem(preserveLogs);
  events.broadcast('system_reset', { preserveLogs, ...result });
  res.json({
    success: true,
    message: 'System successfully reset to clean vacant state. Audit logs preserved.',
    data: result
  });
});

// Fallback to index.html for root or SPA navigation
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Global 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API Route ${req.originalUrl} not found` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  FARMS Backend Server running on http://localhost:${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`  Real-Time SSE: http://localhost:${PORT}/api/events`);
  console.log(`========================================`);
});

module.exports = app;
