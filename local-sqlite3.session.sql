SELECT * FROM words ORDER BY id DESC;

SELECT * FROM words WHERE word LIKE 'language model %';

SELECT * FROM explain_history;

SELECT * FROM related_words;

SELECT count(*) FROM words WHERE explain != '' AND edit_since_embedding = -1;
