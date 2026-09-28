import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  Globe, 
  User, 
  DollarSign, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { updateLeadStage } from '../api/client';

export default function LeadPipeline({ 
  leads = [], 
  onSelectLead, 
  onLeadUpdated,
  currentUser 
}) {
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredLeads = leads.filter(l => 
    priorityFilter === 'All' || (l.aiIntelligence?.priority || 'Medium').toLowerCase() === priorityFilter.toLowerCase()
  );

  const getSourceIcon = (source) => {
    switch ((source || '').toLowerCase()) {
      case 'whatsapp': return <MessageSquare size={13} color="#25d366" />;
      case 'website': return <Globe size={13} color="var(--accent-cyan)" />;
      default: return <User size={13} color="var(--accent-purple)" />;
    }
  };

  const handleStageMove = async (e, lead, direction) => {
    e.stopPropagation();
    const currentIndex = stages.indexOf(lead.stage);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (targetIndex >= 0 && targetIndex < stages.length) {
      const newStage = stages[targetIndex];
      try {
        const res = await updateLeadStage(lead.id, newStage, currentUser?.name || 'Chirag N Sundar');
        if (onLeadUpdated) onLeadUpdated(res.data);
      } catch (err) {
        console.error('Failed to move stage:', err);
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header and Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>
            Lead Pipeline &amp; Conversion Kanban
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
            Manage lead progression through qualification stages. AI priority tagging helps focus on high-impact deals first.
          </p>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filter Priority:</span>
          <select
            className="form-select"
            style={{ width: 'auto', fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="kanban-board">
        {stages.map((stageName, sIdx) => {
          const stageLeads = filteredLeads.filter(l => l.stage.toLowerCase() === stageName.toLowerCase());
          const stageBadgeClass = `badge-stage-${stageName.toLowerCase()}`;

          return (
            <div key={stageName} className="kanban-column">
              {/* Column Header */}
              <div className="kanban-column-header">
                <div className="kanban-column-title">
                  <span className={`badge ${stageBadgeClass}`}>{stageName}</span>
                </div>
                <span style={{ 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {stageLeads.length === 0 ? (
                  <div style={{ 
                    padding: '2.5rem 1rem', 
                    textAlign: 'center', 
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '0.5rem'
                  }}>
                    No leads in {stageName}
                  </div>
                ) : (
                  stageLeads.map(lead => {
                    const priority = lead.aiIntelligence?.priority || 'Medium';
                    const priorityClass = `badge-priority-${priority.toLowerCase()}`;
                    const currentIndex = stages.indexOf(lead.stage);

                    return (
                      <div
                        key={lead.id}
                        id={`kanban-card-${lead.id}`}
                        className="kanban-card"
                        onClick={() => onSelectLead(lead)}
                      >
                        {/* Top: Priority & Source */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span className={`badge ${priorityClass}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                            {priority}
                          </span>
                          <span className="badge badge-source" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.68rem' }}>
                            {getSourceIcon(lead.source)}
                            <span>{lead.source}</span>
                          </span>
                        </div>

                        {/* Company & Name */}
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                          {lead.company}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                          {lead.name}
                        </div>

                        {/* AI Extracted Problem Snippet */}
                        <div style={{ 
                          fontSize: '0.76rem', 
                          color: 'var(--text-muted)', 
                          marginBottom: '0.85rem',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {lead.aiIntelligence?.problem || lead.message}
                        </div>

                        {/* Bottom: Stage Move Controls */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '0.65rem',
                          marginTop: 'auto'
                        }}>
                          <button
                            disabled={currentIndex === 0}
                            onClick={(e) => handleStageMove(e, lead, 'prev')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: currentIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : 'var(--text-muted)',
                              cursor: currentIndex === 0 ? 'default' : 'pointer',
                              padding: '0.2rem',
                              borderRadius: '4px'
                            }}
                            title="Move to previous stage"
                          >
                            <ChevronLeft size={16} />
                          </button>

                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {lead.budget || 'Undisclosed'}
                          </span>

                          <button
                            disabled={currentIndex === stages.length - 1}
                            onClick={(e) => handleStageMove(e, lead, 'next')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: currentIndex === stages.length - 1 ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent-cyan)',
                              cursor: currentIndex === stages.length - 1 ? 'default' : 'pointer',
                              padding: '0.2rem',
                              borderRadius: '4px'
                            }}
                            title="Advance to next stage"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
