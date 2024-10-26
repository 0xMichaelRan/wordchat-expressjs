require('dotenv').config();
const express = require('express');
const cors = require('cors');
const wordsRouter = require('./routes/words');
const relatedRouter = require('./routes/related');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/words', wordsRouter);
app.use('/api/related', relatedRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});