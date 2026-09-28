import React, { useState } from 'react';
import { 
  Cpu, 
  LayoutDashboard, 
  Kanban, 
  BookOpen, 
  Bot, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  Plus, 
  ChevronDown,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  users = [], 
  onSwitchUser, 
  onOpenCreateLead 
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const tabs = [
    { id: 'public', label: 'Public Portal', icon: Globe },
    { id: 'dashboard', label: 'Lead Intelligence', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Board', icon: Kanban },
    { id: 'knowledge', label: 'RAG Knowledge', icon: BookOpen },
    { id: 'agent', label: 'AI Agent Studio', icon: Bot },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'whatsapp', label: 'WhatsApp Lab', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="navbar-header">
      {/* Brand & Venture Identity */}
      <div className="brand-badge" onClick={() => setActiveTab('dashboard')}>
        <div className="brand-icon-box">
          <Cpu size={22} />
        </div>
        <div>
          <div className="brand-title">QUANTUM WEAVE</div>
          <div className="brand-subtitle">BrandMint AI • Intelligence System</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Controls & User Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          id="btn-create-lead-nav"
          className="btn btn-primary btn-sm"
          onClick={onOpenCreateLead}
        >
          <Plus size={15} />
          <span>New Lead</span>
        </button>

        {/* User Profile Switcher */}
        <div style={{ position: 'relative' }}>
          <div 
            id="user-profile-menu-btn"
            className="user-profile-badge"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <div className="live-indicator" title="Connected to Intelligence API" />
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
              alt={currentUser?.name} 
              className="user-avatar-sm"
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser?.name || "Chirag N Sundar"}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
                {currentUser?.role?.split('&')[0] || "AI Engineer"}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Switcher Dropdown */}
          {userDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '260px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-highlight)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 150
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Switch Active Role / User
              </div>
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u);
                    setUserDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: u.id === currentUser?.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = u.id === currentUser?.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{u.role}</div>
                    </div>
                  </div>
                  {u.id === currentUser?.id && <CheckCircle2 size={16} color="#6366f1" />}
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.4rem', paddingTop: '0.4rem', paddingLeft: '0.75rem', paddingRight: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={13} color="var(--accent-emerald)" />
                <span>Internal Team Session</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
