import React from 'react';

const SearchBar = ({ searchTerm, handleSearchChange }) => {
    console.log("The Search is: ", searchTerm);
  return (
    <input
      type='text'
      placeholder='Search...'
      value={searchTerm}
      onChange={handleSearchChange}
      className='search-input'
    />
  );
};


export default SearchBar;
