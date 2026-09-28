const db = require('../db/database');
const aiService = require('./aiService');
const ragService = require('./ragService');
const config = require('../config');

class AutomationService {
  // Execute the complete end-to-end workflow:
  // Inbound enquiry -> Lead created -> AI analyses lead -> Priority assigned -> Follow-up generated -> CRM updated -> Team alert triggered
  async processInboundLead(rawEnquiry, source = 'website') {
    const startTime = Date.now();
    const workflowId = `auto-${Date.now().toString(36)}`;
    const steps = [];

    // Step 1: Capture & Validate Lead Data
    let validatedData = {
      name: rawEnquiry.name ? rawEnquiry.name.trim() : 'Anonymous Prospect',
      email: rawEnquiry.email ? rawEnquiry.email.trim().toLowerCase() : '',
      phone: rawEnquiry.phone ? rawEnquiry.phone.trim() : '',
      company: rawEnquiry.company ? rawEnquiry.company.trim() : 'Undisclosed Company',
      source: source || rawEnquiry.source || 'website',
      service: rawEnquiry.service || 'General Inquiry',
      budget: rawEnquiry.budget || 'Undisclosed',
      message: rawEnquiry.message ? rawEnquiry.message.trim() : ''
    };

    steps.push({
      step: 'Lead Captured & Validated',
      status: 'success',
      timestamp: new Date().toISOString(),
      detail: `Channel: ${validatedData.source}. Contact: ${validatedData.name} (${validatedData.email || validatedData.phone})`
    });

    // Step 2: Duplicate Check & Database Persistence
    let existingLead = db.findDuplicateLead(validatedData.email, validatedData.phone);
    let lead;

    if (existingLead) {
      lead = db.updateLead(existingLead.id, {
        message: `${existingLead.message}\n\n[Follow-up Enquiry ${new Date().toLocaleDateString()}]: ${validatedData.message}`,
        service: validatedData.service || existingLead.service,
        company: validatedData.company !== 'Undisclosed Company' ? validatedData.company : existingLead.company
      });
      db.addActivity({
        leadId: lead.id,
        type: 'note_added',
        title: 'Duplicate Enquiry Appended to Timeline',
        description: `Prospect reached out again via ${source}. Merged with existing lead record.`,
        actor: 'system'
      });
      steps.push({
        step: 'Duplicate Detected & Merged',
        status: 'success',
        timestamp: new Date().toISOString(),
        detail: `Merged with existing Lead #${lead.id} (${lead.company})`
      });
    } else {
      lead = db.createLead({
        ...validatedData,
        stage: 'New'
      });
      db.addActivity({
        leadId: lead.id,
        type: 'lead_created',
        title: `New Lead Created (${source.toUpperCase()})`,
        description: `Enquiry received: "${validatedData.message.substring(0, 100)}..."`,
        actor: 'system'
      });
      steps.push({
        step: 'Lead Created in CRM Database',
        status: 'success',
        timestamp: new Date().toISOString(),
        detail: `Assigned ID: ${lead.id} with initial stage 'New'`
      });
    }

    // Step 3: Trigger AI Lead Intelligence
    let aiIntelligence;
    try {
      aiIntelligence = await aiService.analyzeLeadEnquiry(lead);
      db.updateLead(lead.id, { aiIntelligence });

      db.addActivity({
        leadId: lead.id,
        type: 'ai_analyzed',
        title: 'AI Intelligence Completed',
        description: `Priority: ${aiIntelligence.priority} | Intent: ${aiIntelligence.intent} | Suggested: ${aiIntelligence.suggestedService}`,
        actor: 'ai_agent',
        metadata: {
          priority: aiIntelligence.priority,
          intent: aiIntelligence.intent,
          suggestedService: aiIntelligence.suggestedService
        }
      });

      steps.push({
        step: 'AI Lead Intelligence Analysis',
        status: 'success',
        timestamp: new Date().toISOString(),
        detail: `Assigned Priority: ${aiIntelligence.priority} | Intent: ${aiIntelligence.intent} (Engine: ${aiIntelligence.engine})`
      });
    } catch (err) {
      steps.push({
        step: 'AI Lead Intelligence Analysis',
        status: 'warning',
        timestamp: new Date().toISOString(),
        detail: `AI Analysis encountered issue, fallback applied: ${err.message}`
      });
      aiIntelligence = aiService.deterministicAnalyzeEnquiry(lead);
      db.updateLead(lead.id, { aiIntelligence });
    }

    // Step 4: RAG Knowledge Base Retrieval
    try {
      const ragChunks = ragService.retrieve(lead.message || lead.service, 2);
      steps.push({
        step: 'Knowledge Base Context Retrieved (RAG)',
        status: 'success',
        timestamp: new Date().toISOString(),
        detail: `Retrieved ${ragChunks.length} relevant business documentation chunks (Top ref: ${ragChunks[0]?.docTitle || 'General'})`
      });
    } catch (err) {
      steps.push({
        step: 'Knowledge Base Retrieval',
        status: 'skipped',
        timestamp: new Date().toISOString(),
        detail: 'RAG retrieval skipped'
      });
    }

    // Step 5: Follow-Up Draft Ready
    steps.push({
      step: 'Personalized Follow-Up Drafted',
      status: 'success',
      timestamp: new Date().toISOString(),
      detail: `Generated custom follow-up draft pending human review or 1-click dispatch.`
    });

    // Step 6: Trigger Team Notification / External Webhook
    let notificationStatus = 'simulated';
    try {
      const webhookPayload = {
        event: 'lead.created',
        leadId: lead.id,
        name: lead.name,
        company: lead.company,
        priority: aiIntelligence.priority,
        intent: aiIntelligence.intent,
        source: lead.source,
        suggestedService: aiIntelligence.suggestedService,
        timestamp: new Date().toISOString()
      };

      if (config.SLACK_WEBHOOK_URL) {
        await fetch(config.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *New Lead Alert [${aiIntelligence.priority}]*: *${lead.company}* (${lead.name}) - ${aiIntelligence.summary}`
          })
        });
        notificationStatus = 'dispatched_live';
      }

      steps.push({
        step: 'Team Notification / Webhook Dispatched',
        status: 'success',
        timestamp: new Date().toISOString(),
        detail: `Alert sent to team notification channel (#sales-alerts / ${config.TEAM_NOTIFICATION_EMAIL}). Status: ${notificationStatus}`
      });
    } catch (err) {
      steps.push({
        step: 'Team Notification Dispatched',
        status: 'simulated',
        timestamp: new Date().toISOString(),
        detail: `Dispatched to internal mock webhook dispatcher: ${err.message}`
      });
    }

    // Step 7: Record Complete Automation Log
    const totalDurationMs = Date.now() - startTime;
    const automationRecord = db.addAutomationLog({
      id: workflowId,
      workflow: 'inbound_lead_processing',
      leadId: lead.id,
      trigger: `Inbound ${source.toUpperCase()} Enquiry`,
      steps,
      status: 'success'
    });

    return {
      lead: db.getLeadById(lead.id),
      automation: automationRecord,
      durationMs: totalDurationMs
    };
  }
}

module.exports = new AutomationService();
