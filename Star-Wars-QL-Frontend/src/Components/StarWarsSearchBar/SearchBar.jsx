import React from "react";
// ? CSS imports
// import "../StarWarsSearchBar/SearchBar.css";
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
      />
      {searchTerm && (
        <button className="clear-button" onClick={clearSearchBar}>
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;
