-- Drop tables
DROP TABLE IF EXISTS related_words;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS definition_history;

-- Create tables
CREATE TABLE if not exists words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word VARCHAR(80) UNIQUE NOT NULL,
  definition VARCHAR(188) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if not exists definition_history (
  id SERIAL PRIMARY KEY,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  previous_definition TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert samples
INSERT INTO words (word, definition) VALUES
('Machine Learning', 'A subset of AI that enables systems to learn and improve from experience without being explicitly programmed, using statistical techniques to make predictions or decisions.'),
('Deep Learning', 'A subset of machine learning based on artificial neural networks with multiple layers, capable of learning complex patterns in large amounts of data.'),
('Neural Network', 'A computing system inspired by biological neural networks, consisting of interconnected nodes that process and transmit information, forming the basis of deep learning.'),
('Natural Language Processing', 'A branch of AI that focuses on the interaction between computers and human language, enabling machines to understand, interpret, and generate human-like text.'),
('Computer Vision', 'A field of AI that trains computers to interpret and understand visual information from the world, enabling tasks like image recognition and object detection.'),
('Reinforcement Learning', 'A type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize a reward, often used in robotics and game AI.'),
('Generative AI', 'AI systems capable of creating new content, such as images, text, or music, based on patterns learned from existing data, often using techniques like GANs or transformers.'),
('Transformer', 'A deep learning model architecture that uses self-attention mechanisms to process sequential data, revolutionizing natural language processing and other AI tasks.'),
('GANs (Generative Adversarial Networks)', 'A class of machine learning frameworks where two neural networks compete to generate new, synthetic instances of data that can pass for real data.'),
('Transfer Learning', 'A machine learning technique where a model developed for one task is reused as the starting point for a model on a second, related task, improving efficiency and performance.'),
('Federated Learning', 'A machine learning approach that trains algorithms across multiple decentralized devices or servers holding local data samples, without exchanging them.'),
('Explainable AI (XAI)', 'AI systems designed to be interpretable and transparent, allowing humans to understand the reasoning behind their decisions and outputs.'),
('Edge AI', 'The deployment of AI algorithms and processes directly on edge devices, such as smartphones or IoT devices, rather than in the cloud, reducing latency and improving privacy.'),
('AutoML', 'The process of automating the end-to-end process of applying machine learning to real-world problems, including data preparation, feature selection, and model selection.'),
('Few-Shot Learning', 'A machine learning approach where models are trained to recognize new classes or perform new tasks with only a few examples, mimicking human-like learning abilities.'),
('Quantum Machine Learning', 'An interdisciplinary field that combines quantum computing and machine learning, aiming to develop quantum algorithms for AI tasks to achieve quantum speedup.'),
('Swarm Intelligence', 'A collective behavior of decentralized, self-organized systems, natural or artificial, inspired by social insects, used in optimization and robotics.'),
('Conversational AI', 'AI systems designed to engage in human-like dialogue, understanding context and intent to provide natural, interactive communication experiences.'),
('Sentiment Analysis', 'The use of natural language processing and machine learning to identify and extract subjective information from text data, often used in social media monitoring.'),
('Anomaly Detection', 'The identification of rare items, events, or observations that differ significantly from the majority of the data, often used in fraud detection and system health monitoring.'),
('Ensemble Learning', 'A machine learning technique that combines multiple models to improve overall performance and robustness, often outperforming individual models.'),
('Unsupervised Learning', 'A type of machine learning where the algorithm learns patterns from unlabeled data without explicit instructions, often used for clustering and dimensionality reduction.'),
('Supervised Learning', 'A machine learning approach where the algorithm learns from labeled training data, used for tasks like classification and regression.'),
('Convolutional Neural Network (CNN)', 'A class of deep neural networks commonly used in computer vision tasks, designed to automatically and adaptively learn spatial hierarchies of features.'),
('Recurrent Neural Network (RNN)', 'A class of neural networks with connections between nodes forming a directed graph along a temporal sequence, suitable for tasks involving sequential data.'),
('Long Short-Term Memory (LSTM)', 'A type of recurrent neural network capable of learning long-term dependencies, widely used in speech recognition and language modeling tasks.'),
('Attention Mechanism', 'A technique in neural networks that allows the model to focus on specific parts of the input when producing an output, crucial in many NLP and computer vision tasks.'),
('Backpropagation', 'The primary algorithm for training neural networks, which calculates the gradient of the loss function with respect to the weights, enabling efficient learning.'),
('Gradient Descent', 'An optimization algorithm used to minimize the loss function in machine learning models by iteratively moving towards the minimum of the function.'),
('Overfitting', 'A modeling error in machine learning where a model learns the training data too well, including noise and fluctuations, leading to poor generalization on new data.'),
('Underfitting', 'A situation in machine learning where a model is too simple to capture the underlying structure of the data, resulting in poor performance on both training and new data.'),
('Hyperparameter Tuning', 'The process of optimizing the parameters that control the learning process in machine learning models, often done through techniques like grid search or random search.'),
('Feature Engineering', 'The process of using domain knowledge to extract features from raw data, improving the performance of machine learning algorithms.'),
('Data Augmentation', 'Techniques used to increase the amount of training data by adding slightly modified copies of existing data or newly created synthetic data.'),
('Bias-Variance Tradeoff', 'A fundamental concept in machine learning that reflects the balance between a model''s ability to fit the training data and its ability to generalize to new data.'),
('Cross-Validation', 'A resampling procedure used to evaluate machine learning models on a limited data sample, helping to assess how the model will generalize to an independent dataset.'),
('Regularization', 'Techniques used to prevent overfitting in machine learning models by adding a penalty term to the loss function, discouraging complex models.'),
('Batch Normalization', 'A technique used to improve the stability and performance of neural networks by normalizing the inputs to each layer.'),
('Dropout', 'A regularization technique for neural networks where randomly selected neurons are ignored during training, helping to prevent overfitting.'),
('One-Hot Encoding', 'A process of converting categorical variables into a form that could be provided to machine learning algorithms to improve predictions.'),
('Word Embedding', 'A technique in natural language processing where words or phrases are mapped to vectors of real numbers, capturing semantic meaning.'),
('Tokenization', 'The process of breaking down text into individual words or subwords, a crucial preprocessing step in many natural language processing tasks.'),
('Fine-Tuning', 'The process of taking a pre-trained model and further training it on a specific task or dataset, often used in transfer learning scenarios.'),
('Adversarial Attack', 'Attempts to fool machine learning models by providing deceptive input, often used to test the robustness of AI systems.'),
('Ethical AI', 'The development and use of artificial intelligence systems that adhere to ethical principles and values, ensuring fairness, transparency, and accountability.'),
('AI Alignment', 'The challenge of designing AI systems whose goals and behaviors align with human values and intentions, crucial for the development of safe and beneficial AI.'),
('Artificial General Intelligence (AGI)', 'A hypothetical type of AI that would have the ability to understand, learn, and apply intelligence in a way similar to human intelligence.'),
('Narrow AI', 'AI systems designed to perform specific tasks within a limited domain, as opposed to general AI that can perform any intellectual task.'),
('Turing Test', 'A test of a machine''s ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human, proposed by Alan Turing in 1950.');
