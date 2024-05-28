import React, { useEffect, useState } from "react";

// ? third party imports
import { useMutation } from '@apollo/client';
import { UPDATE_CHARACTER } from "../Querries/UpdateStarWarsData";

// !TODO: Code out the form. 
const UpdateStarWarsCharactersForm = ({character, onUpdate, onClose}) => {
// TODO:
// 1) build the HMTL form and comment it to avoid causing an error(DONE)
// 2) Code out the pieces of state within the form to correspond to the inputs
// 3) make sure to implmenet the useMutation hook to see how it works.
// 4) code out the submit function for a form.

// ? State variables
// ?Initialize state for form fields
  const [name, setName] = useState(character.name || '');
  const [speciesName, setSpeciesName] = useState(character.species ? character.species.name : '');
  const [homeworldName, setHomeworldName] = useState(character.homeworld ? character.homeworld.name : '');

  //? Set up the mutation hook
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);


// ! useEffect hooks
  useEffect(() => {
    if (character) {
      setName(character.name || '');
      setSpeciesName(character.species ? character.species.name : '');
      setHomeworldName(character.homeworld ? character.homeworld.name : '');
    }
  }, [character]);

  // ! Testing is the component is being rendered in the DOM
  useEffect(() => {
    console.log("UpdateStarWarsCharactersForm component rendered");
  }, []); // The empty dependency array ensures the effect runs only once after initial render



// ! Handle Submit function 
// Form submission handler
const handleSubmit = (e) => {
  e.preventDefault();
  updateCharacter({
    variables: {
      id: character.id,
      name,
      speciesId: character.species ? character.species.id : null,
      speciesName,
      homeworldId: character.homeworld ? character.homeworld.id : null,
      homeworldName,
    },
    update: (cache, { data: { updateCharacter } }) => {
      const existingData = cache.readQuery({ query: GET_STAR_WARS_CHARACTERS });
      const updatedPeople = existingData.allPeople.people.map(person =>
        person.id === character.id ? updateCharacter : person
      );
      cache.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: { allPeople: { ...existingData.allPeople, people: updatedPeople } }
      });
    }
  }).then(() => {
    onClose();
  }).catch(err => {
    console.error(err);
  });
};


return (
  // ! HTML for the form, filling out the pieces of state 
  <div className="modal">
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Species:
        <input value={speciesName} onChange={(e) => setSpeciesName(e.target.value)} />
      </label>
      <label>
        Homeworld:
        <input value={homeworldName} onChange={(e) => setHomeworldName(e.target.value)} />
      </label>
      <button type="submit">Update</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  </div>
);
};



export default UpdateStarWarsCharactersForm;
