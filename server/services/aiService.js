const config = require('../config');

class AIService {
  // Call Gemini or OpenAI LLM API if key is present
  async callLLM(prompt, jsonMode = false) {
    if (config.GEMINI_API_KEY) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: jsonMode ? { responseMimeType: 'application/json' } : {}
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return candidateText;
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local NLP engine:', err.message);
      }
    }

    if (config.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: jsonMode ? { type: 'json_object' } : undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.choices?.[0]?.message?.content;
          if (candidateText) {
            return candidateText;
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to local NLP engine:', err.message);
      }
    }

    return null;
  }

  // Task 3: AI Lead Intelligence Analysis
  async analyzeLeadEnquiry(lead) {
    const prompt = `You are Quantum Weave's Lead Intelligence System.
Analyze this prospective customer inquiry for our AI solutions business:

Company: ${lead.company || 'Not Specified'}
Contact Name: ${lead.name || 'Prospect'}
Email: ${lead.email || 'N/A'}
Phone: ${lead.phone || 'N/A'}
Source Channel: ${lead.source || 'Website'}
Requested Service: ${lead.service || 'General'}
Budget Range: ${lead.budget || 'Undisclosed'}
Enquiry Message:
"${lead.message || ''}"

Return a valid JSON object strictly matching this schema:
{
  "summary": "Crisp 2-sentence executive summary of who they are and what they need",
  "problem": "Clear statement of the customer's core operational pain point or requirement",
  "intent": "High Commercial Intent | Enterprise Evaluation | Mid-Market Automation | Exploratory Inquiry",
  "priority": "Urgent | High | Medium | Low",
  "priorityReason": "Bullet-point explanation of why this priority was assigned based on budget, urgency, and fit",
  "suggestedService": "Specific Quantum Weave solution (Autonomous AI Employee | Enterprise RAG | Workflow Automation | Full-Stack AI)",
  "recommendedNextAction": "Actionable next step for the sales/engineering team",
  "suggestedFollowUp": "Polite, personalized ready-to-send draft response mentioning their specific problem and proposing next step"
}`;

    // Try external LLM first
    const llmResult = await this.callLLM(prompt, true);
    if (llmResult) {
      try {
        const cleaned = llmResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          ...parsed,
          isReviewed: false,
          analyzedAt: new Date().toISOString(),
          engine: 'LLM (Cloud AI)'
        };
      } catch (e) {
        console.warn('Failed to parse LLM JSON response, using deterministic NLP engine:', e.message);
      }
    }

    // High-Accuracy Heuristic & Semantic Intelligence Engine (Fallback / Zero-Config)
    return this.deterministicAnalyzeEnquiry(lead);
  }

  // Deterministic local NLP intelligence engine
  deterministicAnalyzeEnquiry(lead) {
    const text = (lead.message || '').toLowerCase();
    const serviceInput = (lead.service || '').toLowerCase();
    const budget = (lead.budget || '').toLowerCase();

    // 1. Problem extraction
    let problem = "Seeking custom AI technology implementation to improve operational productivity.";
    if (text.includes('whatsapp') && (text.includes('shipment') || text.includes('order') || text.includes('support') || text.includes('overwhelmed'))) {
      problem = "Support team is overwhelmed handling repetitive high-volume customer inquiries across WhatsApp and web channels.";
    } else if (text.includes('pdf') || text.includes('document') || text.includes('scattered') || text.includes('rag') || text.includes('search')) {
      problem = "Critical business knowledge and operational protocols are scattered across documents, causing team delays and inefficient search.";
    } else if (text.includes('automate') || text.includes('typeform') || text.includes('hubspot') || text.includes('crm') || text.includes('slack')) {
      problem = "Manual data transfer and lead qualification across disjointed platforms slowing down response times.";
    } else if (text.includes('hours') || text.includes('inventory') || text.includes('shop') || text.includes('bot')) {
      problem = "Repetitive customer inquiries regarding business hours, inventory availability, and basic services.";
    } else if (lead.message && lead.message.length > 10) {
      problem = lead.message.length > 120 ? lead.message.substring(0, 117) + '...' : lead.message;
    }

    // 2. Intent classification
    let intent = "Mid-Market Operational Automation";
    if (budget.includes('25,000') || budget.includes('15,000') || text.includes('enterprise') || text.includes('rfp') || text.includes('vendor')) {
      intent = "Enterprise Evaluation";
    } else if (text.includes('ready') || text.includes('immediately') || text.includes('asap') || text.includes('quote') || text.includes('turnaround time')) {
      intent = "High Commercial Intent";
    } else if (budget.includes('< 3,500') || text.includes('simple') || text.includes('just checking') || text.includes('starter')) {
      intent = "Exploratory / Small Business";
    } else if (text.includes('pricing') || text.includes('cost')) {
      intent = "Pricing & Scope Inquiry";
    }

    // 3. Priority assessment
    let priority = "Medium";
    let priorityReason = "Standard commercial inquiry requiring discovery qualification.";

    const urgentKeywords = ['overwhelmed', 'asap', 'immediately', 'urgent', '400', '500', 'daily', 'losing customers'];
    const hasUrgency = urgentKeywords.some(k => text.includes(k));
    const isHighBudget = budget.includes('15,000') || budget.includes('25,000') || budget.includes('8,000');

    if (hasUrgency && isHighBudget) {
      priority = "Urgent";
      priorityReason = "High inbound volume/urgency combined with verified enterprise budget allocation and immediate readiness.";
    } else if (hasUrgency || isHighBudget || intent === "High Commercial Intent") {
      priority = "High";
      priorityReason = "Strong commercial intent with defined requirements and established budget.";
    } else if (budget.includes('< 3,500') || intent === "Exploratory / Small Business") {
      priority = "Medium";
      priorityReason = "Lower budget threshold; suitable for Starter AI Sprint or self-serve documentation.";
    } else {
      priority = "Medium";
      priorityReason = "Standard inquiry awaiting requirement scoping and technical discovery.";
    }

    // 4. Suggested Service
    let suggestedService = "Autonomous AI Employee & Support Agent";
    if (text.includes('pdf') || text.includes('document') || text.includes('knowledge') || text.includes('rag') || serviceInput.includes('knowledge') || serviceInput.includes('rag')) {
      suggestedService = "Enterprise Knowledge System (RAG Architecture)";
    } else if (text.includes('workflow') || text.includes('automate') || text.includes('hubspot') || text.includes('slack') || serviceInput.includes('workflow') || serviceInput.includes('automation')) {
      suggestedService = "Custom Business Workflow Automation";
    } else if (text.includes('portal') || text.includes('saas') || text.includes('full-stack') || serviceInput.includes('full-stack')) {
      suggestedService = "Full-Stack AI Application Engineering";
    }

    // 5. Recommended Next Action
    let recommendedNextAction = "Schedule 20-minute discovery call to map workflows and demonstrate similar client implementation.";
    if (priority === "Urgent") {
      recommendedNextAction = "Immediate outreach: Schedule technical discovery call within 4 hours and assign dedicated Solutions Architect.";
    } else if (priority === "High") {
      recommendedNextAction = "Send personalized video demo & schedule 30-minute scoping session.";
    } else if (priority === "Medium") {
      recommendedNextAction = "Share Quantum Weave service brochure and Starter Sprint pricing tier.";
    }

    // 6. Summary
    const companyName = lead.company || 'The prospective client';
    const summary = `${companyName} is seeking ${suggestedService.toLowerCase()} to address operational bottlenecks. Their enquiry demonstrates ${intent.toLowerCase()} with a designated priority of ${priority}.`;

    // 7. Suggested Follow-Up Response Draft
    const firstName = (lead.name || 'there').split(' ')[0];
    const companyRef = lead.company && lead.company !== 'Undisclosed Company' ? ` on behalf of ${lead.company}` : '';
    const suggestedFollowUp = `Hi ${firstName},

Thank you for reaching out to Quantum Weave${companyRef}. We reviewed your enquiry regarding ${problem.toLowerCase().replace(/^(the|a)\s+/i, '')}

Our team specializes in deploying enterprise-grade ${suggestedService} with rapid 2-3 week turnarounds and complete API integrations. We have helped similar businesses solve this exact operational challenge.

Could we schedule a brief 20-minute discovery call this week to review your current setup and share a live demo of what we can build for you?

You can pick a time that works best here: https://cal.com/quantumweave/discovery

Best regards,
Solutions Engineering Team
Quantum Weave | BrandMint AI`;

    return {
      summary,
      problem,
      intent,
      priority,
      priorityReason,
      suggestedService,
      recommendedNextAction,
      suggestedFollowUp,
      isReviewed: false,
      analyzedAt: new Date().toISOString(),
      engine: 'Semantic Heuristic Engine (Offline Resilient)'
    };
  }
}

module.exports = new AIService();
