const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load the PostgreSQL schema and seed files
const schemaPath = path.join(__dirname, '..', 'db', 'postgres-schema.sql');
const seedPath = path.join(__dirname, '..', 'db', 'postgres-seed.sql');
const initSchema = fs.readFileSync(schemaPath, 'utf8');
const seedData = fs.readFileSync(seedPath, 'utf8');

// Create a new PostgreSQL pool using environment variables
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

// Promisify database operations
const dbAsync = {
  query: (text, params) => {
    return pool.query(text, params);
  }
};

// Function to check if the database is initialized
async function isDatabaseInitialized() {
  try {
    const result = await dbAsync.query("SELECT to_regclass('public.words') AS table_exists;");
    return result.rows[0].table_exists !== null;
  } catch (err) {
    console.error('Error checking database initialization:', err);
    return false;
  }
}

// Initialize the database if not already initialized
(async () => {
  try {
    const initialized = await isDatabaseInitialized();
    if (!initialized) {
      await dbAsync.query(initSchema);
      console.log('Database initialized successfully');

      // Run seed data
      await dbAsync.query(seedData);
      console.log('Database seeded successfully');
    } else {
      console.log('Database is already initialized');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
})();

module.exports = dbAsync;
