const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/auth/users - List mock/demo team users for quick role switching
router.get('/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login - Simple demo login / session switcher
router.post('/login', (req, res) => {
  try {
    const { email, userId } = req.body;
    const users = db.getUsers();
    let user = users.find(u => (userId && u.id === userId) || (email && u.email.toLowerCase() === email.toLowerCase()));
    
    if (!user) {
      user = users[0]; // Fallback to Lead AI Engineer
    }

    res.json({
      success: true,
      token: `jwt-demo-${user.id}-${Date.now()}`,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me - Get default/current session user
router.get('/me', (req, res) => {
  try {
    const user = db.getUsers()[0]; // Default: Chirag N Sundar
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
