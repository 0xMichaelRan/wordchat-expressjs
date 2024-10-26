const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:word_id', async (req, res) => {
  try {
    const { word_id } = req.params;

    // Validate that word_id is a number
    if (isNaN(word_id)) {
      return res.status(400).json({ error: 'Invalid word ID' });
    }

    // Query to get related words along with their word names
    const related = await db.all(
      `SELECT rw.related_word_id, rw.correlation, w.word AS related_word
       FROM related_words rw
       JOIN words w ON rw.related_word_id = w.id
       WHERE rw.word_id = ?
       ORDER BY rw.correlation DESC`,
      [word_id]
    );

    res.json(related);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
