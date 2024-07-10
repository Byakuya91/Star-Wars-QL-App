//? React and Apollo imports
import React, { useState } from "react";
import { useMutation } from "@apollo/client";

// ?Query imports
import { ADD_STAR_WARS_CHARACTER } from "../Querries/AddStarWarsCharacter";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { ToastContainer, toast } from "react-toastify";

// ? third party imports

// Define the StarWarsCharacterForm component
const StarWarsCharacterForm = () => {
  // State variables for managing form input values
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [homeworld, setHomeworld] = useState("");

  // useMutation hook for the ADD_STAR_WARS_CHARACTER mutation
  const [addStarWarsCharacter] = useMutation(ADD_STAR_WARS_CHARACTER, {
    // Update the Apollo Client cache after the mutation is successful
    update(cache, { data: { addCharacter } }) {
      // Read the existing characters from the cache
      const { allPeople } = cache.readQuery({
        query: GET_STAR_WARS_CHARACTERS,
      });
      // Write the new character to the cache
      cache.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: {
          allPeople: [...allPeople, addCharacter],
        },
      });
    },
    // Handle errors during the mutation
    onError: (error) => {
      console.error("Error adding character:", error);
      toast.error("Error adding character!"); // Display error notification
    },
    // Handle successful completion of the mutation
    onCompleted: (data) => {
      toast.success("New Character is added!"); // Display success notification
      console.log("Added character:", data.addCharacter);
      // Reset form fields
      setName("");
      setSpecies("");
      setHomeworld("");
    },
  });

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await addStarWarsCharacter({
        variables: { name, species, homeworld }, // Pass form input values as variables to the mutation
      });
    } catch (error) {
      console.error("Error adding character:", error);
      toast.error("Error adding character!"); // Display error notification
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Name input field */}
        <label htmlFor="fullNameInput">
          Name:
          <input
            id="fullNameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {/* Species input field */}
        <label>
          Species Name:
          <input value={species} onChange={(e) => setSpecies(e.target.value)} />
        </label>
        {/* Homeworld input field */}
        <label>
          Homeworld Name:
          <input
            value={homeworld}
            onChange={(e) => setHomeworld(e.target.value)}
          />
        </label>
        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StarWarsCharacterForm;
