const fs = require('fs');
const path = require('path');
const config = require('../config');
const {
  seedKnowledgeDocuments,
  seedUsers,
  seedLeads,
  seedActivities,
  seedAutomationLogs
} = require('./seedData');

class Database {
  constructor() {
    this.filePath = config.DB_FILE;
    this.data = {
      leads: [],
      activities: [],
      knowledgeDocuments: [],
      automationLogs: [],
      users: []
    };
    this.init();
  }

  init() {
    try {
      // Ensure data directory exists
      if (!fs.existsSync(config.DATA_DIR)) {
        fs.mkdirSync(config.DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure any missing collection is initialized
        if (!this.data.leads) this.data.leads = [];
        if (!this.data.activities) this.data.activities = [];
        if (!this.data.knowledgeDocuments) this.data.knowledgeDocuments = [];
        if (!this.data.automationLogs) this.data.automationLogs = [];
        if (!this.data.users) this.data.users = [];
      } else {
        // Seed default data
        this.data = {
          leads: seedLeads,
          activities: seedActivities,
          knowledgeDocuments: seedKnowledgeDocuments,
          automationLogs: seedAutomationLogs,
          users: seedUsers
        };
        this.persist();
      }
    } catch (err) {
      console.error('Database initialization error:', err);
      // Fallback in-memory with seed data
      this.data = {
        leads: [...seedLeads],
        activities: [...seedActivities],
        knowledgeDocuments: [...seedKnowledgeDocuments],
        automationLogs: [...seedAutomationLogs],
        users: [...seedUsers]
      };
    }
  }

  persist() {
    try {
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('Database persist error:', err);
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch (innerErr) {
        console.error('Direct persist error:', innerErr);
      }
    }
  }

  // --- Leads ---
  getLeads(filters = {}) {
    let result = [...this.data.leads];

    if (filters.stage && filters.stage !== 'All') {
      result = result.filter(l => l.stage.toLowerCase() === filters.stage.toLowerCase());
    }
    if (filters.priority && filters.priority !== 'All') {
      result = result.filter(l => l.aiIntelligence?.priority?.toLowerCase() === filters.priority.toLowerCase());
    }
    if (filters.source && filters.source !== 'All') {
      result = result.filter(l => l.source?.toLowerCase() === filters.source.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.message && l.message.toLowerCase().includes(q)) ||
        (l.service && l.service.toLowerCase().includes(q))
      );
    }

    // Sort by latest
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getLeadById(id) {
    return this.data.leads.find(l => l.id === id) || null;
  }

  findDuplicateLead(email, phone) {
    if (!email && !phone) return null;
    return this.data.leads.find(l => {
      const emailMatch = email && l.email && l.email.toLowerCase() === email.toLowerCase();
      const phoneMatch = phone && l.phone && l.phone.replace(/\D/g, '') === phone.replace(/\D/g, '') && phone.replace(/\D/g, '').length > 6;
      return emailMatch || phoneMatch;
    }) || null;
  }

  createLead(leadData) {
    const id = leadData.id || `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newLead = {
      id,
      name: leadData.name || 'Anonymous Prospect',
      email: leadData.email || '',
      phone: leadData.phone || '',
      company: leadData.company || 'Not Specified',
      source: leadData.source || 'website',
      stage: leadData.stage || 'New',
      service: leadData.service || 'General Inquiry',
      budget: leadData.budget || 'Undisclosed',
      message: leadData.message || '',
      aiIntelligence: leadData.aiIntelligence || null,
      createdAt: leadData.createdAt || now,
      updatedAt: now
    };

    this.data.leads.unshift(newLead);
    this.persist();
    return newLead;
  }

  updateLead(id, updates) {
    const idx = this.data.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;

    const existing = this.data.leads[idx];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Deep merge aiIntelligence if present
    if (updates.aiIntelligence) {
      updated.aiIntelligence = {
        ...existing.aiIntelligence,
        ...updates.aiIntelligence
      };
    }

    this.data.leads[idx] = updated;
    this.persist();
    return updated;
  }

  deleteLead(id) {
    const initialLen = this.data.leads.length;
    this.data.leads = this.data.leads.filter(l => l.id !== id);
    this.data.activities = this.data.activities.filter(a => a.leadId !== id);
    this.persist();
    return this.data.leads.length < initialLen;
  }

  // --- Activities ---
  getActivities(leadId = null) {
    if (leadId) {
      return this.data.activities
        .filter(a => a.leadId === leadId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [...this.data.activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addActivity(activityData) {
    const id = activityData.id || `act-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newActivity = {
      id,
      leadId: activityData.leadId,
      type: activityData.type || 'note_added',
      title: activityData.title || 'Activity Logged',
      description: activityData.description || '',
      actor: activityData.actor || 'system',
      metadata: activityData.metadata || {},
      createdAt: activityData.createdAt || new Date().toISOString()
    };

    this.data.activities.unshift(newActivity);
    this.persist();
    return newActivity;
  }

  // --- Knowledge Documents ---
  getKnowledgeDocs() {
    return [...this.data.knowledgeDocuments];
  }

  getKnowledgeDocById(id) {
    return this.data.knowledgeDocuments.find(d => d.id === id) || null;
  }

  createKnowledgeDoc(docData) {
    const id = docData.id || `kb-${Date.now().toString(36)}`;
    const newDoc = {
      id,
      title: docData.title,
      category: docData.category || 'general',
      content: docData.content,
      updatedAt: new Date().toISOString()
    };

    this.data.knowledgeDocuments.push(newDoc);
    this.persist();
    return newDoc;
  }

  updateKnowledgeDoc(id, updates) {
    const idx = this.data.knowledgeDocuments.findIndex(d => d.id === id);
    if (idx === -1) return null;

    this.data.knowledgeDocuments[idx] = {
      ...this.data.knowledgeDocuments[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.knowledgeDocuments[idx];
  }

  deleteKnowledgeDoc(id) {
    const len = this.data.knowledgeDocuments.length;
    this.data.knowledgeDocuments = this.data.knowledgeDocuments.filter(d => d.id !== id);
    this.persist();
    return this.data.knowledgeDocuments.length < len;
  }

  // --- Automation Logs ---
  getAutomationLogs(limit = 50) {
    return [...this.data.automationLogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  addAutomationLog(logData) {
    const id = logData.id || `auto-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newLog = {
      id,
      workflow: logData.workflow || 'workflow_execution',
      leadId: logData.leadId || null,
      trigger: logData.trigger || 'Manual Trigger',
      steps: logData.steps || [],
      status: logData.status || 'success',
      createdAt: new Date().toISOString()
    };

    this.data.automationLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  // --- Users ---
  getUsers() {
    return [...this.data.users];
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id) || this.data.users[0];
  }

  // --- Analytics ---
  getAnalyticsSummary() {
    const totalLeads = this.data.leads.length;
    const stages = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Proposal: 0,
      Won: 0,
      Lost: 0
    };
    const priorities = {
      Urgent: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };
    const sources = {};
    const services = {};

    this.data.leads.forEach(l => {
      // Stage breakdown
      if (stages[l.stage] !== undefined) {
        stages[l.stage]++;
      } else {
        stages[l.stage] = 1;
      }

      // Priority breakdown
      const priority = l.aiIntelligence?.priority || 'Medium';
      if (priorities[priority] !== undefined) {
        priorities[priority]++;
      } else {
        priorities[priority] = 1;
      }

      // Source breakdown
      sources[l.source] = (sources[l.source] || 0) + 1;

      // Service breakdown
      const s = l.service || 'Unassigned';
      services[s] = (services[s] || 0) + 1;
    });

    const qualifiedCount = (stages.Qualified || 0) + (stages.Proposal || 0) + (stages.Won || 0);
    const qualificationRate = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0;
    const winRate = totalLeads > 0 ? Math.round(((stages.Won || 0) / totalLeads) * 100) : 0;

    return {
      totalLeads,
      qualifiedCount,
      qualificationRate,
      winRate,
      stages,
      priorities,
      sources,
      services,
      totalAutomations: this.data.automationLogs.length,
      recentActivities: this.data.activities.slice(0, 10)
    };
  }
}

// Export singleton instance
module.exports = new Database();
