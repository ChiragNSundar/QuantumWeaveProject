const express = require('express');
const router = express.Router();
const db = require('../db/database');
const ragService = require('../services/ragService');

// GET /api/knowledge/documents - List all knowledge base documents & chunk stats
router.get('/documents', (req, res) => {
  try {
    const docs = db.getKnowledgeDocs();
    const stats = {
      totalDocuments: docs.length,
      totalChunks: ragService.chunks.length,
      vocabularySize: ragService.vocabulary.size,
      categories: [...new Set(docs.map(d => d.category))]
    };
    res.json({ success: true, stats, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/knowledge/documents/:id - Get single document
router.get('/documents/:id', (req, res) => {
  try {
    const doc = db.getKnowledgeDocById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    const docChunks = ragService.chunks.filter(c => c.docId === doc.id);
    res.json({ success: true, data: doc, chunks: docChunks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/knowledge/documents - Create new knowledge document & trigger re-indexing
router.post('/documents', (req, res) => {
  try {
    const { title, category, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const newDoc = db.createKnowledgeDoc({ title, category, content });
    ragService.indexKnowledgeBase();

    res.status(201).json({
      success: true,
      message: 'Knowledge document added and RAG vector store re-indexed',
      data: newDoc
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/knowledge/documents/:id - Update knowledge document
router.patch('/documents/:id', (req, res) => {
  try {
    const updated = db.updateKnowledgeDoc(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    ragService.indexKnowledgeBase();
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/knowledge/documents/:id - Delete knowledge document
router.delete('/documents/:id', (req, res) => {
  try {
    const deleted = db.deleteKnowledgeDoc(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    ragService.indexKnowledgeBase();
    res.json({ success: true, message: 'Document deleted and RAG index updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/knowledge/query - RAG retrieval & question answering endpoint
router.post('/query', async (req, res) => {
  try {
    const { query, topK = 3 } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const answerResult = await ragService.answerQuestion(query);
    res.json({ success: true, data: answerResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
