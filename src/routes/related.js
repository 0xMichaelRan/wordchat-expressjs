const express = require('express');
const router = express.Router();
const db = require('../config/db');

const { Pinecone } = require('@pinecone-database/pinecone');
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

async function getEmbedding(text) {
  const embedding = await pc.inference.embed(
    process.env.PINECONE_MODEL,
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
      SELECT id, word, explain, ai_generated, base
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
      text: `${w.word}: ${w.explain}`,
      base: w.base
    }));

    // Calculate embeddings
    const embeddings = await pc.inference.embed(
      process.env.PINECONE_MODEL,
      data.map(d => d.text),
      { inputType: 'passage', truncate: 'END' }
    );

    // Prepare vectors for Pinecone
    const vectors = data.map((d, i) => ({
      id: d.id,
      values: embeddings[i].values,
      metadata: {
        text: d.text,
        base: d.base,
        source: d.ai_generated ? 'ai' : 'human'
      }
    }));

    // Upsert to Pinecone
    const index = pc.index(process.env.PINECONE_INDEX);
    const vectorsWithSource = vectors.map((vector, i) => ({
      ...vector,
      metadata: {
        ...vector.metadata,
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

    // Get count of remaining words needing embedding
    const remainingResult = await db.query(`
      SELECT COUNT(*) 
      FROM words 
      WHERE explain != '' 
      AND (pinecone_status = -1 OR pinecone_status > 3)
    `);
    const remainingCount = parseInt(remainingResult.rows[0].count);

    return res.json({
      count: wordIds.length,
      remainingCount: remainingCount,
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
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Must provide valid word id parameter' });
    }

    // Query from single table without join
    const relatedResult = await db.query(`
      SELECT related_word_id, correlation, related_word
      FROM related_words
      WHERE word_id = $1
      ORDER BY correlation DESC
      LIMIT 10
    `, [id]);

    // If we found results in PostgreSQL, return them
    if (relatedResult.rows.length > 0) {
      console.log(`Found ${relatedResult.rows.length} related words in PostgreSQL`);
      return res.json(relatedResult.rows.map(row => ({
        id: row.related_word_id,
        score: row.correlation,
        word: row.related_word,
        source: 'postgres'
      })));
    }

    // If no PostgreSQL results, fall back to Pinecone
    const index = pc.index(process.env.PINECONE_INDEX);
    const queryResponse = await index.namespace(process.env.PINECONE_NAMESPACE).query({
      id: `word_${id}`,
      topK: 10,
      includeMetadata: true
    });

    // TODO: again if no result found in Pinecone, something is wrong
    // Need to add embedding of this word to Pinecone index

    // Format Pinecone response and save to PostgreSQL
    const results = await Promise.all(queryResponse.matches
      .filter(match => match.id !== `word_${id}`)
      .map(async match => {
        const [word] = match.metadata.text.split(': ');
        const related_word_id = parseInt(match.id.replace('word_', ''));
        const base = match.metadata.base || 'unknown';
        const ai_generated = match.metadata.source === 'ai';

        // Insert into or update related_words
        await db.query(`
          INSERT INTO related_words
            (word_id, related_word_id, related_word, correlation, ai_generated, base)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (word_id, related_word_id) 
          DO UPDATE SET 
            related_word = $3,
            correlation = $4,
            ai_generated = $5,
            base = $6
        `, [
          id,
          related_word_id,
          word,
          match.score,
          ai_generated,
          base
        ]);

        return {
          id: related_word_id,
          word,
          score: match.score,
          ai_generated,
          base
        };
      }));

    console.log("/query-by-id" + `Found ${results.length} related words in Pinecone`);

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
    const index = pc.index(process.env.PINECONE_INDEX);
    const embedding = await getEmbedding(word);
    const queryResponse = await index.namespace(process.env.PINECONE_NAMESPACE).query({
      vector: embedding,
      topK: 10,
      includeMetadata: true
    });

    // Format response and parse text into word and explanation 
    const results = queryResponse.matches
      .map(match => {
        const [word] = match.metadata.text.split(': ');
        return {
          id: parseInt(match.id.replace('word_', '')),
          word,
          score: match.score,
          base: match.metadata.base || 'unknown',
          source: match.metadata.source || 'unknown'
        };
      });

    console.log("/query-by-word" + `Found ${results.length} related words in Pinecone`);

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
 