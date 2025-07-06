const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const Trie = require('./trie');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const trie = new Trie();

// Load countries from file
const countriesPath = path.join(__dirname, 'countries.txt');
if (fs.existsSync(countriesPath)) {
  const countries = fs.readFileSync(countriesPath, 'utf-8')
    .split('\n')
    .map(country => country.trim().toLowerCase());

  countries.forEach(country => {
    if (country) trie.insert(country);
  });
  console.log(`✅ Loaded ${countries.length} countries into trie`);
} else {
  console.error('❌ countries.txt not found!');
}

// API route for autocomplete suggestions
app.get('/api/suggestions', (req, res) => {
  const prefix = (req.query.prefix || '').toLowerCase();
  const suggestions = trie.getSuggestions(prefix);
  res.json(suggestions.length > 0 ? suggestions : ['No results found']);
});

// Catch-all route to serve React index.html (for client-side routing)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
