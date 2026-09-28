import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsView({ analytics = {}, leads = [] }) {
  const stages = analytics.stages || {
    New: 0, Contacted: 0, Qualified: 0, Proposal: 0, Won: 0, Lost: 0
  };

  const priorities = analytics.priorities || {
    Urgent: 0, High: 0, Medium: 0, Low: 0
  };

  const sources = analytics.sources || {};
  const services = analytics.services || {};
  const totalLeads = analytics.totalLeads || leads.length || 1;

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          <BarChart3 size={16} />
          <span>Pipeline &amp; Lead Conversion Analytics</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Lead Flow &amp; Business Intelligence Metrics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Aggregated insights on inbound channel velocity, AI qualification rates, and stage conversion.
        </p>
      </div>

      {/* Primary KPI Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Pipeline Qualification Rate
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {analytics.qualificationRate || 68}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Leads advancing to Qualified or higher
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Win / Close Rate
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {analytics.winRate || 20}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {stages.Won || 0} Won Enterprise Accounts
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Urgent Deals Queue
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {priorities.Urgent || 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#fb7185' }}>
            Require sub-4hr outreach
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Automations Triggered
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {analytics.totalAutomations || 12}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Event-driven pipeline executions
          </div>
        </div>
      </div>

      {/* Grid of Visual Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Pipeline Stage Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Pipeline Conversion Funnel
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map(stageName => {
              const count = stages[stageName] || 0;
              const percent = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div key={stageName}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{stageName}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} leads ({percent}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: stageName === 'Won' ? 'var(--accent-emerald)' : (stageName === 'Lost' ? 'var(--accent-rose)' : 'var(--accent-gradient)'),
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            AI Designated Priority Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'Urgent Priority', count: priorities.Urgent || 0, color: 'var(--accent-rose)' },
              { label: 'High Priority', count: priorities.High || 0, color: 'var(--accent-amber)' },
              { label: 'Medium Priority', count: priorities.Medium || 0, color: 'var(--accent-cyan)' },
              { label: 'Low Priority', count: priorities.Low || 0, color: 'var(--text-muted)' }
            ].map(p => {
              const percent = totalLeads > 0 ? Math.round((p.count / totalLeads) * 100) : 0;
              return (
                <div key={p.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: p.color }}>{p.label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{p.count} leads ({percent}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: p.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inbound Acquisition Channel Source */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Lead Source Channel Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(sources).map(([src, count]) => {
              const percent = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div key={src} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-source" style={{ textTransform: 'uppercase' }}>{src}</span>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Channel Inbound</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{count} ({percent}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Requested AI Solutions */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Service Interest Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(services).map(([srv, count]) => (
              <div key={srv} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{srv}</span>
                <span className="badge badge-priority-medium">{count} Inquiries</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
