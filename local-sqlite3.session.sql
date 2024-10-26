SELECT * FROM words ORDER BY id DESC;

SELECT * FROM words WHERE word LIKE '%gen%';

SELECT * FROM explain_history;

SELECT * FROM related_words;

SELECT * FROM words WHERE explain IS '' ORDER BY RANDOM() LIMIT 1