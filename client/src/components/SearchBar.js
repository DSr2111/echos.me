// client/src/components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch([query]); // Pass query as an array
      setQuery(''); // Clear input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch([query]); // Trigger search on Enter
      setQuery(''); // Clear input
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
      </div>
      <button onClick={handleSearchClick} className="search-button">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
