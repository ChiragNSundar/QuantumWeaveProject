import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PublicLanding from './components/PublicLanding';
import LeadDashboard from './components/LeadDashboard';
import LeadPipeline from './components/LeadPipeline';
import LeadDetailModal from './components/LeadDetailModal';
import CreateLeadModal from './components/CreateLeadModal';
import KnowledgeHub from './components/KnowledgeHub';
import AgentStudio from './components/AgentStudio';
import AutomationHub from './components/AutomationHub';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import WhatsAppWidget from './components/WhatsAppWidget';
import AnalyticsView from './components/AnalyticsView';

import { 
  getLeads, 
  getLead, 
  getAnalytics, 
  getUsers, 
  getCurrentUser 
} from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default: Lead Intelligence Hub
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [whatsAppWidgetOpen, setWhatsAppWidgetOpen] = useState(false);

  // Authentication & Users
  const [currentUser, setCurrentUser] = useState({
    id: 'user-001',
    name: 'Chirag N Sundar',
    email: 'chirag@quantumweave.ai',
    role: 'AI Full-Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });
  const [users, setUsers] = useState([]);

  // Fetch initial leads and analytics
  const refreshData = async () => {
    try {
      setLoading(true);
      const [leadsRes, analyticsRes, usersRes] = await Promise.all([
        getLeads(),
        getAnalytics(),
        getUsers()
      ]);
      setLeads(leadsRes.data || []);
      setAnalytics(analyticsRes.data || {});
      if (usersRes.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSelectLead = async (lead) => {
    try {
      const full = await getLead(lead.id);
      setSelectedLead(full.data);
    } catch (e) {
      setSelectedLead(lead);
    }
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    if (selectedLead && selectedLead.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
    refreshData();
  };

  const handleLeadDeleted = (deletedId) => {
    setLeads(prev => prev.filter(l => l.id !== deletedId));
    if (selectedLead && selectedLead.id === deletedId) {
      setSelectedLead(null);
    }
    refreshData();
  };

  const handleLeadCreated = (newLead) => {
    refreshData();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        onSwitchUser={setCurrentUser}
        onOpenCreateLead={() => setShowCreateLead(true)}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, paddingTop: '1.5rem' }}>
        {activeTab === 'public' && (
          <PublicLanding
            onLeadSubmitted={(newLead) => {
              handleLeadCreated(newLead);
            }}
            onOpenWhatsApp={() => setWhatsAppWidgetOpen(true)}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <LeadDashboard
            leads={leads}
            analytics={analytics}
            onSelectLead={handleSelectLead}
            onRefresh={refreshData}
            loading={loading}
          />
        )}

        {activeTab === 'pipeline' && (
          <LeadPipeline
            leads={leads}
            onSelectLead={handleSelectLead}
            onLeadUpdated={handleLeadUpdated}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeHub />
        )}

        {activeTab === 'agent' && (
          <AgentStudio />
        )}

        {activeTab === 'automations' && (
          <AutomationHub />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppSimulator
            onLeadCreated={refreshData}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            leads={leads}
          />
        )}
      </main>

      {/* Floating WhatsApp Widget on All Views */}
      <WhatsAppWidget
        isOpen={whatsAppWidgetOpen}
        onToggle={() => setWhatsAppWidgetOpen(!whatsAppWidgetOpen)}
        onLeadCreated={refreshData}
      />

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onLeadUpdated={handleLeadUpdated}
          onLeadDeleted={handleLeadDeleted}
          currentUser={currentUser}
        />
      )}

      {showCreateLead && (
        <CreateLeadModal
          onClose={() => setShowCreateLead(false)}
          onLeadCreated={handleLeadCreated}
        />
      )}
    </div>
  );
}
