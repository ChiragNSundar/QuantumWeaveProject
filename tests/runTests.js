// Comprehensive Test Suite for Quantum Weave AI Intelligence System
// Tests Task 1-9: Database, APIs, AI Lead Intelligence, RAG, Agent Tools, Automations & WhatsApp

const assert = require('assert');

// Set test environment
process.env.NODE_ENV = 'test';

const db = require('../server/db/database');
const aiService = require('../server/services/aiService');
const ragService = require('../server/services/ragService');
const agentService = require('../server/services/agentService');
const automationService = require('../server/services/automationService');
const webhookService = require('../server/services/webhookService');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${name}`);
    console.error(`    \x1b[33mError: ${err.message}\x1b[0m`);
    if (err.stack) {
      console.error(`    ${err.stack.split('\n')[1]}`);
    }
  }
}

async function runAllTests() {
  console.log(`=======================================================`);
  console.log(`🧪 Quantum Weave Practical Skill Test Validation Suite`);
  console.log(`   Candidate: Chirag N Sundar | Role: AI Full-Stack Dev`);
  console.log(`=======================================================`);

  // Suite 1: Data Layer & Database Repository
  console.log(`\n\x1b[1m\x1b[36m▶ TEST SUITE: 1. Data Layer & Database Repository\x1b[0m`);
  await test('Database initializes with seed leads and documents', async () => {
    const leads = db.getLeads();
    const docs = db.getKnowledgeDocs();
    assert(leads.length >= 5, `Expected at least 5 leads, got ${leads.length}`);
    assert(docs.length >= 4, `Expected at least 4 knowledge documents, got ${docs.length}`);
  });

  await test('Filters leads by stage and priority correctly', async () => {
    const qualifiedLeads = db.getLeads({ stage: 'Qualified' });
    assert(Array.isArray(qualifiedLeads), 'Expected array of leads');
    qualifiedLeads.forEach(l => {
      assert.strictEqual(l.stage, 'Qualified', `Lead ${l.id} stage should be Qualified`);
    });
  });

  await test('Detects duplicate leads by email or phone', async () => {
    const dupByEmail = db.findDuplicateLead('m.vance@apexlogistics.io');
    assert(dupByEmail !== null, 'Should find existing lead Marcus Vance');
    assert.strictEqual(dupByEmail.name, 'Marcus Vance');

    const noDup = db.findDuplicateLead('brandnew.unique.email@company.xyz');
    assert.strictEqual(noDup, null, 'Should return null for non-existing email');
  });

  await test('Creates, updates, and transitions lead stage with activity logging', async () => {
    const testLead = db.createLead({
      name: 'Unit Test Lead',
      email: 'unittest@testing.org',
      company: 'Test Corp',
      stage: 'New',
      service: 'AI Employee'
    });
    assert(testLead.id, 'Lead must have an ID');

    const updated = db.updateLead(testLead.id, { stage: 'Contacted' });
    assert.strictEqual(updated.stage, 'Contacted', 'Stage should be updated to Contacted');

    db.addActivity({
      leadId: testLead.id,
      type: 'stage_changed',
      title: 'Stage updated to Contacted in test'
    });

    const activities = db.getActivities(testLead.id);
    assert(activities.length >= 1, 'Activity should be recorded for lead');

    // Cleanup
    db.deleteLead(testLead.id);
  });

  // Suite 2: AI Lead Intelligence
  console.log(`\n\x1b[1m\x1b[36m▶ TEST SUITE: 2. AI Lead Intelligence Engine\x1b[0m`);
  await test('Extracts customer problem, intent, and assigns priority based on context', async () => {
    const sampleEnquiry = {
      name: 'Rachel Adams',
      company: 'FastDelivery Express',
      email: 'rachel@fastdelivery.com',
      budget: '$15,000+',
      service: 'AI Employee',
      message: 'We are overwhelmed with 500+ customer WhatsApp tracking queries every single day. We need an urgent AI solution.'
    };

    const analysis = await aiService.analyzeLeadEnquiry(sampleEnquiry);

    assert(analysis.summary, 'Should generate lead summary');
    assert(analysis.problem, 'Should extract customer problem');
    assert.strictEqual(analysis.priority, 'Urgent', 'High volume + budget should be designated Urgent priority');
    assert(analysis.intent.includes('Commercial') || analysis.intent.includes('Enterprise'), 'Should recognize high commercial intent');
    assert(analysis.suggestedService.includes('AI Employee'), 'Should suggest AI Employee service');
    assert(analysis.recommendedNextAction, 'Should recommend next action');
    assert(analysis.suggestedFollowUp.includes('FastDelivery'), 'Follow-up draft should personalize with company name');
  });

  await test('Correctly classifies lower tier/exploratory inquiries as Medium priority', async () => {
    const sampleEnquiry = {
      name: 'Sam Store',
      company: 'Small Corner Shop',
      budget: '< $3,500',
      message: 'Just looking for simple pricing on how much a basic website bot costs.'
    };

    const analysis = await aiService.analyzeLeadEnquiry(sampleEnquiry);
    assert.strictEqual(analysis.priority, 'Medium', 'Small budget exploratory enquiry should be Medium priority');
    assert(analysis.suggestedFollowUp, 'Should still produce a professional follow-up draft');
  });

  // Suite 3: RAG Knowledge Assistant
  console.log(`\n\x1b[1m\x1b[36m▶ TEST SUITE: 3. RAG Vector Knowledge Assistant\x1b[0m`);
  await test('Indexes documents into semantic chunks with term vectors', async () => {
    ragService.indexKnowledgeBase();
    assert(ragService.chunks.length > 0, 'RAG must generate semantic chunks');
    assert(ragService.vocabulary.size > 0, 'Vocabulary must be computed');
  });

  await test('Retrieves top relevant chunks for pricing queries', async () => {
    const results = ragService.retrieve('What are your pricing models and starter sprint costs?', 3);
    assert(results.length > 0, 'Should retrieve matching chunks');
    assert(results[0].relevanceScore > 0, 'Top result should have positive relevance score');
    
    const containsPricingOrSprint = results.some(r =>
      r.content.toLowerCase().includes('pricing') ||
      r.content.toLowerCase().includes('3,500') ||
      r.content.toLowerCase().includes('sprint')
    );
    assert(containsPricingOrSprint, 'Retrieved chunks should include pricing details');
  });

  await test('Answers grounded questions with document citations', async () => {
    const qResult = await ragService.answerQuestion('How long does implementation take?');
    assert.strictEqual(qResult.hasDirectAnswer, true, 'Should provide direct answer for known topic');
    assert(qResult.answer.toLowerCase().includes('week') || qResult.answer.toLowerCase().includes('days'), 'Answer should mention timeline');
    assert(qResult.sources.length > 0, 'Answer must cite source chunks');
  });

  await test('Applies guardrails and gracefully handles out-of-domain questions', async () => {
    const unknownResult = await ragService.answerQuestion('What is the recipe for chocolate chip pancakes with blueberries?');
    assert.strictEqual(unknownResult.hasDirectAnswer, false, 'Should flag lack of reliable data');
    assert(unknownResult.answer.toLowerCase().includes("don't have enough verified information") || unknownResult.answer.toLowerCase().includes('unavailable'), 'Should decline hallucination');
  });

  // Suite 4: AI Sales & Support Agent with Tool Calling
  console.log(`\n\x1b[1m\x1b[36m▶ TEST SUITE: 4. AI Sales & Support Agent (Tool Calling)\x1b[0m`);
  await test('Exposes structured tool definitions', async () => {
    const tools = agentService.getToolDefinitions();
    assert(tools.length >= 5, 'Agent should have at least 5 structured tools');
    const toolNames = tools.map(t => t.name);
    assert(toolNames.includes('query_knowledge_base'), 'Must have query_knowledge_base tool');
    assert(toolNames.includes('check_lead_status'), 'Must have check_lead_status tool');
    assert(toolNames.includes('create_or_update_lead'), 'Must have create_or_update_lead tool');
    assert(toolNames.includes('schedule_consultation'), 'Must have schedule_consultation tool');
    assert(toolNames.includes('escalate_to_human'), 'Must have escalate_to_human tool');
  });

  await test('Executes query_knowledge_base tool and returns structured snippet', async () => {
    const execution = await agentService.executeTool('query_knowledge_base', { query: 'security and data privacy' });
    assert.strictEqual(execution.tool, 'query_knowledge_base');
    assert(execution.result.found, 'Knowledge chunks should be found');
    assert(execution.executionTimeMs >= 0, 'Execution time should be measured');
  });

  await test('Executes schedule_consultation tool and updates CRM', async () => {
    const execution = await agentService.executeTool('schedule_consultation', {
      email: 'test.consultant@partner.com',
      preferredDate: 'Next Tuesday at 11:00 AM EST',
      topic: 'Enterprise RAG Architecture Review'
    });

    assert.strictEqual(execution.result.success, true);
    assert(execution.result.confirmationCode.startsWith('QW-'), 'Should return confirmation code');

    const lead = db.findDuplicateLead('test.consultant@partner.com');
    assert(lead !== null, 'Consultation booking should ensure lead exists in CRM');
    assert.strictEqual(lead.stage, 'Contacted', 'Stage should be set to Contacted');

    // Cleanup
    db.deleteLead(lead.id);
  });

  await test('Executes autonomous multi-step reasoning and tool calling in processMessage', async () => {
    const response = await agentService.processMessage('What are your implementation pricing tiers and timelines?');
    assert(response.reply, 'Agent must return contextual reply');
    assert(response.toolsExecuted.length > 0, 'Agent should have executed query_knowledge_base tool');
    assert.strictEqual(response.toolsExecuted[0].tool, 'query_knowledge_base');
  });

  // Suite 5: End-to-End Business Automation Pipeline
  console.log(`\n\x1b[1m\x1b[36m▶ TEST SUITE: 5. End-to-End Business Automation Workflow\x1b[0m`);
  await test('Executes full 7-step pipeline from Inbound Enquiry to Webhook Alert', async () => {
    const testEnquiry = {
      name: 'Alexander Stone',
      company: 'Stone FinTech Corp',
      email: 'a.stone@stonefintech.io',
      phone: '+1 555-492-1049',
      service: 'Custom Workflow Automation',
      budget: '$15,000+',
      message: 'We are losing leads due to 4-hour delay in qualifying inbound web requests. We need automated AI scoring and Slack alerting immediately.'
    };

    const result = await automationService.processInboundLead(testEnquiry, 'website');

    assert(result.lead, 'Should create and return lead');
    assert.strictEqual(result.lead.company, 'Stone FinTech Corp');
    assert(result.lead.aiIntelligence, 'Lead should have AI intelligence attached');
    assert.strictEqual(result.lead.aiIntelligence.priority, 'Urgent');

    assert(result.automation, 'Should record automation log');
    assert.strictEqual(result.automation.status, 'success');
    assert(result.automation.steps.length >= 6, `Expected at least 6 workflow steps, got ${result.automation.steps.length}`);

    // Verify lead activities timeline
    const activities = db.getActivities(result.lead.id);
    assert(activities.length >= 2, 'Should record lead_created and ai_analyzed activities');

    // Cleanup
    db.deleteLead(result.lead.id);
  });

  // Suite 6: WhatsApp Webhook & Simulator
  console.log(`\n\x1b[1m\x1b[36m▶ TEST SUITE: 6. WhatsApp Integration & Webhook Simulator\x1b[0m`);
  await test('Verifies Meta WhatsApp webhook verification challenge', async () => {
    const verifyQuery = {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'quantum_weave_secret_verify_2026',
      'hub.challenge': '1155995533'
    };

    const result = webhookService.verifyWebhook(verifyQuery);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.challenge, '1155995533');
  });

  await test('Rejects invalid verification tokens with 403 Forbidden', async () => {
    const badQuery = {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong_token',
      'hub.challenge': '1155995533'
    };

    const result = webhookService.verifyWebhook(badQuery);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, 403);
  });

  await test('Processes simulated WhatsApp conversation and links to CRM', async () => {
    const simResult = await webhookService.processWhatsAppConversation({
      phone: '+1 (555) 998-0011',
      name: 'WhatsApp Test User',
      message: 'Hi, can you explain your AI Employee services and how much it costs?'
    });

    assert.strictEqual(simResult.success, true);
    assert(simResult.outbound.text, 'Should return outbound WhatsApp text reply');
    assert(simResult.leadId, 'Should associate with a CRM lead ID');

    // Verify the lead was created with WhatsApp source
    const createdLead = db.getLeadById(simResult.leadId);
    assert.strictEqual(createdLead.source, 'whatsapp');

    // Cleanup
    db.deleteLead(simResult.leadId);
  });

  // Summary
  console.log(`\n=======================================================`);
  console.log(`📊 TEST EXECUTION SUMMARY:`);
  console.log(`   Total Tests:  ${totalTests}`);
  console.log(`   \x1b[32mPassed:\x1b[0m       ${passedTests}`);
  console.log(`   \x1b[31mFailed:\x1b[0m       ${failedTests}`);
  console.log(`=======================================================`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log(`\x1b[32m✨ ALL ${passedTests} TESTS PASSED PERFECTLY!\x1b[0m\n`);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
