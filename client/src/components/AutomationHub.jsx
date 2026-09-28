import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Activity, 
  Layers, 
  Server,
  RefreshCw,
  Send,
  Bell
} from 'lucide-react';
import { getAutomationLogs, triggerTestAutomation } from '../api/client';

export default function AutomationHub() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await getAutomationLogs(25);
      setLogs(res.data || []);
      if (res.data?.length > 0 && !selectedLog) {
        setSelectedLog(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load automation logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleTriggerTest = async () => {
    setTriggering(true);
    try {
      const res = await triggerTestAutomation();
      await loadLogs();
      if (res.data?.automation) {
        setSelectedLog(res.data.automation);
      }
    } catch (err) {
      console.error('Failed to trigger automation test:', err);
    } finally {
      setTriggering(false);
    }
  };

  const workflowSteps = [
    { title: 'Inbound Enquiry', desc: 'Web Form or WhatsApp Webhook trigger' },
    { title: 'DB Persistence', desc: 'Duplicate check & atomic save to CRM' },
    { title: 'AI Intelligence', desc: 'Intent, priority, & requirement extraction' },
    { title: 'RAG Retrieval', desc: 'Context retrieval from knowledge base' },
    { title: 'Follow-up Draft', desc: 'Ready-to-send personalized proposal' },
    { title: 'Team Alert / Webhook', desc: 'Slack/Email dispatch to team' }
  ];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Zap size={16} />
            <span>Task 6: Event-Driven Business Automation Pipeline</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Automated Workflow Engine &amp; Webhook Logs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Fully automated pipeline converting cold inbound messages into scored, enriched, and prioritized CRM opportunities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={loadLogs} 
            title="Refresh Logs"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            id="btn-trigger-automation"
            className="btn btn-primary"
            onClick={handleTriggerTest}
            disabled={triggering}
          >
            <Play size={15} />
            <span>{triggering ? 'Executing Pipeline...' : 'Test Trigger Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Flowchart */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Active Automated Inbound Pipeline Architecture
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', 
          gap: '1rem',
          position: 'relative'
        }}>
          {workflowSteps.map((step, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(10, 16, 29, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: 'var(--accent-gradient)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.65rem'
              }}>
                {idx + 1}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs and Detailed Step Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(320px, 1.7fr)', gap: '1.5rem' }}>
        {/* Left: Execution Logs List */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>
              Recent Workflow Executions ({logs.length})
            </h4>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Real-time Audit Trail</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '500px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No automation logs recorded. Click "Test Trigger Workflow" to run one.
              </div>
            ) : (
              logs.map(log => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {log.trigger}
                      </span>
                      <span className="badge badge-stage-won" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                        {log.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Workflow: {log.workflow}</span>
                      <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Step-by-Step Execution Inspector */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          {selectedLog ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Execution Trace: {selectedLog.id}
                  </h4>
                  <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)' }}>
                    Trigger: {selectedLog.trigger} • {new Date(selectedLog.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className="badge badge-stage-won">
                  <CheckCircle2 size={12} />
                  <span>Success</span>
                </span>
              </div>

              {/* Steps Timeline */}
              <div className="timeline" style={{ paddingLeft: '2rem' }}>
                {selectedLog.steps?.map((st, sIdx) => (
                  <div key={sIdx} className="timeline-item" style={{ marginBottom: '1rem' }}>
                    <div className="timeline-dot" style={{ background: st.status === 'success' ? '#10b981' : '#f59e0b' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        Step {sIdx + 1}: {st.step}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {new Date(st.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(8, 12, 20, 0.5)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      {st.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Select a log entry on the left to inspect step executions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
