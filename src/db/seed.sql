INSERT INTO words (word, explain) VALUES
('Tokenization', 'The process of converting a sequence of characters into a sequence of tokens, which are meaningful units for processing by a language model.'),
('Embedding', 'A representation of words or phrases in a continuous vector space where semantically similar words are closer together.'),
('Attention Mechanism', 'A component of neural networks that allows the model to focus on specific parts of the input sequence when producing an output.'),
('Transformer Model', 'A type of neural network architecture that uses self-attention mechanisms to process sequential data, widely used in NLP tasks.'),
('BERT (Bidirectional Encoder Representations from Transformers)', 'A transformer-based model designed to understand the context of a word in search queries.'),
('GPT (Generative Pre-trained Transformer)', 'A type of transformer model designed to generate human-like text by predicting the next word in a sequence.'),
('Fine-Tuning', 'The process of taking a pre-trained model and further training it on a specific task or dataset.'),
('Pre-training', 'The initial phase of training a language model on a large corpus of text to learn general language patterns.'),
('Masked Language Model', 'A training objective where some words in a sentence are masked and the model learns to predict them.'),
('Sequence-to-Sequence Model', 'A model architecture used for tasks where the input and output are sequences, such as translation.'),
('Beam Search', 'A search algorithm that explores a graph by expanding the most promising nodes in a limited set.'),
('Greedy Decoding', 'A decoding strategy that selects the most probable word at each step in sequence generation.'),
('Self-Attention', 'A mechanism that allows each position in a sequence to attend to all positions, helping capture dependencies.'),
('Cross-Attention', 'A mechanism where the attention is applied across different sequences, often used in encoder-decoder models.'),
('Positional Encoding', 'A technique used in transformers to inject information about the position of tokens in a sequence.'),
('Layer Normalization', 'A technique to normalize the inputs across the features for each training example, improving training stability.'),
('Dropout', 'A regularization technique where randomly selected neurons are ignored during training to prevent overfitting.'),
('Residual Connection', 'A shortcut connection that skips one or more layers, helping to mitigate the vanishing gradient problem.'),
('Feedforward Neural Network', 'A type of neural network where connections between the nodes do not form a cycle.'),
('Softmax Function', 'A function that converts a vector of numbers into a probability distribution.'),
('Backpropagation', 'The algorithm used to calculate the gradient of the loss function with respect to the weights of the network.'),
('Gradient Descent', 'An optimization algorithm used to minimize the loss function by iteratively moving towards the minimum.'),
('Learning Rate', 'A hyperparameter that controls how much to change the model in response to the estimated error each time the model weights are updated.'),
('Batch Size', 'The number of training examples utilized in one iteration.'),
('Epoch', 'One complete pass through the entire training dataset.'),
('Overfitting', 'A modeling error that occurs when a model learns the training data too well, including noise and fluctuations.'),
('Underfitting', 'A situation where a model is too simple to capture the underlying structure of the data.'),
('Regularization', 'Techniques used to prevent overfitting by adding a penalty term to the loss function.'),
('Hyperparameter Tuning', 'The process of optimizing the parameters that control the learning process in machine learning models.'),
('Transfer Learning', 'A machine learning technique where a model developed for one task is reused as the starting point for a model on a second task.'),
('Zero-Shot Learning', 'A scenario where a model is able to recognize objects or perform tasks without having seen any examples during training.'),
('Few-Shot Learning', 'A scenario where a model learns to perform a task from a very small number of training examples.'),
('Prompt Engineering', 'The process of designing and refining prompts to elicit the desired response from a language model.'),
('Context Window', 'The range of input tokens that a model can consider when generating an output.'),
('Token Limit', 'The maximum number of tokens a model can process in a single input sequence.'),
('Parameter Count', 'The total number of trainable parameters in a model, often used as a measure of model size.'),
('Inference', 'The process of using a trained model to make predictions on new data.'),
('Training Dataset', 'The dataset used to train a model, typically consisting of input-output pairs.'),
('Validation Dataset', 'A dataset used to provide an unbiased evaluation of a model fit on the training dataset while tuning model hyperparameters.'),
('Test Dataset', 'A dataset used to provide an unbiased evaluation of a final model fit on the training dataset.'),
('BLEU Score', 'A metric for evaluating a generated sentence to a reference sentence, often used in machine translation.'),
('Perplexity', 'A measurement of how well a probability model predicts a sample, often used in language modeling.'),
('Cross-Entropy Loss', 'A loss function commonly used in classification tasks, measuring the difference between two probability distributions.'),
('Logits', 'The raw, unnormalized scores output by a model before applying the softmax function.'),
('Embedding Layer', 'The first layer in a neural network that converts input tokens into dense vectors.'),
('Decoder', 'The part of a sequence-to-sequence model that generates the output sequence.'),
('Encoder', 'The part of a sequence-to-sequence model that processes the input sequence.'),
('Bidirectional Model', 'A model that processes data in both forward and backward directions to capture context from both sides.'),
('Unidirectional Model', 'A model that processes data in a single direction, typically from left to right.'),
('Language Model', 'A model that predicts the probability of a sequence of words, often used in NLP tasks.'),
('Neural Architecture Search', 'The process of automating the design of neural network architectures.'),
('Model Distillation', 'A technique where a smaller model is trained to replicate the behavior of a larger model.'),
('Knowledge Graph', 'A network of real-world entities and their relationships, used to enhance language models with structured information.'),
('Semantic Similarity', 'A measure of the likeness between two pieces of text based on their meaning.'),
('Named Entity Recognition', 'A task in NLP that involves identifying and classifying key entities in text.'),
('Part-of-Speech Tagging', 'The process of marking up a word in a text as corresponding to a particular part of speech.'),
('Dependency Parsing', 'The process of analyzing the grammatical structure of a sentence, establishing relationships between words.'),
('Coreference Resolution', 'The task of determining when two or more expressions in a text refer to the same entity.'),
('Sentiment Analysis', 'The use of NLP to identify and extract subjective information from text data.'),
('Text Summarization', 'The process of creating a concise and coherent version of a longer text document.'),
('Question Answering', 'A task in NLP that involves building systems that automatically answer questions posed by humans.'),
('Machine Translation', 'The use of software to translate text or speech from one language to another.'),
('Speech Recognition', 'The process of converting spoken language into text.'),
('Text-to-Speech', 'The process of converting text into spoken voice output.'),
('Dialogue Systems', 'AI systems designed to converse with humans, understanding context and intent.'),
('Conversational Agents', 'AI systems that engage in human-like dialogue, often used in customer service.'),
('Natural Language Understanding', 'The ability of a machine to understand and interpret human language.'),
('Natural Language Generation', 'The process of generating natural language text from structured data.'),
('Semantic Parsing', 'The process of converting natural language into a machine-readable format.'),
('Word Sense Disambiguation', 'The task of determining which sense of a word is used in a given context.'),
('Language Model Pre-training', 'The initial phase of training a language model on a large corpus of text.'),
('Language Model Fine-tuning', 'The process of adapting a pre-trained language model to a specific task.'),
('Contextual Embeddings', 'Word embeddings that capture the context in which a word appears.'),
('Static Embeddings', 'Word embeddings that do not change based on context, such as Word2Vec or GloVe.'),
('Dynamic Embeddings', 'Word embeddings that change based on context, such as those produced by BERT or GPT.'),
('Multi-Head Attention', 'A mechanism in transformers that allows the model to focus on different parts of the input sequence simultaneously.'),
('Encoder-Decoder Architecture', 'A neural network design used for sequence-to-sequence tasks, consisting of an encoder and a decoder.'),
('Hierarchical Attention', 'An attention mechanism that operates at multiple levels of a sequence, such as words and sentences.'),
('Contextualized Language Models', 'Models that generate embeddings based on the context of the input text.'),
('Language Model Evaluation', 'The process of assessing the performance of a language model on various tasks.'),
('Transfer Learning in NLP', 'The application of transfer learning techniques to natural language processing tasks.'),
('Zero-Shot Transfer', 'The ability of a model to perform a task without having seen any examples during training.'),
('Few-Shot Transfer', 'The ability of a model to learn a task from a small number of examples.'),
('Prompt-Based Learning', 'A method of training language models using prompts to elicit specific responses.'),
('Contextualized Representations', 'Representations of text that capture the context in which words appear.'),
('Semantic Role Labeling', 'The process of assigning roles to words or phrases in a sentence based on their semantic relationships.'),
('Text Classification', 'The task of assigning predefined categories to text data.'),
('Language Model Adaptation', 'The process of adapting a language model to a new domain or task.'),
('Cross-Lingual Transfer', 'The ability of a model to transfer knowledge across different languages.'),
('Multilingual Language Models', 'Models that are trained on text from multiple languages.'),
('Language Model Compression', 'Techniques used to reduce the size of a language model while maintaining performance.'),
('Knowledge Distillation in NLP', 'The process of transferring knowledge from a large model to a smaller one in NLP tasks.'),
('Language Model Robustness', 'The ability of a language model to perform well across different tasks and domains.'),
('Adversarial Training in NLP', 'A technique used to improve the robustness of language models by training them on adversarial examples.'),
('Language Model Interpretability', 'The ability to understand and explain the decisions made by a language model.'),
('Ethical Considerations in NLP', 'The study of ethical issues related to the development and deployment of NLP systems.'),
('Bias Mitigation in Language Models', 'Techniques used to reduce bias in language models.'),
('Fairness in NLP', 'The study of ensuring that NLP systems treat all users and data fairly.'),
('Conversational AI Continuous Learning in NLP Systems', 'The ability of conversational AI systems to learn and adapt over time in NLP systems.'),
('Human-in-the-Loop Dialogue Systems in NLP Systems', 'The integration of human feedback and interaction in dialogue systems in NLP systems.'),
('Interactive Dialogue Systems in NLP Systems', 'Dialogue systems that can interact with users in real-time in NLP systems.'),
('Dialogue Management in NLP Systems', 'The process of managing the flow and context of a conversation in NLP systems.'),
('Response Generation in NLP Systems', 'The task of generating appropriate responses in NLP systems.'),
('Intent Recognition in NLP Systems', 'The task of identifying the intent behind a user''s input in NLP systems.'),
('Slot Filling in NLP Systems', 'The task of extracting and filling specific information in NLP systems.'),
('Dialogue State Tracking in NLP Systems', 'The process of maintaining the state and context of a conversation in NLP systems.'),
('Conversational Context in NLP Systems', 'The context and history of a conversation in NLP systems.'),
('Dialogue Policy Learning in NLP Systems', 'The process of learning policies for managing dialogue in NLP systems.'),
('Conversational Agents in NLP Systems', 'AI systems that engage in human-like dialogue, often used in customer service.'),
('Natural Language Understanding in NLP Systems', 'The ability of NLP systems to understand and interpret user input.'),
('Natural Language Generation in NLP Systems', 'The process of generating natural language responses in NLP systems.'),
('Dialogue System Evaluation in NLP Systems', 'The process of assessing the performance of dialogue systems in NLP systems.'),
('Conversational AI Evaluation in NLP Systems', 'The process of assessing the performance of conversational AI systems in NLP systems.'),
('Dialogue System Adaptation in NLP Systems', 'The process of adapting dialogue systems to new domains or tasks in NLP systems.'),
('Conversational AI Adaptation in NLP Systems', 'The process of adapting conversational AI systems to new domains or tasks in NLP systems.'),
('Dialogue System Robustness in NLP Systems', 'The ability of dialogue systems to perform well across different tasks and domains in NLP systems.'),
('Conversational AI Robustness in NLP Systems', 'The ability of conversational AI systems to perform well across different tasks and domains in NLP systems.'),
('Dialogue System Interpretability in NLP Systems', 'The ability to understand and explain the decisions made by dialogue systems in NLP systems.'),
('Conversational AI Interpretability in NLP Systems', 'The ability to understand and explain the decisions made by conversational AI systems in NLP systems.'),
('Dialogue System Fairness in NLP Systems', 'The study of ensuring that dialogue systems treat all users and data fairly in NLP systems.'),
('Conversational AI Fairness in NLP Systems', 'The study of ensuring that conversational AI systems treat all users and data fairly in NLP systems.'),
('Dialogue System Privacy in NLP Systems', 'The study of protecting user data and privacy in dialogue systems in NLP systems.'),
('Conversational AI Privacy in NLP Systems', 'The study of protecting user data and privacy in conversational AI systems in NLP systems.'),
('Dialogue System Security in NLP Systems', 'The study of protecting dialogue systems from attacks and vulnerabilities in NLP systems.'),
('Conversational AI Security in NLP Systems', 'The study of protecting conversational AI systems from attacks and vulnerabilities in NLP systems.'),
('Dialogue System Scalability in NLP Systems', 'The ability of dialogue systems to handle large-scale data and tasks in NLP systems.'),
('Conversational AI Scalability in NLP Systems', 'The ability of conversational AI systems to handle large-scale data and tasks in NLP systems.'),
('Dialogue System Efficiency in NLP Systems', 'The study of optimizing the performance and resource usage of dialogue systems in NLP systems.'),
('Conversational AI Efficiency in NLP Systems', 'The study of optimizing the performance and resource usage of conversational AI systems in NLP systems.'),
('Dialogue System Deployment in NLP Systems', 'The process of deploying dialogue systems for use in real-world applications in NLP systems.'),
('Conversational AI Deployment in NLP Systems', 'The process of deploying conversational AI systems for use in real-world applications in NLP systems.'),
('Dialogue System Continuous Learning in NLP Systems', 'The ability of dialogue systems to learn and adapt over time in NLP systems.'),
('Human-in-the-Loop Conversational AI in NLP Systems', 'The integration of human feedback and interaction in conversational AI systems in NLP systems.'),
('Interactive Conversational AI in NLP Systems', 'Conversational AI systems that can interact with users in real-time in NLP systems.');

