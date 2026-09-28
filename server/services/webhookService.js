const config = require('../config');
const db = require('../db/database');
const agentService = require('./agentService');
const automationService = require('./automationService');

class WebhookService {
  // Handle WhatsApp Cloud API Verification (GET)
  verifyWebhook(query) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === config.WHATSAPP_VERIFY_TOKEN) {
      return { success: true, challenge };
    }
    return { success: false, status: 403, error: 'Forbidden: Invalid verification token' };
  }

  // Handle Inbound WhatsApp Message from Meta Webhook (POST)
  async handleInboundWhatsApp(body) {
    const entries = body.entry || [];
    const results = [];

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.value && change.value.messages) {
          for (const msg of change.value.messages) {
            if (msg.type === 'text') {
              const senderPhone = msg.from;
              const textBody = msg.text.body;
              const contactName = change.value.contacts?.[0]?.profile?.name || `WhatsApp User ${senderPhone.slice(-4)}`;

              const replyResult = await this.processWhatsAppConversation({
                phone: senderPhone,
                name: contactName,
                message: textBody
              });

              results.push(replyResult);
            }
          }
        }
      }
    }

    return results;
  }

  // Unified WhatsApp Conversation Processor (Used by Meta Webhook & Webhook Simulator)
  async processWhatsAppConversation({ phone, name, message }) {
    // 1. Process message through AI Agent (which executes tool calling, checks CRM, answers from RAG)
    const agentResult = await agentService.processMessage(message, [], {
      channel: 'whatsapp',
      phone,
      name
    });

    // 2. Check if a lead exists or needs creation
    let lead = db.findDuplicateLead(null, phone);
    if (!lead) {
      // Auto-trigger full automation pipeline for new WhatsApp prospect
      const autoResult = await automationService.processInboundLead({
        name,
        phone,
        company: `${name}'s Organization`,
        source: 'whatsapp',
        service: 'WhatsApp Inbound Inquiry',
        message
      }, 'whatsapp');
      lead = autoResult.lead;
    } else {
      // Log WhatsApp interaction to timeline
      db.addActivity({
        leadId: lead.id,
        type: 'whatsapp_message',
        title: 'Inbound WhatsApp Message',
        description: `Customer sent: "${message}"`,
        actor: 'user',
        metadata: { phone, message }
      });
      db.addActivity({
        leadId: lead.id,
        type: 'whatsapp_message',
        title: 'AI WhatsApp Reply Dispatched',
        description: `Agent replied: "${agentResult.reply}"`,
        actor: 'ai_agent',
        metadata: { reply: agentResult.reply, toolsExecuted: agentResult.toolsExecuted }
      });
    }

    // 3. Send WhatsApp Outbound Message (Live or Simulated)
    const outboundStatus = await this.sendWhatsAppMessage(phone, agentResult.reply);

    return {
      success: true,
      inbound: { phone, name, message },
      outbound: {
        text: agentResult.reply,
        status: outboundStatus.status,
        messageId: outboundStatus.messageId
      },
      toolsExecuted: agentResult.toolsExecuted,
      leadId: lead ? lead.id : null
    };
  }

  // Send WhatsApp Outbound message via Cloud API or simulation
  async sendWhatsAppMessage(recipientPhone, messageText) {
    if (config.WHATSAPP_API_TOKEN && config.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const url = `https://graph.facebook.com/v19.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipientPhone,
            type: 'text',
            text: { body: messageText }
          })
        });

        if (response.ok) {
          const data = await response.json();
          return { status: 'sent_live', messageId: data.messages?.[0]?.id };
        }
      } catch (err) {
        console.warn('Live WhatsApp API dispatch failed, falling back to simulated dispatch:', err.message);
      }
    }

    // Simulated dispatch (for testing / zero-config demonstration)
    return {
      status: 'simulated_success',
      messageId: `wamid.HBgL${Date.now()}`
    };
  }
}

module.exports = new WebhookService();
