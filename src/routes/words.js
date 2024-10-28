const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/db');

// Validation middleware
const validateWord = [
  body('word').isString().trim().notEmpty().isLength({ max: 80 }), // Updated max length to match schema
  body('explain').isString().trim().notEmpty().isLength({ max: 188 }), // Updated max length to match schema
  body('details').optional().isString(),
  body('ai_generated').isBoolean().notEmpty(),
];

// Get all words with sorting and limiting
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 20 }).toInt(),
  query('sort').optional().isIn(['most-edited', 'latest', 'random']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const limit = req.query.limit || 10;
    const sort = req.query.sort || 'latest';

    let query = `
      SELECT id, word, 
      ROUND(CAST(0.5 + (RANDOM() * 0.5) AS numeric), 2) AS size 
      FROM words
    `;

    switch (sort) {
      case 'most-edited':
        query = `
          SELECT id, word, size FROM (
            SELECT DISTINCT ON (w.id) w.id, w.word, 
            ROUND(CAST(0.5 + (RANDOM() * 0.5) AS numeric), 2) AS size,
            dh.changed_at
            FROM words w 
            LEFT JOIN explain_history dh ON w.id = dh.word_id 
            ORDER BY w.id, dh.changed_at DESC NULLS LAST
          ) subquery
          ORDER BY changed_at DESC NULLS LAST
          `;
        break;
      case 'latest':
        query += ' ORDER BY created_at DESC';
        break;
      case 'random':
        query += ' ORDER BY RANDOM()';
        break;
    }

    query += ' LIMIT $1';
    const words = await db.query(query, [limit]);
    res.json(words.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get the most recently added word
router.get('/most_recent', async (req, res) => {
  const limit = parseInt(req.query.limit) || 1;
  const words = await db.query('SELECT * FROM words ORDER BY created_at DESC LIMIT $1', [limit]);
  res.json(words.rows);
});

// Get a random word that has empty explain
router.get('/random_empty_explain', async (req, res) => {
  const word = await db.query('SELECT * FROM words WHERE explain = \'\' ORDER BY RANDOM() LIMIT 1');
  res.json(word.rows[0]);
});

// Get single word by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const word = await db.query('SELECT * FROM words WHERE id = $1', [id]);

    if (word.rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json(word.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get explain history
router.get('/:id/history', async (req, res) => {
  const { id } = req.params;
  const history = await db.query(
    `SELECT * FROM explain_history 
     WHERE word_id = $1 AND old_explain != '' 
     ORDER BY changed_at DESC LIMIT 3`,
    [id]
  );
  res.json(history.rows);
});

// Add a word
router.post('/', validateWord, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { word, explain, details, ai_generated } = req.body;
    const result = await db.query(
      'INSERT INTO words (word, explain, details, ai_generated, pinecone_status) VALUES ($1, $2, $3, $4, -1) RETURNING *',
      [word, explain, details, ai_generated]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.message.includes('duplicate key value violates unique constraint')) {
      res.status(400).json({ error: 'Word already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Update word by ID
router.put('/:id', async (req, res) => {
  // Perform conditional validation
  const validationRules = [];
  if (req.body.word !== undefined) {
    validationRules.push(body('word').isString().trim().notEmpty().isLength({ max: 80 }));
  }
  if (req.body.explain !== undefined) {
    validationRules.push(body('explain').isString().trim().notEmpty().isLength({ max: 188 }));
  }
  if (req.body.details !== undefined) {
    validationRules.push(body('details').optional().isString());
  }
  if (req.body.ai_generated !== undefined) {
    validationRules.push(body('ai_generated').isBoolean());
  }

  await Promise.all(validationRules.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { word, explain, details, ai_generated } = req.body;

    // Get current word data
    const currentWord = await db.query('SELECT * FROM words WHERE id = $1', [id]);
    if (currentWord.rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }

    // Determine new values, falling back to current values if not provided
    const newWord = word !== undefined ? word : currentWord.rows[0].word;
    const newExplain = explain !== undefined ? explain : currentWord.rows[0].explain;
    const newDetails = details !== undefined ? details : currentWord.rows[0].details;
    const newAiGenerated = ai_generated !== undefined ? ai_generated : currentWord.rows[0].ai_generated;

    // Increment pinecone_status if explain changed
    const newPineconeStatus = currentWord.rows[0].explain !== newExplain
      ? Math.max(1, currentWord.rows[0].pinecone_status + 1)
      : currentWord.rows[0].pinecone_status;

    // Store old explain in history if it changed
    if (currentWord.rows[0].explain !== newExplain) {
      await db.query(
        'INSERT INTO explain_history (word_id, old_explain) VALUES ($1, $2)',
        [id, currentWord.rows[0].explain]
      );
    }

    // Update word
    await db.query(
      'UPDATE words SET word = $1, explain = $2, details = $3, ai_generated = $4, pinecone_status = $5 WHERE id = $6 RETURNING *',
      [newWord, newExplain, newDetails, newAiGenerated, newPineconeStatus, id]
    );

    const updatedWord = await db.query('SELECT * FROM words WHERE id = $1', [id]);
    res.json(updatedWord.rows[0]);
  } catch (err) {
    if (err.message.includes('duplicate key value violates unique constraint')) {
      res.status(400).json({ error: 'Word already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Delete a word
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const word = await db.query('SELECT * FROM words WHERE id = $1', [id]);

    if (word.rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }

    await db.query('DELETE FROM words WHERE id = $1', [id]);
    res.json({ message: 'Word deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add word relationship TODO: bi-directional
router.post('/:id/related/:relatedId',
  [
    param('id').isInt(),
    param('relatedId').isInt(),
    body('correlation').isFloat({ min: 0, max: 1 })
  ],
  async (req, res) => {
    try {
      const { id, relatedId } = req.params;
      const { correlation } = req.body;

      const result = await db.query(
        'INSERT INTO related_words (word_id, related_word_id, correlation) VALUES ($1, $2, $3) RETURNING *',
        [id, relatedId, correlation]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.message.includes('duplicate key value violates unique constraint')) {
        res.status(400).json({ error: 'Relationship already exists' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  });

module.exports = router;
