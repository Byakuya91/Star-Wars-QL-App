// ? Testing libraries
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MockedProvider } from "@apollo/client/testing";

// ? Component library
import StarWarsCharacterForm from "./StarWarsCharacterForm";

// ? Query imports
import { ADD_STAR_WARS_CHARACTER } from "../Querries/AddStarWarsCharacter";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// Mock functions
const handleAddStarWarsCharacterFormClose = vi.fn();

// Mock GraphQL mutation
const mocks = [
  {
    request: {
      query: ADD_STAR_WARS_CHARACTER,
      variables: {
        name: "Yoda",
        species: "Unknown",
        homeworld: "Dagobah",
      },
    },
    result: {
      data: {
        addCharacter: {
          id: "1",
          name: "Yoda",
          species: "Unknown",
          homeworld: "Dagobah",
        },
      },
    },
  },
];

// Test suite for StarWarsCharacterForm
describe("StarWarsCharacterForm", () => {
  // Test that form renders without crashing
  it("renders the form correctly", () => {
    const { getByLabelText } = render(
      <MockedProvider>
        <StarWarsCharacterForm
          handleAddStarWarsCharacterFormClose={
            handleAddStarWarsCharacterFormClose
          }
        />
      </MockedProvider>
    );

    // Check that form labels are present
    expect(getByLabelText("Name:")).toBeInTheDocument();
    expect(getByLabelText("Species Name:")).toBeInTheDocument();
    expect(getByLabelText("Homeworld Name:")).toBeInTheDocument();
  });

  // Test that input fields update correctly
  it("updates input fields correctly", () => {
    const { getByLabelText } = render(
      <MockedProvider>
        <StarWarsCharacterForm
          handleAddStarWarsCharacterFormClose={
            handleAddStarWarsCharacterFormClose
          }
        />
      </MockedProvider>
    );

    // Simulate user input
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Yoda" } });
    fireEvent.change(getByLabelText("Species Name:"), {
      target: { value: "Unknown" },
    });
    fireEvent.change(getByLabelText("Homeworld Name:"), {
      target: { value: "Dagobah" },
    });

    // Check if input values are updated
    expect(getByLabelText("Name:").value).toBe("Yoda");
    expect(getByLabelText("Species Name:").value).toBe("Unknown");
    expect(getByLabelText("Homeworld Name:").value).toBe("Dagobah");
  });

  // Test that the form is submitted correctly
  it("submits the form correctly", async () => {
    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StarWarsCharacterForm
          handleAddStarWarsCharacterFormClose={
            handleAddStarWarsCharacterFormClose
          }
        />
      </MockedProvider>
    );

    // Simulate user input
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Yoda" } });
    fireEvent.change(getByLabelText("Species Name:"), {
      target: { value: "Unknown" },
    });
    fireEvent.change(getByLabelText("Homeworld Name:"), {
      target: { value: "Dagobah" },
    });

    // Submit the form
    fireEvent.click(getByText("Submit"));

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(handleAddStarWarsCharacterFormClose).toHaveBeenCalled();
    });
  });

  // Test that an error message is displayed on form submission failure
  it("displays an error message on form submission failure", async () => {
    const errorMocks = [
      {
        request: {
          query: ADD_STAR_WARS_CHARACTER,
          variables: { name: "Yoda", species: "Unknown", homeworld: "Dagobah" },
        },
        error: new Error("Failed to add character"),
      },
    ];

    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <StarWarsCharacterForm
          handleAddStarWarsCharacterFormClose={
            handleAddStarWarsCharacterFormClose
          }
        />
      </MockedProvider>
    );

    // Simulate user input
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Yoda" } });
    fireEvent.change(getByLabelText("Species Name:"), {
      target: { value: "Unknown" },
    });
    fireEvent.change(getByLabelText("Homeworld Name:"), {
      target: { value: "Dagobah" },
    });

    // Submit the form
    fireEvent.click(getByText("Submit"));

    // Wait for the error toast to appear
    await waitFor(() => {
      expect(screen.getByText("Error adding character!")).toBeInTheDocument();
    });
  });

  // Test that the form is reset on successful submission
  it("resets the form on successful submission", async () => {
    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StarWarsCharacterForm
          handleAddStarWarsCharacterFormClose={
            handleAddStarWarsCharacterFormClose
          }
        />
      </MockedProvider>
    );

    // Simulate user input
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Yoda" } });
    fireEvent.change(getByLabelText("Species Name:"), {
      target: { value: "Unknown" },
    });
    fireEvent.change(getByLabelText("Homeworld Name:"), {
      target: { value: "Dagobah" },
    });

    // Submit the form
    fireEvent.click(getByText("Submit"));

    // Wait for the form to reset
    await waitFor(() => {
      expect(getByLabelText("Name:").value).toBe("");
      expect(getByLabelText("Species Name:").value).toBe("");
      expect(getByLabelText("Homeworld Name:").value).toBe("");
    });
  });
});
