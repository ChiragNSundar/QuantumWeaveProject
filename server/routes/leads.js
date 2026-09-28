const express = require('express');
const router = express.Router();
const db = require('../db/database');
const aiService = require('../services/aiService');
const automationService = require('../services/automationService');

// GET /api/leads - List all leads with filtering & search
router.get('/', (req, res) => {
  try {
    const { stage, priority, source, search } = req.query;
    const leads = db.getLeads({ stage, priority, source, search });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/leads/:id - Get single lead detail with activity timeline
router.get('/:id', (req, res) => {
  try {
    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    const activities = db.getActivities(lead.id);
    res.json({ success: true, data: { ...lead, activities } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/leads - Create lead (automatically triggers end-to-end automation workflow)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, source, service, budget, message, runAutomation } = req.body;

    if (!message && !name && !email) {
      return res.status(400).json({ success: false, error: 'Please provide at least a name, email, or enquiry message.' });
    }

    // If runAutomation is true (default for inbound enquiries)
    if (runAutomation !== false) {
      const result = await automationService.processInboundLead({
        name,
        email,
        phone,
        company,
        source: source || 'website',
        service,
        budget,
        message
      }, source || 'website');

      return res.status(201).json({
        success: true,
        message: 'Lead created and automation pipeline executed successfully',
        data: result.lead,
        automation: result.automation
      });
    }

    // Manual lead creation without full automation
    const newLead = db.createLead({
      name,
      email,
      phone,
      company,
      source: source || 'manual',
      service,
      budget,
      message,
      stage: 'New'
    });

    db.addActivity({
      leadId: newLead.id,
      type: 'lead_created',
      title: 'Lead Created Manually',
      description: `Manual entry by internal team.`,
      actor: 'user'
    });

    res.status(201).json({ success: true, data: newLead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/leads/:id - Update lead details
router.patch('/:id', (req, res) => {
  try {
    const existing = db.getLeadById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const updated = db.updateLead(req.params.id, req.body);
    db.addActivity({
      leadId: req.params.id,
      type: 'note_added',
      title: 'Lead Information Updated',
      description: `Updated fields: ${Object.keys(req.body).join(', ')}`,
      actor: 'user'
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/leads/:id/stage - Update pipeline stage
router.patch('/:id/stage', (req, res) => {
  try {
    const { stage, user = 'Chirag N Sundar' } = req.body;
    const validStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, error: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }

    const existing = db.getLeadById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const oldStage = existing.stage;
    const updated = db.updateLead(req.params.id, { stage });

    db.addActivity({
      leadId: req.params.id,
      type: 'stage_changed',
      title: `Pipeline Stage Updated: ${oldStage} → ${stage}`,
      description: `Stage changed by ${user}.`,
      actor: 'user',
      metadata: { oldStage, newStage: stage, changedBy: user }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/leads/:id/activities - Add manual activity or note
router.post('/:id/activities', (req, res) => {
  try {
    const { title, description, type, actor = 'user' } = req.body;
    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const newActivity = db.addActivity({
      leadId: req.params.id,
      type: type || 'note_added',
      title: title || 'Team Note Added',
      description: description || '',
      actor
    });

    res.status(201).json({ success: true, data: newActivity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/leads/:id/analyze - Trigger / Re-run AI Lead Intelligence
router.post('/:id/analyze', async (req, res) => {
  try {
    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const analysis = await aiService.analyzeLeadEnquiry(lead);
    const updated = db.updateLead(req.params.id, { aiIntelligence: analysis });

    db.addActivity({
      leadId: req.params.id,
      type: 'ai_analyzed',
      title: 'AI Intelligence Re-Evaluated',
      description: `Assigned Priority: ${analysis.priority}. Intent: ${analysis.intent}. Suggested: ${analysis.suggestedService}`,
      actor: 'ai_agent'
    });

    res.json({ success: true, data: updated, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/leads/:id/approve-followup - Human-in-the-loop follow-up approval & dispatch
router.post('/:id/approve-followup', (req, res) => {
  try {
    const { draftMessage, channel = 'email' } = req.body;
    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const currentAi = lead.aiIntelligence || {};
    const updated = db.updateLead(req.params.id, {
      stage: lead.stage === 'New' ? 'Contacted' : lead.stage,
      aiIntelligence: {
        ...currentAi,
        isReviewed: true,
        suggestedFollowUp: draftMessage || currentAi.suggestedFollowUp,
        approvedAt: new Date().toISOString()
      }
    });

    db.addActivity({
      leadId: req.params.id,
      type: 'follow_up_sent',
      title: `Follow-Up Dispatched via ${channel.toUpperCase()}`,
      description: `Approved draft sent to ${lead.email || lead.phone}:\n"${(draftMessage || currentAi.suggestedFollowUp || '').substring(0, 120)}..."`,
      actor: 'user',
      metadata: { channel, dispatchedAt: new Date().toISOString() }
    });

    res.json({ success: true, data: updated, message: `Follow-up approved and dispatched via ${channel}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteLead(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
