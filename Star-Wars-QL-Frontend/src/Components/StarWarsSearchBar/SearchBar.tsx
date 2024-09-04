import React from "react";
import "../StarWarsSearchBar/SearchBar.css";

// Define the props interface for the SearchBar component
interface SearchBarProps {
  searchTerm: string; // The current search term in the input
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Event handler for input changes
  clearSearchBar: () => void; // Function to clear the search term
}

// Update the SearchBar component to use TypeScript
const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  handleSearchChange,
  clearSearchBar,
}) => {
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
