const express = require('express');
const router = express.Router();
const db = require('../config/db');

const { Pinecone } = require('@pinecone-database/pinecone');
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

router.get('/test', async (req, res) => {

  // 1. Create a serverless index
  const indexName = 'quickstart';
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

  // 2. Create vector embeddings
  const model = 'multilingual-e5-large';
  const data = [
    { id: 'vec1', text: 'Apple is a popular fruit known for its sweetness and crisp texture.' },
    { id: 'vec2', text: 'The tech company Apple is known for its innovative products like the iPhone.' },
    { id: 'vec3', text: 'Many people enjoy eating apples as a healthy snack.' },
    { id: 'vec4', text: 'Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces.' },
    { id: 'vec5', text: 'An apple a day keeps the doctor away, as the saying goes.' },
    { id: 'vec6', text: 'Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.' }
  ];

  const embeddings = await pc.inference.embed(
    model,
    data.map(d => d.text),
    { inputType: 'passage', truncate: 'END' }
  );

  // console.log(embeddings[0]);

  // 3. Upsert data
  const index = pc.index(indexName);
  const vectors = data.map((d, i) => ({
    id: d.id,
    values: embeddings[i].values,
    metadata: { text: d.text }
  }));

  await index.namespace('ns1').upsert(vectors);

  // 4. Check the index
  const stats = await index.describeIndexStats();
  console.log(stats)

  // 2.1 create a query vector
  const query = [
    'Tell me about the tech company known as Apple.',
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
