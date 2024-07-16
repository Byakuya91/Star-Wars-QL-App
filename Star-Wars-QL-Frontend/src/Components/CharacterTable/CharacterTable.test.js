// ?React libraries
import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";

// ?Testing libaries
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
// ?Apollo client libraries
import { MockedProvider } from "@apollo/client/testing";
//? Component libraries
import CharacterTable, { findCharacter } from "./CharacterTable";
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

//? STEP TWO: Render the table component

describe("CharacterTables Component", () => {
  test("renders the table with data from the API", async () => {
    //! Implementing createRoot
    // ? STEP ONE: create div element
    const container = document.createElement("div");
    // ? STEP TWO: append the div to the body  of the doc
    document.body.appendChild(container);
    // ? STEP THREE: create a root for simulation.
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <MockedProvider mocks={[starWarsMockData[0]]} addTypename={false}>
          <CharacterTable />
        </MockedProvider>
      );
    });
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
    //  ? Unmounting the component
    root.unmount();
    document.body.removeChild(container);
  });

  // ? Failure to call an API
  test("displays an error message when the API call fails", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <MockedProvider mocks={[starWarsMockData[1]]} addTypename={false}>
          <CharacterTable />
        </MockedProvider>
      );
    });

    // Click the button to show the table
    fireEvent.click(screen.getByText("Show Star Wars Characters"));

    // Wait for the error message to be rendered
    await waitFor(() => {
      expect(
        screen.getByText("Error: Failed to fetch data")
      ).toBeInTheDocument();
    });

    root.unmount();
    document.body.removeChild(container);
  });
});
