import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  MessageSquare, 
  Globe, 
  User, 
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Zap
} from 'lucide-react';

export default function LeadDashboard({ 
  leads = [], 
  analytics = {}, 
  onSelectLead, 
  onRefresh, 
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Filter leads based on search and selected filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.message && lead.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.service && lead.service.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStage = stageFilter === 'All' || lead.stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || (lead.aiIntelligence?.priority || 'Medium').toLowerCase() === priorityFilter.toLowerCase();
    const matchesSource = sourceFilter === 'All' || (lead.source || '').toLowerCase() === sourceFilter.toLowerCase();

    return matchesSearch && matchesStage && matchesPriority && matchesSource;
  });

  const getSourceIcon = (source) => {
    switch ((source || '').toLowerCase()) {
      case 'whatsapp': return <MessageSquare size={14} color="#25d366" />;
      case 'website': return <Globe size={14} color="var(--accent-cyan)" />;
      default: return <User size={14} color="var(--accent-purple)" />;
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Executive KPI Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* KPI 1: Total Leads */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Inbound Leads</span>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {analytics.totalLeads || leads.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
            <TrendingUp size={14} />
            <span>100% Captured via AI Pipeline</span>
          </div>
        </div>

        {/* KPI 2: Qualification Rate */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI Qualified Rate</span>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {analytics.qualificationRate || 68}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {analytics.qualifiedCount || 0} Leads in Qualified/Won stages
          </div>
        </div>

        {/* KPI 3: Urgent / High Priority */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Urgent Action Required</span>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {(analytics.priorities?.Urgent || 0) + (analytics.priorities?.High || 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fb7185' }}>
            {analytics.priorities?.Urgent || 0} Urgent • {analytics.priorities?.High || 0} High Priority
          </div>
        </div>

        {/* KPI 4: Response Velocity */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI Processing Latency</span>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            &lt; 1.4s
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
            Instant intent &amp; priority synthesis
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="lead-search-input"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search leads by name, company, problem keywords, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <select
              id="filter-stage"
              className="form-select"
              style={{ width: 'auto', fontSize: '0.82rem' }}
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="All">All Stages</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              id="filter-priority"
              className="form-select"
              style={{ width: 'auto', fontSize: '0.82rem' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              id="filter-source"
              className="form-select"
              style={{ width: 'auto', fontSize: '0.82rem' }}
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="All">All Channels</option>
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="manual">Manual</option>
            </select>

            <button
              id="btn-refresh-leads"
              className="btn btn-secondary btn-icon"
              onClick={onRefresh}
              title="Refresh Leads Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Leads List / Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>
            Inbound Leads &amp; AI Intelligence Queue ({filteredLeads.length})
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click any row to open AI Intelligence Dossier &amp; Follow-up Composer
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={36} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No leads matching your filters</div>
            <div style={{ fontSize: '0.84rem' }}>Try clearing filters or search terms.</div>
          </div>
        ) : (
          <div>
            {filteredLeads.map((lead) => {
              const priority = lead.aiIntelligence?.priority || 'Medium';
              const priorityClass = `badge-priority-${priority.toLowerCase()}`;
              const stageClass = `badge-stage-${lead.stage.toLowerCase()}`;

              return (
                <div
                  key={lead.id}
                  id={`lead-row-${lead.id}`}
                  onClick={() => onSelectLead(lead)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 1.8fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(200px, 2fr) 40px',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Lead Info & Company */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {lead.name}
                      </span>
                      <span className="badge badge-source" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {getSourceIcon(lead.source)}
                        <span>{lead.source}</span>
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {lead.company} • <span style={{ color: 'var(--text-muted)' }}>{lead.email || lead.phone}</span>
                    </div>
                  </div>

                  {/* Priority & Intent */}
                  <div>
                    <span className={`badge ${priorityClass}`} style={{ marginBottom: '0.35rem' }}>
                      {priority}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {lead.aiIntelligence?.intent || 'Commercial Need'}
                    </div>
                  </div>

                  {/* Pipeline Stage */}
                  <div>
                    <span className={`badge ${stageClass}`}>
                      {lead.stage}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {lead.budget || 'Undisclosed'}
                    </div>
                  </div>

                  {/* AI Extracted Problem / Requirement */}
                  <div>
                    <div style={{ 
                      fontSize: '0.84rem', 
                      color: 'var(--text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>AI: </span>
                      {lead.aiIntelligence?.summary || lead.message}
                    </div>
                    {lead.aiIntelligence?.isReviewed && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                        <CheckCircle size={11} /> Follow-up Reviewed
                      </span>
                    )}
                  </div>

                  {/* Action Arrow */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-muted)' }}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
