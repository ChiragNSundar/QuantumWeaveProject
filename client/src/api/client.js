const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

// Leads
export const getLeads = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/leads${query ? `?${query}` : ''}`);
};

export const getLead = (id) => apiRequest(`/leads/${id}`);

export const createLead = (leadData, runAutomation = true) =>
  apiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify({ ...leadData, runAutomation })
  });

export const updateLead = (id, updates) =>
  apiRequest(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

export const updateLeadStage = (id, stage, user = 'Chirag N Sundar') =>
  apiRequest(`/leads/${id}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ stage, user })
  });

export const addLeadActivity = (id, activity) =>
  apiRequest(`/leads/${id}/activities`, {
    method: 'POST',
    body: JSON.stringify(activity)
  });

export const analyzeLead = (id) =>
  apiRequest(`/leads/${id}/analyze`, {
    method: 'POST'
  });

export const approveFollowUp = (id, draftMessage, channel = 'email') =>
  apiRequest(`/leads/${id}/approve-followup`, {
    method: 'POST',
    body: JSON.stringify({ draftMessage, channel })
  });

export const deleteLead = (id) =>
  apiRequest(`/leads/${id}`, {
    method: 'DELETE'
  });

// Knowledge & RAG
export const getKnowledgeDocs = () => apiRequest('/knowledge/documents');

export const getKnowledgeDoc = (id) => apiRequest(`/knowledge/documents/${id}`);

export const queryKnowledge = (query, topK = 3) =>
  apiRequest('/knowledge/query', {
    method: 'POST',
    body: JSON.stringify({ query, topK })
  });

export const createKnowledgeDoc = (doc) =>
  apiRequest('/knowledge/documents', {
    method: 'POST',
    body: JSON.stringify(doc)
  });

// Agent
export const getAgentTools = () => apiRequest('/agent/tools');

export const sendAgentChat = (message, conversationHistory = [], sessionContext = {}) =>
  apiRequest('/agent/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationHistory, sessionContext })
  });

export const executeAgentTool = (toolName, args) =>
  apiRequest('/agent/execute-tool', {
    method: 'POST',
    body: JSON.stringify({ toolName, args })
  });

// Automations
export const getAutomationLogs = (limit = 50) => apiRequest(`/automations/logs?limit=${limit}`);

export const triggerTestAutomation = (enquiry) =>
  apiRequest('/automations/trigger', {
    method: 'POST',
    body: JSON.stringify({ enquiry })
  });

// WhatsApp Webhook Simulator
export const simulateWhatsAppMessage = ({ message, phone, name }) =>
  apiRequest('/webhooks/simulate-inbound', {
    method: 'POST',
    body: JSON.stringify({ message, phone, name })
  });

// Analytics
export const getAnalytics = () => apiRequest('/analytics/overview');

// Auth & Users
export const getUsers = () => apiRequest('/auth/users');
export const getCurrentUser = () => apiRequest('/auth/me');
export const loginUser = (userId) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
