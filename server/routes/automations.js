const express = require('express');
const router = express.Router();
const db = require('../db/database');
const automationService = require('../services/automationService');

// GET /api/automations/logs - List automation pipeline execution logs
router.get('/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = db.getAutomationLogs(limit);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/automations/trigger - Test trigger end-to-end automation workflow
router.post('/trigger', async (req, res) => {
  try {
    const { enquiry, source = 'automation_test' } = req.body;
    const sampleEnquiry = enquiry || {
      name: 'Sarah Connor',
      email: `sarah.c.${Date.now().toString(36)}@cyberdyne-sys.org`,
      company: 'Cyberdyne Systems AI',
      phone: '+1 555-019-2831',
      service: 'Autonomous AI Employee',
      budget: '$15,000+',
      message: 'We need an autonomous AI customer support employee integrated with WhatsApp to resolve 80% of our daily enterprise helpdesk tickets.'
    };

    const result = await automationService.processInboundLead(sampleEnquiry, source);
    res.json({
      success: true,
      message: 'End-to-end workflow executed successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
