# Quantum Weave | AI-Powered Lead & Customer Intelligence System

**Candidate:** Chirag N Sundar  
**Role:** AI Full-Stack Developer  
**Company:** Quantum Weave (BrandMint AI Pvt. Ltd.)  
**Test Window:** 24-Hour Practical Skill Test  

---

## Executive Summary & Business Scenario

A growing service business receives enquiries through its website and WhatsApp. Previously, the business faced six critical bottlenecks:
1. **Leads stored manually:** Fragmented spreadsheets, lost prospect notes, delayed entry.
2. **Inconsistent qualification:** Subjective scoring, missed high-intent enterprise accounts.
3. **Delayed follow-ups:** Response latency of hours or days instead of minutes.
4. **Scattered business information:** Critical proposals, pricing models, and SLAs buried in PDFs.
5. **Support overhead:** Repetitive questions consumed engineering and sales time.
6. **Lack of visibility:** Management could not easily track stage velocity or team activities.

### The Solution: Quantum Weave OmniLead AI
A full-stack, enterprise-grade **AI-Powered Lead & Customer Intelligence Platform** that unites lead capture, automated LLM intelligence, grounded RAG knowledge, autonomous agent tool calling, event-driven business automations, and WhatsApp conversational integration into one unified application.

---

## Key Features & Task Breakdown

