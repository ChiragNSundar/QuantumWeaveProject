const express = require('express');
const router = express.Router();
const agentService = require('../services/agentService');

// GET /api/agent/tools - Get list of agent tools
router.get('/tools', (req, res) => {
  try {
    const tools = agentService.getToolDefinitions();
    res.json({ success: true, count: tools.length, data: tools });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/agent/chat - Autonomous Agent chat with tool execution & reasoning
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], sessionContext = {} } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = await agentService.processMessage(message, conversationHistory, sessionContext);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/agent/execute-tool - Direct tool invocation (for testing and automation inspection)
router.post('/execute-tool', async (req, res) => {
  try {
    const { toolName, args } = req.body;
    if (!toolName) {
      return res.status(400).json({ success: false, error: 'toolName is required' });
    }

    const toolExecution = await agentService.executeTool(toolName, args || {});
    res.json({ success: true, data: toolExecution });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
