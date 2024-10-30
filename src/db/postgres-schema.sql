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
('Tokenization', 'The process of converting a sequence of characters into a sequence of tokens, which are meaningful units for processing by a language model.', -1, TRUE, 'LLM'),
('Embedding', 'A representation of words or phrases in a continuous vector space where semantically similar words are closer together.', -1, TRUE, 'LLM'),
('Transformer Model', 'A type of neural network architecture that uses self-attention mechanisms to process sequential data, widely used in NLP tasks.', -1, TRUE, 'LLM'),
('BERT (Bidirectional Encoder Representations from Transformers)', 'A transformer-based model designed to understand the context of a word in search queries.', -1, TRUE, 'LLM'),
('GPT (Generative Pre-trained Transformer)', 'A type of transformer model designed to generate human-like text by predicting the next word in a sequence.', -1, TRUE, 'LLM'),
('Fine-Tuning', 'The process of taking a pre-trained model and further training it on a specific task or dataset.', -1, TRUE, 'LLM'),
('Pre-training', 'The initial phase of training a language model on a large corpus of text to learn general language patterns.', -1, TRUE, 'LLM'),
('Masked Language Model', 'A training objective where some words in a sentence are masked and the model learns to predict them.', -1, TRUE, 'LLM'),
('Sequence-to-Sequence Model', 'A model architecture used for tasks where the input and output are sequences, such as translation.', -1, TRUE, 'LLM'),
('Beam Search', 'A search algorithm that explores a graph by expanding the most promising nodes in a limited set.', -1, TRUE, 'LLM'),
('Greedy Decoding', 'A decoding strategy that selects the most probable word at each step in sequence generation.', -1, TRUE, 'LLM'),
('Self-Attention', 'A mechanism that allows each position in a sequence to attend to all positions, helping capture dependencies.', -1, TRUE, 'LLM'),
('Cross-Attention', 'A mechanism where the attention is applied across different sequences, often used in encoder-decoder models.', -1, TRUE, 'LLM'),
('Positional Encoding', 'A technique used in transformers to inject information about the position of tokens in a sequence.', -1, TRUE, 'LLM'),
('Layer Normalization', 'A technique to normalize the inputs across the features for each training example, improving training stability.', -1, TRUE, 'LLM'),
('Dropout', 'A regularization technique where randomly selected neurons are ignored during training to prevent overfitting.', -1, TRUE, 'LLM'),
('Residual Connection', 'A shortcut connection that skips one or more layers, helping to mitigate the vanishing gradient problem.', -1, TRUE, 'LLM'),
('Feedforward Neural Network', 'A type of neural network where connections between the nodes do not form a cycle.', -1, TRUE, 'LLM'),
('Softmax Function', 'A function that converts a vector of numbers into a probability distribution.', -1, TRUE, 'LLM'),
('Backpropagation', 'The algorithm used to calculate the gradient of the loss function with respect to the weights of the network.', -1, TRUE, 'LLM'),
('Gradient Descent', 'An optimization algorithm used to minimize the loss function by iteratively moving towards the minimum.', -1, TRUE, 'LLM'),
('Learning Rate', 'A hyperparameter that controls how much to change the model in response to the estimated error each time the model weights are updated.', -1, TRUE, 'LLM'),
('Batch Size', 'The number of training examples utilized in one iteration.', -1, TRUE, 'LLM'),
('Epoch', 'One complete pass through the entire training dataset.', -1, TRUE, 'LLM'),
('Overfitting', 'A modeling error that occurs when a model learns the training data too well, including noise and fluctuations.', -1, TRUE, 'LLM'),
('Underfitting', 'A situation where a model is too simple to capture the underlying structure of the data.', -1, TRUE, 'LLM'),
('Regularization', 'Techniques used to prevent overfitting by adding a penalty term to the loss function.', -1, TRUE, 'LLM'),
('Hyperparameter Tuning', 'The process of optimizing the parameters that control the learning process in machine learning models.', -1, TRUE, 'LLM'),
('Transfer Learning', 'A machine learning technique where a model developed for one task is reused as the starting point for a model on a second task.', -1, TRUE, 'LLM'),
('Zero-Shot Learning', 'A scenario where a model is able to recognize objects or perform tasks without having seen any examples during training.', -1, TRUE, 'LLM');

SELECT * FROM words;
SELECT * FROM related_words;
SELECT * FROM explain_history;