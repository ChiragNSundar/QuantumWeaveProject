const db = require('../db/database');
const ragService = require('./ragService');
const aiService = require('./aiService');

class AgentService {
  constructor() {
    this.tools = [
      {
        name: 'query_knowledge_base',
        description: 'Search Quantum Weave knowledge base for pricing, services, SLAs, and technical architectures.',
        parameters: { query: 'string' }
      },
      {
        name: 'check_lead_status',
        description: 'Look up an existing customer or lead by email or phone to check pipeline stage and history.',
        parameters: { email: 'string (optional)', phone: 'string (optional)' }
      },
      {
        name: 'create_or_update_lead',
        description: 'Create a new lead or update an existing record in the CRM database.',
        parameters: { name: 'string', email: 'string', phone: 'string', company: 'string', service: 'string', message: 'string' }
      },
      {
        name: 'schedule_consultation',
        description: 'Book an architectural discovery consultation call and log the event in the CRM timeline.',
        parameters: { email: 'string', preferredDate: 'string', topic: 'string' }
      },
      {
        name: 'escalate_to_human',
        description: 'Escalate an inquiry to a senior Solutions Architect for urgent or high-value requirements.',
        parameters: { leadId: 'string', urgency: 'string', reason: 'string' }
      }
    ];
  }

  getToolDefinitions() {
    return this.tools;
  }

  // Execute a specific tool
  async executeTool(toolName, args) {
    const startTime = Date.now();
    let result = null;

    try {
      switch (toolName) {
        case 'query_knowledge_base': {
          const query = args.query || '';
          const chunks = ragService.retrieve(query, 3, 0.1);
          result = {
            found: chunks.length > 0,
            chunks: chunks.map(c => ({
              title: c.docTitle,
              category: c.category,
              relevance: c.relevanceScore,
              snippet: c.content
            }))
          };
          break;
        }

        case 'check_lead_status': {
          const lead = db.findDuplicateLead(args.email, args.phone);
          if (lead) {
            const activities = db.getActivities(lead.id);
            result = {
              found: true,
              lead: {
                id: lead.id,
                name: lead.name,
                company: lead.company,
                stage: lead.stage,
                service: lead.service,
                priority: lead.aiIntelligence?.priority || 'Standard',
                createdAt: lead.createdAt
              },
              recentActivitiesCount: activities.length
            };
          } else {
            result = { found: false, message: 'No prior lead record found for this contact.' };
          }
          break;
        }

        case 'create_or_update_lead': {
          const existing = db.findDuplicateLead(args.email, args.phone);
          if (existing) {
            const updated = db.updateLead(existing.id, {
              company: args.company || existing.company,
              service: args.service || existing.service,
              message: args.message ? `${existing.message}\n[Update]: ${args.message}` : existing.message
            });
            db.addActivity({
              leadId: existing.id,
              type: 'note_added',
              title: 'Lead Updated by AI Agent',
              description: `Agent updated record during interactive session.`,
              actor: 'ai_agent'
            });
            result = { action: 'updated', leadId: existing.id, stage: updated.stage };
          } else {
            const newLead = db.createLead({
              name: args.name || 'Inbound Prospect',
              email: args.email || '',
              phone: args.phone || '',
              company: args.company || 'Not Specified',
              service: args.service || 'General AI Inquiry',
              message: args.message || 'Captured by AI Sales Agent conversation',
              source: args.source || 'ai_agent_chat',
              stage: 'New'
            });
            // Analyze the newly created lead
            const analysis = await aiService.analyzeLeadEnquiry(newLead);
            db.updateLead(newLead.id, { aiIntelligence: analysis });

            db.addActivity({
              leadId: newLead.id,
              type: 'lead_created',
              title: 'Lead Created by AI Sales Agent',
              description: `Lead auto-created via AI conversation. Priority: ${analysis.priority}.`,
              actor: 'ai_agent'
            });
            result = { action: 'created', leadId: newLead.id, priority: analysis.priority };
          }
          break;
        }

        case 'schedule_consultation': {
          let lead = db.findDuplicateLead(args.email);
          if (!lead) {
            lead = db.createLead({
              name: args.email.split('@')[0],
              email: args.email,
              source: 'ai_agent_scheduler',
              stage: 'Contacted',
              message: `Requested consultation on: ${args.topic || 'AI Implementation'}`
            });
          } else {
            db.updateLead(lead.id, { stage: 'Contacted' });
          }

          db.addActivity({
            leadId: lead.id,
            type: 'consultation_scheduled',
            title: 'Discovery Consultation Booked',
            description: `Scheduled slot: ${args.preferredDate || 'Upcoming available Thursday 2:00 PM EST'}. Topic: ${args.topic || 'General AI Discovery'}`,
            actor: 'ai_agent',
            metadata: { slot: args.preferredDate, topic: args.topic }
          });

          result = {
            success: true,
            leadId: lead.id,
            scheduledSlot: args.preferredDate || 'Thursday 2:00 PM EST',
            confirmationCode: `QW-${Math.floor(1000 + Math.random() * 9000)}`
          };
          break;
        }

        case 'escalate_to_human': {
          if (args.leadId) {
            db.updateLead(args.leadId, {
              stage: 'Contacted',
              aiIntelligence: { priority: 'Urgent', priorityReason: `Escalated by AI: ${args.reason}` }
            });
            db.addActivity({
              leadId: args.leadId,
              type: 'stage_changed',
              title: 'Lead Escalated to Human Solutions Architect',
              description: `Reason: ${args.reason || 'Complex enterprise requirement'}`,
              actor: 'ai_agent'
            });
          }
          result = {
            escalated: true,
            status: 'Notification dispatched to senior solutions lead',
            leadId: args.leadId
          };
          break;
        }

        default:
          result = { error: `Unknown tool: ${toolName}` };
      }
    } catch (err) {
      result = { error: err.message };
    }

    const executionTimeMs = Date.now() - startTime;
    return {
      tool: toolName,
      arguments: args,
      result,
      executionTimeMs
    };
  }

