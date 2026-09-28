const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_DIR: path.join(__dirname, '..', 'data'),
  DB_FILE: path.join(__dirname, '..', 'data', 'quantum_weave_db.json'),
  
  // AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-1.5-flash',
  
  // WhatsApp Cloud API / Webhook Configuration
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || 'quantum_weave_secret_verify_2026',
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '104829102948192',
  
  // Automation Webhook simulation
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || '',
  TEAM_NOTIFICATION_EMAIL: process.env.TEAM_NOTIFICATION_EMAIL || 'leads@quantumweave.ai',
};
