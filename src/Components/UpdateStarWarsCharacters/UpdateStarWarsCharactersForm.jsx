import React, { useEffect, useState } from "react";

// ? third party imports
import { useMutation } from '@apollo/client';
import { UPDATE_CHARACTER } from "../Querries/UpdateStarWarsData";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// !TODO: Code out the form. 
const UpdateStarWarsCharactersForm = ({character, onUpdate, onClose}) => {
// TODO:
// 1) build the HMTL form and comment it to avoid causing an error(DONE)
// 2) Code out the pieces of state within the form to correspond to the inputs(DONE)
// 3) make sure to implement  the useMutation hook to see how it work(ONGOING)
// 4) code out the submit function for a form.

// ? State variables to hold the form values
  //  ? character name 
  const [name, setName] = useState(character.name || '');
  //  ? species name 
  const [speciesName, setSpeciesName] = useState(character.species ? character.species.name : ''); 
  // ? // State for homeworld name: '');
  const [homeworldName, setHomeworldName] = useState(character.homeworld ? character.homeworld.name : '');
 
  console.log("The species name is:", speciesName);
  console.log("The homeworld name is:", homeworldName);
  console.log("The full name is:", name);

  // Mutation hook for updating character
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);

  // Update state when character prop changes
  useEffect(() => {
    if (character) {
      setName(character.name || '');
      setSpeciesName(character.species ? character.species.name : '');
      setHomeworldName(character.homeworld ? character.homeworld.name : '');
    }
  }, [character]);


// ! debugging code 
  // // ! Testing is the component is being rendered in the DOM
  // useEffect(() => {
  //   console.log("UpdateStarWarsCharactersForm component rendered");
  // }, []); // The empty dependency array ensures the effect runs only once after initial render


// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting update with variables:", {
    id: character.id,
    name,
    speciesName,
    homeworldName,
  });
  try {
    await updateCharacter({
      variables: {
        id: character.id,
        name,
        speciesName: speciesName || null,
        homeworldName: homeworldName || null,
      },
      update: (cache, { data: { updateCharacter } }) => {
        // Read existing data from cache
        const existingData = cache.readQuery({ query: GET_STAR_WARS_CHARACTERS });
        // Update character in the cache
        const updatedPeople = existingData.characters.map(person =>
          person.id === character.id ? updateCharacter : person
        );
        // Write updated data back to cache
        cache.writeQuery({
          query: GET_STAR_WARS_CHARACTERS,
          data: { characters: updatedPeople }
        });
      }
    });
    onClose(); // Close the form after successful update
  } catch (err) {
    console.error("Error updating character:", err); // Log error if mutation fails
    console.error("GraphQL Errors:", err.graphQLErrors); // Log specific GraphQL errors
      console.error("Network Errors:", err.networkError); // Log network errors
  }
};

return (
  <div className="modal">
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Species Name:
        <input value={speciesName} onChange={(e) => setSpeciesName(e.target.value)} />
      </label>
      <label>
        Homeworld Name:
        <input value={homeworldName} onChange={(e) => setHomeworldName(e.target.value)} />
      </label>
      <button type="submit">Update</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  </div>
);
};

export default UpdateStarWarsCharactersForm;