-- Insert dummy data into explain_history
INSERT INTO explain_history (word_id, previous_explain, changed_at) VALUES
(1, 'Initial explanation for word 1', '2023-10-01 10:00:00'),
(1, 'Initial explanation for word 2', '2023-10-02 11:00:00'),
(1, 'Initial explanation for word 3', '2023-10-03 12:00:00'),
(2, 'Initial explanation for word 2', '2023-10-02 11:00:00'),
(3, 'Initial explanation for word 3', '2023-10-03 12:00:00'),
(12, 'Initial explanation for word 2', '2023-10-02 11:00:00'),
(13, 'Initial explanation for word 3', '2023-10-03 12:00:00'),
(22, 'Initial explanation for word 2', '2023-10-02 11:00:00'),
(23, 'Initial explanation for word 3', '2023-10-03 12:00:00'),
(32, 'Initial explanation for word 2', '2023-10-02 11:00:00'),
(33, 'Initial explanation for word 3', '2023-10-03 12:00:00'),
(42, 'Initial explanation for word 2', '2023-10-02 11:00:00'),
(43, 'Initial explanation for word 3', '2023-10-03 12:00:00');

INSERT INTO related_words (word_id, related_word_id, correlation) VALUES
(1, 2, 0.73), (2, 1, 0.73),
(1, 3, 0.45), (3, 1, 0.45),
(1, 6, 0.89), (6, 1, 0.89),
(1, 10, 0.21), (10, 1, 0.21),
(2, 4, 0.62), (4, 2, 0.62),
(2, 7, 0.95), (7, 2, 0.95),
(2, 11, 0.38), (11, 2, 0.38),
(3, 5, 0.56), (5, 3, 0.56),
(3, 8, 0.79), (8, 3, 0.79),
(3, 12, 0.14), (12, 3, 0.14),
(4, 9, 0.87), (9, 4, 0.87),
(4, 13, 0.32), (13, 4, 0.32),
(5, 14, 0.68), (14, 5, 0.68),
(5, 15, 0.41), (15, 5, 0.41),
(6, 16, 0.93), (16, 6, 0.93),
(6, 17, 0.27), (17, 6, 0.27),
(7, 18, 0.81), (18, 7, 0.81),
(7, 19, 0.53), (19, 7, 0.53),
(8, 20, 0.76), (20, 8, 0.76),
(8, 21, 0.19), (21, 8, 0.19),
(9, 22, 0.84), (22, 9, 0.84),
(9, 23, 0.37), (23, 9, 0.37),
(10, 24, 0.59), (24, 10, 0.59),
(10, 25, 0.92), (25, 10, 0.92),
(11, 26, 0.43), (26, 11, 0.43),
(11, 27, 0.78), (27, 11, 0.78),
(12, 28, 0.25), (28, 12, 0.25),
(12, 29, 0.71), (29, 12, 0.71),
(13, 30, 0.86), (30, 13, 0.86),
(13, 31, 0.34), (31, 13, 0.34),
(14, 32, 0.67), (32, 14, 0.67),
(14, 33, 0.98), (33, 14, 0.98),
(15, 34, 0.51), (34, 15, 0.51),
(15, 35, 0.83), (35, 15, 0.83),
(16, 36, 0.29), (36, 16, 0.29),
(16, 37, 0.75), (37, 16, 0.75),
(17, 38, 0.91), (38, 17, 0.91),
(17, 39, 0.47), (39, 17, 0.47),
(18, 40, 0.64), (40, 18, 0.64),
(18, 41, 0.88), (41, 18, 0.88),
(19, 42, 0.23), (42, 19, 0.23),
(19, 43, 0.72), (43, 19, 0.72),
(20, 44, 0.96), (44, 20, 0.96),
(20, 45, 0.39), (45, 20, 0.39),
(21, 46, 0.58), (46, 21, 0.58),
(21, 47, 0.85), (47, 21, 0.85),
(22, 48, 0.31), (48, 22, 0.31),
(22, 49, 0.77), (49, 22, 0.77),
(23, 24, 0.65), (24, 23, 0.65),
(23, 25, 0.78), (25, 23, 0.78),
(23, 26, 0.54), (26, 23, 0.54),
(24, 27, 0.82), (27, 24, 0.82),
(24, 28, 0.49), (28, 24, 0.49),
(25, 29, 0.91), (29, 25, 0.91),
(25, 30, 0.33), (30, 25, 0.33),
(26, 31, 0.76), (31, 26, 0.76),
(26, 32, 0.58), (32, 26, 0.58),
(27, 33, 0.87), (33, 27, 0.87),
(27, 34, 0.42), (34, 27, 0.42),
(28, 35, 0.69), (35, 28, 0.69),
(28, 36, 0.95), (36, 28, 0.95),
(29, 37, 0.53), (37, 29, 0.53),
(29, 38, 0.81), (38, 29, 0.81),
(30, 39, 0.74), (39, 30, 0.74),
(30, 40, 0.29), (40, 30, 0.29),
(31, 41, 0.88), (41, 31, 0.88),
(31, 42, 0.36), (42, 31, 0.36),
(32, 43, 0.67), (43, 32, 0.67),
(32, 44, 0.92), (44, 32, 0.92),
(33, 45, 0.51), (45, 33, 0.51),
(33, 46, 0.83), (46, 33, 0.83),
(34, 47, 0.29), (47, 34, 0.29),
(34, 48, 0.75), (48, 34, 0.75),
(35, 49, 0.91), (49, 35, 0.91),
(35, 50, 0.47), (50, 35, 0.47);



