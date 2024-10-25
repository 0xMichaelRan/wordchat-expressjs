DROP TABLE IF EXISTS related_words;
DROP TABLE IF EXISTS definition_history;
DROP TABLE IF EXISTS words;

CREATE TABLE if not exists words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word VARCHAR(100) UNIQUE NOT NULL,
  definition TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if not exists definition_history (
  id SERIAL PRIMARY KEY,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  previous_definition TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if not exists related_words (
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  related_word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  correlation FLOAT CHECK (correlation >= 0 AND correlation <= 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (word_id, related_word_id)
);