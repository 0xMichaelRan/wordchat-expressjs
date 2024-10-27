-- Drop tables
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS related_words;
DROP TABLE IF EXISTS explain_history;

-- Create tables
CREATE TABLE if not exists words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word VARCHAR(80) UNIQUE NOT NULL,
  explain VARCHAR(188) NOT NULL,
  details TEXT,
  pinecone_status INTEGER NOT NULL, -- -1: no embedding, 0: just embedded, >0: outdated after edits
  ai_generated BOOLEAN NOT NULL, -- TRUE if AI generated, FALSE if human input
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if not exists explain_history (
  id SERIAL PRIMARY KEY,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  previous_explain TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if not exists related_words (
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  related_word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  correlation FLOAT CHECK (correlation >= 0 AND correlation <= 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (word_id, related_word_id)
);
