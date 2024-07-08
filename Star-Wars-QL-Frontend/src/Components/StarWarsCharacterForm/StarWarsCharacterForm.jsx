//? React and Apollo imports
import React, { useState } from "react";
import { useMutation } from "@apollo/client";

// ?Query imports
import { ADD_STAR_WARS_CHARACTER } from "../Querries/AddStarWarsCharacter";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { ToastContainer, toast } from "react-toastify";

// ? third party imports

const StarWarsCharacterForm = () => {
  // ?State variables for form
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [homeworld, setHomeworld] = useState("");

  // ?Apollo state variable
  const [addStarWarsCharacter] = useMutation(ADD_STAR_WARS_CHARACTER, {
    update(cache, { data: { addCharacter } }) {
      // Update cache to include the new character
      const { allPeople } = cache.readQuery({
        query: GET_STAR_WARS_CHARACTERS,
      });
      cache.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: {
          allPeople: [...allPeople, addCharacter],
        },
      });
    },
  });

  // ? Handler function

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ?adding the data
      const { data } = await addStarWarsCharacter({
        variables: { name, species, homeworld },
      });

      // Optionally, you can handle success and reset form state
      console.log("Added character:", data.addCharacter);
      toast.success("New Character is added!");

      // Reset form fields
      setName("");
      setSpecies("");
      setHomeworld("");
    } catch (error) {
      console.error("Error adding character:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullNameInput">
          Name:
          <input
            id="fullNameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Species Name:
          <input value={species} onChange={(e) => setSpecies(e.target.value)} />
        </label>
        <label>
          Homeworld Name:
          <input
            value={homeworld}
            onChange={(e) => setHomeworld(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StarWarsCharacterForm;