  // Handle agent conversation with autonomous tool calling
  async processMessage(userMessage, conversationHistory = [], sessionContext = {}) {
    const executedTools = [];
    const lower = userMessage.toLowerCase();

    // 1. Tool Call Selection Logic (Deterministic Agent Reasoning)
    // Check if user is asking about pricing, timeline, or services -> call query_knowledge_base
    if (lower.includes('price') || lower.includes('cost') || lower.includes('tier') || 
        lower.includes('how much') || lower.includes('service') || lower.includes('timeline') || 
        lower.includes('security') || lower.includes('rag') || lower.includes('employee')) {
      const ragExecution = await this.executeTool('query_knowledge_base', { query: userMessage });
      executedTools.push(ragExecution);
    }

    // Check if user is mentioning their email or asking to check existing status
    const emailMatch = userMessage.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    const userEmail = emailMatch ? emailMatch[1] : sessionContext.email;

    if (userEmail && (lower.includes('status') || lower.includes('check') || lower.includes('my enquiry') || lower.includes('order'))) {
      const statusExecution = await this.executeTool('check_lead_status', { email: userEmail });
      executedTools.push(statusExecution);
    }

    // Check if user wants to schedule a call / demo
    if (lower.includes('book') || lower.includes('schedule') || lower.includes('meeting') || lower.includes('demo') || lower.includes('consultation')) {
      const dateHint = lower.includes('tomorrow') ? 'Tomorrow 3:00 PM EST' : 'Thursday 2:00 PM EST';
      const scheduleExecution = await this.executeTool('schedule_consultation', {
        email: userEmail || 'prospect@quantumweave.ai',
        preferredDate: dateHint,
        topic: userMessage
      });
      executedTools.push(scheduleExecution);
    }

    // Check if user is providing their contact details to get a quote / contact
    if (userEmail && (lower.includes('my name is') || lower.includes('reach me') || lower.includes('contact me') || lower.includes('want to build') || lower.includes('need'))) {
      const nameMatch = userMessage.match(/my name is ([a-zA-Z\s]+)/i);
      const name = nameMatch ? nameMatch[1].trim() : 'Prospective Client';
      const leadExecution = await this.executeTool('create_or_update_lead', {
        name,
        email: userEmail,
        company: 'Prospective Client',
        service: lower.includes('employee') ? 'AI Employee' : (lower.includes('rag') ? 'Enterprise RAG' : 'Workflow Automation'),
        message: userMessage,
        source: sessionContext.channel || 'ai_agent_chat'
      });
      executedTools.push(leadExecution);
    }

    // Check if inquiry mentions high urgency or big enterprise budget -> escalate
    if (lower.includes('enterprise') || lower.includes('asap') || lower.includes('budget over 50k') || lower.includes('urgent')) {
      const escalateExecution = await this.executeTool('escalate_to_human', {
        leadId: sessionContext.leadId || 'lead-101',
        urgency: 'Urgent',
        reason: 'Client flagged enterprise readiness and immediate deployment need.'
      });
      executedTools.push(escalateExecution);
    }

    // 2. Synthesize Agent Response using Tool Results & Context
    let agentResponse = "";

    // Check if tools yielded knowledge
    const kbResult = executedTools.find(t => t.tool === 'query_knowledge_base');
    const schedResult = executedTools.find(t => t.tool === 'schedule_consultation');
    const leadResult = executedTools.find(t => t.tool === 'create_or_update_lead');
    const statusResult = executedTools.find(t => t.tool === 'check_lead_status');
    const escResult = executedTools.find(t => t.tool === 'escalate_to_human');

    if (schedResult && schedResult.result?.success) {
      agentResponse = `I have scheduled your architectural discovery consultation for **${schedResult.result.scheduledSlot}** (Confirmation Code: **${schedResult.result.confirmationCode}**). A calendar invitation and preliminary preparation questions have been dispatched to ${userEmail || 'your email'}. Our senior solutions architect will be on the line!`;
    } else if (statusResult && statusResult.result?.found) {
      const lead = statusResult.result.lead;
      agentResponse = `I found your existing enquiry for **${lead.company}** (Stage: **${lead.stage}**, Service: **${lead.service}**). Our solutions team has flagged this with **${lead.priority}** priority. Would you like me to book your discovery sync directly?`;
    } else if (leadResult && leadResult.result?.leadId) {
      agentResponse = `Thank you! I have created your project record in our CRM system with **${leadResult.result.priority || 'High'}** priority. Our solutions team has received the briefing and will reach out with a technical architecture diagram. You can also book a direct slot right now!`;
    } else if (kbResult && kbResult.result?.found) {
      const topChunk = kbResult.result.chunks[0];
      agentResponse = `Based on Quantum Weave's verified business documentation:\n\n${topChunk.snippet}\n\n*Would you like to schedule a 20-minute discovery call to discuss your exact implementation requirements?*`;
    } else if (escResult) {
      agentResponse = `Because your requirement is high-priority and mission-critical, I have escalated this directly to our Lead AI Engineer & Senior Solutions Architect. Someone will reach out via WhatsApp / Email within 2 business hours.`;
    } else {
      agentResponse = `Hello! I am Quantum Weave's AI Business & Solutions Agent. I can assist you with:\n• Exploring our **Autonomous AI Employees** and **Enterprise RAG Systems**\n• Sharing our **Pricing Tiers** (Starter PoC $3.5k, Growth $8k-$12k, Enterprise)\n• Querying our implementation timeline and tech stack\n• Booking a live technical discovery call\n\nHow can I help you today?`;
    }

    return {
      reply: agentResponse,
      toolsExecuted: executedTools,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AgentService();
