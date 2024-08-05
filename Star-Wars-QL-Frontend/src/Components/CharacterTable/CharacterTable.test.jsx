// ?React libraries
import React from "react";

// ?Testing libraries
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom"; // Correct import for jest-dom

// ?Apollo client libraries
import { MockedProvider } from "@apollo/client/testing";

// ?Component libraries
import CharacterTable from "./CharacterTable";

// ?Query imports
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// ? STEP ONE: Mock the data
// Mock data for Apollo Client
const starWarsMockData = [
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
          { id: "5", name: "R2-D2", species: "Droid", homeworld: "Tatooine" },
          { id: "6", name: "C-3PO", species: "Droid", homeworld: "Tatooine" },
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

// ? STEP TWO: Render the table component
describe("CharacterTables Component", () => {
  it("renders the table with data from the API", async () => {
    render(
      <MockedProvider mocks={[starWarsMockData[0]]} addTypename={false}>
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
      expect(screen.getByText("C-3PO")).toBeInTheDocument();
    });
  });

  it("displays an error message when the API call fails", async () => {
    render(
      <MockedProvider mocks={[starWarsMockData[1]]} addTypename={false}>
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
