const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/db');

// Validation middleware
const validateWord = [
  body('word').isString().trim().notEmpty().isLength({ max: 80 }),
  body('explain').isString().trim().notEmpty().isLength({ max: 188 }),
  body('details').optional().isString(),
  body('ai_generated').isBoolean().notEmpty(),
  body('knowledge_base').isString().trim().notEmpty().isLength({ max: 50 }),
];

// Middleware to validate knowledge_base query parameter
const validateKnowledgeBase = [
  query('knowledge_base').isString().trim().notEmpty().isLength({ max: 50 })
];

// Get all words with sorting and limiting
router.get('/', validateKnowledgeBase, [
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
    const { knowledge_base } = req.query;

    let queryText = `
      SELECT id, word, ai_generated, knowledge_base, 
      '0.' || LPAD(FLOOR(random() * 1000)::int::text, 3, '0') AS size 
      FROM words WHERE knowledge_base = $2
    `;

    switch (sort) {
      case 'latest':
        queryText = `
          SELECT id, word, ai_generated, knowledge_base, 
          '0.' || LPAD(FLOOR(random() * 1000)::int::text, 3, '0') AS size 
          FROM words 
          WHERE knowledge_base = $2
          ORDER BY created_at DESC
        `;
        break;
      case 'most-edited':
        queryText = `
          SELECT DISTINCT w.id, w.word, w.ai_generated, w.knowledge_base, 
          '0.' || LPAD(FLOOR(random() * 1000)::int::text, 3, '0') AS size,
          dh.changed_at
          FROM words w 
          LEFT JOIN explain_history dh ON w.id = dh.word_id 
          WHERE w.knowledge_base = $2
          ORDER BY dh.changed_at DESC NULLS LAST
        `;
        break;
      case 'random':
        queryText += ' ORDER BY RANDOM()';
        break;
    }

    queryText += ' LIMIT $1';
    const { rows: words } = await db.query(queryText, [limit, knowledge_base]);
    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get the most recently added word
router.get('/most_recent', validateKnowledgeBase, async (req, res) => {
  const limit = parseInt(req.query.limit) || 1;
  const { knowledge_base } = req.query;
  try {
    const { rows: words } = await db.query(
      'SELECT * FROM words WHERE knowledge_base = $2 ORDER BY created_at DESC LIMIT $1',
      [limit, knowledge_base]
    );
    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a random word that has empty explain
router.get('/random_empty_explain', validateKnowledgeBase, async (req, res) => {
  const { knowledge_base } = req.query;
  try {
    const { rows } = await db.query(
      'SELECT * FROM words WHERE explain = \'\' AND knowledge_base = $1 ORDER BY RANDOM() LIMIT 1',
      [knowledge_base]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single word by ID
router.get('/:id', validateKnowledgeBase, async (req, res) => {
  const { id } = req.params;
  const { knowledge_base } = req.query;
  try {
    const { rows } = await db.query(
      'SELECT id, word, explain, edit_since_embedding, ai_generated, knowledge_base, created_at, details FROM words WHERE id = $1 AND knowledge_base = $2',
      [id, knowledge_base]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get explain history
router.get('/:id/history', validateKnowledgeBase, async (req, res) => {
  const { id } = req.params;
  const { knowledge_base } = req.query;
  const history = await db.query(
    `SELECT * FROM explain_history 
     WHERE word_id = $1 AND old_explain != '' 
     AND EXISTS (SELECT 1 FROM words WHERE id = $1 AND knowledge_base = $2)
     ORDER BY changed_at DESC LIMIT 3`,
    [id, knowledge_base]
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
    const { word, explain, details, ai_generated, knowledge_base } = req.body;
    const result = await db.query(
      'INSERT INTO words (word, explain, details, ai_generated, edit_since_embedding, knowledge_base) VALUES ($1, $2, $3, $4, -1, $5) RETURNING id',
      [word, explain, details, ai_generated, knowledge_base]
    );

    const newWord = await db.query('SELECT * FROM words WHERE id = $1', [result.rows[0].id]);
    res.status(201).json(newWord.rows[0]);
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
  const validationRules = [
    body('knowledge_base').isString().trim().notEmpty().isLength({ max: 50 })
  ];

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
    const { word, explain, details, ai_generated, knowledge_base } = req.body;

    const { rows } = await db.query('SELECT * FROM words WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    } else if (knowledge_base !== rows[0].knowledge_base) {
      return res.status(400).json({ error: 'Knowledge base cannot be changed' });
    }

    const currentWord = rows[0];
    const newWord = word !== undefined ? word : currentWord.word;
    const newExplain = explain !== undefined ? explain : currentWord.explain;
    const newDetails = details !== undefined ? details : currentWord.details;
    const newAiGenerated = ai_generated !== undefined ? ai_generated : currentWord.ai_generated;

    const newPineconeStatus = currentWord.explain !== newExplain
      ? Math.max(1, currentWord.edit_since_embedding + 1)
      : currentWord.edit_since_embedding;

    if (currentWord.explain !== newExplain) {
      await db.query(
        'INSERT INTO explain_history (word_id, old_explain) VALUES ($1, $2)',
        [id, currentWord.explain]
      );
    }

    await db.query(
      'UPDATE words SET word = $1, explain = $2, details = $3, ai_generated = $4, edit_since_embedding = $5, knowledge_base = $6 WHERE id = $7',
      [newWord, newExplain, newDetails, newAiGenerated, newPineconeStatus, knowledge_base, id]
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
    const { rows } = await db.query('SELECT * FROM words WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }

    await db.query('DELETE FROM words WHERE id = $1', [id]);
    res.json({ message: 'Word deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
