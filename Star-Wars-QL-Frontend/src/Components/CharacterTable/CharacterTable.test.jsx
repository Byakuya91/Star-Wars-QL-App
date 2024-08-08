// ?React libraries
import React from "react";

// ?Testing libraries
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom"; // Correct import for jest-dom

// ?Apollo client libraries
import { MockedProvider } from "@apollo/client/testing";

// ?Component libraries
import CharacterTable from "./CharacterTable";

// ?Query imports
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// TODO: Tests I wish to cover
// 1 Renders the table from the API (DONE)
// 2 Does NOT render the table from the API(DONE)
// 3 Search functionality(DONE)
// 4 Sorting functionality(ONGOING)
// 5 pagimation
//  6 Add character functionality
// 7 Delete character functionality

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
  //? Search functionality
  it("filters the data based on a search term.", async () => {
    // Render the character table
    render(
      <MockedProvider mocks={[starWarsMockData[0]]} addTypename={false}>
        <CharacterTable />
      </MockedProvider>
    );
    fireEvent.click(screen.getByText("Show Star Wars Characters"));

    // Waiting for the table to be rendered

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });

    // Enter the Search term
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Leia" },
    });

    // Wait for the table to be updated
    await waitFor(() => {
      expect(screen.getByText("Leia Organa")).toBeInTheDocument();
      expect(screen.queryByText("Luke Skywalker")).not.toBeInTheDocument();
    });
  });

  // ? Sort test: testing if the table can be sorted by either "Name", "Species" or "Homeworld"
  it("sorts the data by name when 'Name' header is clicked", async () => {
    //  STEP ONE: Wait for the table to be rendered
    render(
      <MockedProvider mocks={[starWarsMockData[0]]} addTypename={false}>
        <CharacterTable />
      </MockedProvider>
    );
    fireEvent.click(screen.getByText("Show Star Wars Characters"));

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });

    // STEP TWO: simulate the click of "Name" header to sort by "Name".
    fireEvent.click(screen.getByText(/^Name/));

    // STEP THREE: create the rows for the simulation
    const rows = screen.getAllByRole("row");

    expect(rows[1]).toHaveTextContent("C-3PO");
    expect(rows[2]).toHaveTextContent("Darth Vader");
    expect(rows[3]).toHaveTextContent("Han Solo");
    expect(rows[4]).toHaveTextContent("Leia Organa");
    expect(rows[5]).toHaveTextContent("Luke Skywalker");
    expect(rows[6]).toHaveTextContent("R2-D2");
  });
});
