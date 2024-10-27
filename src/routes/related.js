const express = require('express');
const router = express.Router();
const db = require('../config/db');

const { Pinecone } = require('@pinecone-database/pinecone');
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

router.get('/connect', async (req, res) => {
  const indexName = 'quickstart';

  // await pc.createIndex({
  //   name: indexName,
  //   dimension: 2, // Replace with your model dimensions
  //   metric: 'cosine', // Replace with your model metric
  //   spec: { 
  //     serverless: { 
  //       cloud: 'aws', 
  //       region: 'us-east-1' 
  //       }
  //     } 
  //   });

  const index = pc.index('quickstart');
  // await index.namespace('ns1').upsert([
  //   {
  //     id: 'vec1',
  //     values: [1.0, 1.5],
  //     metadata: { genre: 'drama' }
  //   },
  //   {
  //     id: 'vec2',
  //     values: [2.0, 1.0],
  //     metadata: { genre: 'action' }
  //   },
  //   {
  //     id: 'vec3',
  //     values: [0.1, 0.3],
  //     metadata: { genre: 'drama' }
  //   },
  //   {
  //     id: 'vec4',
  //     values: [1.0, -2.5],
  //     metadata: { genre: 'action' }
  //   }
  // ]);

  // query 
  const queryResponse = await index.namespace('ns1').query({
    topK: 4,
    vector: [0.1, 0.3],
    includeValues: true,
    includeMetadata: true,
    filter: { genre: { '$eq': 'drama' } }
  });

  console.log(queryResponse);





  return res.json({ queryResponse: queryResponse });
});

router.get('/tutorial', async (req, res) => {
  // 1. Create a serverless index
  const indexName = 'tutorial';
  // await pc.createIndex({
  //   name: indexName,
  //   dimension: 1024, // Replace with your model dimensions
  //   metric: 'cosine', // Replace with your model metric
  //   spec: {
  //     serverless: {
  //       cloud: 'aws',
  //       region: 'us-east-1'
  //     }
  //   }
  // });

  // // 2. Create vector embeddings
  const model = 'multilingual-e5-large';
  // const data = [
  //   { id: 'vec1', text: 'Apple is a popular fruit known for its sweetness and crisp texture.' },
  //   { id: 'vec2', text: 'The tech company Apple is known for its innovative products like the iPhone.' },
  //   { id: 'vec3', text: 'Many people enjoy eating apples as a healthy snack.' },
  //   { id: 'vec4', text: 'Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces.' },
  //   { id: 'vec5', text: 'An apple a day keeps the doctor away, as the saying goes.' },
  //   { id: 'vec6', text: 'Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.' }
  // ];

  // const embeddings = await pc.inference.embed(
  //   model,
  //   data.map(d => d.text),
  //   { inputType: 'passage', truncate: 'END' }
  // );
  // // console.log(embeddings[0]);

  // // 3. Upsert data
  const index = pc.index(indexName);
  // const vectors = data.map((d, i) => ({
  //   id: d.id,
  //   values: embeddings[i].values,
  //   metadata: { text: d.text }
  // }));

  // await index.namespace('ns1').upsert(vectors);

  // 4. Check the index
  const stats = await index.describeIndexStats();
  console.log(stats)

  // 2.1 create a query vector
  const query = [
    'microsoft and windows xp',
  ];

  const embedding = await pc.inference.embed(
    model,
    query,
    { inputType: 'query' }
  );

  // 2.2 Run a similarity search
  const queryResponse = await index.namespace("ns1").query({
    topK: 3,
    vector: embedding[0].values,
    includeValues: false,
    includeMetadata: true
  });

  console.log(queryResponse);

  return res.json({ queryResponse: queryResponse });
});

router.post('/embed-new-words', async (req, res) => {
  try {
    // Find 5 random words that need embedding
    // Note that I only update embedding for words that has been edited 3 or more times
    const words = await db.all(`
      SELECT id, word, explain, ai_generated
      FROM words 
      WHERE explain != '' 
      AND (pinecone_status = -1 OR pinecone_status > 3)
      ORDER BY RANDOM() 
      LIMIT 5
    `);

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
    const index = pc.index('tutorial');
    const vectorsWithSource = vectors.map((vector, i) => ({
      ...vector,
      metadata: {
        ...vector.metadata,
        source: words[i].ai_generated ? 'ai' : 'human'
      }
    }));
    await index.namespace('llm').upsert(vectorsWithSource);

    // Update pinecone_status in database
    const wordIds = words.map(w => w.id);
    await db.run(`
      UPDATE words 
      SET pinecone_status = 0 
      WHERE id IN (${wordIds.join(',')})
    `);

    return res.json({
      words: data,
      embeddings: embeddings
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
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
