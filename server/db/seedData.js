// Initial seed data for Quantum Weave AI Intelligence System

const seedKnowledgeDocuments = [
  {
    id: "kb-001",
    title: "Quantum Weave Overview & Capabilities",
    category: "services",
    content: `Quantum Weave is an AI-first business implementation venture of BrandMint AI Pvt. Ltd.
We design, build, and deploy enterprise-grade AI solutions that solve tangible operational bottlenecks.
Our core pillars:
1. Autonomous AI Employees: 24/7 conversational agents for sales qualification, customer support, and internal operations.
2. Intelligent Workflow Automations: End-to-end automation pipelines integrating CRMs, ERPs, webhooks, and AI reasoning.
3. Enterprise Knowledge Systems (RAG): High-accuracy vector retrieval and grounded knowledge bases for scattered documentation.
4. Full-Stack AI Application Engineering: Bespoke web, mobile, and SaaS platforms built around agentic AI workflows.
Quantum Weave delivers working solutions with rapid turnaround, typically deploying a production-ready pilot within 2 to 3 weeks.`,
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "kb-002",
    title: "AI Employees & Conversational Support Agents",
    category: "services",
    content: `Our AI Employees go far beyond traditional rule-based chatbots. They act as autonomous agents with tool-calling capabilities.
Key Capabilities:
- Omnichannel Support: Deployed across WhatsApp (Cloud API), Website Live Chat, Email, and Slack.
- Tool Calling & Workflow Actions: Agents can query live databases, book calendar discovery meetings, update CRM stages, and escalate urgent tickets.
- Multilingual & Context-Aware: Speaks 40+ languages, maintains multi-turn conversation memory, and recalls past user interactions.
- Guardrails & Safety: Grounded strictly in verified business knowledge with fallback mechanisms when information is unavailable.
- Response Time: Sub-second response latency (< 800ms) with human-in-the-loop escalation triggers for complex deals.`,
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "kb-003",
    title: "Enterprise Knowledge Systems & RAG Architecture",
    category: "technical",
    content: `Quantum Weave builds domain-specific Knowledge Retrieval-Augmented Generation (RAG) systems.
Technical Architecture:
- Ingestion: Connectors for PDFs, Notion, Google Drive, Markdown, Confluence, and REST APIs.
- Chunking Strategy: Semantic chunking (300-500 tokens) with 50-token overlap and metadata preservation.
- Vector Search: Hybrid dense vector embeddings paired with lexical keyword filtering for maximum precision.
- Hallucination Control: Strict citation prompting. If confidence falls below 75%, the agent politely admits lack of data and offers human team contact.
- Security: Client data is partitioned, encrypted with AES-256 at rest, and never used to train public LLM foundation models.`,
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "kb-004",
    title: "Pricing Models, Engagement Tiers & Implementation Timelines",
    category: "pricing",
    content: `Quantum Weave offers transparent, ROI-driven engagement models:
1. Proof of Concept (PoC) / Sprint:
   - Price: $3,500 one-time
   - Scope: 2-week delivery of a functional prototype, RAG knowledge setup, and primary channel integration (WhatsApp or Web).
2. Growth AI Implementation:
   - Price: $7,500 - $12,000 one-time + $1,200/mo maintenance & model fine-tuning.
   - Scope: Custom AI Employee, CRM/Database bi-directional sync, custom automation webhooks, and analytics dashboard.
3. Enterprise Custom Solution:
   - Custom quote ($25,000+) based on architecture complexity, on-premise deployment, or multi-system ERP integration.
Implementation Timeline:
- Phase 1 (Discovery & Knowledge Ingestion): Days 1-5
- Phase 2 (Agent Architecture & API Integrations): Days 6-12
- Phase 3 (Testing, Guardrails & Production Deployment): Days 13-18`,
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "kb-005",
    title: "Business Workflow Automation & Webhook Integration",
    category: "services",
    content: `We connect disconnected business software using event-driven AI pipelines.
Standard Automations:
- Inbound Lead Qualification: Instant capture from Web or WhatsApp, automatic AI intent extraction, priority tagging, and CRM update.
- Automated Follow-up Dispatch: Tailored draft follow-up generated within 3 minutes; automated WhatsApp or email dispatch upon human approval or auto-rule.
- Team Alerting: Real-time notifications dispatched to Slack, Microsoft Teams, or webhook receivers for high-priority or urgent leads.
- Calendar Booking Sync: Autonomous meeting scheduling linked directly with Google Calendar or Calendly APIs.`,
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const seedUsers = [
  {
    id: "user-001",
    name: "Chirag N Sundar",
    email: "chirag@quantumweave.ai",
    role: "Lead AI Engineer & Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "user-002",
    name: "Sarah Chen",
    email: "sarah.chen@quantumweave.ai",
    role: "Sales & Growth Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "user-003",
    name: "Alex Rivera",
    email: "alex.rivera@quantumweave.ai",
    role: "Senior Solutions Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
];

const seedLeads = [
  {
    id: "lead-101",
    name: "Marcus Vance",
    email: "m.vance@apexlogistics.io",
    phone: "+1 (555) 234-8901",
    company: "Apex Logistics Global",
    source: "website",
    stage: "Qualified",
    service: "AI Employee / Chatbot",
    budget: "$8,000 - $15,000",
    message: "We receive over 400 customer shipment status inquiries daily via WhatsApp and web form. Our support agents are overwhelmed answering where is my shipment and pricing quotes. We need an intelligent WhatsApp AI employee that can query our tracking API, answer customer questions, and escalate difficult claims.",
    aiIntelligence: {
      summary: "Apex Logistics requires an omnichannel WhatsApp AI Employee to automate 400+ daily shipment tracking inquiries and quote requests, relieving support team strain.",
      problem: "Support staff overwhelmed by repetitive shipment status inquiries and quote calculations across WhatsApp and Web.",
      intent: "High Commercial Intent (Ready for Pilot)",
      priority: "Urgent",
      priorityReason: "High enquiry volume (400/day), clear existing budget, explicit API integration requirement, direct business ROI.",
      suggestedService: "Autonomous AI Employee & WhatsApp Cloud Integration",
      recommendedNextAction: "Conduct 30-min Technical Discovery call to review Shipment Tracking API endpoints and confirm WhatsApp Business Account access.",
      suggestedFollowUp: "Hi Marcus,\n\nThank you for reaching out to Quantum Weave. Automating 400+ daily shipment tracking and quote enquiries via WhatsApp is right in our sweet spot. We build autonomous AI employees with custom API tool-calling that integrate directly with your tracking system and escalate edge cases seamlessly.\n\nCould we schedule a 20-minute discovery call this Thursday at 2:00 PM EST to map out your API schema and share a live demo?\n\nBest regards,\nChirag N Sundar\nQuantum Weave AI Solutions",
      isReviewed: true,
      analyzedAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "lead-102",
    name: "Dr. Elena Rostova",
    email: "elena@novacareclinics.com",
    phone: "+1 (555) 912-3482",
    company: "NovaCare Health Network",
    source: "whatsapp",
    stage: "Proposal",
    service: "Enterprise Knowledge Systems & RAG",
    budget: "$15,000+",
    message: "Our medical staff and clinic coordinators spend hours digging through 600+ PDF clinical protocols, insurance coverage guides, and vendor contracts. We need an internal RAG knowledge assistant with strict zero-hallucination guarantees and instant search.",
    aiIntelligence: {
      summary: "Healthcare provider seeking enterprise RAG system to index 600+ clinical protocols and insurance documents for instant clinician reference.",
      problem: "Scattered clinical documentation and vendor contracts causing significant clinician time waste and coordination delays.",
      intent: "Enterprise Purchasing / Immediate Requirement",
      priority: "High",
      priorityReason: "High-value enterprise requirement with large document corpus and strict compliance needs.",
      suggestedService: "Enterprise Knowledge System (RAG Architecture)",
      recommendedNextAction: "Submit formal proposal with SOC2 compliance breakdown and 2-week PoC timeline.",
      suggestedFollowUp: "Dear Dr. Elena,\n\nThank you for connecting with Quantum Weave on WhatsApp. Our Enterprise Knowledge Systems are engineered specifically for high-accuracy document retrieval with strict citation guarantees and zero public LLM data leakage.\n\nWe have prepared a preliminary proposal detailing our semantic chunking, vector retrieval architecture, and 2-week implementation milestone. When is a convenient time to review the technical proposal together?\n\nWarm regards,\nQuantum Weave Solutions Team",
      isReviewed: true,
      analyzedAt: new Date(Date.now() - 3600000 * 28).toISOString()
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: "lead-103",
    name: "David Kim",
    email: "david@fintechspark.co",
    phone: "+1 (555) 438-2019",
    company: "Fintech Spark",
    source: "website",
    stage: "New",
    service: "Custom Workflow Automation",
    budget: "$5,000 - $8,000",
    message: "Hi there. We need to automate our inbound B2B customer onboarding flow. When a lead fills out our Typeform, we want AI to score their company size, enrich with Clearbit data, create a Hubspot deal, and notify the right account executive on Slack. What is your turnaround time?",
    aiIntelligence: {
      summary: "Fintech Spark wants an event-driven AI workflow automation to qualify B2B onboarding submissions and sync Typeform, HubSpot, and Slack.",
      problem: "Manual lead scoring and cross-platform data entry delaying sales engagement.",
      intent: "Mid-Market Operational Automation",
      priority: "High",
      priorityReason: "Clear scope, well-defined tools (Typeform, HubSpot, Slack), quick decision cycle.",
      suggestedService: "Custom Business Workflow Automation",
      recommendedNextAction: "Send automated follow-up confirming 2-week turnaround and request sample Typeform schema.",
      suggestedFollowUp: "Hi David,\n\nThanks for reaching out! Connecting Typeform -> AI lead scoring -> HubSpot deal creation -> Slack AE alert is an ideal workflow automation for our stack. Our typical turnaround for this pipeline is 7-10 business days.\n\nI can share a quick video demo of a similar HubSpot/Slack pipeline we deployed recently. Are you free for a 15-minute sync tomorrow?\n\nBest,\nQuantum Weave AI Automation",
      isReviewed: false,
      analyzedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "lead-104",
    name: "Rachel Green",
    email: "rachel@urbanboutique.shop",
    phone: "+1 (555) 773-1940",
    company: "Urban Boutique Apparel",
    source: "whatsapp",
    stage: "Contacted",
    service: "AI Employee / Chatbot",
    budget: "< $3,500",
    message: "Hey! Do you build simple Instagram or WhatsApp bots that can answer when our store is open and what sizes we have in stock?",
    aiIntelligence: {
      summary: "E-commerce boutique inquiring about a lightweight WhatsApp bot for store hours and inventory check.",
      problem: "Repetitive social media inquiries regarding opening hours and inventory.",
      intent: "Exploratory / Small Business",
      priority: "Medium",
      priorityReason: "Lower budget tier, but straightforward implementation that matches our Starter Sprint model.",
      suggestedService: "Starter AI Employee Sprint ($3,500)",
      recommendedNextAction: "Share product brochure & starter sprint overview.",
      suggestedFollowUp: "Hi Rachel!\n\nThanks for messaging us. Yes, we build intelligent WhatsApp assistants that can connect to your Shopify or inventory catalog and answer customer questions instantly 24/7.\n\nOur Starter AI Sprint covers complete setup in 10 days. I've linked our brochure here: quantumweave.ai/starter. Would you like to test a quick interactive demo?\n\nWarmly,\nQuantum Weave Team",
      isReviewed: true,
      analyzedAt: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: "lead-105",
    name: "Thomas Sterling",
    email: "t.sterling@sterlingestate.com",
    phone: "+1 (555) 604-3321",
    company: "Sterling Luxury Real Estate",
    source: "website",
    stage: "Won",
    service: "Full-Stack AI Application",
    budget: "$25,000+",
    message: "We need a full-stack client portal where high-net-worth buyers can query property dossiers, calculate investment returns via AI agent, and automatically generate custom PDF investment memoranda.",
    aiIntelligence: {
      summary: "Luxury real estate brokerage requiring bespoke client portal with interactive investment calculation agent and PDF generation.",
      problem: "Manual generation of luxury property investment memoranda consuming days of partner time.",
      intent: "Enterprise Deal Won",
      priority: "High",
      priorityReason: "Signed enterprise contract, active kickoff scheduled.",
      suggestedService: "Full-Stack AI Application Engineering",
      recommendedNextAction: "Proceed with Phase 1 Sprint architecture review and repository kickoff.",
      suggestedFollowUp: "Hi Thomas, welcome aboard Quantum Weave! Our solutions engineering team is finalized for your kickoff sprint.",
      isReviewed: true,
      analyzedAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const seedActivities = [
  {
    id: "act-001",
    leadId: "lead-101",
    type: "lead_created",
    title: "Lead Captured via Website",
    description: "Inbound enquiry submitted through public website contact form.",
    actor: "system",
    metadata: { source: "website", form: "main_contact" },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "act-002",
    leadId: "lead-101",
    type: "ai_analyzed",
    title: "AI Lead Intelligence Generated",
    description: "AI parsed intent as High Commercial Intent, assigned Urgent priority, and generated suggested follow-up response.",
    actor: "ai_agent",
    metadata: { priority: "Urgent", suggestedService: "Autonomous AI Employee" },
    createdAt: new Date(Date.now() - 86400000 * 2 + 120000).toISOString()
  },
  {
    id: "act-003",
    leadId: "lead-101",
    type: "stage_changed",
    title: "Pipeline Stage: New → Qualified",
    description: "Stage updated to Qualified following AI priority analysis and requirement match.",
    actor: "user",
    metadata: { oldStage: "New", newStage: "Qualified", changedBy: "Chirag N Sundar" },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "act-004",
    leadId: "lead-103",
    type: "lead_created",
    title: "Inbound Web Enquiry",
    description: "David Kim submitted enquiry for B2B workflow automation.",
    actor: "system",
    metadata: { source: "website" },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "act-005",
    leadId: "lead-103",
    type: "ai_analyzed",
    title: "AI Analysis Complete",
    description: "Priority assigned as High. Recommended action: 15-minute demo sync.",
    actor: "ai_agent",
    metadata: { priority: "High" },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const seedAutomationLogs = [
  {
    id: "auto-001",
    workflow: "inbound_lead_processing",
    leadId: "lead-101",
    trigger: "New Website Form Submission",
    steps: [
      { step: "Lead Captured", status: "success", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), detail: "Stored lead record in database" },
      { step: "AI Analysis Triggered", status: "success", timestamp: new Date(Date.now() - 86400000 * 2 + 15000).toISOString(), detail: "Extracted intent, priority=Urgent, service match" },
      { step: "RAG Context Enriched", status: "success", timestamp: new Date(Date.now() - 86400000 * 2 + 30000).toISOString(), detail: "Retrieved knowledge chunks for AI Employee capabilities" },
      { step: "Follow-up Drafted", status: "success", timestamp: new Date(Date.now() - 86400000 * 2 + 45000).toISOString(), detail: "Personalized follow-up draft created for review" },
      { step: "Team Notification Dispatched", status: "success", timestamp: new Date(Date.now() - 86400000 * 2 + 60000).toISOString(), detail: "Dispatched Slack alert to #urgent-leads channel" }
    ],
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "auto-002",
    workflow: "whatsapp_inbound_stream",
    leadId: "lead-102",
    trigger: "WhatsApp Webhook Message Received",
    steps: [
      { step: "Webhook Verified", status: "success", timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), detail: "HMAC signature verified" },
      { step: "Customer Phone Matched", status: "success", timestamp: new Date(Date.now() - 86400000 * 3 + 10000).toISOString(), detail: "Identified NovaCare Health contact" },
      { step: "RAG Grounded Response", status: "success", timestamp: new Date(Date.now() - 86400000 * 3 + 25000).toISOString(), detail: "Retrieved RAG architecture and security docs" },
      { step: "Automated WhatsApp Reply Sent", status: "success", timestamp: new Date(Date.now() - 86400000 * 3 + 35000).toISOString(), detail: "Sent WhatsApp message via Cloud API" }
    ],
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

module.exports = {
  seedKnowledgeDocuments,
  seedUsers,
  seedLeads,
  seedActivities,
  seedAutomationLogs
};
