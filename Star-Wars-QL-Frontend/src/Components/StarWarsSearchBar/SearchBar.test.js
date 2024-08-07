// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom"; // Extends Jest's expect assertions with custom matchers for DOM nodes
// import SearchBar from "./SearchBar"; // Import the SearchBar component to be tested

// // Mock the CSS import to avoid errors related to CSS modules
// jest.mock("../StarWarsSearchBar/SearchBar.css", () => ({
//   __esModule: true,
//   default: "mocked-search-bar-css", // or an empty object, depending on your use case
// }));

// // Test case to verify that the search bar renders correctly and the clear functionality works
// test("renders search bar and clears input", () => {
//   // Create mock functions to pass as props to the SearchBar component
//   const handleSearchChange = jest.fn();
//   const clearSearchBar = jest.fn();

//   // Render the SearchBar component with initial props
//   render(
//     <SearchBar
//       searchTerm="Luke" // Initial value of the search input
//       handleSearchChange={handleSearchChange} // Mock function to handle input changes
//       clearSearchBar={clearSearchBar} // Mock function to handle clearing the input
//     />
//   );

//   // Get the input element by its placeholder text
//   const inputElement = screen.getByPlaceholderText(/search/i);

//   // Assert that the input element's value is "Luke"
//   expect(inputElement.value).toBe("Luke");

//   // Get the clear button element
//   const clearButton = screen.getByRole("button");

//   // Simulate a click event on the clear button
//   fireEvent.click(clearButton);

//   // Assert that the clearSearchBar function was called once
//   expect(clearSearchBar).toHaveBeenCalledTimes(1);
// });
