require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// this is for sqlite3, not used any more.
async function setupDatabase() {
  try {
    // Read schema and seed files
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'sqlite3-schema.sql'), 'utf8');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'sqlite3-seed.sql'), 'utf8');

    // Execute schema
    await pool.query(schemaSQL);
    console.log('Schema created successfully');

    // Execute seed
    await pool.query(seedSQL);
    console.log('Sample data inserted successfully');

    await pool.end();
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setupDatabase();