const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/analytics/overview - Overall metrics & pipeline KPI aggregation
router.get('/overview', (req, res) => {
  try {
    const summary = db.getAnalyticsSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