| # | Task | Implementation Status & Key Capabilities | Primary Source Files |
|---|---|---|---|
| **1** | **Full-Stack Application** | **Completed.** Sleek public portal + secure internal intelligence hub. Kanban pipeline board, lead detail dossiers, role-based switching. | [`client/src/App.jsx`](file:///d:/GitHub/QuantumWeaveProject/client/src/App.jsx), [`client/src/components/`](file:///d:/GitHub/QuantumWeaveProject/client/src/components/) |
| **2** | **Backend, APIs & Database** | **Completed.** Modular Express REST API with atomic JSON/SQLite persistence, ACID-style writes, activity logging, and filtering. | [`server/index.js`](file:///d:/GitHub/QuantumWeaveProject/server/index.js), [`server/db/database.js`](file:///d:/GitHub/QuantumWeaveProject/server/db/database.js) |
| **3** | **AI Lead Intelligence** | **Completed.** Automated analysis: 2-sentence summary, problem extraction, commercial intent, priority with reasoning, service match, next action, follow-up draft. | [`server/services/aiService.js`](file:///d:/GitHub/QuantumWeaveProject/server/services/aiService.js) |
| **4** | **AI Knowledge Assistant / RAG** | **Completed.** Semantic chunking, TF-IDF vector embeddings, cosine similarity retrieval, citation attributions, and out-of-domain hallucination guardrails. | [`server/services/ragService.js`](file:///d:/GitHub/QuantumWeaveProject/server/services/ragService.js), [`client/src/components/KnowledgeHub.jsx`](file:///d:/GitHub/QuantumWeaveProject/client/src/components/KnowledgeHub.jsx) |
| **5** | **AI Sales / Support Agent** | **Completed.** Autonomous agent with 5 callable tools (`query_kb`, `check_crm`, `create_lead`, `schedule_slot`, `escalate`). Real-time tool execution trace inspector. | [`server/services/agentService.js`](file:///d:/GitHub/QuantumWeaveProject/server/services/agentService.js), [`client/src/components/AgentStudio.jsx`](file:///d:/GitHub/QuantumWeaveProject/client/src/components/AgentStudio.jsx) |
| **6** | **Business Automation** | **Completed.** 7-step automated event pipeline (Capture → Deduplicate → AI Score → RAG Context → Follow-up Draft → Slack/Webhook Alert → Audit Log). | [`server/services/automationService.js`](file:///d:/GitHub/QuantumWeaveProject/server/services/automationService.js), [`client/src/components/AutomationHub.jsx`](file:///d:/GitHub/QuantumWeaveProject/client/src/components/AutomationHub.jsx) |
| **7** | **WhatsApp / External Integration** | **Completed.** Meta WhatsApp Cloud API verification handshake + inbound webhook parser + interactive smartphone simulator lab. | [`server/services/webhookService.js`](file:///d:/GitHub/QuantumWeaveProject/server/services/webhookService.js), [`client/src/components/WhatsAppSimulator.jsx`](file:///d:/GitHub/QuantumWeaveProject/client/src/components/WhatsAppSimulator.jsx) |
| **8** | **Reliability & Security** | **Completed.** Deduplication by email/phone, zero-key resilient offline fallback, human-in-the-loop review actions, sanitization, secret isolation. | Handled across [`server/`](file:///d:/GitHub/QuantumWeaveProject/server/) |
| **9** | **Testing** | **Completed.** 18 automated unit and integration tests verifying all 6 sub-systems with 100% pass rate (`npm test`). | [`tests/runTests.js`](file:///d:/GitHub/QuantumWeaveProject/tests/runTests.js) |
| **10** | **Deployment** | **Completed.** Single-command local dev (`npm run dev`), single-port production server (`npm start`), zero-config cloud deployment ready (Render, Railway, AWS). | [`package.json`](file:///d:/GitHub/QuantumWeaveProject/package.json), [`server/index.js`](file:///d:/GitHub/QuantumWeaveProject/server/index.js) |
| **11** | **Technical Documentation** | **Completed.** Concise architecture documentation with ASCII diagram, component deep-dives, security handling, and setup instructions. | [`README.md`](file:///d:/GitHub/QuantumWeaveProject/README.md) |

---

## Technology Stack

- **Frontend:** React 19, Vite, Lucide Icons, Bespoke Vanilla CSS Design System (dark obsidian theme, glassmorphic blur filters, glowing accents, modern typography via Google Fonts *Plus Jakarta Sans* & *JetBrains Mono*).
- **Backend:** Node.js, Express 5, CORS, Dotenv.
- **Data Layer:** ACID-style atomic file-persisted database (`quantum_weave_db.json`) with automatic seeding and relations.
- **AI & RAG:** Dual-mode architecture supporting Google Gemini API (`gemini-1.5-flash`) / OpenAI GPT-4o-mini with deterministic semantic NLP fallback. Semantic document chunker and TF-IDF vector space with normalized cosine similarity.
- **Automations:** Event-driven pipeline orchestrator with webhook dispatch simulation (Slack / Email / Webhook).
- **External API:** Meta WhatsApp Cloud API compliant webhook endpoints (`GET` challenge handshake + `POST` inbound message stream).

---

## Architecture Diagram

```
+----------------------------------------------------------------------------------------------------+
|                                    INBOUND INGESTION CHANNELS                                      |
+----------------------------------------------------------------------------------------------------+
       |                                                                            |
       v                                                                            v
[ Public Web Portal ]                                                    [ WhatsApp Cloud API / ]
[ Inbound Enquiry Form ]                                                 [ Webhook Simulator   ]
       |                                                                            |
       +------------------------------------+---------------------------------------+
                                            |
                                            v
+----------------------------------------------------------------------------------------------------+
|                                  EXPRESS 5 REST API SERVER (Node.js)                               |
+----------------------------------------------------------------------------------------------------+
|  • /api/leads        : CRUD, Stage Changes, Follow-up Approvals, Duplicate Check                   |
|  • /api/knowledge    : Document Corpus Ingestion & Semantic Vector RAG Search                      |
|  • /api/agent        : Autonomous Multi-Turn Agent with Structured Tool Calling Trace              |
|  • /api/automations  : 7-Step Inbound Event Pipeline & Real-Time Execution Logs                    |
|  • /api/webhooks     : Meta WhatsApp Cloud API Handshake & Conversational Processor                |
|  • /api/analytics    : Pipeline Funnel, Conversion Velocity & Source Heatmaps                      |
+----------------------------------------------------------------------------------------------------+
                                            |
                                            v
+----------------------------------------------------------------------------------------------------+
|                                   REACT CLIENT APPLICATION (Vite)                                  |
+----------------------------------------------------------------------------------------------------+
|  • Public Portal       : High-impact service showcase, ROI tiers, interactive enquiry form         |
|  • Lead Intelligence   : Executive KPI cards, real-time lead queue, search and filter matrix       |
|  • Pipeline Board      : 6-Stage Kanban (New -> Contacted -> Qualified -> Proposal -> Won / Lost)  |
|  • Lead Dossier Modal  : AI summary, intent, priority, next action, editable follow-up composer    |
|  • Knowledge Hub       : RAG vector document manager with chunk viewer and grounded Q&A            |
|  • Agent Studio        : Autonomous agent chat with live tool-calling execution trace              |
|  • Automation Hub      : Interactive flowchart with step-by-step transaction logs                  |
|  • WhatsApp Lab        : Smartphone mockup simulator + Meta Cloud API specs                        |
|  • Analytics View      : Pipeline conversion funnel and service breakdowns                         |
+----------------------------------------------------------------------------------------------------+
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 2. Local Setup & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quantum-weave-intelligence.git
cd quantum-weave-intelligence

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 3. Run Automated Test Suite
Verify all 18 tests across database, AI intelligence, RAG, agent tools, automations, and WhatsApp webhooks:

```bash
npm test
```

### 4. Start the Application

#### Option A: Development Mode (Concurrent Server + Vite Client)
```bash
npm run dev
```
- Client runs on: `http://localhost:3000` (proxies `/api` to backend)
- Server runs on: `http://localhost:5000`

#### Option B: Production Mode (Unified Single-Port Server)
```bash
npm run build
npm start
```
- Full application runs unified on: `http://localhost:5000` (ready for 1-click cloud host deployment like Render, Railway, or AWS Elastic Beanstalk).

---

## API Reference

### Leads & Pipeline
- `GET /api/leads` - List leads with filters (`?stage=Qualified&priority=Urgent&source=whatsapp&search=Apex`)
- `GET /api/leads/:id` - Get lead details with activity history timeline
- `POST /api/leads` - Create lead and trigger end-to-end automation pipeline
- `PATCH /api/leads/:id/stage` - Update pipeline stage (`New` → `Contacted` → `Qualified` → `Proposal` → `Won` / `Lost`)
- `POST /api/leads/:id/analyze` - Trigger / re-run AI Lead Intelligence
- `POST /api/leads/:id/approve-followup` - Human-in-the-loop follow-up approval & dispatch
- `DELETE /api/leads/:id` - Delete lead record

### Knowledge Base & RAG
- `GET /api/knowledge/documents` - List knowledge documents and vector chunk stats
- `POST /api/knowledge/documents` - Ingest new document and re-index vector store
- `POST /api/knowledge/query` - Semantic vector query with citations and guardrails

### AI Agent & Tools
- `GET /api/agent/tools` - Inspect 5 registered agent tool definitions
- `POST /api/agent/chat` - Multi-turn agent conversation with autonomous tool calling
- `POST /api/agent/execute-tool` - Direct invocation of agent tools (`query_knowledge_base`, `check_lead_status`, etc.)

### Business Automations & Webhooks
- `GET /api/automations/logs` - Retrieve chronological automation pipeline logs
- `POST /api/automations/trigger` - Test trigger end-to-end automation workflow
- `GET /api/webhooks/whatsapp` - Meta WhatsApp Cloud API verification challenge
- `POST /api/webhooks/whatsapp` - Meta WhatsApp inbound webhook receiver
- `POST /api/webhooks/simulate-inbound` - WhatsApp simulator conversation endpoint

### Analytics & System
- `GET /api/analytics/overview` - KPI aggregation, stage funnel, source distribution
- `GET /api/health` - Server health, uptime, and candidate metadata

---

## Reliability, Edge Cases & Security

1. **Duplicate Lead Detection:** Inbound requests are cross-checked against existing emails and normalized phone digits. Existing leads are enriched rather than duplicated, appending the message to their timeline.
2. **Offline & Zero-Key Resilience:** The platform operates seamlessly with or without external API keys. If `GEMINI_API_KEY` is undefined or throttled, the system activates its local semantic heuristic engine with zero downtime.
3. **Human-in-the-Loop Safeguard:** AI-generated follow-up emails and WhatsApp messages are flagged `Pending Human Review`. Team members can inspect, edit, and click `Approve & Dispatch` before anything reaches the client.
4. **Hallucination Prevention:** The RAG system requires a cosine relevance threshold of `0.15`. If an inquiry falls outside verified documents (e.g. "What is the recipe for pancakes?"), the system politely admits lack of data and offers direct engineer contact.
5. **Secret Protection:** No API keys or credentials are leaked in client bundles; all sensitive configurations reside securely in `.env`.

---

## Production Roadmap & Improvements

With additional time, the following enhancements would be added:
- **Vector Database Migration:** Scale from in-memory normalized vector indexing to PGVector / Qdrant for multi-million document corpora.
- **Voice Agent Handover:** Integrate Twilio or ElevenLabs voice agents for automated outbound phone qualification calls.
- **Fine-Tuned Domain Adapters:** Train LoRA adapters on Quantum Weave historical sales wins to align follow-up tone.
- **Bi-Directional CRM Webhooks:** Native HubSpot and Salesforce bi-directional event synchronizers.

---

**Built by Chirag N Sundar for Quantum Weave \| BrandMint AI Practical Skill Test.**
