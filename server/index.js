const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  if (config.NODE_ENV !== 'test') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
  }
  next();
});

// Mount API routes
app.use('/api/leads', require('./routes/leads'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/agent', require('./routes/agent'));
app.use('/api/automations', require('./routes/automations'));
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Quantum Weave AI Lead & Customer Intelligence Platform',
    version: '1.0.0',
    candidate: 'Chirag N Sundar',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Fallback to client index.html for SPA routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    const indexPath = path.join(clientDistPath, 'index.html');
    const fs = require('fs');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: config.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start listening if not imported in tests and not running as a serverless function (Vercel)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(config.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Quantum Weave Intelligence API Server running on port ${config.PORT}`);
    console.log(`   Health check: http://localhost:${config.PORT}/api/health`);
    console.log(`   Leads API:    http://localhost:${config.PORT}/api/leads`);
    console.log(`   RAG API:      http://localhost:${config.PORT}/api/knowledge/documents`);
    console.log(`   Agent API:    http://localhost:${config.PORT}/api/agent/tools`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
