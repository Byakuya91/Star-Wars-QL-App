import React from "react";
// ? CSS imports
import "../StarWarsSearchBar/SearchBar.css";

// New update
const SearchBar = ({ searchTerm, handleSearchChange, clearSearchBar }) => {
  // console.log("The Search is: ", searchTerm);
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
        data-testid="search-input" // Add data-testid for easier querying
      />
      {searchTerm && (
        <button
          className="clear-button"
          onClick={clearSearchBar}
          data-testid="clear-button"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;
