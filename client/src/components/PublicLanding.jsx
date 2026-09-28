import React, { useState } from 'react';
import { 
  Bot, 
  Database, 
  Workflow, 
  Layers, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Send,
  MessageSquare,
  Zap,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { createLead } from '../api/client';

export default function PublicLanding({ onLeadSubmitted, onOpenWhatsApp, onGoToDashboard }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Autonomous AI Employee',
    budget: '$8,000 - $15,000',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    {
      icon: Bot,
      title: 'Autonomous AI Employees',
      tagline: '24/7 Omnichannel Execution',
      desc: 'Intelligent AI agents for sales qualification, client onboarding, and support. Integrates directly with WhatsApp Cloud API, Web Chat, and CRMs with real tool-calling.',
      features: ['WhatsApp Cloud API Native', 'Live Tool & API Calling', 'Sub-second Latency (<800ms)', 'Human-in-the-Loop Handover']
    },
    {
      icon: Database,
      title: 'Enterprise Knowledge (RAG)',
      tagline: 'Grounded Zero-Hallucination Retrieval',
      desc: 'Transform scattered PDFs, Notion docs, and ERP records into a unified high-accuracy semantic vector knowledge base with citation transparency.',
      features: ['Semantic Vector Chunking', 'Hybrid Dense + Keyword Search', 'Strict Source Attributions', 'SOC2 / Zero LLM Training']
    },
    {
      icon: Workflow,
      title: 'Intelligent Workflow Automation',
      tagline: 'Event-Driven Operations',
      desc: 'Automate repetitive workflows across CRMs, Slack, email, and databases. Instant lead qualification, calendar booking, and automated follow-ups.',
      features: ['Instant Lead Qualification', 'Bi-directional CRM Sync', 'Slack/Teams Instant Alerts', 'Automated Smart Follow-Ups']
    },
    {
      icon: Layers,
      title: 'Full-Stack AI Engineering',
      tagline: 'Custom SaaS & Portals',
      desc: 'Bespoke web applications, client portals, and SaaS platforms engineered around agentic AI workflows and modern scalable architectures.',
      features: ['Modern React & Node Stack', 'Agentic Workflow Engines', 'Fast 2-3 Week Turnaround', 'Production SLA & Monitoring']
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter AI Sprint',
      price: '$3,500',
      period: 'one-time',
      timeline: '2 Weeks Delivery',
      desc: 'Perfect for fast proof-of-concept AI implementation.',
      features: [
        'Dedicated AI Employee (WhatsApp or Web)',
        'RAG Knowledge Base (Up to 50 documents)',
        'CRM / Google Sheets Integration',
        'Standard Business Hours SLA',
        'Handover & Team Training Session'
      ],
      popular: false
    },
    {
      name: 'Growth Implementation',
      price: '$8,500',
      period: 'one-time + $1,200/mo',
      timeline: '3 Weeks Delivery',
      desc: 'Complete end-to-end AI operational intelligence.',
      features: [
        'Omnichannel AI Employee (WhatsApp + Web + Email)',
        'Advanced RAG with Document Ingestion Pipeline',
        'Custom Tool Calling & CRM Bi-directional Sync',
        'Automated Lead Qualification & Priority Dispatch',
        'Dedicated Solutions Architect Support'
      ],
      popular: true
    },
    {
      name: 'Enterprise Custom',
      price: '$25,000+',
      period: 'bespoke scoping',
      timeline: '4-6 Weeks Delivery',
      desc: 'Tailored for large organizations with strict security needs.',
      features: [
        'Multi-Agent System with Shared Context',
        'On-Premise / Private Cloud VPC Deployment',
        'ERP & Legacy Database Custom Integrations',
        'SOC2 & HIPAA Compliance Guarantees',
        '24/7 Dedicated Support & 99.9% Uptime SLA'
      ],
      popular: false
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in your name, email, and requirement message.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await createLead(formData, true);
      setSubmissionResult(response);
      if (onLeadSubmitted) onLeadSubmitted(response.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '5rem 1.5rem 4rem', 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.95rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: 'var(--accent-cyan)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={14} />
          <span>BrandMint AI Venture • AI-First Business Systems</span>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', 
          fontWeight: 800, 
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Autonomous AI Employees & Lead Intelligence That Close Deals.
        </h1>

        <p style={{ 
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', 
          color: 'var(--text-secondary)', 
          maxWidth: '750px', 
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Never let an enquiry go cold. Quantum Weave connects AI lead qualification, grounded business knowledge (RAG), WhatsApp automations, and CRM workflows into one high-performance system.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#enquiry-section" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}>
            <span>Deploy AI for Your Business</span>
            <ArrowRight size={17} />
          </a>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
            onClick={onOpenWhatsApp}
          >
            <MessageSquare size={17} color="#25d366" />
            <span>Chat on WhatsApp Live</span>
          </button>
          <button 
            className="btn btn-outline-cyan" 
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
            onClick={onGoToDashboard}
          >
            <Zap size={16} />
            <span>Internal Intelligence Hub</span>
          </button>
        </div>

        {/* Feature Badges Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          marginTop: '3.5rem',
          flexWrap: 'wrap',
          color: 'var(--text-muted)',
          fontSize: '0.86rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="var(--accent-cyan)" />
            <span>Sub-minute AI qualification</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} color="var(--accent-emerald)" />
            <span>3.8x faster sales response</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="var(--accent-primary)" />
            <span>Zero public LLM data training</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Built for Practical Business Impact
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            We think beyond coding. We design the system, build it, integrate intelligence and automation, and deploy a usable solution.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(99, 102, 241, 0.15)', 
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  marginBottom: '1.25rem'
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {srv.tagline}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {srv.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                  {srv.desc}
                </p>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  {srv.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      <CheckCircle size={14} color="var(--accent-emerald)" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Transparent, ROI-Driven Engagements
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Rapid prototypes to full enterprise rollouts with fixed milestone pricing.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {pricingTiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={tier.popular ? 'glass-panel-elevated' : 'glass-panel'}
              style={{ 
                padding: '2rem', 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: 'var(--accent-gradient)',
                  padding: '0.25rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  Most Recommended
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{tier.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tier.price}</span>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{tier.period}</span>
                </div>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.35rem', 
                  padding: '0.2rem 0.65rem', 
                  background: 'rgba(6, 182, 212, 0.1)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '1.25rem'
                }}>
                  <Clock size={13} />
                  <span>{tier.timeline}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
                  {tier.desc}
                </p>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                  {tier.features.map((f, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                      <CheckCircle size={15} color="var(--accent-primary)" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href="#enquiry-section" 
                className={tier.popular ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ width: '100%' }}
                onClick={() => setFormData(prev => ({ ...prev, service: tier.name }))}
              >
                <span>Select {tier.name}</span>
                <ArrowRight size={15} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Inbound Enquiry Form Section */}
      <section id="enquiry-section" className="container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: 'var(--accent-cyan)', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              <Zap size={15} />
              <span>Real-Time Lead Intelligence Capture</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Tell Us About Your Business Challenge
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Submit your inquiry below. Our backend AI Lead Intelligence workflow will automatically parse your operational requirements, assign priority, and generate a personalized solution proposal within seconds!
            </p>
          </div>

          {submissionResult ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.2)', 
                color: 'var(--accent-emerald)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <FileCheck size={28} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#34d399' }}>
                Enquiry Captured & AI Analyzed!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '650px', margin: '0 auto 1.5rem' }}>
                Your enquiry has entered Quantum Weave's intelligent pipeline. The end-to-end automation executed: Lead Created → AI Intent Analyzed → Knowledge Retrieved → Team Alerted.
              </p>

              {/* AI Analysis Summary Preview */}
              {submissionResult.data?.aiIntelligence && (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  maxWidth: '680px',
                  margin: '0 auto 1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      Instant AI Intelligence Preview
                    </span>
                    <span className={`badge badge-priority-${submissionResult.data.aiIntelligence.priority.toLowerCase()}`}>
                      {submissionResult.data.aiIntelligence.priority} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {submissionResult.data.aiIntelligence.summary}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <strong>Identified Problem:</strong> {submissionResult.data.aiIntelligence.problem}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--accent-primary)' }}>
                    <strong>Recommended Next Action:</strong> {submissionResult.data.aiIntelligence.recommendedNextAction}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={onGoToDashboard}
                >
                  <Zap size={16} />
                  <span>View in Internal Dashboard</span>
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmissionResult(null);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      service: 'Autonomous AI Employee',
                      budget: '$8,000 - $15,000',
                      message: ''
                    });
                  }}
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  color: '#f87171',
                  fontSize: '0.86rem',
                  marginBottom: '1.25rem'
                }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="lead-name">Your Full Name *</label>
                  <input
                    id="lead-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Marcus Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lead-email">Work Email *</label>
                  <input
                    id="lead-email"
                    type="email"
                    className="form-input"
                    placeholder="m.vance@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="lead-company">Company / Organization</label>
                  <input
                    id="lead-company"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Apex Logistics"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lead-phone">WhatsApp / Phone Number</label>
                  <input
                    id="lead-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 234-8901"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="lead-service">Area of Interest</label>
                  <select
                    id="lead-service"
                    className="form-select"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="Autonomous AI Employee">Autonomous AI Employee (WhatsApp/Web)</option>
                    <option value="Enterprise Knowledge Systems & RAG">Enterprise Knowledge Systems & RAG</option>
                    <option value="Custom Business Workflow Automation">Custom Business Workflow Automation</option>
                    <option value="Full-Stack AI Application Engineering">Full-Stack AI Application Engineering</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lead-budget">Estimated Budget Range</label>
                  <select
                    id="lead-budget"
                    className="form-select"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="< $3,500">Starter Sprint (&lt; $3,500)</option>
                    <option value="$5,000 - $8,000">$5,000 - $8,000</option>
                    <option value="$8,000 - $15,000">$8,000 - $15,000 (Growth Tier)</option>
                    <option value="$15,000+">$15,000+ (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-message">Describe Your Business Problem & Requirements *</label>
                <textarea
                  id="lead-message"
                  className="form-textarea"
                  rows={4}
                  placeholder="e.g. We receive over 300 customer shipment inquiries daily on WhatsApp. Our team is delayed by 4 hours. We need an AI employee that connects to our tracking API and answers questions instantly..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button
                id="btn-submit-enquiry"
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? (
                  <span>Processing Through AI Intelligence Engine...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Enquiry & Trigger AI Pipeline</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
