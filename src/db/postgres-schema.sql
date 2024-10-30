-- Drop tables
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS related_words CASCADE;
DROP TABLE IF EXISTS explain_history CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(80) UNIQUE NOT NULL,
  explain VARCHAR(188) NOT NULL,
  details TEXT,
  edit_since_embedding INTEGER NOT NULL, -- -1: no embedding, 0: just embedded, >0: outdated after edits
  ai_generated BOOLEAN NOT NULL, -- TRUE if AI generated, FALSE if human input
  knowledge_base VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS explain_history (
  id SERIAL PRIMARY KEY,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  old_explain TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS related_words (
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  related_word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  related_word VARCHAR(80) NOT NULL,
  correlation FLOAT CHECK (correlation >= 0 AND correlation <= 1),
  ai_generated BOOLEAN NOT NULL,
  knowledge_base VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (word_id, related_word_id)
);


INSERT INTO words (word, explain, edit_since_embedding, ai_generated, knowledge_base) VALUES
('Tokenization', 'The process of converting a sequence of characters into a sequence of tokens, which are meaningful units for processing by a language model.', -1, TRUE, 'llm'),
('Embedding', 'A representation of words or phrases in a continuous vector space where semantically similar words are closer together.', -1, TRUE, 'llm'),
('Attention Mechanism', 'A component of neural networks that allows the model to focus on specific parts of the input sequence when producing an output.', -1, TRUE, 'llm');

SELECT * FROM words;
SELECT * FROM related_words;
SELECT * FROM explain_history;