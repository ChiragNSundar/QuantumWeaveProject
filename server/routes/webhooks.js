const express = require('express');
const router = express.Router();
const webhookService = require('../services/webhookService');

// GET /api/webhooks/whatsapp - Meta WhatsApp Cloud API verification challenge
router.get('/whatsapp', (req, res) => {
  const result = webhookService.verifyWebhook(req.query);
  if (result.success) {
    return res.status(200).send(result.challenge);
  }
  return res.status(result.status || 403).send(result.error);
});

// POST /api/webhooks/whatsapp - Inbound WhatsApp Webhook receiver
router.post('/whatsapp', async (req, res) => {
  try {
    const results = await webhookService.handleInboundWhatsApp(req.body);
    // WhatsApp requires immediate 200 OK
    res.status(200).json({ status: 'EVENT_RECEIVED', results });
  } catch (err) {
    console.error('WhatsApp webhook processing error:', err);
    res.status(200).json({ status: 'ERROR_RECORDED', error: err.message });
  }
});

// POST /api/webhooks/simulate-inbound - Interactive WhatsApp Simulator endpoint
router.post('/simulate-inbound', async (req, res) => {
  try {
    const { phone = '+1 (555) 789-0123', name = 'Customer via WhatsApp', message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = await webhookService.processWhatsAppConversation({ phone, name, message });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
