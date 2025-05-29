import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const highlightMatch = (text, query) => {
  if (!query || !text) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded font-medium">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmedQuery = query.trim();
      if (trimmedQuery === '') {
        setSuggestions([]);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/suggestions?prefix=${encodeURIComponent(trimmedQuery)}`);
        setSuggestions(res.data);
        setError(null);
        setActiveSuggestion(-1);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch suggestions. Please try again.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : -1));
    }
    else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    }

    if (activeSuggestion >= 0 && suggestionsRef.current) {
      const activeItem = suggestionsRef.current.children[activeSuggestion];
      activeItem?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Determine if label should float
  const shouldFloat = isFocused || query !== '';

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-10 border border-white/30">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-wide">
          🌍 Country Search
        </h1>

        {/* Fixed Floating label input */}
        <div className="relative z-0 w-full mb-6">
          <input
            ref={inputRef}
            type="text"
            name="search"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="block py-3 px-4 w-full text-base sm:text-lg text-gray-900 bg-white rounded-xl 
                      appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 
                      focus:border-indigo-500 shadow-sm transition duration-200 border border-gray-300"
            placeholder=" "
            autoComplete="off"
          />
          <label
            htmlFor="search"
            className={`absolute left-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none
              ${shouldFloat ? 
                '-translate-y-6 scale-75 bg-transparent text-indigo-600' : 
                'translate-y-0 scale-100 bg-transparent text-gray-500'
              }`}
            style={{
              top: '1rem',
              transformOrigin: 'left center',
            }}
          >
            Type a country name...
          </label>
          <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Suggestions List */}
        {query.trim() !== '' && (
          <div
            ref={suggestionsRef}
            className="bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto border border-gray-200"
          >
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="p-4 text-center text-gray-500">
                  <div className="flex justify-center items-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </li>
              ) : error ? (
                <li className="p-4 flex items-center text-red-500">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </li>
              ) : suggestions.length === 0 ? (
                <li className="p-4 text-center text-gray-500">
                  No matches found
                </li>
              ) : (
                suggestions.map((s, i) => (
                  <li
                    key={i}
                    className={`p-3 cursor-pointer transition-colors duration-150 flex items-center ${
                      i === activeSuggestion ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => handleSuggestionClick(s)}
                    onMouseEnter={() => setActiveSuggestion(i)}
                  >
                    <span className="text-base sm:text-lg">
                      {highlightMatch(s, query)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;   