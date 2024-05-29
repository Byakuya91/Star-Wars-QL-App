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
  //  ? species Id 
  const [speciesId, setSpeciesId] = useState(character.species ? character.species.id : ''); 
  // ? // State for homeworld ID: '');
  const [homeworldId, setHomeworldId] = useState(character.homeworld ? character.homeworld.id : ''); 

  //? Mutation hook to perform the updateCharacter mutation
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);


// ?Effect to update state when character prop changes
  useEffect(() => {
    if (character) {
      // Update name state
      setName(character.name || '');
      // Update species ID state 
      setSpeciesId(character.species ? character.species.id : ''); 
      // Update homeworld ID state
      setHomeworldId(character.homeworld ? character.homeworld.id : ''); 
    }
  }, [character]);


// ! debugging code 
  // // ! Testing is the component is being rendered in the DOM
  // useEffect(() => {
  //   console.log("UpdateStarWarsCharactersForm component rendered");
  // }, []); // The empty dependency array ensures the effect runs only once after initial render


//? Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  // ! Seeing if the function is firing off
  console.log("Submitting update with variables:", {
    id: character.id,
    name,
    speciesId: speciesId || null,
    homeworldId: homeworldId || null,
  });
  try {
    // Execute updateCharacter mutation
    await updateCharacter({
      variables: {
        id: character.id,
        name,
        speciesId: speciesId || null,
        homeworldId: homeworldId || null,
      },
      // Update Apollo Client cache after mutation
      update: (cache, { data: { updateCharacter } }) => {
        // Read existing data from cache
        const existingData = cache.readQuery({ query: GET_STAR_WARS_CHARACTERS });
        // Map through existing characters to update the modified character
        const updatedPeople = existingData.characters.map(person =>
          person.id === character.id ? updateCharacter : person
        );
        // Write updated characters list back to cache
        cache.writeQuery({
          query: GET_STAR_WARS_CHARACTERS,
          data: { characters: updatedPeople }
        });
      }
    });
    onClose(); // Close the form after successful update
  } catch (err) {
    console.error("Error updating character:", err); // Log error if mutation fails
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
        Species:
        <input value={speciesId} onChange={(e) => setSpeciesId(e.target.value)} />
      </label>
      <label>
        Homeworld ID:
        <input value={homeworldId} onChange={(e) => setHomeworldId(e.target.value)} />
      </label>
      <button type="submit">Update</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  </div>
);
};



export default UpdateStarWarsCharactersForm;
