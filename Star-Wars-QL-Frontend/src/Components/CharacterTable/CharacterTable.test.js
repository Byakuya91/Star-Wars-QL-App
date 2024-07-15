// Import necessary libraries
// ?React libraries
import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";

// ?Testing libaries
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test } from "@testing-library/jest-dom/extend-expect";
// ?Apollo client libraries
import { MockedProvider } from "@apollo/client/testing";
//? Component libraries
import CharacterTable, { findCharacter } from "./CharacterTable";
// ?Query imports
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// Mock data for Apollo Client
const mocks = [
  {
    request: {
      query: GET_STAR_WARS_CHARACTERS,
    },
    result: {
      data: {
        allPeople: [
          {
            id: "1",
            name: "Luke Skywalker",
            species: "Human",
            homeworld: "Tatooine",
          },
          {
            id: "2",
            name: "Darth Vader",
            species: "Human",
            homeworld: "Tatooine",
          },
          {
            id: "3",
            name: "Han Solo",
            species: "Human",
            homeworld: "Tatooine",
          },
          {
            id: "4",
            name: "Leia Organa",
            species: "Human",
            homeworld: "Alderaan",
          },
          { id: "5", name: "R2-D2", species: "droid", homeworld: "Tatooine" },
          { id: "6", name: "C3P0", species: "droid", homeworld: "Tatooine" },
        ],
      },
    },
  },
  {
    request: {
      query: GET_STAR_WARS_CHARACTERS,
    },
    error: new Error("Failed to fetch data"),
  },
];

// Tests for the findCharacter function
describe("findCharacter", () => {
  const characters = [
    { name: "Luke Skywalker", species: "Human", homeworld: "Tatooine" },
    { name: "Darth Vader", species: "Human", homeworld: "Tatooine" },
    { name: "Han Solo", species: "Human", homeworld: "Tatooine" },
    { name: "Leia Organa", species: "Human", homeworld: "Alderaan" },
    { name: "R2-D2", species: "droid", homeworld: "Tatooine" },
    { name: "C3P0", species: "droid", homeworld: "Tatooine" },
  ];
  const keys = ["name", "species", "homeworld"];

  test("finds characters by name", () => {
    const result = findCharacter(characters[0], "Luke", keys);
    expect(result).toBe(true);
  });

  test("finds characters by species", () => {
    const result = findCharacter(characters[4], "droid", keys);
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
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CharacterTable />
      </MockedProvider>
    );
  });

  test("renders the table with data from the API", async () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
      <MockedProvider mocks={[mocks[0]]} addTypename={false}>
        <CharacterTable />
      </MockedProvider>
    );

    // Click the button to show the table
    fireEvent.click(screen.getByText("Show Star Wars Characters"));

    // Wait for the table to be rendered
    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
      expect(screen.getByText("Darth Vader")).toBeInTheDocument();
      expect(screen.getByText("Han Solo")).toBeInTheDocument();
      expect(screen.getByText("Leia Organa")).toBeInTheDocument();
      expect(screen.getByText("R2-D2")).toBeInTheDocument();
      expect(screen.getByText("C3P0")).toBeInTheDocument();
    });
  });

  test("displays an error message when the API call fails", async () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
      <MockedProvider mocks={[mocks[1]]} addTypename={false}>
        <CharacterTable />
      </MockedProvider>
    );

    // Click the button to show the table
    fireEvent.click(screen.getByText("Show Star Wars Characters"));

    // Wait for the error message to be rendered
    await waitFor(() => {
      expect(
        screen.getByText("Error: Failed to fetch data")
      ).toBeInTheDocument();
    });
  });
});
