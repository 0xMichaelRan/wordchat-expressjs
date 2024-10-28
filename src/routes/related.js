const express = require('express');
const router = express.Router();
const db = require('../config/db');

const { Pinecone } = require('@pinecone-database/pinecone');
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

async function getEmbedding(text) {
  const model = process.env.PINECONE_MODEL;
  const embedding = await pc.inference.embed(
    model,
    [text],
    { inputType: 'query' }
  );
  return embedding[0].values;
}

// Because only new words with AI-generated explain will have pinecone_status = -1
router.post('/embed-new-words', async (req, res) => {
  try {
    const { limit } = req.body; // Assuming limit is passed in the request body

    // Validate the limit parameter
    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Find random words that need embedding
    const wordsResult = await db.query(`
      SELECT id, word, explain, ai_generated
      FROM words 
      WHERE explain != '' 
      AND (pinecone_status = -1 OR pinecone_status > 3)
      ORDER BY RANDOM() 
      LIMIT $1
    `, [limit]);

    const words = wordsResult.rows;

    if (words.length === 0) {
      return res.json({ message: 'No words found requiring embedding' });
    }

    // Prepare data for embedding
    const data = words.map(w => ({
      id: `word_${w.id}`,
      text: `${w.word}: ${w.explain}`
    }));

    // Calculate embeddings
    const model = 'multilingual-e5-large';
    const embeddings = await pc.inference.embed(
      model,
      data.map(d => d.text),
      { inputType: 'passage', truncate: 'END' }
    );

    // Prepare vectors for Pinecone
    const vectors = data.map((d, i) => ({
      id: d.id,
      values: embeddings[i].values,
      metadata: { text: d.text }
    }));

    // Upsert to Pinecone
    const index = pc.index(process.env.PINECONE_INDEX);
    const vectorsWithSource = vectors.map((vector, i) => ({
      ...vector,
      metadata: {
        ...vector.metadata,
        source: words[i].ai_generated ? 'ai' : 'human'
      }
    }));
    await index.namespace(process.env.PINECONE_NAMESPACE).upsert(vectorsWithSource);

    // Update pinecone_status in database
    const wordIds = words.map(w => w.id);
    await db.query(`
      UPDATE words 
      SET pinecone_status = 0 
      WHERE id = ANY($1::int[])
    `, [wordIds]);

    return res.json({
      words: data,
      embeddings: embeddings
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/query-by-id', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Must provide word id parameter' });
    }

    // Validate that id is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid word ID' });
    }

    // Query Pinecone using word_id format
    const index = pc.index('tutorial');
    const queryResponse = await index.namespace('llm').query({
      id: `word_${id}`,
      topK: 10,
      includeMetadata: true
    });

    // Format response and parse text into word and explanation
    const results = queryResponse.matches.map(match => {
      const [word, explain] = match.metadata.text.split(': ');
      return {
        id: parseInt(match.id.replace('word_', '')),
        score: match.score,
        word,
        explain,
        source: match.metadata.source
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/query-by-word', async (req, res) => {

  try {
    const { word } = req.query;
    if (!word) {
      return res.status(400).json({ error: 'Must provide word parameter' });
    }

    // Query Pinecone using the word text
    const index = pc.index('tutorial');
    const queryResponse = await index.namespace('llm').query({
      vector: await getEmbedding(word),
      topK: 10,
      includeMetadata: true
    });

    // Format response and parse text into word and explanation 
    const results = queryResponse.matches.map(match => {
      const [word, explain] = match.metadata.text.split(': ');
      return {
        id: parseInt(match.id.replace('word_', '')),
        score: match.score,
        word,
        explain,
        source: match.metadata.source
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:word_id', async (req, res) => {
  try {
    const { word_id } = req.params;

    // Validate that word_id is a number
    if (isNaN(word_id)) {
      return res.status(400).json({ error: 'Invalid word ID' });
    }

    // Query to get related words along with their word names
    const relatedResult = await db.query(
      `SELECT rw.related_word_id, rw.correlation, w.word AS related_word
       FROM related_words rw
       JOIN words w ON rw.related_word_id = w.id
       WHERE rw.word_id = $1
       ORDER BY rw.correlation DESC`,
      [word_id]
    );

    res.json(relatedResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
