// backend/trie.js
class TrieNode {
  constructor() {
    this.links = new Array(26).fill(null);
    this.isEnd = false;
  }

  containsKey(ch) {
    return this.links[ch.charCodeAt(0) - 'a'.charCodeAt(0)] !== null;
  }

  put(ch, node) {
    this.links[ch.charCodeAt(0) - 'a'.charCodeAt(0)] = node;
  }

  get(ch) {
    return this.links[ch.charCodeAt(0) - 'a'.charCodeAt(0)];
  }

  setEnd() {
    this.isEnd = true;
  }

  isEndOfWord() {
    return this.isEnd;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let ch of word.toLowerCase()) {
      if (ch >= 'a' && ch <= 'z') {
        if (!node.containsKey(ch)) {
          node.put(ch, new TrieNode());
        }
        node = node.get(ch);
      }
    }
    node.setEnd();
  }

  getSuggestions(prefix) {
    let node = this.root;
    for (let ch of prefix.toLowerCase()) {
      if (ch >= 'a' && ch <= 'z') {
        if (!node.containsKey(ch)) return [];
        node = node.get(ch);
      }
    }

    const suggestions = [];
    this._collectSuggestions(node, prefix.toLowerCase(), suggestions);
    return suggestions;
  }

  _collectSuggestions(node, prefix, suggestions) {
    if (node.isEndOfWord()) {
      suggestions.push(prefix);
    }

    for (let i = 0; i < 26; i++) {
      if (node.links[i]) {
        const ch = String.fromCharCode(i + 'a'.charCodeAt(0));
        this._collectSuggestions(node.links[i], prefix + ch, suggestions);
      }
    }
  }
}

module.exports = Trie;
