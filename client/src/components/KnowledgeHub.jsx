import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Layers, 
  Database,
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { getKnowledgeDocs, queryKnowledge, createKnowledgeDoc } from '../api/client';

export default function KnowledgeHub() {
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // RAG Search State
  const [ragQuery, setRagQuery] = useState('');
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResult, setRagResult] = useState(null);

  // Create Doc Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('services');
  const [newContent, setNewContent] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const sampleQueries = [
    "What are Quantum Weave's pricing tiers and starter sprint costs?",
    "How long does implementation take from discovery to production?",
    "What security standards and data privacy policies do you support?",
    "Can an AI employee integrate with WhatsApp and call custom APIs?",
    "What is the capital of Mars?" // Guardrail test
  ];

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await getKnowledgeDocs();
      setDocs(res.data || []);
      setStats(res.stats || null);
      if (res.data?.length > 0 && !selectedDoc) {
        setSelectedDoc(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load knowledge docs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleRunRAG = async (queryText) => {
    const q = queryText || ragQuery;
    if (!q.trim()) return;

    setRagLoading(true);
    try {
      const res = await queryKnowledge(q);
      setRagResult(res.data);
    } catch (err) {
      console.error('RAG query failed:', err);
    } finally {
      setRagLoading(false);
    }
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setCreateLoading(true);
    try {
      await createKnowledgeDoc({
        title: newTitle,
        category: newCategory,
        content: newContent
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      await loadDocs();
    } catch (err) {
      console.error('Failed to create doc:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Title & Stats */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Database size={15} />
            <span>Task 4: Grounded Business RAG Knowledge Base</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Enterprise Knowledge Assistant &amp; Vector Store
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Semantic vector embeddings and chunk-level retrieval ensure answers cite verified business facts with zero hallucination.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} />
          <span>Add Knowledge Document</span>
        </button>
      </div>

      {/* RAG Metrics Row */}
      {stats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Indexed Documents</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalDocuments}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Semantic Vector Chunks</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats.totalChunks}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Lexical Term Vocabulary</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{stats.vocabularySize} tokens</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Retrieval Guardrail</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.35rem' }}>
              Cosine &gt; 0.15 Required
            </div>
          </div>
        </div>
      )}

      {/* Interactive RAG Playground */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Interactive RAG Retrieval &amp; Question Answering Lab
          </h3>
        </div>

        {/* Preset Query Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Test Queries:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              onClick={() => {
                setRagQuery(sq);
                handleRunRAG(sq);
              }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="rag-query-input"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Ask any question about Quantum Weave services, pricing, timelines, or architectures..."
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunRAG()}
            />
          </div>
          <button
            id="btn-run-rag"
            className="btn btn-primary"
            onClick={() => handleRunRAG()}
            disabled={ragLoading}
          >
            <span>{ragLoading ? 'Retrieving Chunks...' : 'Query Knowledge'}</span>
          </button>
        </div>

        {/* RAG Answer Display */}
        {ragResult && (
          <div style={{
            background: ragResult.hasDirectAnswer ? 'rgba(99, 102, 241, 0.08)' : 'rgba(244, 63, 94, 0.08)',
            border: `1px solid ${ragResult.hasDirectAnswer ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            animation: 'modalIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {ragResult.hasDirectAnswer ? (
                  <CheckCircle size={16} color="var(--accent-emerald)" />
                ) : (
                  <ShieldAlert size={16} color="var(--accent-rose)" />
                )}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: ragResult.hasDirectAnswer ? 'var(--accent-cyan)' : 'var(--accent-rose)' }}>
                  {ragResult.hasDirectAnswer ? 'Grounded AI Synthesized Response' : 'Hallucination Guardrail Active (Out of Domain)'}
                </span>
              </div>
              <span className={`badge ${ragResult.confidence === 'high' ? 'badge-priority-urgent' : (ragResult.confidence === 'medium' ? 'badge-priority-high' : 'badge-priority-low')}`} style={{ fontSize: '0.7rem' }}>
                Confidence: {ragResult.confidence}
              </span>
            </div>

            <div style={{ 
              fontSize: '0.95rem', 
              color: 'var(--text-primary)', 
              lineHeight: 1.6, 
              whiteSpace: 'pre-wrap',
              marginBottom: '1.25rem' 
            }}>
              {ragResult.answer}
            </div>

            {/* Citations & Source Chunks */}
            {ragResult.sources && ragResult.sources.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Retrieved Vector Chunks &amp; Cosine Relevance Scores ({ragResult.sources.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {ragResult.sources.map((src, sIdx) => (
                    <div 
                      key={sIdx} 
                      style={{ 
                        background: 'var(--bg-card)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '0.85rem' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {src.docTitle}
                        </span>
                        <span className="badge badge-priority-medium" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                          Score: {(src.relevanceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45, fontStyle: 'italic' }}>
                        "{src.content.length > 180 ? src.content.substring(0, 177) + '...' : src.content}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Documents Browser */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(350px, 2fr)', gap: '1.5rem' }}>
        {/* Left: Document List */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '1rem' }}>
            Knowledge Documents ({docs.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {docs.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                    {doc.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span className="badge badge-source" style={{ textTransform: 'capitalize' }}>{doc.category}</span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Document Content Preview */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          {selectedDoc ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedDoc.title}</h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Category: {selectedDoc.category}
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setRagQuery(`Tell me about ${selectedDoc.title}`);
                    handleRunRAG(`Tell me about ${selectedDoc.title}`);
                  }}
                >
                  <Search size={13} />
                  <span>Test RAG on Doc</span>
                </button>
              </div>

              <div style={{
                background: 'rgba(8, 12, 20, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}>
                {selectedDoc.content}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Select a document to view content
            </div>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Knowledge Base Document</h3>
              <button className="btn btn-secondary btn-icon" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateDoc}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Document Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Service Level Agreements & Uptime Guarantees"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="services">Services &amp; Capabilities</option>
                    <option value="pricing">Pricing &amp; Engagements</option>
                    <option value="technical">Technical Architecture &amp; RAG</option>
                    <option value="sla">SLA &amp; Compliance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Content *</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="Paste full text, policies, service descriptions, or pricing breakdown..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={createLoading} className="btn btn-primary">
                  {createLoading ? 'Indexing Chunks...' : 'Save & Re-Index RAG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
