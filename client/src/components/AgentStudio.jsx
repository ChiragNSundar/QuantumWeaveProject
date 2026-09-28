import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Wrench, 
  Clock, 
  Code, 
  Sparkles, 
  User, 
  Calendar, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Terminal
} from 'lucide-react';
import { getAgentTools, sendAgentChat, executeAgentTool } from '../api/client';

export default function AgentStudio() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am Quantum Weave\'s Autonomous AI Business & Solutions Agent.\n\nI am equipped with live tool-calling capabilities to:\n• Query our verified business knowledge base (RAG)\n• Check prospect lead status and history in CRM\n• Programmatically create/update CRM records\n• Schedule architectural discovery consultations\n• Escalate high-urgency enterprise accounts\n\nHow can I help you today?',
      toolsExecuted: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState([]);
  const [selectedToolTrace, setSelectedToolTrace] = useState(null);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    { label: 'Query Knowledge Tool', text: 'What are your implementation pricing tiers and timelines?' },
    { label: 'Check CRM Status Tool', text: 'Please check the status for my enquiry at m.vance@apexlogistics.io' },
    { label: 'Schedule Consultation Tool', text: 'I want to schedule a discovery consultation for next Thursday. My email is alex@futureops.ai' },
    { label: 'Escalate to Human Tool', text: 'We have an urgent enterprise need with $50k+ budget that must go live immediately.' }
  ];

  useEffect(() => {
    getAgentTools().then(res => setTools(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText) => {
    const text = messageText || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await sendAgentChat(text, messages);
      const assistantMsg = {
        role: 'assistant',
        content: res.data.reply,
        toolsExecuted: res.data.toolsExecuted || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      if (res.data.toolsExecuted?.length > 0) {
        setSelectedToolTrace(res.data.toolsExecuted[0]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error communicating with agent: ${err.message}`,
        toolsExecuted: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          <Bot size={16} />
          <span>Task 5: Autonomous AI Sales &amp; Support Agent with Function Calling</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          AI Agent Studio &amp; Tool Calling Trace
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Demonstrates structured tool invocation, agent-to-CRM interactions, and business context grounding rather than simple text generation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        {/* Left: Chat Sandbox */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '640px' }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '1rem 1.25rem', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Quantum Weave Solutions Agent</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="live-indicator" /> Online • 5 Active Workflow Tools
                </div>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem' }}
              onClick={() => setMessages(messages.slice(0, 1))}
            >
              Reset Chat
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '82%',
                    padding: '0.9rem 1.15rem',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isUser ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                    border: isUser ? 'none' : '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.content}
                  </div>

                  {/* Tool Execution Pills on Assistant Message */}
                  {!isUser && msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                      {msg.toolsExecuted.map((t, tIdx) => (
                        <div
                          key={tIdx}
                          onClick={() => setSelectedToolTrace(t)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(6, 182, 212, 0.12)',
                            border: '1px solid rgba(6, 182, 212, 0.35)',
                            fontSize: '0.72rem',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          <Wrench size={11} />
                          <span>Tool: {t.tool} ({t.executionTimeMs}ms)</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem', padding: '0 0.4rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.82rem', padding: '0.5rem' }}>
                <Sparkles size={16} className="animate-spin" />
                <span>Agent reasoning &amp; evaluating tools...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Test Prompt Chips */}
          <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(10, 16, 29, 0.4)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', whiteSpace: 'nowrap' }}
                onClick={() => handleSend(sp.text)}
              >
                {sp.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.65rem' }}>
            <input
              id="agent-chat-input"
              type="text"
              className="form-input"
              placeholder="Ask anything, query CRM status, or book a consultation slot..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              id="btn-agent-send"
              className="btn btn-primary"
              onClick={() => handleSend()}
              disabled={loading || !inputMessage.trim()}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Right: Tool Execution Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Active Tool Execution Trace */}
          <div className="glass-panel" style={{ padding: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Terminal size={17} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                Live Function/Tool Calling Trace
              </h3>
            </div>

            {selectedToolTrace ? (
              <div style={{
                background: 'rgba(5, 9, 18, 0.85)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    ▶ Invoked: {selectedToolTrace.tool}()
                  </span>
                  <span style={{ color: 'var(--accent-emerald)' }}>
                    ⏱ {selectedToolTrace.executionTimeMs} ms
                  </span>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>// Input Arguments:</div>
                  <pre style={{ color: '#fde047', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', overflowX: 'auto' }}>
                    {JSON.stringify(selectedToolTrace.arguments, null, 2)}
                  </pre>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>// Tool Execution Output:</div>
                  <pre style={{ color: '#86efac', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', overflowX: 'auto', maxHeight: '180px' }}>
                    {JSON.stringify(selectedToolTrace.result, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                <Code size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <div>No tool calls recorded yet</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Click one of the test prompts above to see live tool execution</div>
              </div>
            )}
          </div>

          {/* Registered Agent Tools List */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Registered Agent Function Calling Tools ({tools.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
              {tools.map(tool => (
                <div 
                  key={tool.name}
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.15rem' }}>
                    {tool.name}()
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    {tool.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
