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

    const related = await db.all('SELECT * FROM related_words WHERE word_id = ?', [word_id]);
    res.json(related);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
