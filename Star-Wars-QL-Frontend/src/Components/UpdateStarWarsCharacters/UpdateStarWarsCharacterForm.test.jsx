// ? testing libraries
import { render, screen, waitFor, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";

// ? Component imports
import UpdateStarWarsCharacterForm from "./UpdateStarWarsCharacterForm";

// ? Query imports
import { UPDATE_STAR_WARS_CHARACTER } from "../Querries/UpdateStarWarsCharacter";

// ?TODO:UNIT tests
// 1. Ensure that the form is rendered correctly(ONGOING)
//    - Check if the form renders without crashing
//    - Verify that all input fields (Name, Species, Homeworld) are present
//    - Verify that the Submit and Cancel buttons are present

// 2. Ensure that the form fields are populated correctly when the component mounts
//    - Verify that the input fields are populated with the correct values when a character prop is passed

// 3. Ensure that the form fields are updated correctly when the input values change
//    - Simulate user input in each field and verify that the state is updated correctly

// 4. Ensure that the form is submitted correctly
//    - Simulate a form submission and verify that the updateCharacter mutation is called with the correct arguments
//    - Verify that the onCompleted callback handles success correctly
//    - Verify that the onError callback handles errors correctly

// 5. Ensure that an error message is displayed on form submission failure
//    - Simulate a mutation error and verify that the appropriate error message is displayed using toast

// 6. Ensure that the form resets after a successful submission
//    - Simulate a successful form submission and check that the input fields are cleared

// 7. Ensure that the onClose callback is triggered when the "Cancel" button is clicked
//    - Simulate clicking the Cancel button and verify that the onClose callback is invoked

// 8. Ensure that an error message is displayed when no fields are changed and the form is submitted
//    - Submit the form without changing any fields and verify that the "No fields have been changed." error message is displayed

// ?Mocking the Data
const mockCharacter = {
  name: "Yoda",
  species: {
    name: "Unknown",
  },
  homeworld: {
    name: "Dagobah",
  },
};

const mocks = [
  {
    request: {
      query: UPDATE_CHARACTER,
      variables: {
        id: "1",
        name: "Luke Skywalker",
        species: "Human",
        homeworld: "Tatooine",
      },
    },
    result: {
      data: {
        updateCharacter: {
          id: "1",
          name: "Luke Skywalker",
          species: "Human",
          homeworld: "Tatooine",
        },
      },
    },
  },
];

describe("UpdateStarWarsCharacterForm", () => {
  // Test that the form is rendering correctly
  it("renders the form correctly", () => {
    render(
      <MockedProvider>
        <UpdateStarWarsCharacterForm character={mockCharacter} />
      </MockedProvider>
    );
    // Check that form labels are present
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Species Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Homeworld Name:")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
