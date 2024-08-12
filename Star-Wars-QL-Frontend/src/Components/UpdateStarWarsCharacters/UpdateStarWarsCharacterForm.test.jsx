// ? testing libraries
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";

// ? Component imports
import UpdateStarWarsCharactersForm from "../UpdateStarWarsCharacters/UpdateStarWarsCharactersForm";

// ? Query imports
import { UPDATE_STAR_WARS_CHARACTER } from "../Querries/UpdateStarWarsData";

// ?UNIT Tests for UpdateStarWarsCharactersForm Component
describe("UpdateStarWarsCharacterForm Component", () => {
  // Test case 1: Rendering the form with the initial character data
  it("renders the form with initial character data", () => {
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    render(
      <MockedProvider>
        <UpdateStarWarsCharactersForm character={character} />
      </MockedProvider>
    );

    expect(screen.getByDisplayValue("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Human")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tatooine")).toBeInTheDocument();
  });

  it("submits the form with updated data", async () => {
    const character = {
      id: "1",
      name: "Luke Skywalker",
      species: { name: "Human" },
      homeworld: { name: "Tatooine" },
    };

    const mocks = [
      {
        request: {
          mutation: UPDATE_STAR_WARS_CHARACTER,
          variables: {
            id: "1",
            name: "Darth Vader",
            species: "Sith",
            homeworld: "Mustafar",
          },
        },
        result: {
          data: {
            updateCharacter: {
              id: "1",
              name: "Darth Vader",
              species: "Sith",
              homeworld: "Mustafar",
            },
          },
          errors: [
            {
              message: "Error message",
              locations: [
                {
                  line: 1,
                  column: 1,
                },
              ],
            },
          ],
        },
      },
    ];

    const onUpdateMock = vi.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UpdateStarWarsCharactersForm
          character={character}
          onUpdate={onUpdateMock}
        />
      </MockedProvider>
    );

    console.log("Rendered component:", screen.getByText(/Submit/i));

    fireEvent.change(screen.getByDisplayValue("Luke Skywalker"), {
      target: { value: "Darth Vader" },
    });
    console.log("Changed name input:", screen.getByDisplayValue("Darth Vader"));

    fireEvent.change(screen.getByDisplayValue("Human"), {
      target: { value: "Sith" },
    });
    console.log("Changed species input:", screen.getByDisplayValue("Sith"));

    fireEvent.change(screen.getByDisplayValue("Tatooine"), {
      target: { value: "Mustafar" },
    });
    console.log(
      "Changed homeworld input:",
      screen.getByDisplayValue("Mustafar")
    );

    fireEvent.click(screen.getByText(/Submit/i));
    console.log("Clicked submit button");

    // Wait for the mutation to be called
    await waitFor(() => {
      console.log("onUpdateMock called:", onUpdateMock);
      expect(onUpdateMock).toHaveBeenCalled(); // Ensure onUpdate callback is triggered
    });
  });
});
