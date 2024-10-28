const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// dictionary.sqlite (128KB as of Oct 2024) is in .gitignore
const dbPath = path.join(dataDir, 'dictionary.sqlite');
const db = new sqlite3.Database(dbPath);

// Promisify database operations
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

// Initialize database schema
const initSchema = `
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT UNIQUE NOT NULL,
  explain TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS explain_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER,
  previous_explain TEXT NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS related_words (
  word_id INTEGER,
  related_word_id INTEGER,
  correlation REAL CHECK (correlation >= 0 AND correlation <= 1),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (word_id, related_word_id),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (related_word_id) REFERENCES words(id) ON DELETE CASCADE
);

-- Insert sample data if the words table is empty
INSERT OR IGNORE INTO words (word, explain, details) VALUES
  ('ephemeral', 'Lasting for a very short time', 'From Greek "ephemeros" meaning lasting only one day'),
  ('serendipity', 'The occurrence of finding pleasant things by chance', 'Coined by Horace Walpole in 1754'),
  ('ubiquitous', 'Present, appearing, or found everywhere', 'From Latin "ubique" meaning everywhere'),
  ('eloquent', 'Fluent or persuasive in speaking or writing', 'From Latin "eloqui" meaning to speak out'),
  ('resilient', 'Able to recover quickly from difficulties', 'From Latin "resilire" meaning to spring back');
`;

// Initialize the database
db.serialize(async () => {
  try {
    await dbAsync.exec(initSchema);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
});

module.exports = dbAsync;