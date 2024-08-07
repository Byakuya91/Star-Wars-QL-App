# Star-Wars-QL-App

Utilizing the SWAPI to create a table of Star Wars character names, species, homeworlds, movies etc.

# UNIT TESTS

---

## Test Documentation

### SearchBar Component Tests

**File: `SearchBar.test.js`**

**Description**: This file contains tests for the `SearchBar` component, ensuring it renders correctly and the clear functionality works as expected.

```javascript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Extends Jest's expect assertions with custom matchers for DOM nodes
import SearchBar from "./SearchBar"; // Import the SearchBar component to be tested

// Mock the CSS import to avoid errors related to CSS modules
jest.mock("../StarWarsSearchBar/SearchBar.css", () => ({
  __esModule: true,
  default: "mocked-search-bar-css", // or an empty object, depending on your use case
}));

test("renders search bar and clears input", () => {
  const handleSearchChange = jest.fn();
  const clearSearchBar = jest.fn();

  render(
    <SearchBar
      searchTerm="Luke"
      handleSearchChange={handleSearchChange}
      clearSearchBar={clearSearchBar}
    />
  );

  const inputElement = screen.getByPlaceholderText(/search/i);
  expect(inputElement.value).toBe("Luke");

  const clearButton = screen.getByRole("button");
  fireEvent.click(clearButton);

  expect(clearSearchBar).toHaveBeenCalledTimes(1);
});
```

### CharacterTable Component Tests

**File: `CharacterTable.test.js`**

**Description**: This file contains tests for the `findCharacter` function and the `CharacterTable` component, ensuring they behave as expected. The `MockedProvider` from `@apollo/client/testing` is used to mock the Apollo Client.

```javascript
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CharacterTable, { findCharacter } from "../CharacterTable";
import { MockedProvider } from "@apollo/client/testing";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// Mock data for Apollo Client
const mocks = [
  {
    request: {
      query: GET_STAR_WARS_CHARACTERS,
    },
    result: {
      data: {
        allPeople: {
          people: [
            {
              id: "1",
              name: "Luke Skywalker",
              species: { name: "Human" },
              homeworld: { name: "Tatooine" },
            },
            {
              id: "2",
              name: "Darth Vader",
              species: { name: "Human" },
              homeworld: { name: "Tatooine" },
            },
            {
              id: "3",
              name: "Leia Organa",
              species: { name: "Human" },
              homeworld: { name: "Alderaan" },
            },
            {
              id: "4",
              name: "Chewbacca",
              species: { name: "Wookiee" },
              homeworld: { name: "Kashyyyk" },
            },
          ],
        },
      },
    },
  },
];

// Tests for the findCharacter function
describe("findCharacter", () => {
  const characters = [
    {
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    },
    {
      name: "Darth Vader",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    },
    {
      name: "Leia Organa",
      species: { name: "Human" },
      homeworld: { name: "Alderaan" },
    },
    {
      name: "Chewbacca",
      species: { name: "Wookiee" },
      homeworld: { name: "Kashyyyk" },
    },
  ];

  const keys = ["name", "species.name", "homeworld.name"];

  test("finds characters by name", () => {
    const result = findCharacter(characters[0], "Luke", keys);
    expect(result).toBe(true);
  });

  test("finds characters by species", () => {
    const result = findCharacter(characters[3], "Wookiee", keys);
    expect(result).toBe(true);
  });

  test("finds characters by homeworld", () => {
    const result = findCharacter(characters[0], "Tatooine", keys);
    expect(result).toBe(true);
  });

  test("returns false if no characters match", () => {
    const result = findCharacter(characters[0], "Yoda", keys);
    expect(result).toBe(false);
  });
});

// Tests for the CharacterTable component
describe("CharacterTable", () => {
  test("renders without crashing", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CharacterTable />
      </MockedProvider>
    );
  });

  // More tests can be added here to simulate user interactions and verify the component's behavior
});
```

### Summary

- **SearchBar.test.js**: Tests the `SearchBar` component, ensuring it renders correctly and the clear functionality works.
- **CharacterTable.test.js**: Tests the `findCharacter` function to ensure it correctly identifies characters based on different criteria, and verifies that the `CharacterTable` component renders without crashing using mock Apollo Client data.

---
