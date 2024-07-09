// Import necessary libraries
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CharacterTable, { findCharacter } from "./CharacterTable";
import { MockedProvider } from "@apollo/client/testing";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

//? Mock data for Apollo Client
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
  //   Keys for testing
  const keys = ["name", "species", "homeworld"];

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
    render(<MockedProvider mocks={mocks} addTypename={false} />);
  });

  // More tests can be added here to simulate user interactions and verify the component's behavior
});
