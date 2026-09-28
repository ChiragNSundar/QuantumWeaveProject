import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  User, 
  Sparkles, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  Info,
  ExternalLink,
  Bot
} from 'lucide-react';
import { simulateWhatsAppMessage } from '../api/client';

export default function WhatsAppSimulator({ onLeadCreated }) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: 'Hi! Welcome to Quantum Weave WhatsApp Assistant 👋 We build AI employees and workflow automations. How can we help you today?',
      time: '10:00 AM'
    }
  ]);

  const [customerPhone, setCustomerPhone] = useState('+1 (555) 789-0123');
  const [customerName, setCustomerName] = useState('Elena Vance');
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastLeadId, setLastLeadId] = useState(null);

  const sampleMessages = [
    "Hi, we need an AI employee for customer support on WhatsApp. What are your pricing plans?",
    "Can your AI RAG system index 500 clinical PDFs without hallucinating?",
    "We want to automate Typeform to HubSpot and Slack. Can we schedule a discovery call?"
  ];

  const handleSend = async (customText) => {
    const text = customText || inputMsg;
    if (!text.trim() || loading) return;

    const userEntry = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userEntry]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await simulateWhatsAppMessage({
        message: text,
        phone: customerPhone,
        name: customerName
      });

      const reply = res.data?.outbound?.text || "Thanks for your message! Our team has received your inquiry.";
      const leadId = res.data?.leadId;
      if (leadId) setLastLeadId(leadId);

      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (onLeadCreated && leadId) {
        onLeadCreated();
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: `[WhatsApp Webhook Error]: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#25d366', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          <MessageSquare size={16} />
          <span>Task 7: WhatsApp Cloud API &amp; Conversational External Integration</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          WhatsApp Business Simulator Lab
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Test WhatsApp inbound conversational workflows in real-time. Inbound messages automatically invoke the AI Agent, query RAG knowledge, and sync to the CRM lead pipeline.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) minmax(320px, 1fr)', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Smartphone Mockup Interface */}
        <div style={{
          background: '#0c1317',
          border: '12px solid #1f2c34',
          borderRadius: '42px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(37, 211, 102, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '660px',
          position: 'relative'
        }}>
          {/* WhatsApp Header */}
          <div style={{
            background: '#1f2c34',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#25d366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Bot size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Quantum Weave AI</div>
              <div style={{ fontSize: '0.72rem', color: '#25d366', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="live-indicator" style={{ background: '#25d366', boxShadow: '0 0 8px #25d366' }} />
                <span>Verified Business Account</span>
              </div>
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp pattern background */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            backgroundColor: '#0b141a',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}>
            {messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: isUser ? '#005c4b' : '#202c33',
                    color: '#e9edef',
                    padding: '0.65rem 0.85rem',
                    borderRadius: isUser ? '10px 10px 0 10px' : '10px 10px 10px 0',
                    fontSize: '0.84rem',
                    lineHeight: 1.45,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <div>{m.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.66rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    <span>{m.time}</span>
                    {isUser && <CheckCheck size={13} color="#53bdeb" />}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#202c33', padding: '0.5rem 0.85rem', borderRadius: '10px', fontSize: '0.76rem', color: '#8696a0' }}>
                Quantum Weave AI is typing...
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div style={{ padding: '0.5rem 0.75rem', background: '#111b21', display: 'flex', gap: '0.4rem', overflowX: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {sampleMessages.map((sm, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSend(sm)}
                style={{
                  background: '#202c33',
                  border: 'none',
                  color: '#00a884',
                  borderRadius: '16px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {sm.slice(0, 32)}...
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{
            background: '#202c33',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              id="whatsapp-chat-input"
              type="text"
              placeholder="Type WhatsApp message..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              style={{
                flex: 1,
                background: '#2a3942',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                color: '#e9edef',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
            <button
              id="btn-whatsapp-send"
              onClick={() => handleSend()}
              disabled={loading || !inputMsg.trim()}
              style={{
                background: '#00a884',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right: Technical Explanation & Integration Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Contact Simulator Controls */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--accent-cyan)" />
              <span>Simulated Inbound Customer Identity</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            {lastLeadId && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.78rem',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Check size={14} />
                <span>Auto-synced to CRM: <strong>Lead #{lastLeadId}</strong></span>
              </div>
            )}
          </div>

          {/* Cloud API Architecture Spec */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--accent-primary)" />
              <span>Meta WhatsApp Cloud API Live Integration Specs</span>
            </h3>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.55 }}>
              The application exposes a fully compliant Meta WhatsApp Cloud API endpoint ready to receive live webhooks from Meta's Graph API.
            </p>

            <div style={{ background: 'rgba(8, 12, 20, 0.8)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', fontFamily: 'monospace', fontSize: '0.76rem', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.35rem' }}>// Webhook Verification (Meta GET):</div>
              <div style={{ color: 'var(--text-muted)' }}>GET /api/webhooks/whatsapp?hub.mode=subscribe&amp;hub.challenge=...</div>
              
              <div style={{ color: 'var(--accent-cyan)', marginTop: '0.75rem', marginBottom: '0.35rem' }}>// Inbound Message Stream (Meta POST):</div>
              <div style={{ color: 'var(--text-muted)' }}>POST /api/webhooks/whatsapp</div>
              <div style={{ color: '#86efac' }}>Payload: entry[0].changes[0].value.messages[0]</div>

              <div style={{ color: 'var(--accent-cyan)', marginTop: '0.75rem', marginBottom: '0.35rem' }}>// Outbound Dispatch API:</div>
              <div style={{ color: '#fde047' }}>POST https://graph.facebook.com/v19.0/{'{PHONE_ID}'}/messages</div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              When live API credentials (<code className="font-mono">WHATSAPP_API_TOKEN</code> and <code className="font-mono">WHATSAPP_PHONE_NUMBER_ID</code>) are provided in <code className="font-mono">.env</code>, the backend connects live to Meta's servers. When running in demonstration/test mode, the built-in webhook simulator mirrors the exact same payload schema and triggers the CRM automation pipeline seamlessly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
