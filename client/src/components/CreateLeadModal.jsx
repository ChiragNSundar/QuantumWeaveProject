import React, { useState } from 'react';
import { X, Plus, Sparkles, UserPlus } from 'lucide-react';
import { createLead } from '../api/client';

export default function CreateLeadModal({ onClose, onLeadCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Autonomous AI Employee',
    budget: '$8,000 - $15,000',
    message: '',
    runAutomation: true
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.email && !formData.message) {
      setErrorMsg('Please provide at least a name, email, or enquiry description.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await createLead(formData, formData.runAutomation);
      if (onLeadCreated) onLeadCreated(res.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <UserPlus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Inbound Lead</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Manually record a prospect or referral
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1rem',
                color: '#f87171',
                fontSize: '0.84rem',
                marginBottom: '1rem'
              }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Tech"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Requested Service</label>
                <select
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="Autonomous AI Employee">Autonomous AI Employee</option>
                  <option value="Enterprise Knowledge Systems & RAG">Enterprise Knowledge (RAG)</option>
                  <option value="Custom Business Workflow Automation">Workflow Automation</option>
                  <option value="Full-Stack AI Application Engineering">Full-Stack AI Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Budget Tier</label>
                <select
                  className="form-select"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="< $3,500">&lt; $3,500 (Starter)</option>
                  <option value="$5,000 - $8,000">$5,000 - $8,000</option>
                  <option value="$8,000 - $15,000">$8,000 - $15,000 (Growth)</option>
                  <option value="$15,000+">$15,000+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Enquiry Notes / Requirements</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="What is the customer's operational problem or requirements?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <input
                id="run-automation-checkbox"
                type="checkbox"
                checked={formData.runAutomation}
                onChange={(e) => setFormData({ ...formData, runAutomation: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="run-automation-checkbox" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <strong>Run AI Lead Intelligence Pipeline:</strong> Auto-qualify intent, assign priority score, and draft follow-up immediately.
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Plus size={16} />
              <span>{loading ? 'Creating...' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
