// ?React and testing-library imports
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest"; // Use Vitest functions

// ?Component imports
import SearchBar from "./SearchBar"; // Import the SearchBar component to be tested

// Mock the CSS import to avoid errors related to CSS modules
vi.mock("../StarWarsSearchBar/SearchBar.css", () => ({
  __esModule: true,
  default: "mocked-search-bar-css", // or an empty object, depending on your use case
}));

// ?TESTS

// Test case to verify that the search bar renders correctly and the clear functionality works
describe("SearchBar Component", () => {
  it("renders search bar and clears input", () => {
    console.log("Starting test: renders search bar and clears input");

    // Create mock functions to pass as props to the SearchBar component
    const handleSearchChange = vi.fn(); // Use `vi.fn()` instead of `jest.fn()`
    const clearSearchBar = vi.fn();

    // Initialize the search term
    let searchTerm = "Luke";

    // Render the SearchBar component with initial props
    const { rerender } = render(
      <SearchBar
        searchTerm={searchTerm} // Initial value of the search input
        handleSearchChange={handleSearchChange} // Mock function to handle input changes
        clearSearchBar={() => {
          clearSearchBar(); // Call the mocked clearSearchBar function
          searchTerm = ""; // Simulate clearing the search term
          rerender(
            // Re-render the component with the updated searchTerm
            <SearchBar
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              clearSearchBar={clearSearchBar}
            />
          );
        }}
      />
    );

    console.log("SearchBar component rendered");

    // Get the input element by its placeholder text
    const inputElement = screen.getByPlaceholderText(/search/i);

    // Log the input element's value
    console.log("Input element value before any action:", inputElement.value);

    // Assert that the input element's value is "Luke"
    expect(inputElement.value).toBe("Luke");

    // Get the clear button element
    const clearButton = screen.getByRole("button");

    // Simulate a click event on the clear button
    fireEvent.click(clearButton);

    // Log the fact that the clear button was clicked
    console.log("Clear button clicked");

    // Re-render the component with updated props if needed (not always necessary if rerender handles it)
    rerender(
      <SearchBar
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        clearSearchBar={clearSearchBar}
      />
    );

    // Assert that the clearSearchBar function was called once
    expect(clearSearchBar).toHaveBeenCalledTimes(1);

    // Assert that the input field is cleared
    expect(inputElement.value).toBe(""); // After re-rendering, this should be empty

    console.log("Test completed successfully");
  });
});
