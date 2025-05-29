// backend/server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const Trie = require('./trie');

const app = express();
const PORT = 3001;

app.use(cors());

const trie = new Trie();

// Load countries from file and insert into trie
const countries = fs.readFileSync('countries.txt', 'utf-8')
  .split('\n')
  .map(country => country.trim().toLowerCase());

countries.forEach(country => trie.insert(country));

// API endpoint for suggestions
app.get('/api/suggestions', (req, res) => {
  const prefix = (req.query.prefix || '').toLowerCase();
  const suggestions = trie.getSuggestions(prefix);
  res.json(suggestions);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
