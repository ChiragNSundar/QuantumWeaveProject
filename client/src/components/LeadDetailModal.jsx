import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  Edit3, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  ShieldAlert, 
  User, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  updateLeadStage, 
  analyzeLead, 
  approveFollowUp, 
  addLeadActivity, 
  deleteLead 
} from '../api/client';

export default function LeadDetailModal({ 
  lead, 
  onClose, 
  onLeadUpdated, 
  onLeadDeleted,
  currentUser 
}) {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence' | 'timeline' | 'notes'
  const [stage, setStage] = useState(lead.stage || 'New');
  const [draftFollowUp, setDraftFollowUp] = useState(lead.aiIntelligence?.suggestedFollowUp || '');
  const [dispatchChannel, setDispatchChannel] = useState(lead.source === 'whatsapp' ? 'whatsapp' : 'email');
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
  const ai = lead.aiIntelligence || {};
  const activities = lead.activities || [];

  const handleStageChange = async (newStage) => {
    setStage(newStage);
    try {
      const res = await updateLeadStage(lead.id, newStage, currentUser?.name || 'Chirag N Sundar');
      if (onLeadUpdated) onLeadUpdated(res.data);
      setActionSuccessMsg(`Stage updated to ${newStage}`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleReAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeLead(lead.id);
      if (onLeadUpdated) onLeadUpdated(res.data);
      if (res.analysis?.suggestedFollowUp) {
        setDraftFollowUp(res.analysis.suggestedFollowUp);
      }
      setActionSuccessMsg('AI Intelligence re-evaluated successfully');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApproveFollowUp = async () => {
    try {
      const res = await approveFollowUp(lead.id, draftFollowUp, dispatchChannel);
      if (onLeadUpdated) onLeadUpdated(res.data);
      setIsEditingDraft(false);
      setActionSuccessMsg(`Follow-up approved & dispatched via ${dispatchChannel.toUpperCase()}`);
      setTimeout(() => setActionSuccessMsg(''), 3500);
    } catch (err) {
      console.error('Follow-up dispatch failed:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addLeadActivity(lead.id, {
        title: 'Team Internal Note',
        description: newNote,
        type: 'note_added',
        actor: currentUser?.name || 'user'
      });
      setNewNote('');
      setActionSuccessMsg('Note appended to timeline');
      setTimeout(() => setActionSuccessMsg(''), 3000);
      if (onLeadUpdated) {
        // Trigger reload
        onLeadUpdated({ ...lead });
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete lead for ${lead.company}?`)) {
      try {
        await deleteLead(lead.id);
        if (onLeadDeleted) onLeadDeleted(lead.id);
        onClose();
      } catch (err) {
        console.error('Failed to delete lead:', err);
      }
    }
  };

  const priorityClass = `badge-priority-${(ai.priority || 'medium').toLowerCase()}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '880px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{lead.name}</h2>
              <span className={`badge ${priorityClass}`}>{ai.priority || 'Medium'} Priority</span>
              <span className="badge badge-source">{lead.source}</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {lead.company} • Created {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Stage Selector */}
            <select
              id="lead-detail-stage-select"
              className="form-select"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
              value={stage}
              onChange={(e) => handleStageChange(e.target.value)}
            >
              {stages.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button 
              className="btn btn-secondary btn-icon"
              onClick={onClose}
              title="Close Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action success alert banner */}
        {actionSuccessMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '0.65rem 1.75rem',
            color: '#34d399',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={15} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Modal Subtabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)', 
          padding: '0 1.75rem',
          background: 'rgba(10, 16, 29, 0.5)'
        }}>
          <button
            className={`nav-tab-btn ${activeTab === 'intelligence' ? 'active' : ''}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'intelligence' ? '2px solid var(--accent-primary)' : 'none', padding: '0.75rem 1rem' }}
            onClick={() => setActiveTab('intelligence')}
          >
            <Sparkles size={15} />
            <span>AI Lead Intelligence</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'timeline' ? '2px solid var(--accent-primary)' : 'none', padding: '0.75rem 1rem' }}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock size={15} />
            <span>Activity Timeline ({activities.length})</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'contact' ? '2px solid var(--accent-primary)' : 'none', padding: '0.75rem 1rem' }}
            onClick={() => setActiveTab('contact')}
          >
            <Building size={15} />
            <span>Contact &amp; Enquiry Details</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body">
          {activeTab === 'intelligence' && (
            <div>
              {/* Executive Summary Card */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Sparkles size={14} />
                    <span>Executive AI Summary</span>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
                    onClick={handleReAnalyze}
                    disabled={analyzing}
                  >
                    <RefreshCw size={12} className={analyzing ? 'animate-spin' : ''} />
                    <span>{analyzing ? 'Analyzing...' : 'Re-Run AI'}</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                  {ai.summary || 'AI analysis pending...'}
                </p>
              </div>

              {/* Problem & Recommended Solution Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* Extracted Problem */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Identified Operational Problem
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {ai.problem || 'Not specified'}
                  </div>
                </div>

                {/* Suggested Service */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Suggested Quantum Weave Service
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ai.suggestedService || lead.service}
                  </div>
                </div>

                {/* Intent & Priority Reason */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Commercial Intent &amp; Reason
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    <strong>{ai.intent || 'Mid-Market'}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {ai.priorityReason}
                  </div>
                </div>

                {/* Recommended Next Action */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Recommended Next Action
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {ai.recommendedNextAction || 'Conduct initial discovery call.'}
                  </div>
                </div>
              </div>

              {/* Human-in-the-loop Follow-Up Composer */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-highlight)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                      AI-Generated Follow-Up Draft
                    </span>
                    {ai.isReviewed ? (
                      <span className="badge badge-stage-won" style={{ fontSize: '0.68rem' }}>
                        <CheckCircle size={10} /> Approved
                      </span>
                    ) : (
                      <span className="badge badge-priority-urgent" style={{ fontSize: '0.68rem' }}>
                        Pending Human Review
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '0.2rem' }}>
                      <button
                        className={`btn btn-sm ${dispatchChannel === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => setDispatchChannel('email')}
                      >
                        <Mail size={12} /> Email
                      </button>
                      <button
                        className={`btn btn-sm ${dispatchChannel === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => setDispatchChannel('whatsapp')}
                      >
                        <MessageSquare size={12} /> WhatsApp
                      </button>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                    >
                      <Edit3 size={13} />
                      <span>{isEditingDraft ? 'Preview' : 'Edit'}</span>
                    </button>
                  </div>
                </div>

                {isEditingDraft ? (
                  <textarea
                    id="draft-followup-editor"
                    className="form-textarea"
                    rows={7}
                    style={{ fontSize: '0.86rem', lineHeight: 1.5, fontFamily: 'inherit' }}
                    value={draftFollowUp}
                    onChange={(e) => setDraftFollowUp(e.target.value)}
                  />
                ) : (
                  <div style={{
                    background: 'rgba(8, 12, 20, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.55,
                    marginBottom: '1rem'
                  }}>
                    {draftFollowUp || 'No draft follow-up generated.'}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button
                    id="btn-approve-followup"
                    className="btn btn-primary btn-sm"
                    onClick={handleApproveFollowUp}
                  >
                    <Send size={14} />
                    <span>Approve &amp; Dispatch via {dispatchChannel.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add an internal note or update about this lead..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                    Add Note
                  </button>
                </form>
              </div>

              <div className="timeline">
                {activities.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No activity history recorded.</div>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {act.title}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(act.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', whiteSpace: 'pre-wrap' }}>
                        {act.description}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                        Logged by: {act.actor}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Customer Profile
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <User size={15} color="var(--accent-primary)" />
                    <span><strong>Name:</strong> {lead.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Building size={15} color="var(--accent-primary)" />
                    <span><strong>Company:</strong> {lead.company}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Mail size={15} color="var(--accent-primary)" />
                    <span><strong>Email:</strong> {lead.email || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Phone size={15} color="var(--accent-primary)" />
                    <span><strong>Phone:</strong> {lead.phone || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={15} color="var(--accent-primary)" />
                    <span><strong>Budget:</strong> {lead.budget || 'Undisclosed'}</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Original Inbound Message
                </h4>
                <div style={{
                  background: 'rgba(8, 12, 20, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5
                }}>
                  {lead.message || 'No enquiry message text.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            onClick={handleDelete}
          >
            <Trash2 size={14} />
            <span>Delete Lead</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
