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

    /// Re-render the component when the searchTerm changes
    const renderSearchBar = () =>
      render(
        <SearchBar
          searchTerm={searchTerm} // Initial value of the search input
          handleSearchChange={handleSearchChange} // Mock function to handle input changes
          clearSearchBar={() => {
            clearSearchBar(); // Call the mocked clearSearchBar function
            searchTerm = ""; // Simulate clearing the search term
            renderSearchBar(); // Re-render the SearchBar with the updated searchTerm
          }}
        />
      );

    // Render the SearchBar component with initial props
    renderSearchBar();

    console.log("SearchBar component rendered");

    // Get the input element by its placeholder text
    let inputElement = screen.getAllByPlaceholderText(/search/i)[0];

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

    // Re-select the input element after clearing the search term
    inputElement = screen.getAllByPlaceholderText(/search/i)[0];

    // Log the input element's value
    console.log(
      "Input element value after clear button click:",
      inputElement.value
    );

    // Assert that the clearSearchBar function was called once
    expect(clearSearchBar).toHaveBeenCalledTimes(1);

    // Assert that the input field is cleared
    expect(inputElement.value).toBe("");

    console.log("Test completed successfully");
  });
});
