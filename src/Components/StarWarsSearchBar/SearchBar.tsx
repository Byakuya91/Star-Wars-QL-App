import React from "react";
// ? CSS imports
import "../StarWarsSearchBar/SearchBar.css";

// TODO: refactor the the SearchBar component to be more in line with typescript

// Define prop types
interface SearchBarProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchBar: () => void;
}

// New update
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
