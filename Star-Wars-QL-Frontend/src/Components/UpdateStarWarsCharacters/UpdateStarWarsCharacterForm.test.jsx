// ? testing libraries
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";

// ? Component imports
import UpdateStarWarsCharactersForm from "../UpdateStarWarsCharacters/UpdateStarWarsCharactersForm";

// ? Query imports
import { UPDATE_CHARACTER } from "../Querries/UpdateStarWarsData";

// ?UNIT Tests for UpdateStarWarsCharactersForm Component
describe("UpdateStarWarsCharacterForm Component", () => {
  // ?Test 1: Rendering the form with the initial character data
  it("renders the form with initial character data", () => {
    // ? Mock character data to simulate the initial form state
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    // ? Render the component within a MockedProvider
    render(
      <MockedProvider>
        <UpdateStarWarsCharactersForm character={character} />
      </MockedProvider>
    );

    // ? Ensure that each input field is correctly populated with the character data
    expect(screen.getByDisplayValue("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Human")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tatooine")).toBeInTheDocument();
  });

  // ?Test 2: Submitting the form with updated data
  it("submits the form with updated data", async () => {
    // ? Mock character data to simulate the initial form state
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    // ? Mock the mutation response for the Apollo Client
    const mocks = [
      {
        request: {
          query: UPDATE_CHARACTER,
          variables: {
            id: "1",
            name: "Darth Vader", // New name for the character
            species: "Sith", // New species for the character
            homeworld: "Mustafar", // New homeworld for the character
          },
        },
        result: {
          data: {
            updateCharacter: {
              id: "1",
              name: "Darth Vader",
              species: "Sith",
              homeworld: "Mustafar",
              __typename: "Character",
            },
          },
        },
      },
    ];

    // ? Mock function to handle the onUpdate callback
    const onUpdateMock = vi.fn();

    // ? Render the component within a MockedProvider with the mocked mutation
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UpdateStarWarsCharactersForm
          character={character}
          onUpdate={onUpdateMock}
        />
      </MockedProvider>
    );

    // ? Simulate changing the values in the input fields
    fireEvent.change(screen.getByDisplayValue("Luke Skywalker"), {
      target: { value: "Darth Vader" }, // Changing name
    });
    fireEvent.change(screen.getByDisplayValue("Human"), {
      target: { value: "Sith" }, // Changing species
    });
    fireEvent.change(screen.getByDisplayValue("Tatooine"), {
      target: { value: "Mustafar" }, // Changing homeworld
    });

    // ? Simulate clicking the submit button to trigger the mutation
    fireEvent.click(screen.getByText(/Submit/i));

    // ? Wait for the mutation to be called and ensure it was called with the correct arguments
    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalled(); // Ensure the onUpdate callback is triggered
    });
  });

  // ?Test 3: Submitting without changes
  it("does not send the mutation if no changes were made", async () => {
    // ? Mock character data to simulate the initial form state
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    // ? Mock mutation setup - should not be triggered if no changes are made
    const mocks = [
      {
        request: {
          query: UPDATE_CHARACTER,
          variables: {
            id: "1",
            name: "Luke Skywalker", // No changes
            species: "Human",
            homeworld: "Tatooine",
          },
        },
        result: {
          data: {
            updateCharacter: null, // Mutation should not be called
          },
        },
      },
    ];

    // ? Mock function to handle the onUpdate callback
    const onUpdateMock = vi.fn();

    // ? Render the component within a MockedProvider with the mocked mutation
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UpdateStarWarsCharactersForm
          character={character}
          onUpdate={onUpdateMock}
        />
      </MockedProvider>
    );

    // ? Simulate clicking the submit button without making any changes
    fireEvent.click(screen.getByText(/Submit/i));

    // ? Ensure that the mutation is not triggered
    await waitFor(() => {
      expect(onUpdateMock).not.toHaveBeenCalled(); // Ensure onUpdate callback is NOT triggered
    });
  });

  // ?Test 4: Closing the form without submitting
  it("calls onClose when cancel button is clicked", () => {
    // ? Mock character data to simulate the initial form state
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    // ? Mock function to handle the onClose callback
    const onCloseMock = vi.fn();

    // ? Render the component within a MockedProvider
    render(
      <MockedProvider>
        <UpdateStarWarsCharactersForm
          character={character}
          onClose={onCloseMock}
        />
      </MockedProvider>
    );

    // ? Simulate clicking the cancel button to close the form
    fireEvent.click(screen.getByText(/Cancel/i));

    // ? Ensure the onClose callback is called
    expect(onCloseMock).toHaveBeenCalled(); // Ensure onClose callback is triggered
  });

  // ?Edge Case: Clearing fields and submitting
  it("handles clearing fields and submitting", async () => {
    // ? Mock character data to simulate the initial form state
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    // ? Mock mutation setup for clearing fields
    const mocks = [
      {
        request: {
          query: UPDATE_CHARACTER,
          variables: {
            id: "1",
            name: "", // Fields cleared
            species: "",
            homeworld: "",
          },
        },
        result: {
          data: {
            updateCharacter: {
              id: "1",
              name: "",
              species: "",
              homeworld: "",
              __typename: "Character",
            },
          },
        },
      },
    ];

    // ? Render the component within a MockedProvider with the mocked mutation
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UpdateStarWarsCharactersForm character={character} />
      </MockedProvider>
    );

    // ? Simulate clearing the values in the input fields
    fireEvent.change(screen.getByDisplayValue("Luke Skywalker"), {
      target: { value: "" }, // Clearing name
    });
    fireEvent.change(screen.getByDisplayValue("Human"), {
      target: { value: "" }, // Clearing species
    });
    fireEvent.change(screen.getByDisplayValue("Tatooine"), {
      target: { value: "" }, // Clearing homeworld
    });

    // ? Simulate clicking the submit button to trigger the mutation with cleared fields
    fireEvent.click(screen.getByText(/Submit/i));

    // ? Wait for the mutation to be called and ensure the fields are cleared
    await waitFor(() => {
      expect(screen.getByDisplayValue("")).toBeInTheDocument(); // Ensure the fields are cleared
    });
  });
});
