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

// Because only new words with AI-generated explain will have edit_since_embedding = -1
router.post('/embed-new-words', async (req, res) => {
  try {
    const { knowledge_base, limit } = req.body; // Assuming limit is passed in the request body

    // Validate the limit parameter
    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Find random words that need embedding
    const wordsResult = await db.query(`
      SELECT id, word, explain, ai_generated  
      FROM words 
      WHERE explain != '' AND knowledge_base = $1
      AND (edit_since_embedding = -1 OR edit_since_embedding > 3)
      ORDER BY RANDOM() 
      LIMIT $2
    `, [knowledge_base, limit]);

    const words = wordsResult.rows;
    console.log('words that need embedding', words);

    if (words.length === 0) {
      return res.json({ message: 'No words found requiring embedding' });
    }

    // Prepare data for embedding
    const data = words.map(w => ({
      id: `word_0${w.id}`,
      text: `${w.word}: ${w.explain}`,
      ai_generated: w.ai_generated,
      knowledge_base: knowledge_base,
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
        ai_generated: d.ai_generated,
        knowledge_base: knowledge_base,
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
    await index.namespace(knowledge_base).upsert(vectorsWithSource);

    // Update edit_since_embedding in database
    const wordIds = words.map(w => w.id);
    await db.query(`
      UPDATE words 
      SET edit_since_embedding = 0 
      WHERE id = ANY($1::int[])
    `, [wordIds]);

    // Get count of remaining words needing embedding
    const remainingResult = await db.query(`
      SELECT COUNT(*) 
      FROM words 
      WHERE explain != '' AND knowledge_base = $1
      AND (edit_since_embedding = -1 OR edit_since_embedding > 3)
    `, [knowledge_base]);
    const remainingCount = parseInt(remainingResult.rows[0].count);

    return res.json({
      embedding_added: wordIds.length,
      remaining_to_embed: remainingCount,
      words: data,
      embeddings: embeddings,
      knowledge_base: knowledge_base
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
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
    const queryResponse = await index.namespace(knowledge_base).query({
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
          ai_generated: match.metadata.ai_generated,
          knowledge_base: match.metadata.knowledge_base,
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
    const id = parseInt(req.params.word_id);
    const { knowledge_base } = req.query;

    // Validate parameters
    if (isNaN(id) || !knowledge_base) {
      return res.status(400).json({ error: 'Invalid word ID or missing knowledge base' });
    }

    // Query from single table without join
    const relatedResult = await db.query(`
      SELECT related_word_id, related_word, correlation, ai_generated, knowledge_base
      FROM related_words
      WHERE word_id = $1 AND knowledge_base = $2
      ORDER BY correlation DESC
      LIMIT 10
    `, [id, knowledge_base]);

    // If we found results in PostgreSQL, return them
    if (relatedResult.rows.length > 0) {
      console.log(`Found ${relatedResult.rows.length} related words in PostgreSQL`);
      return res.json(relatedResult.rows.map(row => ({
        id: row.related_word_id,
        word: row.related_word,
        correlation: row.correlation,
        ai_generated: row.ai_generated,
        knowledge_base: row.knowledge_base
      })));
    }
    console.log('Did not find related words in PostgreSQL in knowledge_base', knowledge_base, " for word_id", id);

    // If no PostgreSQL results, fall back to Pinecone
    const index = pc.index(process.env.PINECONE_INDEX);
    const queryResponse = await index.namespace(knowledge_base).query({
      id: `word_0${id}`,
      topK: 10,
      includeMetadata: true
    });

    // TODO: again if no result found in Pinecone, something is wrong
    // Need to add embedding of this word to Pinecone index

    // Format Pinecone response and save to PostgreSQL
    const results = await Promise.all(queryResponse.matches
      .filter(match => match.id !== `word_0${id}`)
      .map(async match => {
        const [word] = match.metadata.text.split(': ');
        const related_word_id = parseInt(match.id.replace('word_', ''));
        const ai_generated = match.metadata.ai_generated === 'true';
        const knowledge_base = match.metadata.knowledge_base;
        console.log('Pinecone match:', word, 'ai_generated', ai_generated, 'knowledge_base', knowledge_base, 'with word_id', id);

        // Insert into or update related_words
        await db.query(`
          INSERT INTO related_words
            (word_id, related_word_id, related_word, correlation, ai_generated, knowledge_base)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (word_id, related_word_id) 
          DO UPDATE SET 
            related_word = $3,
            correlation = $4,
            ai_generated = $5,
            knowledge_base = $6
        `, [
          id,
          related_word_id,
          word,
          match.score,
          ai_generated,
          knowledge_base
        ]);

        return {
          id: related_word_id,
          word,
          score: match.score,
          ai_generated,
          knowledge_base
        };
      }));

    console.log('/query-by-id', `Found ${results.length} related words in Pinecone`);
    console.log('knowledge_base', knowledge_base);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
