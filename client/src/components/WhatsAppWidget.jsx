import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, CheckCheck } from 'lucide-react';
import { simulateWhatsAppMessage } from '../api/client';

export default function WhatsAppWidget({ isOpen, onToggle, onLeadCreated }) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: 'Hi! Welcome to Quantum Weave 👋 Have a question about our AI Employees, RAG systems, or pricing? Message us here!',
      time: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg;
    setInputMsg('');
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setLoading(true);
    try {
      const res = await simulateWhatsAppMessage({
        message: userText,
        phone: '+1 (555) 309-8124',
        name: 'Website Visitor (WhatsApp Widget)'
      });

      const reply = res.data?.outbound?.text || "Thanks for your message! Our AI solutions team has received it.";
      setMessages(prev => [...prev, {
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (onLeadCreated) onLeadCreated();
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'agent',
        text: `Error: ${err.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        id="floating-whatsapp-trigger"
        className="floating-whatsapp-btn"
        onClick={onToggle}
        title="Chat on WhatsApp with AI Assistant"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="whatsapp-drawer">
          {/* Header */}
          <div style={{
            background: '#1f2c34',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#25d366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>Quantum Weave WhatsApp</div>
                <div style={{ fontSize: '0.7rem', color: '#25d366', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="live-indicator" style={{ background: '#25d366' }} />
                  <span>AI Employee Active</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onToggle}
              style={{ background: 'transparent', border: 'none', color: '#8696a0', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            backgroundColor: '#0b141a',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0)',
            backgroundSize: '20px 20px'
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
                    padding: '0.6rem 0.8rem',
                    borderRadius: isUser ? '10px 10px 0 10px' : '10px 10px 10px 0',
                    fontSize: '0.82rem',
                    lineHeight: 1.4,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <div>{m.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', marginTop: '0.2rem', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                    <span>{m.time}</span>
                    {isUser && <CheckCheck size={11} color="#53bdeb" />}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#202c33', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.74rem', color: '#8696a0' }}>
                AI is typing...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.4rem 0.65rem', background: '#111b21', display: 'flex', gap: '0.35rem', overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => {
                setInputMsg("What are your pricing tiers?");
              }}
              style={{
                background: '#202c33',
                border: 'none',
                color: '#00a884',
                borderRadius: '12px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.68rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              Pricing tiers?
            </button>
            <button
              onClick={() => {
                setInputMsg("How fast can you deploy an AI employee?");
              }}
              style={{
                background: '#202c33',
                border: 'none',
                color: '#00a884',
                borderRadius: '12px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.68rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              Deployment speed?
            </button>
          </div>

          {/* Input Form */}
          <form 
            onSubmit={handleSend}
            style={{
              background: '#202c33',
              padding: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <input
              type="text"
              placeholder="Ask on WhatsApp..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                background: '#2a3942',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                color: '#e9edef',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              style={{
                background: '#00a884',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
