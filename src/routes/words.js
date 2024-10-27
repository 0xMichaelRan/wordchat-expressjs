const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/db');

// Validation middleware
const validateWord = [
  body('word').isString().trim().notEmpty().isLength({ max: 100 }),
  body('explain').isString().trim().notEmpty(),
  body('details').optional().isString(),
];

// Get all words with sorting and limiting
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 20 }).toInt(),
  query('sort').optional().isIn(['hottest', 'latest', 'popular', 'random']),
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
      '0.' || substr('000' || abs(random()) % 1000, -3, 3) AS size 
      FROM words
    `;

    switch (sort) {
      case 'latest':
        query = `
          SELECT id, word, 
          '0.' || substr('000' || abs(random()) % 1000, -3, 3) AS size 
          FROM words 
          ORDER BY created_at DESC
        `;
        break;
      case 'hottest':
        query = `
          SELECT DISTINCT w.id, w.word, 
          '0.' || substr('000' || abs(random()) % 1000, -3, 3) AS size 
          FROM words w 
          LEFT JOIN explain_history dh ON w.id = dh.word_id 
          ORDER BY dh.changed_at DESC NULLS LAST
        `;
        break;
      case 'popular':
        query = `
          SELECT w.id, w.word, 
          '0.' || substr('000' || abs(random()) % 1000, -3, 3) AS size, 
          COUNT(rw.related_word_id) as popularity 
          FROM words w 
          LEFT JOIN related_words rw ON w.id = rw.word_id 
          GROUP BY w.id 
          ORDER BY popularity DESC
        `;
        break;
      case 'random':
        query += ' ORDER BY RANDOM()';
        break;
    }

    query += ' LIMIT ?';
    const words = await db.all(query, [limit]);
    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get the most recently added word
router.get('/most_recent', async (req, res) => {
  const limit = parseInt(req.query.limit) || 1;
  const words = await db.all('SELECT * FROM words ORDER BY created_at DESC LIMIT ?', [limit]);
  res.json(words);
});

// Get a random word that has empty explain
router.get('/random_empty_explain', async (req, res) => {
  const word = await db.get('SELECT * FROM words WHERE explain IS \'\' ORDER BY RANDOM() LIMIT 1');
  res.json(word);
});

// Get single word by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const word = await db.get('SELECT * FROM words WHERE id = ?', [id]);

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    // Return only the word details
    res.json(word);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get explain history
router.get('/:id/history', async (req, res) => {
  const { id } = req.params;
  const history = await db.all(
    `SELECT * FROM explain_history 
     WHERE word_id = ? AND previous_explain != '' 
     ORDER BY changed_at DESC LIMIT 3`,
    [id]
  );
  res.json(history);
});

// Add a word
router.post('/', validateWord, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { word, explain, details } = req.body;
    const result = await db.run(
      'INSERT INTO words (word, explain, details) VALUES (?, ?, ?)',
      [word, explain, details]
    );

    const newWord = await db.get('SELECT * FROM words WHERE id = ?', [result.lastID]);
    res.status(201).json(newWord);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
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
    validationRules.push(body('word').isString().trim().notEmpty().isLength({ max: 100 }));
  }
  if (req.body.explain !== undefined) {
    validationRules.push(body('explain').isString().trim().notEmpty());
  }
  if (req.body.details !== undefined) {
    validationRules.push(body('details').optional().isString());
  }

  await Promise.all(validationRules.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { word, explain, details } = req.body;

    console.log("word", word);
    console.log("explain", explain);
    console.log("details", details);

    // Get current word data
    const currentWord = await db.get('SELECT * FROM words WHERE id = ?', [id]);
    if (!currentWord) {
      return res.status(404).json({ error: 'Word not found' });
    }

    // Determine new values, falling back to current values if not provided
    const newWord = word !== undefined ? word : currentWord.word;
    const newExplain = explain !== undefined ? explain : currentWord.explain;
    const newDetails = details !== undefined ? details : currentWord.details;

    // Store old explain in history if it changed
    if (currentWord.explain !== newExplain) {
      await db.run(
        'INSERT INTO explain_history (word_id, previous_explain) VALUES (?, ?)',
        [id, currentWord.explain]
      );
    }

    // Update word
    await db.run(
      'UPDATE words SET word = ?, explain = ?, details = ? WHERE id = ?',
      [newWord, newExplain, newDetails, id]
    );

    const updatedWord = await db.get('SELECT * FROM words WHERE id = ?', [id]);
    res.json(updatedWord);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
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
    const word = await db.get('SELECT * FROM words WHERE id = ?', [id]);

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    await db.run('DELETE FROM words WHERE id = ?', [id]);
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

      const result = await db.run(
        'INSERT INTO related_words (word_id, related_word_id, correlation) VALUES (?, ?, ?)',
        [id, relatedId, correlation]
      );

      const relationship = await db.get(
        'SELECT * FROM related_words WHERE word_id = ? AND related_word_id = ?',
        [id, relatedId]
      );

      res.status(201).json(relationship);
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Relationship already exists' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  });

module.exports = router;
